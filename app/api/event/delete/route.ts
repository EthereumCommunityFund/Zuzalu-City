import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/client';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { DID } from 'dids';
import { ceramic, composeClient } from '@/constant';
import { base64ToUint8Array, hashAndEncodeBase58 } from '@/utils';
import { chainID } from '@/constant';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, userDID } = body;
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
            author {
              id
            }
            superAdmin {
              id
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
    const superAdmins =
      getEventResponse.data.node.superAdmin?.map((superAdmin: any) =>
        superAdmin.id.toLowerCase(),
      ) || [];
    if (superAdmins.includes(userDID)) {
      const enableIndexingSpaceMutation = `mutation enableIndexingZucitySpace($input: EnableIndexingZucitySpaceInput!) {
        enableIndexingZucitySpace(input: $input) {
          document {
            id
          }
        }
      }`;
      const response = await composeClient.executeQuery(
        enableIndexingSpaceMutation,
        {
          input: {
            id: eventId,
            shouldIndex: false,
          },
        },
      );
      return NextResponse.json(
        {
          message: 'Successfully deleted event',
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        {
          message: 'Not superadmin',
        },
        { status: 500 },
      );
    }
  } catch (err) {
    console.error(err);
    return new NextResponse('An unexpected error occurred', { status: 500 });
  }
}
