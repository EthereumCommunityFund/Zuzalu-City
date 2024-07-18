import { NextRequest, NextResponse } from 'next/server';
import dayjs from 'dayjs';
import { supabase } from '@/utils/supabase/client';
import { ComposeClient } from '@composedb/client';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { DID } from 'dids';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { RuntimeCompositeDefinition } from '@composedb/types';
import { definition } from '@/composites/definition.js';
import { uint8ArrayToBase64 } from '@/utils';
const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
const ceramicUrl =
  (isDev
    ? process.env.NEXT_PUBLIC_CERAMIC_URL_DEV
    : process.env.NEXT_PUBLIC_CERAMIC_URL_PROD) || 'http://localhost:7007';

const ceramic = new CeramicClient(ceramicUrl);
const composeClient = new ComposeClient({
  ceramic: ceramicUrl,
  definition: definition as RuntimeCompositeDefinition,
});
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
      participant,
      max_participant,
      min_participant,
      external_url,
      strDesc,
      spaceId,
      profileId,
      avatarURL,
      startTime,
      endTime,
      socialLinks,
      adminId,
      tracks,
      person,
      locations,
    } = body;

    const update: any = await composeClient.executeQuery(
      `
      mutation CreateEventMutation($input: CreateEventInput!) {
        createEvent(
          input: $input
        ) {
          document {
            id
            spaceId
            title
            description
            tagline
            image_url
            createdAt
            startTime
            endTime
            profileId
            participant_count
            max_participant
            min_participant
            status
            customLinks {
              title
              links
            }
            tracks
            superAdmin {
              id
            }
            external_url
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
            image_url: avatarURL,
            createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]'),
            startTime: startTime,
            endTime: endTime,
            customLinks: Object.entries(socialLinks).map(([key, value]) => ({
              title: key,
              links: value,
            })),
            participant_count: participant,
            max_participant: max_participant,
            min_participant: min_participant,
            status: person ? 'In-Person' : 'Online',
            tracks: tracks.join(','),
            superAdmin: adminId,
            external_url: external_url,
          },
        },
      },
    );
    const { data: locationData, error: locationError } = await supabase
      .from('locations')
      .insert({
        name: body.locations.join(','),
        eventId: update.data.createEvent.document.id,
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
        eventId: update.data.createEvent.document.id,
      });

    if (eventError) {
      console.error('Error inserting into events:', eventError);
      return new NextResponse('Error inserting into events', { status: 500 });
    }

    return NextResponse.json({
      message:
        'Submitted! Create process probably complete after few minutes. Please check it in Space List page.',
    });
  } catch (err) {
    console.error(err);
    return new NextResponse('An unexpected error occurred', { status: 500 });
  }
}
