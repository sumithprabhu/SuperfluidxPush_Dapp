import React, { useState, useEffect } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import {
  Button,
  Form,
  FormGroup,
  FormControl,
  Spinner,
  Card
} from "react-bootstrap";
import "./DeleteStream.css";
import { ethers } from "ethers";



//where the Superfluid logic takes place
async function deleteExistingFlow(recipient) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner();

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider
  });

  const superSigner = sf.createSigner({ signer: signer });

  console.log(signer);
  console.log(await superSigner.getAddress());
  const daix = await sf.loadSuperToken("fDAIx");

  console.log(daix);

  try {
    const deleteFlowOperation = daix.deleteFlow({
      sender: await signer.getAddress(),
      receiver: recipient
      // userData?: string
    });

    console.log(deleteFlowOperation);
    console.log("Deleting your stream...");

    const result = await deleteFlowOperation.exec(superSigner);
    console.log(result);

    console.log(
      `Congrats - you've just updated a money stream!
    `
    );
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
}

const DeleteStream = ({checkIfWalletIsConnected,currentAccount}) => {
  const [recipient, setRecipient] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);



  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  function DeleteButton({ isLoading, children, ...props }) {
    return (
      <Button variant="success" className="button" {...props}>
        {isButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    );
  }

  const handleRecipientChange = (e) => {
    setRecipient(() => ([e.target.name] = e.target.value));
  };

  return (
    <div>
      <h2>Delete a Flow</h2>
      
      <Form>
        <FormGroup className="mb-3">
          <FormControl
            name="recipient"
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Enter recipient address"
          ></FormControl>
        </FormGroup>
        <FormGroup className="mb-3"></FormGroup>
        <DeleteButton
          onClick={() => {
            setIsButtonLoading(true);
            deleteExistingFlow(recipient);
            setTimeout(() => {
              setIsButtonLoading(false);
            }, 1000);
          }}
        >
          Click to Create Your Stream
        </DeleteButton>
      </Form>

      <div className="description">
        <p>
          Go to the DeleteFlow.js component and look at the <b>deleteFlow() </b>
          function to see under the hood
        </p>
      </div>
    </div>
  );
};

export default DeleteStream;
