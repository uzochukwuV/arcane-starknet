"use client"
import { useAccount } from "~~/hooks/useAccount";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { Uint256 } from "starknet";


export const Listings =()=> {
    const { data: totalCounter } = useScaffoldReadContract({
        contractName: "Arcane",
        functionName: "get_all_listings",
        args: [],
      });
      console.log(totalCounter);
    return (
        <>
        Listings
        </>
    )
}

// onchain lottery
// lending contract
// nft market place

// 2000000000000000