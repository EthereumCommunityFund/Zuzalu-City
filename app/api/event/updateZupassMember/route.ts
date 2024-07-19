import { NextResponse } from 'next/server';
import dayjs from 'dayjs';
import { supabase } from '@/utils/supabase/client';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { DID } from 'dids';
import { ceramic, composeClient } from '@/constant';
import { base64ToUint8Array, hashAndEncodeBase58 } from '@/utils';
import { chainID } from '@/constant';
interface zupass {
  hash: string;
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, memberDID, memberZupass } = body;
    const { data, error } = await supabase
      .from('events')
      .select('privateKey')
      .eq('eventId', eventId)
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
    const GET_Event_QUERY = `
    query GetEvent($id: ID!) {
      node(id: $id) {
          ... on Event {
            id
            admins {
              id
              mvpProfile {
                username
              }
            }
            members {
              id
              mvpProfile {
                username
              }
            }
            author {
              id
            }
            zupassHash {
            hash
            }
          }
        }
      }
    `;

    const getEventResponse: any = await composeClient.executeQuery(
      GET_Event_QUERY,
      {
        id: eventId,
      },
    );
    const existedZupass =
      getEventResponse.data.node.zupassHash?.map(
        (zupass: any) => zupass.hash,
      ) ?? [];

    if (existedZupass.includes(hashAndEncodeBase58(memberZupass))) {
      return new NextResponse('Zupass already existed', { status: 500 });
    } else {
      const updatedMembers = getEventResponse.data.node.members
        ? [
            ...getEventResponse.data.node.members.map(
              (member: any) => member.id,
            ),
            memberDID,
          ]
        : [memberDID];
      const existingZupass: zupass[] = Array.isArray(
        getEventResponse.data.node.zupassHash,
      )
        ? getEventResponse.data.node.zupassHash
        : [];
      const newZupass: zupass = {
        hash: hashAndEncodeBase58(memberZupass),
      };
      const updatedZupass: zupass[] = [...existingZupass, newZupass];
      const query = `
            mutation UpdateEvent($i: UpdateEventInput!) {
            updateEvent(input: $i) {
            document {
                id
            }
        }
    }
    `;

      const variables = {
        i: {
          id: eventId,
          content: {
            members: updatedMembers,
            zupassHash: updatedZupass,
          },
        },
      };
      const updateResult: any = await composeClient.executeQuery(
        query,
        variables,
      );
      return NextResponse.json({
        message: 'Successfully added into member list',
      });
    }
  } catch (err) {
    console.error(err);
    return new NextResponse('An unexpected error occurred', { status: 500 });
  }
}
