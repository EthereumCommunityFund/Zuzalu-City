import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/client';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { DID } from 'dids';
import { ceramic, composeClient } from '@/constant';
import { base64ToUint8Array } from '@/utils';

async function updateQuestion(
  id: string,
  applicationForm: string,
  profileId: string,
) {
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
  await composeClient.executeQuery(Update_QUERY, {
    input: {
      id,
      content: {
        applicationForm,
        profileId,
      },
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, type, applicationForm, profileId, id } = body;
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
                  id
                  profileId
                  registrationAccess
                  registrationOpen
                  ticketType
                  checkinOpen
                  applyRule
                  applyOption
                  applicationForm
                  eventId
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

    if (type === 'question') {
      await updateQuestion(id, applicationForm, profileId);
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
