import { NextApiRequest, NextApiResponse } from "next";
import { PassThrough } from 'stream';
import OpenAI from 'openai';



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { message } = req.body;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  const myStream = new PassThrough();
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: message }],
    stream: true,
  });
  
  for await (const part of stream) {
    process.stdout.write(part.choices[0]?.delta?.content || '');
    myStream.write(part.choices[0]?.delta?.content || '');
    myStream.pipe(res);
  }

}

