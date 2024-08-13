'use client';
import * as React from 'react';
import { SigningKey, ethers, parseEther } from 'ethers';
import { useAccount,  useSignMessage } from 'wagmi';
import { createWalletClient, custom, encodeFunctionData, getContract } from 'viem';
import { scrollSepolia } from 'viem/chains';
import { TICKET_ABI } from '@/utils/ticket_abi'
import sindri from 'sindri';

type GetProofProps = {
  nftAddress: `0x${string}`
};

const GetProof: React.FC<GetProofProps> = (props) => {
  const { nftAddress } = props;
  const { data: signature, signMessage, status} = useSignMessage();
  const { address } = useAccount();
  const message = "I own this NFT!";

  React.useEffect(() => {
    ;(async () => {
      if (signature && status ==='success') {
        // const client = createWalletClient({
        //   chain: scrollSepolia,
        //   transport: custom(window.ethereum!)
        // })

        // const contract = getContract({
        //   address: nftAddress,
        //   abi: TICKET_ABI,
        //   client
        // })

        // const hash = await client.writeContract({
        //   address:'0xe312A706DC0AF7CBA0F5FD4B74C4b33321b3d422',
        //   abi: TICKET_ABI,
        //   functionName: 'purchaseTicket',
        //   args: ['0x0211408B26fBa3740eAD9Debc210F9619f22a97e', "blah"],
        //   account:  "0x2353E1Ab920EC5d5c6af47B5CDaF615215d8bfD1",
        // })

        // console.log(hash)

        const data = await fetch(`/api/merklePath?nftAddress=${nftAddress}&address=${address}`)
        const merkleData = await data.json()
        console.log(merkleData)

        var hashedMessage = ethers.hashMessage(message)
        var publicKey = SigningKey.recoverPublicKey(hashedMessage, signature)
        publicKey = publicKey.substring(4)
        let pub_key_x = publicKey.substring(0, 64);
        let pub_key_y = publicKey.substring(64);
    
        var sSignature = Array.from(ethers.getBytes(signature))
        sSignature.pop()

        const input = JSON.stringify({
            pub_key_x: Array.from(ethers.getBytes("0x"+pub_key_x)),
            pub_key_y: Array.from(ethers.getBytes("0x"+pub_key_y)),
            signature: sSignature,
            hashed_message: Array.from(ethers.getBytes(hashedMessage)),
            root: merkleData.root,
            hash_path: merkleData.path,
            index: merkleData.index
        });
        console.log(input)

        const circuitIdentifier = 'zupass-scroll';
        sindri.authorize({ apiKey: process.env.NEXT_PUBLIC_SINDRI_API_KEY })
        const circuit = await sindri.getCircuit("zupass-scroll");
        console.log('Circuit details:', circuit);
        const proof = await sindri.proveCircuit(circuitIdentifier, input, true);
        console.log(proof)
      }
    })()
  }, [signature, status])


  return (
   <button onClick={()=>{signMessage({message})}}>Get Proof</button>
  );
};

export default GetProof;
