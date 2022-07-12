import { useAddress, useMetamask, useEditionDrop, useToken } from "@thirdweb-dev/react";
import { useState, useEffect ,useMemo} from 'react';





const App = () => {
  
  const address = useAddress();
  const token = useToken("0xde4f1fd54d980616ddBf28754cB2165b93Da47d3");
  const connectWithWallet = useMetamask();
  const editionDrop = useEditionDrop("0x8E06BAF61D3fA40204f8331BcdD26817155A3E52");
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  const [memberAddresses, setMemberAddresses] = useState([]);


  const shortAddress = (str) =>{
    return str.substring(0,6) + "..."+str.substring(str.length-4,str.length);
  }

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
  const getAllClaimerAddresses = async () => {
    try {

      const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);
      setMemberAddresses(walletAddresses);
    }
    catch (err) {
      console.error("Failed to get all claimer addresses", err);
    }

  }
  getAllClaimerAddresses();
}, [hasClaimedNFT, editionDrop.history]);



  useEffect(() => {
    if (!address)
      return;


    const checkBalance = async () => {


      try {
        const balance = await editionDrop.balanceOf(address, 0);

        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("this user has the membership");
        }
        else {
          setHasClaimedNFT(false);
          console.log("this user does not have the membership");
        }

      } catch (error) {

        setHasClaimedNFT(false);
        console.log("Failed to get balance", error);

      }


    }
    checkBalance();


  }, [address, editionDrop])



  //function to get all the token amounts of the members

  useEffect(() => {
     if(!hasClaimedNFT)
     return;

     const getAllBAlances = async () => {

      try{
        const amounts= await token.history.getAllHolderBalances();
        console.log(amounts);
        setMemberTokenAmounts(amounts);

      }
      catch(error)
      {
        console.loh("Failed to get balances.",error);
      }



     }

     getAllBAlances()
   

  
  },[token.history,hasClaimedNFT])

  const memberList = useMemo(()=>{

   return  memberAddresses.map((address)=>{

      const member = memberTokenAmounts.find(({holder})=>holder===address)
      
      return {
        address,
        tokenAmount:member?.balance.displayValue||"0", 
      }
    })
    

  },[memberAddresses,memberTokenAmounts])

  const mint = async () => {

    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Failed to mint NFT", error);

    }
    finally{
      setIsClaiming(false);

    }

  }
  console.log("Address: ", address);

  if (!address) {
    return (
      <div>
        <button onClick={connectWithWallet}>Connect with Wallet</button>
      </div>
    );
  }
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>♟ DAO Member Page</h1>
        <p>Congratulations on being a member</p>
        <table className="card">
            <thead>
              <tr>
                <th>Address</th>
                <th>Token Amount</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => {
                return (
                  <tr key={member.address}>
                    <td>{shortAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
      </div>
    );
  };
 return (
    <div className="mint-nft">
      <h1>Mint your free 🍪DAO Membership NFT</h1>
      <button
        disabled={isClaiming}
        onClick={mint}
      >
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};

export default App;
