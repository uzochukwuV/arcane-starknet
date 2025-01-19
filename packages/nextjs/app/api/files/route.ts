import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "../../../utils/config";

import fsPromises from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const name: string| undefined = data.get("name")?.toString()
    const description: string | undefined = data.get("description")?.toString()
    if( !name || !description){
        throw new Error(`No name or description ${data.values().toArray().join("")}`)
    }
    const file: File | null = data.get("file") as unknown as File;
    const uploadData = await pinata.upload.file(file).addMetadata({
        keyValues:{
            name: name!,
            description : description!
        }
    });
    
    const url = await pinata.gateways.convert(uploadData.IpfsHash)
    const view = {
        name: name!,
        description : description!,
        url:url
      };
    
      // Convert the view to a JSON string
      const jsonview = JSON.stringify(view, null, 2);
    
      // Define the file path
      const filePath = path.join(__dirname, 'data.json');
      await fsPromises.writeFile(filePath, jsonview, 'utf8');
      const buffer =await fsPromises.readFile(filePath)
      let blob = new Blob([buffer]);
      let newfile = new File([blob], "nft.json")
    
      const uploadJson = await pinata.upload.file(newfile)
      const jsonurl = await pinata.gateways.convert(uploadJson.IpfsHash)
    return NextResponse.json({url,jsonurl}, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
