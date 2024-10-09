import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/client';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { DID } from 'dids';
import { ceramic, composeClient } from '@/constant';
import { base64ToUint8Array, hashAndEncodeBase58 } from '@/utils';
import { chainID } from '@/constant';
import { Contract } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      eventId,
      id,
      type,
      contractAddress,
      description,
      image_url,
      status,
      checkin,
    } = body;
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
            regAndAccess(first:1) {
              edges {
                node {
                  scrollPassTickets {
                    type
                    status
                    checkin
                    image_url
                    description
                    contractAddress
                  }
                }
              }
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
    console.log(getEventResponse);

    const Update_QUERY = `
      mutation UpdateZucityEventRegistrationAndAccessMutation($input: UpdateZucityEventRegistrationAndAccessInput!) {
        updateZucityEventRegistrationAndAccess(
          input: $input
        ) {
          document {
            id
          }
        }
      }
      `;
    const regAndAccess =
      getEventResponse.data.node.regAndAccess.edges?.[0]?.node;
    const existingContracts: Contract[] = Array.isArray(
      regAndAccess.scrollPassTickets,
    )
      ? regAndAccess.scrollPassTickets
      : [];
    const newContract: Contract = {
      type,
      contractAddress,
      description,
      image_url,
      status,
      checkin: checkin ?? '0',
    };
    const updatedContracts: Contract[] = [...existingContracts, newContract];
    const variables = {
      input: {
        id,
        content: {
          scrollPassTickets: updatedContracts,
        },
      },
    };
    const updateResult: any = await composeClient.executeQuery(
      Update_QUERY,
      variables,
    );
    console.log(updateResult);
    return NextResponse.json(
      {
        message: 'Successfully added into member list',
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return new NextResponse('An unexpected error occurred', { status: 500 });
  }
}
