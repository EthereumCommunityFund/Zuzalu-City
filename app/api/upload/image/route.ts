import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'ok' }, { status: 200 });
}

export async function POST() {
  return NextResponse.json({ message: 'post'}, { status: 200 });
}
