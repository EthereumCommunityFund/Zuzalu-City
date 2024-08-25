import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { supabase } from '@/utils/supabase/client';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  const image =
    'https://bafkreifje7spdjm5tqts5ybraurrqp4u6ztabbpefp4kepyzcy5sk2uel4.ipfs.nftstorage.link';

  const { data: sessionData } = await supabase
    .from('sessions')
    .select('*')
    .eq('uuid', id!.toString())
    .single();

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          fontWeight: 600,
          color: 'white',
        }}
      >
        <img
          src={image}
          alt=""
          width={1050}
          height={549}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
        <h1
          style={{
            position: 'absolute',
            bottom: 60,
            left: 80,
            margin: 0,
            fontSize: 50,
            maxWidth: 900,
            whiteSpace: 'pre-wrap',
            letterSpacing: -1,
          }}
        >
          {sessionData.title}
        </h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
