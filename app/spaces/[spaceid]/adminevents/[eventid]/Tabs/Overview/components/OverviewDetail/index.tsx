import * as React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { ZuButton } from 'components/core';
import { EventIcon, LockIcon, MapIcon } from 'components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import { CeramicResponseType, Event, EventEdge } from '@/types';
import { useParams } from 'next/navigation';
import { convertDateStringFormat } from '@/utils';

const OverviewDetail = () => {
  const {
    ceramic,
    composeClient,
    isAuthenticated,
    authenticate,
    logout,
    showAuthPrompt,
    hideAuthPrompt,
    isAuthPromptVisible,
    newUser,
    profile,
    username,
    createProfile,
  } = useCeramicContext();
  const params = useParams();
  const eventId = params.eventid.toString();

  const [eventData, setEventData] = React.useState<Event>();

  const getEventDetailInfo = async () => {
    try {
      const response: CeramicResponseType<EventEdge> =
        (await composeClient.executeQuery(
          `
        query MyQuery ($id: ID!) {
          node (id: $id) {
            ...on Event {
              id
              title
              description
              status
              endTime
              spaceId
              tagline
              timezone
              createdAt
              image_url
              profileId
              startTime
              description
              meeting_url
              external_url
              max_participant
              space {
                name
                gated
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

  React.useEffect(() => {
    getEventDetailInfo();
  }, []);

  return eventData ? (
    <Stack
      marginY={4}
      padding={2}
      direction="row"
      spacing={2}
      bgcolor="#283734"
      borderRadius={3}
    >
      <Box
        component="img"
        src={eventData.image_url ? eventData.image_url : '/12.webp'}
        borderRadius={3}
        height={450}
        width={450}
      />
      <Stack direction="column" flex={1} spacing={2}>
        <Stack direction="row" spacing={2}>
          <ZuButton sx={{ backgroundColor: '#2F4541', flex: 1 }}>
            Edit Event Details
          </ZuButton>
          <ZuButton sx={{ backgroundColor: '#2F4541', flex: 1 }}>
            View Event
          </ZuButton>
          <ZuButton sx={{ backgroundColor: '#2F4541', flex: 1 }}>
            Share Event
          </ZuButton>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="caption" color="white">
            BY:
          </Typography>
          <Box component="img" src="/1.webp" height={20} width={20} />
          <Typography variant="body2" color="white">
            {eventData.space && eventData.space.name}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <EventIcon />
          <Typography variant="body1" color="white">
            {convertDateStringFormat(eventData.startTime)} -{' '}
            {convertDateStringFormat(eventData.endTime)}
          </Typography>
        </Stack>
        <Typography variant="h5" color="white">
          {eventData.title}
        </Typography>
        <Typography variant="body1" color="white">
          {eventData.description}
        </Typography>
        {eventData.timezone && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <MapIcon size={4} />
            <Typography variant="caption" color="white">
              {eventData.timezone}
            </Typography>
          </Stack>
        )}
        {eventData.status && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <MapIcon size={4} />
            <Typography variant="caption" color="white">
              {eventData.status}
            </Typography>
          </Stack>
        )}
        {eventData.space && eventData.space.gated && (
          <ZuButton
            startIcon={<LockIcon size={4} />}
            sx={{ backgroundColor: '#2F4541', maxWidth: '20%' }}
          >
            GATED
          </ZuButton>
        )}
      </Stack>
    </Stack>
  ) : (
    <></>
  );
};

export default OverviewDetail;
