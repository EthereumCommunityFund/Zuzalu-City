'use client';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useParams } from 'next/navigation';
import { Stack, Box, Typography, SwipeableDrawer } from '@mui/material';
import {
  EventName,
  EventDetail,
  EventRegister,
  EventAbout,
  Initial,
  Disclaimer,
  Email,
  Payment,
} from 'components/event';
import { ZuButton } from '@/components/core';
import { XMarkIcon } from '@/components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import { CeramicResponseType, EventEdge, Event } from '@/types';
import { supabase } from '@/utils/supabase/client';
import { SpaceCard } from '@/components/cards';
import { Anchor } from '@/types';

interface IAbout {
  eventData: Event | undefined;
  setEventData: Dispatch<SetStateAction<Event | undefined>>;
}

const About: React.FC<IAbout> = ({ eventData, setEventData }) => {
  console.log('here', eventData);
  const [eventLocation, setEventLocation] = useState<string>('');

  const [isInitial, setIsInitial] = useState<boolean>(false);
  const [isDisclaimer, setIsDisclaimer] = useState<boolean>(false);
  const [isEmail, setIsEmail] = useState<boolean>(false);
  const [isPayment, setIsPayment] = useState<boolean>(false);

  const params = useParams();
  const eventId = params.eventid.toString();

  const { composeClient } = useCeramicContext();

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const getLocation = async () => {
    try {
      const { data } = await supabase
        .from('locations')
        .select('*')
        .eq('eventId', eventId);
      if (data !== null) {
        setEventLocation(data[0].name);
      }
    } catch (err) {
      console.log(err);
    }
  };

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
        }
      }
    } catch (err) {
      console.log('Failed to fetch event: ', err);
    }
  };

  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getEventDetailInfo();
        // await getLocation();
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const List = (anchor: Anchor) => {
    const handleClose = () => {
      toggleDrawer('right', false);
      setIsEmail(false);
    };

    return (
      <Box
        sx={{
          width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '700px',
          backgroundColor: '#222222',
        }}
        role="presentation"
        zIndex="10"
        borderLeft="1px solid #383838"
        height="100%"
      >
        <Stack
          direction="row"
          spacing="14px"
          alignItems="center"
          height="50px"
          borderBottom="1px solid #383838"
          paddingX={3}
        >
          <ZuButton startIcon={<XMarkIcon />} onClick={() => handleClose()}>
            Close
          </ZuButton>
          <Typography variant="subtitleSB">Register for Event</Typography>
        </Stack>
        {!isInitial && !isDisclaimer && !isEmail && !isPayment && (
          <Initial setIsInitial={setIsInitial} />
        )}
        {isInitial && !isDisclaimer && !isEmail && !isPayment && (
          <Disclaimer
            setIsInitial={setIsInitial}
            setIsDisclaimer={setIsDisclaimer}
          />
        )}
        {!isInitial && isDisclaimer && !isEmail && !isPayment && (
          <Email setIsDisclaimer={setIsDisclaimer} setIsEmail={setIsEmail} />
        )}
        {!isInitial && !isDisclaimer && isEmail && !isPayment && (
          <Payment
            setIsEmail={setIsEmail}
            setIsPayment={setIsPayment}
            handleClose={handleClose}
          />
        )}
      </Box>
    );
  };

  return (
    <Stack
      padding="40px"
      justifyContent="center"
      alignItems="center"
      bgcolor="#222222"
    >
      {eventData && (
        <Stack width={900} direction="row" spacing="20px">
          <Stack spacing="20px" flex="2">
            {/* <Stack spacing="4px">
                      <Box component="img" src="/sponsor_banner.png" height="100px" borderRadius="10px" />
                      <Typography variant="caption" textAlign="right">
                        Sponsored Banner
                      </Typography>
                    </Stack> */}

            <EventName
              tagline={eventData.tagline}
              endTime={eventData.endTime}
              startTime={eventData.startTime}
              eventDescription={eventData.description}
              spaceName={eventData.space?.name}
              eventName={eventData.title}
              location={eventLocation}
              organizer={eventData.profile?.username as string}
              image_url={eventData.image_url}
            />
            <EventAbout
              tagline={eventData.tagline}
              description={eventData.description}
            />
            <Stack
              bgcolor="#292929"
              padding="20px"
              spacing="20px"
              borderRadius="10px"
            >
              <Typography variant="subtitleSB">EVENT SPONSORS</Typography>
              <Box display="flex" gap="20px" flexWrap="wrap">
                <Stack alignItems="center" spacing="4px">
                  <Box
                    component="img"
                    src="/sponsor.png"
                    width="100px"
                    height="100px"
                    borderRadius="10px"
                  />
                  <Typography variant="bodyS">SponsorName</Typography>
                </Stack>
                <Stack alignItems="center" spacing="4px">
                  <Box
                    component="img"
                    src="/sponsor.png"
                    width="100px"
                    height="100px"
                    borderRadius="10px"
                  />
                  <Typography variant="bodyS">SponsorName</Typography>
                </Stack>
                <Stack alignItems="center" spacing="4px">
                  <Box
                    component="img"
                    src="/sponsor.png"
                    width="100px"
                    height="100px"
                    borderRadius="10px"
                  />
                  <Typography variant="bodyS">SponsorName</Typography>
                </Stack>
                <Stack alignItems="center" spacing="4px">
                  <Box
                    component="img"
                    src="/sponsor.png"
                    width="100px"
                    height="100px"
                    borderRadius="10px"
                  />
                  <Typography variant="bodyS">SponsorName</Typography>
                </Stack>
                <Stack alignItems="center" spacing="4px">
                  <Box
                    component="img"
                    src="/sponsor.png"
                    width="100px"
                    height="100px"
                    borderRadius="10px"
                  />
                  <Typography variant="bodyS">SponsorName</Typography>
                </Stack>
              </Box>
            </Stack>
            <Stack
              bgcolor="#292929"
              padding="20px"
              spacing="20px"
              borderRadius="10px"
              height="300px"
            >
              <Typography variant="subtitleSB">ORGANIZER UPDATES</Typography>
              <Stack spacing="10px">
                <Stack direction="row" alignItems="center" spacing="10px">
                  <Box
                    component="img"
                    src="/5.webp"
                    width="30px"
                    height="30px"
                    borderRadius="20px"
                  />
                  <Typography variant="bodyMB">drivenfast</Typography>
                  <Typography variant="caption">3 DAYS AGO</Typography>
                </Stack>
                <Typography variant="bodyM">
                  ZuConnect is an experience crafted with love by Zuzalu, whose
                  mission is to foster a global network of communities to
                  advance humanity by creating playgrounds at the intersection
                  of free and open technology, science, health, and social
                  innovation.
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Stack spacing="20px" flex="1">
            <EventRegister onToggle={toggleDrawer} />
            {/* <Stack spacing="4px">
                      <Box component="img" src="/sponsor_banner.png" height="200px" borderRadius="10px" width="100%" />
                      <Typography variant="caption" textAlign="right">
                        Sponsored Banner
                      </Typography>
                    </Stack> */}
            <EventDetail
              status={eventData.status}
              links={eventData.customLinks}
            />
            {/* <Stack>
                      <SpaceCard id={params.spaceid.toString()} title={eventData?.space?.name} logoImage={eventData?.space?.avatar} bgImage={eventData?.space?.banner} description={eventData?.space?.description} />
                    </Stack> */}
          </Stack>
          <SwipeableDrawer
            hideBackdrop={true}
            sx={{
              '& .MuiDrawer-paper': {
                marginTop: '50px',
                height: 'calc(100% - 50px)',
                boxShadow: 'none',
              },
            }}
            anchor="right"
            open={state['right']}
            onClose={() => toggleDrawer('right', false)}
            onOpen={() => toggleDrawer('right', true)}
          >
            {List('right')}
          </SwipeableDrawer>
        </Stack>
      )}
    </Stack>
  );
};

export default About;
