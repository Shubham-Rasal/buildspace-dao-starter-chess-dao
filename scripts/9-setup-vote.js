import sdk from './1-initialize-sdk.js';


const voteContractAddress = "0x9E83d8BA6ff6cCB16F24cc9Ea251386AbeaA307C";
const vote = sdk.getVote(voteContractAddress)

const token = sdk.getToken("0xde4f1fd54d980616ddBf28754cB2165b93Da47d3");

(async () => {
    try {

        await token.roles.grant("minter", vote.getAddress());

        console.log("✅ Successfully granted minter role to vote contract");

    }
    catch (ERROR) {
        console.log("Failed to grant vote permissions on token contract.", ERROR);
        process.exit(1);
    }


    try {

        const ownedTokenBalance = await token.balanceOf(process.env.WALLET_ADDRESS);
        const ownedAmount = ownedTokenBalance.displayValue;
        const percent50 = Number(ownedAmount) / 2;


        await token.transfer(voteContractAddress, percent50);

        console.log("✅ Successfully transferred " + percent90 + " tokens to vote contract");



    }
    catch (error) {
        console.log("Failed to send tokens to the treasury.", error);
    }
}
)();