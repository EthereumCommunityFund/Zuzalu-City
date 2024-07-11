import { NextResponse, NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    data.append('file', file);
    data.append('pinataMetadata', JSON.stringify({ name: 'File to upload' }));
    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PINATA_KEY}`,
      },
      body: data,
    });
    const { IpfsHash } = await res.json();
    const url = `${process.env.PINATA_GATEWAY}/ipfs/${IpfsHash}`;
    return NextResponse.json({ url }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
