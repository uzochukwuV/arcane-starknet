"use client"

import React, { useEffect } from 'react'
import { useState } from 'react';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';
import { useAccount } from '~~/hooks/useAccount';
import deployedContracts from '~~/contracts/deployedContracts';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';

function CreateNFT() {
    const [file, setFile] = useState<File>();
      const [url, setUrl] = useState("");
      const [message, setMessage] = useState("Uploading");
      const [tokenId, settokenId] = useState(0);
      const [step, setstep] = useState(0);
      const [form, setform] = useState({title:"", description:"", price:1, size:""});
      const { address: connectedAddress } = useAccount();
      const coin_contract = deployedContracts.sepolia.ArcCoin.address;
      const nft_address = deployedContracts.sepolia.ArcNft.address;
      const arcane_address= deployedContracts.sepolia.Arcane.address;
      
      const [uploading, setUploading] = useState(false);
      const { data : id } = useScaffoldReadContract({
        contractName: "ArcNft",
        functionName: "get_next_id",
        args: [],
      });

      useEffect(()=>{
        if(!connectedAddress){
          alert("connect wallet to mint")
        }
        settokenId(Number(id?.toString()!))
      },[url, message])

      const { sendAsync : Mint } = useScaffoldWriteContract({
        contractName: "ArcNft",
        functionName: "lazy_mint",
        args: [connectedAddress, url, tokenId],
      });

      

      const { sendAsync : Approve } = useScaffoldWriteContract({
        contractName: "ArcNft",
        functionName: "approve",
        args: [arcane_address, tokenId],
      });

      const { sendAsync : List } = useScaffoldWriteContract({
        contractName: "Arcane",
        functionName: "list_nft",
        args: [ nft_address,coin_contract, tokenId, form.price],
      });

      const createListNFT = async () => {
        try {
          if (!file) {
            alert("No file selected");
            return;
          }
    
          setUploading(true);
          const data = new FormData();
          data.set("file", file);
          data.set("name", form.title);
          data.set("description", form.description);
          const uploadRequest = await fetch("/api/files", {
            method: "POST",
            body: data,
          });
          const ipfsUrl = await uploadRequest.json()
          setUrl(ipfsUrl.jsonurl);
          setMessage("Uploaded")
          
          setUploading(false);
          setstep(1)
        } catch (e) {
          console.log(e);
          setUploading(false);
          alert("Trouble uploading file");
        }
      };

      const mint = async ()=> {
        try {
          setUploading(true);
        await Mint();
        setMessage("Minted")
        setUploading(false);
        setstep(2)
        } catch (error) {
          setUploading(false);
        }
      }

      const list = async ()=>{
        try {
          setUploading(true);
        await Approve();
        alert("Approved");
        setMessage("Approved")
        await List();
        setMessage("Listed")
        alert("nft listed")
        setUploading(false);
        setstep(0)
        } catch (error) {
          setUploading(false)
        }
      }

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target?.files?.[0]);
      };

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let {name, value} = e.target;
    
        setform((prev)=>{
            return { ...prev, [name]:value};
        })
      };
  return (
    <section className="kg">
        <h1 className=' text-center text-4xl py-5'>Create and List NFT</h1>
      <div className="a">
        <div className="f z gd nd fe">
          <div  className="ff vj">
            <div className="fa za xc bm">
              <div className="pb zf bl/12 lm">
                <div className="ra tk">
                  <div className="qa">
                    <input type="file" name="file" id="file" className="b" onChange={handleFileChange} />
                    <label htmlFor="file" className="f za gb ob yc _c kd qd ud xd ie gf ch">
                      <div>
                        <div className="ia ch">
                          <svg width="80" height="80" viewBox="0 0 80 80" className="da">
                            <path d="M28.3333 45L36.6667 55L48.3333 40L63.3333 60H16.6667L28.3333 45ZM70 63.3333V16.6667C70 12.9667 67 10 63.3333 10H16.6667C14.8986 10 13.2029 10.7024 11.9526 11.9526C10.7024 13.2029 10 14.8986 10 16.6667V63.3333C10 65.1014 10.7024 66.7971 11.9526 68.0474C13.2029 69.2976 14.8986 70 16.6667 70H63.3333C65.1014 70 66.7971 69.2976 68.0474 68.0474C69.2976 66.7971 70 65.1014 70 63.3333Z" fill="#4D4C5A"></path>
                          </svg>
                        </div>
                        <span className="la xa ih nh vh">
                          Drop files here
                        </span>
                        <span className="sa xa eh oh uh">
                          PNG, JPG, GIF, WEBP or MP4. Max 200mb.
                        </span>
                        <span className="sa xa eh oh uh">
                          Or choose a file
                        </span>
                        <span className="_a md ee tf zf eh nh wh">
                          Browse
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="ka ld je of xf">
                    {
                        file && (<div className="za yc ad">
                        <span className="id pg eh oh vh">
                          {file.name}
                        </span>
                        <button className="vh">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z" fill="currentColor"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z" fill="currentColor"></path>
                          </svg>
                        </button>
                      </div>
                    )

                    }

                  </div>
                </div>
              </div>
              <div className="pb zf cl/12 lm">
                <div>
                  <div className="ka">
                    <label htmlFor="title" className="la xa eh oh vh">
                      Title {url}
                    </label>
                    <input required type="text" name="title" id="title" value={form.title} onChange={handleChange} placeholder="Enter item title" className="pb ld qd wd ie sf wf eh oh uh di ii fj gj"  />
                  </div>
                  <div className="ka">
                    <label htmlFor="description" className="la xa eh oh vh">
                      Description (optional)
                    </label>
                    <textarea required rows={2} name="description" value={form.description} onChange={handleChange as any} id="description" placeholder="Type item description" className="pb ld qd wd ie sf wf eh oh uh di ii fj gj"></textarea>
                  </div>
                  <div className="ka">
                    <label htmlFor="price" className="la xa eh oh vh">
                      Price (in usdt)
                    </label>
                    <input required type="number" name="price" value={form.price} onChange={handleChange} id="price" placeholder="10 ETH" className="pb ld qd wd ie sf wf eh oh uh di ii fj gj" />
                  </div>

                  <div className="ga za xc">
                    <div className="pb qf hk/2">
                      <div className="ka">
                        <label htmlFor="royalties" className="la xa eh oh vh">
                          Royalties (UnAvailable)
                        </label>
                        <input type="text" disabled name="royalties" id="royalties" placeholder="5%" className="pb ld qd wd ie sf wf eh oh uh di ii fj gj" />
                      </div>
                    </div>
                    <div className="pb qf hk/2">
                      <div className="ka">
                        <label htmlFor="size" className="la xa eh oh vh">
                          Size
                        </label>
                        <input type="text" name="size" value={form.size} onChange={handleChange} id="size" placeholder="e.g. 'size'" className="pb ld qd wd ie sf wf eh oh uh di ii fj gj" />
                      </div>
                    </div>
                  </div>

                  <div className="ka qg">
                    <p className="ih ph vh">
                      Time Auctions (Unavailabe)
                      <span className="uh"> (optional) </span>
                    </p>
                  </div>

                  <div className="ga za xc">
                    <div className="pb qf hk/2">
                      <div className="ka">
                        <label htmlFor="startDate" className="la xa eh oh vh">
                          Starting date
                        </label>
                        <input disabled type="date" name="startDate" id="startDate" className="pb ld qd wd ie sf wf eh oh uh di ii fj gj" />
                      </div>
                    </div>
                    <div className="pb qf hk/2">
                      <div className="ka">
                        <label htmlFor="expireDate" className="la xa eh oh vh">
                          Expiration date
                        </label>
                        <input type="time" disabled name="expireDate" id="expireDate" className="pb ld qd wd ie sf wf eh oh uh di ii fj gj" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button onClick={step == 0? createListNFT : step==1?mint: list } disabled={uploading|| !connectedAddress} className="sm pb ld he sf xf ch eh nh vh di">
                       {uploading ? "running ........." : step == 0? "upload" : step==1?"mint": "list"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreateNFT