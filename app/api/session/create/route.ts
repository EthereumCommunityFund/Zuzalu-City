import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/client';
import { SessionSupabaseData, CeramicResponseType, EventEdge } from '@/types';
import { useCeramicContext } from '@/context/CeramicContext';
import { RuntimeCompositeDefinition } from '@composedb/types';
import { definition } from '@/composites/definition.js';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ComposeClient } from '@composedb/client';

const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
const ceramicUrl =
  (isDev
    ? process.env.NEXT_PUBLIC_CERAMIC_URL_DEV
    : process.env.NEXT_PUBLIC_CERAMIC_URL_PROD) || 'http://localhost:7007';

const composeClient = new ComposeClient({
  ceramic: ceramicUrl,
  definition: definition as RuntimeCompositeDefinition,
});
export async function POST(req: NextRequest) {
  const {
    title,
    description,
    experience_level,
    createdAt,
    startTime,
    endTime,
    profileId,
    eventId,
    tags,
    type,
    format,
    track,
    timezone,
    video_url,
    location,
    organizers,
    speakers,
    creatorDID,
    liveStreamLink,
    recording_link,
  }: SessionSupabaseData = await req.json();

  try {
    const response: CeramicResponseType<EventEdge> =
      (await composeClient.executeQuery(
        `
    query MyQuery($id: ID!) {
      node (id: $id) {
        ...on Event {
            admins {
              id
            }
            members {
              id
            }
            superAdmin{
            id
            }
        }
      }
    }
  `,
        {
          id: eventId,
        },
      )) as CeramicResponseType<EventEdge>;

    if (response.data && response.data.node) {
      const admins =
        response.data.node.admins?.map((admin) => admin.id.toLowerCase()) || [];
      const members =
        response.data.node.members?.map((member) => member.id.toLowerCase()) ||
        [];
      const superAdmins =
        response.data.node.superAdmin?.map((superAdmin) =>
          superAdmin.id.toLowerCase(),
        ) || [];
      if (
        !superAdmins.includes(creatorDID.toLowerCase()) &&
        !admins.includes(creatorDID.toLowerCase()) &&
        !members.includes(creatorDID.toLowerCase())
      ) {
        return NextResponse.json(
          { error: 'Profile ID is neither an admin nor a member' },
          { status: 403 },
        );
      }
    } else {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const { data, error } = await supabase.from('sessions').insert({
      title,
      description,
      experience_level,
      createdAt,
      startTime,
      endTime,
      profileId,
      eventId,
      tags,
      type,
      format,
      track,
      timezone,
      video_url,
      location,
      organizers,
      speakers,
      creatorDID,
      liveStreamLink,
      recording_link,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
