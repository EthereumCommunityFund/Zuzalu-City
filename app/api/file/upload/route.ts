import { NextResponse } from 'next/server';
import { createConnector, type Uploader3Connector } from '@lxdao/uploader3-connector';

const token = `${process?.env?.NEXT_PUBLIC_CONNECTOR_TOKEN_Prefix}.${process?.env?.NEXT_PUBLIC_CONNECTOR_TOKEN}`;

export async function GET() {
  return NextResponse.json({ message: token.length }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const connector = createConnector('NFT.storage', { token });

    const reqBody = (await req.json()) as Uploader3Connector.PostImageFile;
    let { data: imageData = '', type } = reqBody;

    if (!imageData) {
      console.error('No image data');
      return NextResponse.json({ error: 'No image data' }, { status: 500 });
    }

    if (!type) {
      console.error('No image type');
      return NextResponse.json({ error: 'No image type' }, { status: 400 });
    }

    if (imageData.startsWith('data:image/')) {
      imageData = imageData.replace(/^data:image\/\w+;base64,/, '');
    }

    const buffer = Buffer.from(imageData, 'base64');
    // if buffer size > 2MB throw error
    if (buffer.byteLength > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'file size > 2MB' }, { status: 500 });
    }
    return connector
      .postImage({ data: imageData, type })
      .then((result) => {
        return NextResponse.json({ url: result.url });
      })
      .catch((e) => {
        return NextResponse.json({ error: e.message }, { status: 500 });
      });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e.message, stack: e.stack },
      { status: 401 }
    );
  }
}
