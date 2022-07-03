import { useAddress,useMetamask } from "@thirdweb-dev/react";


const App = () => {

  const address = useAddress();
  const connectWithWallet = useMetamask();
  console.log("Address: ", address);

  if(!address)
  {
    return (
      <div>
        <button onClick={connectWithWallet}>Connect with Wallet</button>
      </div>
    );
  }
  return (
    <div className="landing">
      <h1>Welcome to My DAO.
        😎
      </h1>
    </div>
  );
};

export default App;
