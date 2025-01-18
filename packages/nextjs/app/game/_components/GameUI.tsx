"use client"
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { IntegerInput } from "~~/components/scaffold-stark";
import { useEffect, useState } from "react";
import { InputBase } from "~~/components/scaffold-stark";
import CoinSelect from "./CoinSelect";
import { Button } from "@radix-ui/themes";
import deployedContracts from "~~/contracts/deployedContracts";


export default function GameUI() {
    const [amount, setAmount] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [assetId, setAssetId] = useState<string>("19514442401534788");
    const [assetPrice, setAssetPrice] = useState<string>("");
    const coins = ["ETH", "STRK", "ARC"]
    const [selected, setSelected] = useState(coins[0]);
    const coinAddress = deployedContracts.sepolia.ArcCoin.address;
    const nftAddress = deployedContracts.sepolia.ArcNft.address;
    const arcaneAddress = deployedContracts.sepolia.Arcane.address;
    const Eth = "19514442401534788";
    const Strk = "6004514686061859652";

    const [guess, setGuess] = useState<number>(0);
    const [gameId, setgameId] = useState<number>(0);
    const [coinType, setCoinType] = useState<number>(0);

    
    const { data: asset_price, refetch:refetchAsset } = useScaffoldReadContract({
        contractName: "Arcane",
        functionName: "get_asset_price",
        args: [assetId],
    });
    
  
    const { sendAsync:sendEthApproveAsync, isPending:isPendingEth } = useScaffoldWriteContract({
        contractName: "Eth",
        functionName: "approve",
        args: [arcaneAddress,price],
    });
    
    const { sendAsync:sendStrkApproveAsync, isPending:isPendingStrk } = useScaffoldWriteContract({
        contractName: "Strk",
        functionName: "approve",
        args: [arcaneAddress, price],
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

    const { sendAsync:sendPlayTrx, isPending:isPendingPlayTrx } = useScaffoldWriteContract({
        contractName: "Arcane",
        functionName: "play",
        args: [guess, gameId, amount, coinType, coinAddress],
      });

    const playLottery = async() => {
        let [token, asset_id] = get_token_used(selected);
        const guess = Math.floor(Math.random() * 9) + 1;
        setGuess(guess);
        setCoinType(token)
        
        setAssetPrice(asset_price?.toString()!)
        setAmount((prev)=>prev)

        try {
            const approve = await sendEthApproveAsync();
            console.log(approve)
            const trx = await sendPlayTrx();
            console.log(trx)
            
          } catch (e) {
            console.error("Error setting name", e);
          }

    }

    useEffect(()=>{
        setAssetPrice(asset_price?.toString()!)
        setgameId(Number(game_id?.toString()))
    }, [selected, assetId, price, amount])


    const setSelectedAsset = (e:any)=>{
        e.preventDefault();
        setSelected(e.target.value);
        if (selected == "STRK"){
            setAssetId(Strk);
        }else {
            setAssetId(Eth);
        }
        refetchAsset()
        setAssetPrice(asset_price?.toString()!)
    }

    const get_token_used = (token: string):[number, string] => {
        switch (token) {
            case "ETH":
                return [1,Eth]
            case "STRK":
                return [2,Strk]
            case "ARC":
                return [3,""]
            default:
                return [0,""]
        }
    }
    






    return (
        <div className="max-w-2xl mx-auto text-center">
            <p>Lottery id: {game_id?.toString()}
            </p>
            <p>
                Lottery Pool: {game_pool?.toString()}
            </p>

            <div className="sm:col-span-2">
              <label htmlFor="postal-code" className="block text-sm/6 font-medium text-gray-900">
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                  id="amount"
                  name="amount"
                  type="text"
                  value={amount}
                  onChange={(e)=> setAmount(Number(e.target.value))}
                  placeholder="must be greater than 1"  
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <br />
            <CoinSelect coins={coins} selected={selected} setCoin={setSelectedAsset} />
            <br />
            <p>{assetId}</p>
            <p>{asset_price?.toString()}</p>
            {selected}
           
            <button
            disabled={isPendingEth || isPendingPlayTrx|| isPendingStrk}
         type="button" color="green" onClick={playLottery}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Enter Lottery
        </button>
        </div>
    )

    
}
