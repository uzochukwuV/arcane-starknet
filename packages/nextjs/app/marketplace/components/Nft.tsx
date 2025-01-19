"use client"

import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";

type NFT ={
    description:string,
    name:string,
    url: string
  }
  

 export default function NFTView({token_id}:any) {
      const [nft, setNft] = useState<NFT>();
      const [isbuying, setBuying] = useState(false)
  
      const { data: nfturi } = useScaffoldReadContract({
          contractName: "ArcNft",
          functionName: "get_token_uri",
          args: [token_id],
        });
        const { data: details } = useScaffoldReadContract({
            contractName: "Arcane",
            functionName: "get_nft_detail",
            args: [token_id],
          });
  
  
        useEffect(() => {
          fetch(nfturi?.toString()!)
          .then((data)=>data.json())
          .then((res)=> {
            console.log(res)
            setNft(res)
          } )
        
          
        }, [nfturi])
        
        
        
        
        
        
      return <div className="pb nf hk/2 _k/3 2xl:ud-w-1/4">
          <div className="ja nd qd bg-indigo-50/40   wd hf">
              <div className="f ka gd kd">
                  <img src={nft?.url} alt="auctions" className="pb" />
                      <button className="e i r _a yc ld ee _f ag">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6.99999 11.8709L6.15416 11.1009C3.14999 8.37675 1.16666 6.57425 1.16666 4.37508C1.16666 2.57258 2.57832 1.16675 4.37499 1.16675C5.38999 1.16675 6.36416 1.63925 6.99999 2.38008C7.63582 1.63925 8.60999 1.16675 9.62499 1.16675C11.4217 1.16675 12.8333 2.57258 12.8333 4.37508C12.8333 6.57425 10.85 8.37675 7.84582 11.1009L6.99999 11.8709Z" fill="#F85486"></path>
                          </svg>
  
                          <span className="tg kh nh wh">
                              
                          </span>
                      </button>
                  </div>
              <div>
                  <h3>
                      <p className="sa ya hh nh text-black cj">
                          {nft?.name} {token_id}
                      </p>
                  </h3>
                  <div className="ka za yc ad">
                      <div className="pb">
                          <div className="za yc">
                              {/* <div className="ta hb pb fc ld">
                                  <img src="src/images/auctions/creator-01.png" alt="creator" className="ib pb af bf" />
                                  </div> */}
                              <div className="pb">
                                  <h4 className="kh nh text-black">
                                      {nft?.description}
                                  </h4>
                              </div>
                          </div>
                      </div>
                      <div className="pb">
                          <h5 className="dh kh nh text-black">
                              {details?.toString()} USDT
  
                              <span className="xa kh oh uh">
                                  
                              </span>
                          </h5>
                      </div>
                  </div>
                  {isbuying && <BuyNFT token_id={token_id} setBuying={setBuying} token_cost={details?.toString()} />}
                  <div onClick={()=>{
                    if(isbuying){

                    }else{
                        setBuying(true)
                    }
                  }} className="za yc _c ld ee se kf eh nh ">
                      BUY NFT
                  </div>
              </div>
          </div>
      </div>
  }


 
  function BuyNFT({token_id, setBuying, token_cost}:any) {
    const [pay, setPay] = useState(1);
    const [price, setPrice] = useState(1);
    
    const { address: connectedAddress } = useAccount();
      const coin_contract = deployedContracts.sepolia.ArcCoin.address;
      const nft_address = deployedContracts.sepolia.ArcNft.address;
      const arcane_address= deployedContracts.sepolia.Arcane.address;
      const ETH_USD = 19514442401534788;
        const STRK_USDT = 6004514686061859652;

      const { data: ethprice } = useScaffoldReadContract({
        contractName: "Arcane",
        functionName: "get_asset_price",
        args: [ETH_USD],
      });

      const { data: strkprice } = useScaffoldReadContract({
        contractName: "Arcane",
        functionName: "get_asset_price",
        args: [STRK_USDT],
      });


      const { sendAsync : ApproveEth } = useScaffoldWriteContract({
        contractName: "Eth",
        functionName: "approve",
        args: [arcane_address, price],
      });

      const { sendAsync : ApproveArc } = useScaffoldWriteContract({
        contractName: "ArcCoin",
        functionName: "approve",
        args: [arcane_address, price],
      });

      const { sendAsync : ApproveStark } = useScaffoldWriteContract({
        contractName: "Strk",
        functionName: "approve",
        args: [arcane_address, price],
      });

     const { sendAsync : BuyNft } = useScaffoldWriteContract({
            contractName: "Arcane",
            functionName: "buy_nft",
            args: [nft_address, coin_contract, token_id, pay],
          });
    const buy_nft = async ()=>{
        try {
            await ApproveStark();
            await BuyNft()
            setBuying(false)
        } catch (error) {
            console.log(error);
            
        }
    }
    return (
      <div className=" z-40 fixed top-0 left-0 right-0 bottom-0 bg-black/5 flex justify-center items-center">
            <div className="max-w-lg w-full bg-white px-6 pb-6 rounded-md flex flex-col gap-6 border border-slate-300 shadow-lg py-6">
                <h1>Pay with </h1>
                <div onClick={()=>{setPay(0)}} className="px-12 py-3 rounded-md border border-gray-300 text-slate-800 font-medium">
                    {Number(token_cost) / Number(ethprice?.toString())}  Eth (default) {pay ==1 && "ticked"}  
                </div>
                <div onClick={()=>{setPay(1)}} className="px-12 py-3 rounded-md border border-gray-300 text-slate-800 font-medium">
                    Strk {pay ==2 && "ticked"}
                </div>
                <div onClick={()=>{setPay(2)}} className="px-12 py-3 rounded-md border border-gray-300 text-slate-800 font-medium">
                    Arc {pay ==3 && "ticked"}
                </div>

                <button onClick={()=>buy_nft()} className="za yc _c ld ee se kf eh nh bg-slate-200 ">
                    Pay
                </button>
            </div>
      </div>
    )
  }
  
  