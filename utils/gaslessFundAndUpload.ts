import { WebIrys } from '@irys/sdk';

type Tag = {
  name: string;
  value: string;
};

const gaslessFundAndUploadEVM = async (
  selectedFile: File,
  tags: Tag[],
): Promise<string> => {
  const pubKeyRes = (await (
    await fetch('/api/publicKeyEVM')
  ).json()) as unknown as {
    pubKey: string;
  };
  const pubKey = Buffer.from(pubKeyRes.pubKey, 'hex');
  const provider = {
    getPublicKey: async () => {
      return pubKey;
    },
    getSigner: () => {
      return {
        getAddress: () => pubKey.toString(),
        _signTypedData: async (
          _domain: never,
          _types: never,
          message: { address: string; 'Transaction hash': Uint8Array },
        ) => {
          const convertedMsg = Buffer.from(
            message['Transaction hash'],
          ).toString('hex');
          const res = await fetch('/api/signDataEVM', {
            method: 'POST',
            body: JSON.stringify({ signatureData: convertedMsg }),
          });
          const { signature } = await res.json();
          const bSig = Buffer.from(signature, 'hex');
          // Pad & convert so it's in the format the signer expects to have to convert from.
          const pad = Buffer.concat([
            Buffer.from([0]),
            Buffer.from(bSig),
          ]).toString('hex');
          return pad;
        },
      };
    },

    _ready: () => {},
  };
  const token = process.env.NEXT_PUBLIC_TOKEN || '';

  const wallet = { name: 'ethersv5', provider: provider };
  const irys = new WebIrys({
    network: 'mainnet', // "mainnet" || "devnet"
    token,
    wallet,
  });

  const w3signer = await provider.getSigner();
  const address = (await w3signer.getAddress()).toLowerCase();
  await irys.ready();

  const tx = await irys.uploadFile(selectedFile, {
    tags,
  });
  console.log(`Uploaded successfully. https://gateway.irys.xyz/${tx.id}`);

  return tx.id;
};

const gaslessFundAndUpload = async (
  selectedFile: File,
  tags: Tag[],
  blockchain: 'EVM',
): Promise<string> => {
  let txId = '';
  switch (blockchain) {
    case 'EVM':
      txId = await gaslessFundAndUploadEVM(selectedFile, tags);
      break;
    default:
      throw new Error('Unsupported blockchain');
  }
  return txId;
};

export default gaslessFundAndUpload;
