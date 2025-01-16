import Link from "next/link";
import Image from "next/image";
import { ConnectedAddress } from "~~/components/ConnectedAddress";
import { useAccount } from "~~/hooks/useAccount";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { Listings } from "~~/my_components/listings";


const Home = () => {
 
  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center">
          <span className="block text-2xl mb-2">Welcome to</span>
          <span className="block text-4xl font-bold">Scaffold-Stark 2</span>
        </h1>
        <ConnectedAddress />
       
      </div>

      <Listings />
    </div>
  );
};

export default Home;

// 0x4c346b75c793ab7dc5f217753201bacd82a138a59459f948cbdd04fe7d32c53 nft
// 0x6ebb89244eb9b5e618acfdea6adacdaaf9e20c2ffc43021a448b2359e4c8e92 coin
// 0x31b5eec1ca0f5ffa89a1c5fe1334831ffdbe9ee531155335b49445318886f4d