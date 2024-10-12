import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/client';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { DID } from 'dids';
import { ceramic, composeClient } from '@/constant';
import { base64ToUint8Array } from '@/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      eventId,
      applyRule,
      applyOption,
      registrationWhitelist,
      registrationAccess,
      ticketType,
      profileId,
      scrollPassContractFactoryID,
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
    const Create_QUERY = `
      mutation CreateZucityEventRegistrationAndAccessMutation($input: CreateZucityEventRegistrationAndAccessInput!) {
        createZucityEventRegistrationAndAccess(
          input: $input
        ) {
          document {
            eventId
            applyRule
            ticketType
            applyOption
            registrationWhitelist {
              id
            }
            scrollPassContractFactoryID
          }
        }
      }
      `;

    const result = await composeClient.executeQuery(Create_QUERY, {
      input: {
        content: {
          eventId,
          applyRule: applyRule || null,
          ticketType,
          applyOption: applyOption || null,
          registrationWhitelist: registrationWhitelist || null,
          registrationAccess,
          profileId,
          scrollPassContractFactoryID,
        },
      },
    });
    if (result.errors) {
      console.error('Error creating registration and access:', result.errors);
      return new NextResponse('Error creating registration and access', {
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
