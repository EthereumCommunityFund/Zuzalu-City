import { NextResponse } from 'next/server';
import { BucketClient } from '@4everland/upload-pin';

export async function POST(req: Request) {
  const params = {
    accessKeyId: process.env.BUCKET_ACCESS_KEY ?? '',
    secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY ?? '',
    sessionToken: '',
    endpoint: process.env.ENDPIONT ?? '',
  };

  const bucketclient = new BucketClient(params);

  const fileReader = req.body?.getReader();

  const data: any = await fileReader?.read();
  var file = new TextDecoder().decode(data?.value);

  const task = bucketclient.uploadObject({
    Key: '/' + process.env.BUCKET_FOLDER_PATH + '18.png',
    Body: file,
    ContentType: 'image/jpeg',
    Bucket: process.env.BUCKET_NAME ?? '',
  });

  const { cid } = await task.done();
  return NextResponse.json({ cid });
}
