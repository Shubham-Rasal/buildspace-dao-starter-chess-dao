import sdk from "./1-initialize-sdk.js";

const token   = sdk.getToken("0xde4f1fd54d980616ddBf28754cB2165b93Da47d3");


(async()=>{
    try {
        const amount = 1_000_000;
        // Interact with your deployed ERC-20 contract and mint the tokens!
        await token.mintToSelf(amount);
        const totalSupply = await token.totalSupply();
    
        // Print out how many of our token's are out there now!
        console.log("✅ There now is", totalSupply.displayValue, "$CHD in circulation");
        
    } catch (error) {
        console.log("Failed to print money.",error)
    }
})();