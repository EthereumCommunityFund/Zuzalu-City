import { NextApiRequest, NextApiResponse } from "next";
import s3 from "@/utils/aws/aws-config";
import formidable, { IncomingForm } from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "File parsing error" });
    }

    const fileArray = files.file instanceof Array ? files.file : [files.file];
    const file = fileArray[0] as formidable.File
    const fileContent = fs.readFileSync(file.filepath);

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: file.originalFilename as string,
      Body: fileContent
    }

    try {
      await s3.upload(params).promise();
      return res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'File upload error' })
    }
  })
}

export default handler;