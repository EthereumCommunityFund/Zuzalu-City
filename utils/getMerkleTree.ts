import { MerkleTree } from "merkletreejs";
import { ethers, Contract } from "ethers";
import keccak256 from "keccak256";
import abi from "../components/zkProof/tempABI.json"
import { client } from "@/context/WalletContext";

export async function getNFTOwners(nftAddress: string): Promise<string[]> {
    let nftOwners : string[] = []
    let i = 1
    while(true){
        try {
        const data = await client.readContract({
            address: nftAddress,
            abi,
            functionName: 'ownerOf',
            args: [i]
        })
        nftOwners.push(data)
        console.log("AFHFIJHASDFI", data)
        i++;
        } catch(e){
        return nftOwners
        }
    }
}

export async function getMerkleTree(holders: string[]) {
    const leaves = holders.map((x) => {
        return ethers.solidityPackedKeccak256(['address'], [x]);
      });
    
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    return tree
}

