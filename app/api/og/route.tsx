import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import dayjs from 'dayjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { supabase } from '@/utils/supabase/client';
import { CeramicResponseType, EventEdge } from '@/types';
import { composeClient } from '@/constant';

export const runtime = 'nodejs';

import type { Font } from 'satori';

export default async function getFonts(): Promise<Font[]> {
  const [interSemiBold, interBold] = await Promise.all([
    fetch(
      `https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf`,
    ).then((res) => res.arrayBuffer()),
    fetch(
      `https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50ujIw2boKoduKmMEVuFuYMZg.ttf`,
    ).then((res) => res.arrayBuffer()),
  ]);

  return [
    {
      name: 'Inter',
      data: interSemiBold,
      style: 'normal',
      weight: 600,
    },
    {
      name: 'Inter',
      data: interBold,
      style: 'normal',
      weight: 700,
    },
  ];
}

const getEventDetailInfo = async (eventId: string) => {
  try {
    const response: CeramicResponseType<EventEdge> =
      (await composeClient.executeQuery(
        `
        query MyQuery($id: ID!) {
          node (id: $id) {
            ...on Event {
              endTime
              image_url
              startTime
              title
            }
          }
        }
      `,
        {
          id: eventId,
        },
      )) as CeramicResponseType<EventEdge>;
    if (response.data) {
      if (response.data.node) {
        return response.data.node;
      }
    }
  } catch (err) {
    console.log('Failed to fetch event: ', err);
  }
};

const getEventImage = async (eventId: string, origin: string) => {
  const eventData = await getEventDetailInfo(eventId!);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          padding: '20px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: '20px',
          borderRadius: '10px',
          backgroundColor:
            'linear-gradient(119deg, #2C2C2C 13.98%, #222 86.02%)',
          fontFamily: '"Inter"',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                lineHeight: '160%',
                color: '#fff',
                opacity: 0.8,
                marginBottom: '10px',
              }}
            >
              Event:
            </span>
            <span
              style={{
                fontSize: '24px',
                fontWeight: 700,
                lineHeight: '120%',
                color: '#fff',
                marginBottom: '18px',
              }}
            >
              {eventData?.title}
            </span>
            <span
              style={{
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: '120%',
                color: '#fff',
                opacity: 0.6,
              }}
            >
              {dayjs(eventData?.startTime).format('MMMM, D')} -{' '}
              {dayjs(eventData?.endTime).format('MMMM, D')}
            </span>
          </div>
          <img src={`${origin}/ZuCityLogoSocial.png`} height={18} width={80} />
        </div>
        <img
          src={eventData?.image_url}
          style={{
            height: '100%',
            width: '200px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            aspectRatio: '1/1',
          }}
        />
      </div>
    ),
    {
      width: 437,
      height: 246,
      fonts: await getFonts(),
    },
  );
};

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  // const { data: sessionData } = await supabase
  //   .from('sessions')
  //   .select('*')
  //   .eq('uuid', id!.toString())
  //   .single();

  if (type === 'event') {
    return getEventImage(id!, origin);
  }
}
