import AWS from 'aws-sdk';
import { S3Client } from '@aws-sdk/client-s3';

// const s3 = new AWS.S3({
//   accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
//   region: process.env.NEXT_PUBLIC_AWS_REGION
// });

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!
  },
})

export default s3;