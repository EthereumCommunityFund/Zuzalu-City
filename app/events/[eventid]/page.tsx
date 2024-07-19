'use client';
import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { Thumbnail, Subbar } from './components';
import { About, Sessions } from './tabs';
import { CeramicResponseType, EventEdge, Event } from '@/types';
import { useCeramicContext } from '@/context/CeramicContext';
import { useParams } from 'next/navigation';
const Home = () => {
  const [tabName, setTabName] = useState('About');
  const params = useParams();
  const [eventData, setEventData] = useState<Event>();
  const { composeClient, ceramic } = useCeramicContext();
  const [sessionView, setSessionView] = useState<boolean>(false);
  const [verify, setVerify] = useState<boolean>(false);
  const eventId = params.eventid.toString();
  const getEventDetailInfo = async () => {
    try {
      const response: CeramicResponseType<EventEdge> =
        (await composeClient.executeQuery(
          `
        query MyQuery($id: ID!) {
          node (id: $id) {
            ...on Event {
              createdAt
              description
              endTime
              external_url
              gated
              id
              image_url
              max_participant
              meeting_url
              min_participant
              participant_count
              profileId
              spaceId
              startTime
              status
              tagline
              timezone
              title
              tracks
              contractID
              members{
              id
              }
              admins{
              id
              }
              space {
                id
                name
                gated
                avatar
                banner
                description
              }
              profile {
                username
                avatar
              }
              customLinks {
                title
                links
              }
            }
          }
        }
      `,
          {
            id: eventId,
          },
        )) as CeramicResponseType<EventEdge>;
      if (response.data) {
        if (response.data.node) {
          setEventData(response.data.node);
          return response.data.node;
        }
      }
    } catch (err) {
      console.log('Failed to fetch event: ', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventDetails = await getEventDetailInfo();
        const admins =
          eventDetails?.admins?.map((admin) => admin.id.toLowerCase()) || [];
        const members =
          eventDetails?.members?.map((member) => member.id.toLowerCase()) || [];
        const userDID = ceramic?.did?.parent.toString().toLowerCase() || '';
        if (admins.includes(userDID) || members.includes(userDID)) {
          setSessionView(true);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [ceramic?.did?.parent, verify]);

  return (
    <Stack color="white">
      <Thumbnail name={eventData?.title} />
      <Subbar
        tabName={tabName}
        setTabName={setTabName}
        canViewSessions={sessionView}
      />
      {tabName === 'About' && (
        <About eventData={eventData} setVerify={setVerify} />
      )}
      {tabName === 'Sessions' && <Sessions eventData={eventData} />}
    </Stack>
  );
};

export default Home;
