import {
  createConnector,
  type Uploader3Connector,
} from '@lxdao/uploader3-connector';
import { NextApiRequest, NextApiResponse } from 'next';

const connector = createConnector('lighthouse', {
  token: `${process.env.NEXT_PUBLIC_CONNECTOR_TOKEN_Prefix}.${process.env.NEXT_PUBLIC_CONNECTOR_TOKEN}`,
});

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const reqBody = <Uploader3Connector.PostImageFile>req.body;
  let { data: imageData = '', type } = reqBody;

  if (!imageData) {
    res.status(400).json({ error: 'No image data' });
    return;
  }

  if (!type) {
    res.status(400).json({ error: 'No image type' });
    return;
  }

  if (imageData.startsWith('data:image/')) {
    imageData = imageData.replace(/^data:image\/\w+;base64,/, '');
  }

  const buffer = Buffer.from(imageData, 'base64');

  // if buffer size > 2MB throw error
  // or other your own logic
  if (buffer.byteLength > 2 * 1024 * 1024) {
    res.status(500).json({ error: 'file size > 2MB' });
    return;
  }

  const result = await connector.postImage({ data: imageData, type }).catch((e) => {
    res.status(500).json({ error: e.message });
  });

  if (result) {
    res.status(200).json({ url: result.url });
  }
}
