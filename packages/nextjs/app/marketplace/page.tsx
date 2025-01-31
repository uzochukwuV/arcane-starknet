"use client"

import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import NFTView from "./components/Nft";
import Link from "next/link";


const Marketplace = () => {
 const { data: allNfts } = useScaffoldReadContract({
         contractName: "Arcane",
         functionName: "get_all_listings",
         args: [],
    });
  return (
    <div className=" w-screen px-8 py-6">
        <div className="allnft font-semibold flex justify-between text-black mb-8">
          <div>NFT Marketplace</div>
          <div className="flex gap-6">
          <Link href={"/game"}> join Lottery</Link>
          <Link href={"/createnft"}>Create your own nft</Link>
          </div>
        </div>
        <div className="ea za xc">
            {
                        allNfts?.map((token_id)=> <NFTView key={token_id.toString()} token_id={token_id.toString()} />)
            }
        </div>
    </div>
  );
};

export default Marketplace;