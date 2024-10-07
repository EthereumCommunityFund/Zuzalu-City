import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/client';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { DID } from 'dids';
import { ceramic, composeClient } from '@/constant';
import { base64ToUint8Array } from '@/utils';
import { TicketingMethod } from '@/app/spaces/[spaceid]/adminevents/[eventid]/Tabs/Ticket/components/types';

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
async function updateQuestion(
  id: string,
  applicationForm: string,
  profileId: string,
) {
  return await composeClient.executeQuery(Update_QUERY, {
    input: {
      id,
      content: {
        applicationForm,
        profileId,
      },
    },
  });
}

async function updateMethod({
  id,
  applyRule,
  applyOption,
  registrationAccess,
  ticketType,
  profileId,
}: {
  id: string;
  applyRule: string;
  applyOption: string;
  registrationAccess: string;
  ticketType: string;
  profileId: string;
}) {
  return await composeClient.executeQuery(Update_QUERY, {
    input: {
      id,
      content: {
        applyRule,
        ticketType,
        applyOption: applyOption || null,
        registrationAccess,
        profileId,
      },
    },
  });
}

async function updateSwitch({
  id,
  registrationOpen,
  checkinOpen,
  profileId,
}: {
  id: string;
  registrationOpen: string;
  checkinOpen: string;
  profileId: string;
}) {
  const content = checkinOpen
    ? {
        checkinOpen,
      }
    : {
        registrationOpen,
      };
  return await composeClient.executeQuery(Update_QUERY, {
    input: {
      id,
      content: {
        ...content,
        profileId,
      },
    },
  });
}

async function updateWhitelist({
  id,
  registrationWhitelist,
  profileId,
}: {
  registrationWhitelist: string;
  id: string;
  profileId: string;
}) {
  return await composeClient.executeQuery(Update_QUERY, {
    input: {
      id,
      content: {
        registrationWhitelist: registrationWhitelist || null,
        profileId,
      },
    },
  });
}

async function updateZuPass({
  id,
  zuPassInfo,
}: {
  id: string;
  zuPassInfo: any;
}) {
  return await composeClient.executeQuery(Update_QUERY, {
    input: {
      id,
      content: {
        zuPassInfo: [zuPassInfo],
      },
    },
  });
}

async function updateScrollPass({
  id,
  scrollPassTickets,
}: {
  id: string;
  scrollPassTickets: any;
}) {
  return await composeClient.executeQuery(Update_QUERY, {
    input: {
      id,
      content: {
        scrollPassTickets,
      },
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      eventId,
      type,
      applicationForm,
      profileId,
      id,
      applyRule,
      applyOption,
      registrationAccess,
      ticketType,
      registrationOpen,
      checkinOpen,
      registrationWhitelist,
      zuPassInfo,
      scrollPassTickets,
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

    let result;

    if (type === 'question') {
      result = await updateQuestion(id, applicationForm, profileId);
    }

    if (type === 'method') {
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

      const regAndAccess =
        getEventResponse.data.node.regAndAccess.edges?.[0].node;
      if (regAndAccess.ticketType !== TicketingMethod.NoTicketing) {
        return NextResponse.json(
          {
            message: 'You cannot change the ticketing method once it is set.',
          },
          { status: 500 },
        );
      }
      result = await updateMethod({
        id,
        applyRule,
        applyOption,
        registrationAccess,
        ticketType,
        profileId,
      });
    }

    if (type === 'switch') {
      result = await updateSwitch({
        id,
        registrationOpen,
        checkinOpen,
        profileId,
      });
    }

    if (type === 'whitelist') {
      result = await updateWhitelist({
        id,
        registrationWhitelist,
        profileId,
      });
    }

    if (type === 'zuPass') {
      result = await updateZuPass({
        id,
        zuPassInfo,
      });
    }

    if (type === 'scrollpass') {
      result = await updateScrollPass({
        id,
        scrollPassTickets,
      });
    }

    if (result?.errors) {
      console.error('Error updating registration and access:', result.errors);
      return new NextResponse('Error updating registration and access', {
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
