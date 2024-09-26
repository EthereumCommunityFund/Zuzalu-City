import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { CeramicResponseType, EventEdge, Space } from '@/types';
import { composeClient } from '@/constant';
import type { Font } from 'satori';
import { supabase } from '@/utils/supabase/client';

dayjs.extend(timezone);
dayjs.extend(utc);

export const runtime = 'nodejs';

async function getFonts(): Promise<Font[]> {
  const [interSemiBold, interBold, interRegular] = await Promise.all([
    fetch(
      `https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf`,
    ).then((res) => res.arrayBuffer()),
    fetch(
      `https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50ujIw2boKoduKmMEVuFuYMZg.ttf`,
    ).then((res) => res.arrayBuffer()),
    fetch(
      `https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf`,
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
    {
      name: 'Inter',
      data: interRegular,
      style: 'normal',
      weight: 400,
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
            ...on zucityEvent {
              endTime
              imageUrl
              startTime
              title
              timezone
              space {
                id
                name
                gated
                avatar
                banner
                description
              }
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

const getSpaceByID = async (spaceId: string) => {
  const GET_SPACE_QUERY = `
      query GetSpace($id: ID!) {
        node(id: $id) {
          ...on Space {
            avatar
            name
          }
        }
      }
      `;

  const response: any = await composeClient.executeQuery(GET_SPACE_QUERY, {
    id: spaceId,
  });
  return response.data.node as Space;
};

const getEventImage = async (eventId: string, origin: string) => {
  const eventData = await getEventDetailInfo(eventId!);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          padding: '50px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: '50px',
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
            flex: 1,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '36px',
                fontWeight: 600,
                lineHeight: '160%',
                color: '#fff',
                opacity: 0.8,
                marginBottom: '25px',
              }}
            >
              Event:
            </span>
            <span
              style={{
                fontSize: '61px',
                fontWeight: 700,
                lineHeight: '120%',
                color: '#fff',
                marginBottom: '45px',
              }}
            >
              {eventData?.title}
            </span>
            <span
              style={{
                fontSize: '41px',
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
          <img src={`${origin}/ZuCityLogoSocial.png`} height={46} width={205} />
        </div>
        <img
          src={eventData?.imageUrl}
          style={{
            height: '100%',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.10)',
          }}
        />
      </div>
    ),
    {
      fonts: await getFonts(),
    },
  );
};

const getSpaceImage = async (spaceId: string, origin: string) => {
  const spaceData = await getSpaceByID(spaceId!);
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          padding: '50px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: '50px',
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
                fontSize: '36px',
                fontWeight: 600,
                lineHeight: '160%',
                color: '#fff',
                opacity: 0.8,
                marginBottom: '25px',
              }}
            >
              Community Space:
            </span>
            <span
              style={{
                fontSize: '71px',
                fontWeight: 700,
                lineHeight: '120%',
                color: '#fff',
              }}
            >
              {spaceData?.name}
            </span>
          </div>
          <img src={`${origin}/ZuCityLogoSocial.png`} height={46} width={205} />
        </div>
        <img
          src={spaceData?.avatar}
          style={{
            height: '100%',
            borderRadius: '100%',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            flexShrink: 0,
          }}
        />
      </div>
    ),
    {
      fonts: await getFonts(),
    },
  );
};

const getSessionImage = async (
  sessionId: string,
  eventId: string,
  origin: string,
) => {
  const [{ data }, eventData] = await Promise.all([
    supabase
      .from('sessions')
      .select('*')
      .eq('uuid', sessionId!.toString())
      .single(),
    getEventDetailInfo(eventId!),
  ]);

  const startTime = dayjs(data.startTime).tz(eventData?.timezone);
  const gmtOffset = startTime.utcOffset() / 60;
  const gmtString = `GMT${gmtOffset >= 0 ? '+' : ''}${gmtOffset}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          padding: '50px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: '50px',
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
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span
              style={{
                fontSize: '36px',
                fontWeight: 600,
                lineHeight: '160%',
                color: '#fff',
                opacity: 0.8,
                marginBottom: '25px',
              }}
            >
              Session
            </span>
            <span
              style={{
                fontSize: '50px',
                fontWeight: 700,
                lineHeight: '60px',
                color: '#fff',
                marginBottom: '50px',
              }}
            >
              {data?.title}
            </span>
            <span
              style={{
                fontSize: '41px',
                fontWeight: 700,
                lineHeight: '49px',
                color: '#fff',
                opacity: 0.7,
                marginBottom: '13px',
              }}
            >
              {dayjs(data.startTime)
                .tz(eventData?.timezone)
                .format('ddd. MMMM D')}
            </span>
            <span
              style={{
                fontSize: '36px',
                lineHeight: '57px',
                color: '#fff',
                opacity: 0.7,
                fontWeight: 400,
              }}
            >
              {dayjs(data.startTime).tz(eventData?.timezone).format('h:mm A')} -{' '}
              {dayjs(data.endTime).tz(eventData?.timezone).format('h:mm A')} (
              {gmtString})
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <img
              src={`${origin}/ZuCityLogoSocial.png`}
              height={46}
              width={205}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                gap: '26px',
              }}
            >
              <img
                src={eventData?.space?.avatar}
                height={61}
                width={61}
                style={{ borderRadius: '10px' }}
              />
              <span
                style={{
                  fontSize: '33px',
                  lineHeight: '40px',
                  color: '#fff',
                  opacity: 0.7,
                  fontWeight: 700,
                }}
              >
                {eventData?.space?.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      fonts: await getFonts(),
    },
  );
};

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const eventId = searchParams.get('eventId');

  if (type === 'event') {
    return getEventImage(id!, origin);
  } else if (type === 'space') {
    return getSpaceImage(id!, origin);
  }
  return getSessionImage(id!, eventId!, origin);
}
