import { useAddress, useMetamask, useEditionDrop } from "@thirdweb-dev/react";
import { useState, useEffect } from 'react';



const App = () => {

  const address = useAddress();
  const connectWithWallet = useMetamask();
  const editionDrop = useEditionDrop("0x8E06BAF61D3fA40204f8331BcdD26817155A3E52");
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);


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
        <h1>🍪DAO Member Page</h1>
        <p>Congratulations on being a member</p>
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
