import { NextResponse } from 'next/server';
import dayjs from 'dayjs';
import { supabase } from '@/utils/supabase/client';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { DID } from 'dids';
import { ceramic, composeClient } from '@/constant';
import { uint8ArrayToBase64 } from '@/utils';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(timezone);

export async function POST(req: Request) {
  try {
    let seed = crypto.getRandomValues(new Uint8Array(32));
    const provider = new Ed25519Provider(seed);
    const did = new DID({ provider, resolver: getResolver() });
    await did.authenticate();
    ceramic.did = did;
    composeClient.setDID(did);
    const body = await req.json();
    const {
      name,
      tagline,
      externalUrl,
      strDesc,
      spaceId,
      profileId,
      imageUrl,
      startTime,
      endTime,
      socialLinks,
      adminId,
      tracks,
      person,
      locations,
      timezone,
    } = body;

    const update: any = await composeClient.executeQuery(
      `
      mutation CreateZucityEventMutation($input: CreateZucityEventInput!) {
        createZucityEvent(
          input: $input
        ) {
          document {
            id
            spaceId
            title
            description
            tagline
            imageUrl
            createdAt
            startTime
            endTime
            profileId
            status
            customLinks {
              title
              links
            }
            tracks
            superAdmin {
              id
            }
            externalUrl
            timezone
          }
        }
      }
      `,
      {
        input: {
          content: {
            title: name,
            description: strDesc,
            tagline: tagline,
            spaceId: spaceId,
            profileId: profileId,
            imageUrl: imageUrl,
            createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]'),
            startTime: startTime,
            endTime: endTime,
            customLinks: socialLinks,
            status: person ? 'In-Person' : 'Online',
            tracks: tracks.join(','),
            superAdmin: adminId,
            externalUrl: externalUrl,
            timezone: timezone,
          },
        },
      },
    );
    const { data: locationData, error: locationError } = await supabase
      .from('locations')
      .insert({
        name: locations.join(','),
        eventId: update.data.createZucityEvent.document.id,
      });

    if (locationError) {
      console.error('Error inserting into locations:', locationError);
      return new NextResponse('Error inserting into locations', {
        status: 500,
      });
    }

    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .insert({
        privateKey: uint8ArrayToBase64(seed),
        eventId: update.data.createZucityEvent.document.id,
      });

    if (eventError) {
      console.error('Error inserting into events:', eventError);
      return new NextResponse('Error inserting into events', { status: 500 });
    }

    return NextResponse.json(
      {
        message:
          'Submitted! Create process probably complete after few minutes.',
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return new NextResponse('An unexpected error occurred', { status: 500 });
  }
}
