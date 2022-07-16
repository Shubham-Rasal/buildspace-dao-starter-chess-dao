
import sdk from "./1-initialize-sdk.js"

const token = sdk.getToken("0xde4f1fd54d980616ddBf28754cB2165b93Da47d3");

(async()=>{
    try {

        const allRoles  = await token.roles.getAll();
        console.log(token.roles.get("minter"));

        console.log("All roles ", allRoles);

        await token.roles.setAll({admin:[to],minter:[token.getAddress()]});

        console.log("All roles ", await token.roles.getAll());

        
        console.log("✅ Successfully revoked my superpowers from the ERC-20 contract");

    }
    catch (e)
    {
        console.error("Could not revoke roles.", e);
        
    }
})();