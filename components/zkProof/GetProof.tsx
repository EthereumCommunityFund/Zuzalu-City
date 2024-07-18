'use client';
import * as React from 'react';
import { SigningKey, ethers } from 'ethers';
import { useAccount,  useSignMessage } from 'wagmi';
import { getMerkleTree, getNFTOwners} from '@/utils/getMerkleTree';

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
        const signerAddress = address!
        var hashedMessage = ethers.hashMessage(message)
        var publicKey = SigningKey.recoverPublicKey(
            hashedMessage,
            signature)
    
        publicKey = publicKey.substring(4)
        let pub_key_x = publicKey.substring(0, 64);
        let pub_key_y = publicKey.substring(64);
    
        var sSignature = Array.from(ethers.getBytes(signature))
        sSignature.pop()

        const nftOwners = await getNFTOwners(nftAddress)
        if(!nftOwners.includes(signerAddress)){
          throw("Error: could not locate your account on the attendant merkle tree")
        }
        const index = nftOwners.indexOf(signerAddress) + 1

        const tree = await getMerkleTree(nftOwners)
        const hashPath = tree.getHexProof(signerAddress, index)
        const input = {
            pub_key_x: Array.from(ethers.getBytes("0x"+pub_key_x)),
            pub_key_y: Array.from(ethers.getBytes("0x"+pub_key_y)),
            signature: sSignature,
            hashed_message: Array.from(ethers.getBytes(hashedMessage)),
            root: tree.getRoot().toString('hex'),
            hash_path: hashPath,
            index: index,
        };
        console.log(input)

        const request = new Request('https://sindri.app/api/v1/circuit/zupass-scroll/prove', {
          method: 'POST',
          headers: { 
              'Accept': 'application/json', 
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SINDRI_API_KEY}`,
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: JSON.stringify({
              'proof_input': input,
              'perform_verify': true, 
          })
        })
        const proof = await fetch(request)

        // const noir = new Noir(circuit);
        // var proof = await noir.generateFinalProof(input);
        console.log(proof)
      }
    })()
  }, [signature, status])


  return (
   <button onClick={()=>{signMessage({message})}}>Get Proof</button>
  );
};

export default GetProof;
