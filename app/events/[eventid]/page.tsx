'use client';
import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { Thumbnail, Subbar } from './components';
import { About, Sessions, Announcements } from './tabs';
import { CeramicResponseType, EventEdge, Event } from '@/types';
import { useCeramicContext } from '@/context/CeramicContext';
import { useParams } from 'next/navigation';

const Home = () => {
  const [tabName, setTabName] = useState('About');
  const params = useParams();
  const [eventData, setEventData] = useState<Event>();
  const { composeClient, ceramic } = useCeramicContext();
  const [sessionView, setSessionView] = useState<boolean>(false);
  const [announcementsEdit, setAnnouncementsEdit] = useState<boolean>(false);
  const [verify, setVerify] = useState<boolean>(false);
  const eventId = params.eventid.toString();
  const [urlOption, setUrlOption] = useState<string>('');

  const getEventDetailInfo = async () => {
    try {
      const response: CeramicResponseType<EventEdge> =
        (await composeClient.executeQuery(
          `
        query MyQuery($id: ID!) {
          node (id: $id) {
            ...on ZucityEvent {
              createdAt
              description
              endTime
              externalUrl
              gated
              id
              imageUrl
              meetingUrl
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
              superAdmin{
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
              contracts {
                contractAddress
                description
                image_url
                status
                type
                checkin
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
        const userDID = ceramic?.did?.parent.toString().toLowerCase() || '';

        const {
          admins = [],
          superAdmin = [],
          members = [],
        } = eventDetails || {};
        const lowerCaseIds = (arr: any[]) =>
          (arr || []).map((item) => item.id.toLowerCase());

        const adminIds = lowerCaseIds(admins);
        const superAdminIds = lowerCaseIds(superAdmin);
        const memberIds = lowerCaseIds(members);

        console.log(superAdminIds, adminIds, memberIds, userDID);
        setAnnouncementsEdit(
          superAdminIds.includes(userDID) || adminIds.includes(userDID),
        );
        setSessionView(
          superAdminIds.includes(userDID) ||
            adminIds.includes(userDID) ||
            memberIds.includes(userDID),
        );

        const storedTab = sessionStorage.getItem('tab');
        if (storedTab) {
          setTabName(storedTab);
          setUrlOption(sessionStorage.getItem('option') || '');
          sessionStorage.setItem('tab', '');
          sessionStorage.setItem('option', '');
        }
      } catch (err) {
        console.error('Error:', err);
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
      {tabName === 'Sessions' && (
        <Sessions eventData={eventData} option={urlOption} />
      )}
      {tabName === 'Announcements' && (
        <Announcements
          eventData={eventData}
          setVerify={setVerify}
          canEdit={announcementsEdit}
        />
      )}
    </Stack>
  );
};

export default Home;
