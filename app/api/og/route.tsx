import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import dayjs from 'dayjs';
import { supabase } from '@/utils/supabase/client';
import { CeramicResponseType, EventEdge } from '@/types';
import { composeClient } from '@/constant';

export const runtime = 'nodejs';

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
          gap: '40px',
          borderRadius: '10px',
          backgroundColor:
            'linear-gradient(119deg, #2C2C2C 13.98%, #222 86.02%)',
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
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                lineHeight: '1.6',
                color: '#fff',
                opacity: 0.8,
                marginBottom: '10px',
              }}
            >
              Event:
            </p>
            <p
              style={{
                fontSize: '24px',
                fontWeight: 700,
                lineHeight: '1.2',
                color: '#fff',
                marginBottom: '18px',
              }}
            >
              {eventData?.title}
            </p>
            <p
              style={{
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: '1.2',
                color: '#fff',
                opacity: 0.6,
              }}
            >
              {dayjs(eventData?.startTime).format('MMMM, D')} -{' '}
              {dayjs(eventData?.endTime).format('MMMM, D')}
            </p>
          </div>
          <img src={`${origin}/ZuCityLogoSocial.png`} height={18} width={80} />
        </div>
        <img
          src={eventData?.image_url}
          style={{
            height: '100%',
            boxShadow: '0px 14px 44px 0px #26292E',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.10)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
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
