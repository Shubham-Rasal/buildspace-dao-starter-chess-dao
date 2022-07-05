//0x8E06BAF61D3fA40204f8331BcdD26817155A3E52

import sdk from "./1-initialize-sdk.js";

import {readFileSync} from "fs";

const editionDrop =   sdk.getEditionDrop("0x8E06BAF61D3fA40204f8331BcdD26817155A3E52");


(async () =>{
    try {
        await editionDrop.createBatch([
            {
              name: "Pawn",
              description: "This NFT will give you access to ChessDAO!",
              image: readFileSync("scripts/assets/pawn.jpg"),
            },
          ]);
          console.log("✅ Successfully created a new NFT in the drop!");

    } catch (error) {

        console.log("Falied to deploy NFT", error);
        
    }


})();