import { type Uploader3Connector } from '@lxdao/uploader3-connector';
import FormData from 'form-data';
import fetch from 'node-fetch';

const token = `${process.env.NEXT_PUBLIC_CONNECTOR_TOKEN_Prefix}.${process.env.NEXT_PUBLIC_CONNECTOR_TOKEN}`;

enum ErrorMessage {
  NO_IMAGE_DATA_OR_TYPE = 'No image data or type provided',
  FILE_SIZE_TOO_LARGE = 'File size exceeds 2MB limit',
}

export async function GET() {
  return Response.json({ message: 'get' }, { status: 200 });
}

export async function POST(req: Request) {
  const { data: imageData = '', type } =
    (await req.json()) as Uploader3Connector.PostImageFile;

  if (!imageData || !type) {
    return Response.json(
      { error: ErrorMessage.NO_IMAGE_DATA_OR_TYPE },
      { status: 400 },
    );
  }

  let imageDataStr = imageData.startsWith('data:image/')
    ? imageData.replace(/^data:image\/\w+;base64,/, '')
    : imageData;
  const buffer = Buffer.from(imageDataStr, 'base64');

  if (buffer.byteLength > 2 * 1024 * 1024) {
    return Response.json(
      { error: ErrorMessage.FILE_SIZE_TOO_LARGE },
      { status: 400 },
    );
  }

  try {
    const formData = new FormData();
    formData.append('file', buffer, { contentType: type });
    const res = await fetch('https://node.lighthouse.storage/api/v0/add', {
      method: 'POST',
      body: formData,
      headers: {
        Encryption: 'false',
        Authorization: `Bearer ${token}`,
      },
    });
    const { Hash: cid } = (await res.json()) as { Hash: string };
    return Response.json(
      { url: `https://gateway.lighthouse.storage/ipfs/${cid}` },
      { status: 200 },
    );
  } catch (e) {
    // @ts-ignore
    return Response.json({ error: e.message }, { status: 500 });
  }
}
