import type { NextApiRequest, NextApiResponse } from 'next';
import { TypedEthereumSigner } from 'arbundles';
import { NextResponse } from 'next/server';

/**
 *
 * @returns A signed version of the data, signatureData, as sent by the client.
 */
async function signDataOnServer(signatureData: Buffer): Promise<Buffer> {
  const key = process.env.PRIVATE_KEY_EVM;
  if (!key) throw new Error('Private key is undefined!');
  const signer = new TypedEthereumSigner(key);
  return Buffer.from(await signer.sign(signatureData));
}

async function readFromStream(stream: ReadableStream): Promise<string> {
  const reader = stream.getReader();
  let result = '';
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      result += new TextDecoder().decode(value);
    }
  }

  return result;
}

export async function POST(req: Request) {
  //@ts-ignore
  const rawData = await readFromStream(req.body);
  const body = JSON.parse(rawData);

  const signatureData = Buffer.from(body.signatureData, 'hex');
  const signature = await signDataOnServer(signatureData);

  return NextResponse.json({ signature: signature.toString('hex') });
}
