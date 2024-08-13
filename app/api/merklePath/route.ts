import { SigningKey, ethers } from 'ethers';
import { PROVIDER } from '@/constant';
import { supabase } from '@/utils/supabase/client';
import { NextResponse } from 'next/server';
import { TICKET_ABI } from '@/utils/ticket_abi';
import { createPublicClient, getContract, http } from 'viem';
import { scrollSepolia } from 'viem/chains';
import sindri, { SindriClient } from 'sindri';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';

async function getProof(left:String, right:String){
    const input = {
        index: "0",
        left_leaf: left,
        right_path: [right]
    }

    const circuitIdentifier = 'merkle-tree';
    const proofInput = JSON.stringify(input)
    const proof = await sindri.proveCircuit(circuitIdentifier, proofInput, true);
    const root = proof.public['Verifier.toml'].split("\"")[1]
    return root
}

async function getMerklePath(addresses: string[], targetAddress: string) {
    console.log(addresses)
    let tree = [addresses];
    let index = addresses.indexOf(targetAddress);

    if (index === -1) {
        throw new Error('Address not found');
    }

    let path = [];

    while (tree[tree.length - 1].length > 1) {
        const currentLevel = tree[tree.length - 1];
        let nextLevel = [];

        for (let i = 0; i < currentLevel.length; i += 2) {
            const left = currentLevel[i];
            const right = currentLevel[i + 1] || left;
            const hash = await getProof(left, right);
            nextLevel.push(hash);

            if (i === index || i + 1 === index) {
                path.push(i === index ? right : left);
                index = Math.floor(i / 2);
            }
        }
        tree.push(nextLevel);
    }

    // console.log(tree)

    return {
        root: tree[tree.length - 1][0],
        path,
        index: addresses.indexOf(targetAddress)
    };
}

export async function GET(req: Request) {
    const url = new URL(req.url)
    const params = url.searchParams
    const nftAddress = params.get("nftAddress")!
    const address = params.get("address")!

    let holders: string[] = [];
    try{
       
        const read = createPublicClient({
            chain: scrollSepolia,
            transport: http(),
            batch: { multicall: true },
          });
        const contract = getContract({
            address: nftAddress,
            abi: TICKET_ABI,
            client: read
          })

        const totalSupply = Number(await contract.read.totalTicketsMinted());
        console.log(totalSupply)
        for (let i = 0; i < totalSupply; i++) {
            // const tokenId = await contract.read.tokenByIndex([i]);
            const owner = await contract.read.ownerOf([i]);
            if (!holders.includes(owner)) {
                holders.push(owner);
            }
        }
    } catch(error) {
        return NextResponse.json({ error: `Error getting NFT holders: ${error}`}, { status: 500 })
    }

    const merklePath = await getMerklePath(holders.slice(0,4), address); 
    // console.log(merklePath)

    return NextResponse.json(merklePath);
};