import sdk from "./1-initialize-sdk.js"

const token = sdk.getToken("0xde4f1fd54d980616ddBf28754cB2165b93Da47d3");


const rolesAndMembers = await token.roles.getAll();

const updatedRoles = {
  ...rolesAndMembers,
  minter: [...rolesAndMembers.minter, token.getAddress()],
};

await token.roles.setAll(updatedRoles);