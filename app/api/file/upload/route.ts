import { type Uploader3Connector } from '@lxdao/uploader3-connector';

const token = `${process.env.NEXT_PUBLIC_CONNECTOR_TOKEN_Prefix}.${process.env.NEXT_PUBLIC_CONNECTOR_TOKEN}`;

import FormData from 'form-data';
import fetch from 'node-fetch';

export async function GET() {
  return Response.json({ message: 'get' }, { status: 200 });
}

export async function POST(req: Request) {
  const reqBody = (await req.json()) as Uploader3Connector.PostImageFile;
  let { data: imageData = '', type } = reqBody;

  if (!imageData) {
    return Response.json({ error: 'No image data' }, { status: 500 });
  }

  if (!type) {
    return Response.json({ error: 'No image type' }, { status: 500 });
  }

  if (imageData.startsWith('data:image/')) {
    imageData = imageData.replace(/^data:image\/\w+;base64,/, '');
  }

  const buffer = Buffer.from(imageData, 'base64');

  // if buffer size > 2MB throw error
  if (buffer.byteLength > 2 * 1024 * 1024) {
    return Response.json({ error: 'file size > 2MB' }, { status: 500 });
  }

  const formData = new FormData();
  formData.append('file', buffer, { contentType: type });

  return fetch('https://node.lighthouse.storage/api/v0/add', {
    method: 'POST',
    body: formData,
    headers: {
      Encryption: 'false',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      const { Hash: cid } = res as { Hash: string };
      return Response.json(
        { url: `https://gateway.lighthouse.storage/ipfs/${cid}` },
        { status: 200 },
      );
    })
    .catch((e) => {
      return Response.json({ error: e.message }, { status: 500 });
    });
}
