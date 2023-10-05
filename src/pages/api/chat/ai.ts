import type { NextRequest } from "next/server";
import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

type NextProps = NextRequest & {
  body: {
    message: string;
  };
};

const handler = async (req: NextProps) => {
  const res = await req.json();
  console.log(res.message);
  let context = res.context || "You are a helpful assistant.";

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        { role: "system", content: context },
        ...res.messages,
        { role: "user", content: res.message },
      ],
      max_tokens: 500,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1,
    });

    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error(error);

    return new Response(JSON.stringify(error), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    });
  }
};

export const config = {
  runtime: "edge",
};

export default handler;
