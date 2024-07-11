import { NextResponse } from 'next/server';

async function serverInit(): Promise<{
  serviceId: string;
  templateId: string;
  userId: string;
}> {
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const userId = process.env.EMAILJS_USER_ID;
  if (!templateId) throw new Error('templateId is undefined!');
  if (!serviceId) throw new Error('serviceId is undefined!');
  if (!userId) throw new Error('serviceId is undefined!');
  return { serviceId, templateId, userId };
}

export async function GET(req: Request) {
  try {
    const config = await serverInit();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
