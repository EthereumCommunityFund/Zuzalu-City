import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const token = `${process?.env?.NEXT_PUBLIC_CONNECTOR_TOKEN_Prefix}.${process?.env?.NEXT_PUBLIC_CONNECTOR_TOKEN}`;
    return NextResponse.json({ message: token }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e.message, stack: e.stack },
      { status: 401 },
    );
  }
}

