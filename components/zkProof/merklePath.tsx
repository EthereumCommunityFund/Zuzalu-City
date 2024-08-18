import { TICKET_ABI } from '@/utils/ticket_abi';
import { createPublicClient, defineChain, getContract, http } from 'viem';
import circuit from './merkleCircuit.json'
import { Noir } from '@noir-lang/noir_js';
import { ethers } from 'ethers';
import { verifierABI } from "./verifierABI"
 
export const PATH_LENGTH = 10
const LEAVES_NUM = 2**PATH_LENGTH

const VERIFIER_CONTRACT_10 = '0xbE137F14e637Df1caC958042F163261E72028268'

// the default RPC URL is really flaky for retrieving state variables
const scrollSepolia = defineChain({
    id: 534_351,
    name: 'Scroll Sepolia',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://scroll-public.scroll-testnet.quiknode.pro'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Scrollscan',
        url: 'https://sepolia.scrollscan.com',
        apiUrl: 'https://api-sepolia.scrollscan.com/api',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 9473,
      },
    },
    testnet: true,
})

async function getProof(left:string, right:string){
    const input = {
        index: "0",
        left_leaf: left,
        right_path: [right]
    }

    const { returnValue: root }= await new Noir(circuit).execute(input) ;
    return root as string
}

async function getNFTOwners(nftAddress: string){
    let holders: string[] = [];
    try{
        const client = createPublicClient({
            chain: scrollSepolia,
            transport: http(),
            batch: { multicall: true },
            cacheTime: 5,
        });
        const contract = getContract({
            address: nftAddress,
            abi: TICKET_ABI,
            client
        })

        const totalSupply = Number(await contract.read.totalTicketsMinted());        

        for (let i = 0; i < totalSupply; i++) {
            // const tokenId = await contract.read.tokenByIndex([i]);
            const owner = await contract.read.ownerOf([i]);
            if (!holders.includes(owner)) {
                holders.push(owner);
            }
        }
    } catch(error) {
        console.log("error getting NFT holders", error)
    }
    return holders
}
export async function getMerklePath(nftAddress: string, targetAddress: string) {
    const addresses = await getNFTOwners(nftAddress)
    let index = addresses.indexOf(targetAddress);
    if (index === -1) {
        throw new Error('Address not found');
    }

    // ensure the merkle tree has the PATH_LENGTH levels by padding the leaves to the right length
    let tree = [addresses.concat(Array(LEAVES_NUM-addresses.length).fill("0"))];
    // let tree = [addresses];
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

    return {
        root: tree[tree.length - 1][0],
        path,
        index: addresses.indexOf(targetAddress)
    };
};

export async function getMerkleRoot(nftAddress: string) {
    const addresses = await getNFTOwners(nftAddress)

    // ensure the merkle tree has the PATH_LENGTH levels by padding the leaves to the right length
    let tree = [addresses.concat(Array(LEAVES_NUM-addresses.length).fill("0"))];
    while (tree[tree.length - 1].length > 1) {
        const currentLevel = tree[tree.length - 1];
        let nextLevel = [];

        for (let i = 0; i < currentLevel.length; i += 2) {
            const left = currentLevel[i];
            const right = currentLevel[i + 1] || left;
            const hash = await getProof(left, right);
            nextLevel.push(hash);
        }
        tree.push(nextLevel);
    }

    const root = tree[tree.length - 1][0]
    return root
};

export async function verify(message: string, nftAddress: string, proof: string){
    const hashedMessage = ethers.hashMessage(message)
    const root = await getMerkleRoot(nftAddress)

    var publicInputs = Array.from(ethers.getBytes(hashedMessage)).map(x => "0x" + x.toString(16).padStart(64,"0"))
    publicInputs.push(root)

    const client = createPublicClient({
        chain: scrollSepolia,
        transport: http(),
        batch: { multicall: true },
        cacheTime: 5,
    });
    const { result } = await client.simulateContract({
        address: VERIFIER_CONTRACT_10,
        abi: verifierABI,
        functionName: 'verify',
        args: ["0x" + proof, publicInputs],
    })
    return result
}