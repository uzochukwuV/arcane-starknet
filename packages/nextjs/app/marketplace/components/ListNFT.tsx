"use client"

import React, { useEffect } from 'react'
import { useState } from 'react';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';
import { useAccount } from '~~/hooks/useAccount';
import deployedContracts from '~~/contracts/deployedContracts';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import NFTView from './Nft';

function ListNFT() {
    const { data: allNfts } = useScaffoldReadContract({
        contractName: "Arcane",
        functionName: "get_all_listings",
        args: [],
      });
     
  return (
    <section className="wg">
      <div className="a">
        <div className="ra td vd _d">
          <div className="ad qj">
            <h2 className="ia mh ph sh text-black ">
              
              <span className='dark:text-white text-black'>MarketPlace</span>
            </h2>
            <a href="javascript:void(0)" className="ka _a yc _c ld he uf wf eh nh text-black ii aj">
              View All
            </a>
          </div>
        </div>

        <div className="ea za xc">
          {/* {
            <NFTView token_id={} />
         
          } */}
          {
            allNfts?.map((token_id)=> <NFTView key={token_id.toString()} token_id={token_id.toString()} />)
          }
        </div>
      </div>
    </section>
  )
}

export default ListNFT

