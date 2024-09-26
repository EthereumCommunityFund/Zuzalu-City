import { NextResponse } from 'next/server';
import dayjs from 'dayjs';
import { supabase } from '@/utils/supabase/client';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { DID } from 'dids';
import { ceramic, composeClient } from '@/constant';
import { base64ToUint8Array } from '@/utils';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(timezone);

export async function POST(req: Request) {
  try {
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
      tracks,
      person,
      locations,
      timezone,
      id,
    } = body;

    const { data, error } = await supabase
      .from('events')
      .select('privateKey')
      .eq('eventId', id)
      .single();
    if (error) {
      console.error('Error getting private key:', error);
      return new NextResponse('Error getting private key', { status: 500 });
    }
    const seed = base64ToUint8Array(data.privateKey);
    const provider = new Ed25519Provider(seed);
    const did = new DID({ provider, resolver: getResolver() });
    await did.authenticate();
    ceramic.did = did;
    composeClient.setDID(did);

    const query = `
          mutation UpdateEvent($i: UpdateEventInput!) {
            updateEvent(input: $i) {
              document {
                id
              },
            }
          }
        `;
    const variables = {
      i: {
        id,
        content: {
          title: name,
          description: strDesc,
          tagline,
          spaceId: spaceId,
          profileId: profileId,
          imageUrl: imageUrl,
          startTime,
          endTime,
          customLinks: socialLinks,
          status: person ? 'In-Person' : 'Online',
          tracks: tracks.join(','),
          externalUrl: externalUrl,
          timezone,
        },
      },
    };
    await composeClient.executeQuery(query, variables);
    const { error: locationError } = await supabase
      .from('locations')
      .update({
        name: locations.join(','),
      })
      .eq('eventId', id);

    if (locationError) {
      console.error('Error inserting into locations:', locationError);
      return new NextResponse('Error inserting into locations', {
        status: 500,
      });
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
