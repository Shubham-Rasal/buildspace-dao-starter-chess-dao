import { useAddress, useMetamask, useEditionDrop, useToken, useVote } from "@thirdweb-dev/react";
import { useState, useEffect, useMemo } from 'react';

import { AddressZero } from '@ethersproject/constants';




const App = () => {

  const address = useAddress();
  const token = useToken("0xde4f1fd54d980616ddBf28754cB2165b93Da47d3");

  const vote = useVote("0x9E83d8BA6ff6cCB16F24cc9Ea251386AbeaA307C");
  const connectWithWallet = useMetamask();
  const editionDrop = useEditionDrop("0x8E06BAF61D3fA40204f8331BcdD26817155A3E52");
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  const [memberAddresses, setMemberAddresses] = useState([]);

  const [votes, setVotes] = useState([]);


  const shortAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4, str.length);
  }

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);


  useEffect(() => {

    if (!hasClaimedNFT)
      return;

    const getAllProposals = async () => {

      try {
        const proposals = await vote.getAll();

        setProposals(proposals);
        console.log("🌈Proposals:", proposals);

      }
      catch (err) {
        console.log("Could not get proposals.", err);
      }

    }

    getAllProposals();
  }, [hasClaimedNFT, vote]);


  useEffect(() => {

    if (!hasClaimedNFT)
      return;

    if (!proposals.length)

      return;

    const checkVoted = async () => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);

        setHasVoted(hasVoted);
        if (hasVoted) {
          console.log("🥵 User has already voted");
        } else {
          console.log("🙂 User has not voted yet");
        }
      }
      catch (err) {
        console.log("Could not check if voted.", err);
      }
    }


    checkVoted();

  }, [hasClaimedNFT, proposals, address, vote])


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
    if (!hasClaimedNFT)
      return;

    const getAllBAlances = async () => {

      try {
        const amounts = await token.history.getAllHolderBalances();
        console.log(amounts);
        setMemberTokenAmounts(amounts);

      }
      catch (error) {
        console.loh("Failed to get balances.", error);
      }



    }

    getAllBAlances()



  }, [token.history, hasClaimedNFT])

  const memberList = useMemo(() => {

    return memberAddresses.map((address) => {

      const member = memberTokenAmounts.find(({ holder }) => holder === address)

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      }
    })


  }, [memberAddresses, memberTokenAmounts])

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
    finally {
      setIsClaiming(false);

    }

  }

  // const checkIfExecuted = async (votes) => {

  //   await Promise.all(
  //     votes.map(async ({ proposalId }) => {
  //       // we'll first get the latest state of the proposal again, since we may have just voted before
  //       const proposal = await vote.get(proposalId);

  //       //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
  //       if (proposal.state === 4) {
  //         console.log(proposal)

  //         return vote.execute(proposalId);

  //       }
  //     })
  //   );


  // }

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
        <h2>Active Proposals</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(e);

            //before we do async things, we want to disable the button to prevent double clicks
            setIsVoting(true);

            // lets get the votes from the form for the values
            const votes = proposals.map((proposal) => {
              const voteResult = {
                proposalId: proposal.proposalId,
                //abstain by default
                vote: 2,
              };

              proposal.votes.forEach((vote) => {
                const elem = document.getElementById(
                  proposal.proposalId + "-" + vote.type
                );

                if (elem.checked) {
                  voteResult.vote = vote.type;
                  return;
                }
              });
              return voteResult;
            });

            console.log(votes)

            // first we need to make sure the user delegates their token to vote
            try {
              //we'll check if the wallet still needs to delegate their tokens before they can vote
              const delegation = await token.getDelegationOf(address);
              // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
              if (delegation === AddressZero) {
                //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                await token.delegateTo(address);
              }
              // then we need to vote on the proposals
              try {
                await Promise.all(
                  votes.map(async ({ proposalId, vote: _vote }) => {
                    // before voting we first need to check whether the proposal is open for voting
                    // we first need to get the latest state of the proposal
                    const proposal = await vote.get(proposalId);
                    // then we check if the proposal is open for voting (state === 1 means it is open)
                    if (proposal.state === 1) {
                      // if it is open for voting, we'll vote on it
                      return vote.vote(proposalId, _vote);
                    }
                    // if the proposal is not open for voting we just return nothing, letting us continue
                    return;
                  })
                );
                try {
                  // if any of the propsals are ready to be executed we'll need to execute them
                  // a proposal is ready to be executed if it is in state 4
                  await Promise.all(
                    votes.map(async ({ proposalId }) => {
                      // we'll first get the latest state of the proposal again, since we may have just voted before
                      const proposal = await vote.get(proposalId);

                      //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                      if (proposal.state === 4) {
                        console.log(proposal)

                        return vote.execute(proposalId);

                      }
                    })
                  );
                  // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                  setHasVoted(true);
                  // and log out a success message
                  console.log("successfully voted");
                } catch (err) {
                  console.error("failed to execute votes", err);
                }
              } catch (err) {
                console.error("failed to vote", err);
              }
            } catch (err) {
              console.error("failed to delegate tokens");
            } finally {
              // in *either* case we need to set the isVoting state to false to enable the button again
              setIsVoting(false);
            }
          }}
        >
          {proposals.map((proposal) => (
            <div key={proposal.proposalId} className="card">
              <h3>{proposal.description}</h3>
              <div>
                {proposal.votes.map(({ type, label }) => (
                  <div key={type}>
                    <input
                      type="radio"
                      id={proposal.proposalId + "-" + type}
                      name={proposal.proposalId}
                      value={type}
                      //default the "abstain" vote to checked
                      defaultChecked={type === 2}
                    />
                    <label htmlFor={proposal.proposalId + "-" + type}>
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button disabled={isVoting || hasVoted} type="submit">
            {isVoting
              ? "Voting..."
              : hasVoted
                ? "You Already Voted"
                : "Submit Votes"}
          </button>
          {!hasVoted && (
            <small>
              This will trigger multiple transactions that you will need to
              sign.
            </small>
          )}
        </form>

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
