import sdk from "./1-initialize-sdk.js";

import { ethers } from "ethers";


const vote = sdk.getVote("0x9E83d8BA6ff6cCB16F24cc9Ea251386AbeaA307C");
const token = sdk.getToken("0xde4f1fd54d980616ddBf28754cB2165b93Da47d3");

(async () => {
    // try {

    //     const amount = 410_000;
    //     const description = "Should we mint more tokens?";
    //     const executions = [
    //         {
    //             toAddress: token.getAddress(),
    //             nativeTokenValue: 0,

    //             transactionData: token.encoder.encode(
    //                 "mintTo",
    //                 [
    //                     vote.getAddress(),
    //                     ethers.utils.parseEther(amount.toString(), 18),
    //                 ]
    //             ),
    //         },
    //     ];

    //     await vote.propose(description, executions);
    //     console.log("✅ Successfully created minting to treasury proposal");
    // }
    // catch (err) {
    //     console.log("Could not declare proposals.", err);
    //     process.exit(1);
    // }



    try {
        const amount = 6_900;
        const description = "Should we send " + amount + "to : " + process.env.WALLET_ADDRESS + " for being awesome ?";
        const executions = [
            {
                toAddress: token.getAddress(),
                nativeTokenValue: 0,
                transactionData: token.encoder.encode(
                    "transfer",
                    [
                        process.env.WALLET_ADDRESS,
                        ethers.utils.parseEther(amount.toString(), 18),
                    ]
                ),
            },
        ];

        await vote.propose(description, executions);
        console.log("✅ Successfully created transfer proposal");
    }

    catch (error) {
        console.log("Failed to send tokens to the guy who is awesome.", error);
    }

})();