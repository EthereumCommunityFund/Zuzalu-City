import { NextResponse } from 'next/server';

import {
  createConnector,
  type Uploader3Connector,
} from '@lxdao/uploader3-connector';


export async function GET() {
  try {
    const token = `${process?.env?.NEXT_PUBLIC_CONNECTOR_TOKEN_Prefix}.${process?.env?.NEXT_PUBLIC_CONNECTOR_TOKEN}`;
    const connector = createConnector('lighthouse', {
      token,
    });
    return NextResponse.json({ message: token, v: typeof connector }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e.message, stack: e.stack },
      { status: 401 },
    );
  }
}

