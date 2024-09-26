import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/client';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { DID } from 'dids';
import { ceramic, composeClient } from '@/constant';
import { base64ToUint8Array, hashAndEncodeBase58 } from '@/utils';
import { chainID } from '@/constant';

export async function POST(req: Request) {
  let updateResult;
  try {
    const body = await req.json();
    const { eventId, newTrack } = body;
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
    query GetZucityEvent($id: ID!) {
      node(id: $id) {
          ... on ZucityEvent {
            id
            admins {
              id
              zucityProfile {
                username
              }
            }
            members {
              id
              zucityProfile {
                username
              }
            }
            author {
              id
            }
            superAdmin {
              id
            }
            zupassHash {
             hash
            }
            tracks
            timezone
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

    const dataArray: string[] = getEventResponse.data.node.tracks
      .split(',')
      .map((item: string) => item.trim());

    let updatedTracks: string;

    if (dataArray.length >= 3) {
      updatedTracks = dataArray
        .reduce(
          (acc: string[], item: string, index: number, array: string[]) => {
            acc.push(item);
            if (index === array.length - 2) {
              acc.push(newTrack);
            }
            return acc;
          },
          [],
        )
        .join(',');
    } else {
      updatedTracks = dataArray.join(',');
    }
    const query = `
                mutation UpdateZucityEvent($i: UpdateZucityEventInput!) {
                updateZucityEvent(input: $i) {
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
          tracks: updatedTracks,
          timezone: 'Asia/Tbilisi',
        },
      },
    };
    updateResult = await composeClient.executeQuery(query, variables);
    return NextResponse.json(
      {
        message: 'Successfully added into member list',
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return new NextResponse(`An unexpected error occurred: ${updateResult}`, {
      status: 500,
    });
  }
}
