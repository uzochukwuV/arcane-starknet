"use client"
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";

import { useEffect, useState } from "react";

import CoinSelect from "./CoinSelect";

import deployedContracts from "~~/contracts/deployedContracts";


export default function GameUI() {
    const [amount, setAmount] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [btn, setbtn] = useState(true);

    const [assetPrice, setAssetPrice] = useState<string>("");
    const coins = ["ETH", "STRK", "ARC"]
    const [selected, setSelected] = useState(coins[0]);
    const coinAddress = deployedContracts.sepolia.ArcCoin.address;
    const nftAddress = deployedContracts.sepolia.ArcNft.address;
    const arcaneAddress = deployedContracts.sepolia.Arcane.address;
    const Eth = "19514442401534788";
    const Strk = "6004514686061859652";
    const WEI = 1000000000000000000
    const [assetId, setAssetId] = useState<string>(Strk);

    const [guess, setGuess] = useState<number>(0);
    const [gameId, setgameId] = useState<number>(0);
    const [coinType, setCoinType] = useState<number>(0);


    const { data: asset_price, refetch: refetchAsset } = useScaffoldReadContract({
        contractName: "Arcane",
        functionName: "get_asset_price",
        args: [assetId],
    });


    const { sendAsync: sendEthApproveAsync, isPending: isPendingEth } = useScaffoldWriteContract({
        contractName: "Eth",
        functionName: "approve",
        args: [arcaneAddress, Number((price * WEI).toFixed(0))],
    });

    const { sendAsync: sendStrkApproveAsync, isPending: isPendingStrk } = useScaffoldWriteContract({
        contractName: "Strk",
        functionName: "approve",
        args: [arcaneAddress, Number((price * WEI * 10000).toFixed(0))],
    });




    const { data: game_id } = useScaffoldReadContract({
        contractName: "Arcane",
        functionName: "get_game_id",
        args: [],
    });

    const { data: game_pool } = useScaffoldReadContract({
        contractName: "Arcane",
        functionName: "get_game_pool",
        args: [],
    });

    const { sendAsync: sendPlayTrx, isPending: isPendingPlayTrx } = useScaffoldWriteContract({
        contractName: "Arcane",
        functionName: "play",
        args: [guess, gameId, amount, coinType, coinAddress],
    });

    const playLottery = () => {
        let [token, asset_id] = get_token_used(selected);
        const guess = Math.floor(Math.random() * 9) + 1;
        setGuess(guess);
        setCoinType(token)

        let p = amount * 100000000 / Number(asset_price?.toString())

        setPrice(p)
        setbtn(false)

    }

    const getPlay = async () => {

        await refetchAsset()
        try {

            let t = coinType == 1 ? await sendEthApproveAsync() : await sendStrkApproveAsync();
            const trx = await sendPlayTrx();
            console.log(trx)



        } catch (e) {
            console.error("Error setting name", e);
        }
    }

    useEffect(() => {
        setAssetPrice(asset_price?.toString()!)
        setgameId(Number(game_id?.toString()))
    }, [asset_price])


    const setSelectedAsset = (e: any) => {
        e.preventDefault();
        setSelected(e.target.value);

        if (e.target.value.contains("S")) {
            setAssetId(Strk);
            setCoinType(2)

        } else {
            setAssetId(Eth);
            setCoinType(1)
        }

        refetchAsset()


    }

    const get_token_used = (token: string): [number, string] => {
        switch (token) {
            case "ETH":
                return [1, Eth]
            case "STRK":
                return [2, Strk]
            case "ARC":
                return [3, ""]
            default:
                return [0, ""]
        }
    }

    const setPriceNow = () => {
        setAssetPrice(asset_price?.toString()!)
    }



    return (
        <div className="max-w-2xl mx-auto text-center">
            <p className=" text-indigo-500 font-bold text-3xl  mt-6">Lottery id: {game_id?.toString()}
            </p>
            <p className=" text-black font-bold text-xl  py-6">
                Lottery Pool: {game_pool?.toString()} usdt
            </p>

            <div className="sm:col-span-2 mt-8">
                <label htmlFor="amount"> Amount to play with</label>
                <div className="mt-2">
                    <input
                        id="amount"
                        name="amount"
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="must be greater than 1"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
            </div>
            <br />
            <CoinSelect coins={coins} selected={selected} setCoin={setSelectedAsset} />
            <br />


            {
                btn ? <button

                    type="button" color="green" onClick={playLottery}
                    className="btn btn-wide mt-6 bg-indigo-300">Get Play</button> :
                    <button

                        type="button" color="green" onClick={getPlay}
                        className="btn btn-wide mt-6 bg-indigo-600">Play {price.toFixed(3)} {selected}</button>
            }
        </div>
    )


}
