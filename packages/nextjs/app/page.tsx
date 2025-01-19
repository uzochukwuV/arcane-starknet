"use client";

import Link from "next/link";
import Image from "next/image";
import { ConnectedAddress } from "~~/components/ConnectedAddress";
import { useAccount } from "~~/hooks/useAccount";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { Listings } from "~~/my_components/listings";

import ListNFT from "./marketplace/components/ListNFT";
import Hero from "./marketplace/components/Hero";



import { useState } from "react";

export default function Home() {
  
  return (
    <main className="w-screen">
       <Hero />
       <ListNFT />
    </main>
  );
}
