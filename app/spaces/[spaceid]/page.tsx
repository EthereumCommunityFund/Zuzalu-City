'use client';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Snackbar,
  Typography,
  Alert,
  useMediaQuery,
  Skeleton,
  Stack,
} from '@mui/material';
import { EventCard } from '@/components/cards';
// import AnnouncementCard from 'components/AnnouncementCart';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  ArrowDownIcon,
  ChevronDownIcon,
  EventIcon,
  HomeIcon,
  PlusCircleIcon,
  ShareIcon,
} from 'components/icons';
import { RightArrowCircleSmallIcon } from 'components/icons/RightArrowCircleSmall';
import SidebarButton from 'components/layout/Sidebar/SidebarButton';
import { MOCK_DATA } from 'mock';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import SubSidebar from 'components/layout/Sidebar/SubSidebar';
import { useCeramicContext } from '@/context/CeramicContext';
import { Space, Event, SpaceEventData } from '@/types';
// import { Sidebar } from '@/components/layout';
import { groupEventsByMonth } from '@/components/cards/EventCard';
import { ChevronUpIcon } from '@/components/icons/ChevronUp';
import TextEditor from '@/components/editor/editor';
// import { SubSidebar } from '@/components/layout';

import { IconSidebar } from './events/components';

export default function SpaceDetailPage() {
  const params = useParams();
  const theme = useTheme();
  const router = useRouter();
  const { composeClient } = useCeramicContext();
  const [showMore, setShowMore] = useState(false);
  const [space, setSpace] = useState<Space>();
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const isDesktop = useMediaQuery(theme.breakpoints.down('xl'));
  const [currentHref, setCurrentHref] = useState('');
  useEffect(() => {
    setCurrentHref(window.location.href);
  }, []);

  const getSpaceByID = async () => {
    try {
      const GET_SPACE_QUERY = `
      query GetSpace($id: ID!) {
        node(id: $id) {
          ...on Space {
            avatar
            banner
            description
            name
            profileId
            tagline
            website
            twitter
            telegram
            nostr
            lens
            github
            discord
            ens
            events(first: 10) {
              edges {
                node {
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
                }
              }
            }
          }
        }
      }
      `;
      const spaceId = params.spaceid.toString();

      const response: any = await composeClient.executeQuery(GET_SPACE_QUERY, {
        id: spaceId,
      });
      const spaceData: Space = response.data.node as Space;
      setSpace(spaceData);

      const eventData: SpaceEventData = response.data.node
        .events as SpaceEventData;
      const fetchedEvents: Event[] = eventData.edges.map((edge) => edge.node);
      setEvents(fetchedEvents);
      return spaceData;
    } catch (error) {
      console.error('Failed to fetch space:', error);
    }
  };

  useEffect(() => {
    getSpaceByID()
      .then((space = {} as Space) => {
        document.title = space.name + ' - ' + 'Zuzalu City';
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  }, []);

  const shortDescription = (description: string, showMore: boolean) => {
    if (showMore) return description;
    return description.substring(0, 30);
  };

  function isValidJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
      }}
    >
      {!isDesktop && <IconSidebar />}
      <Stack
        sx={{
          minWidth: '280px',
          width: '280px',
          backgroundColor: '#222',
          display: 'none',
          [theme.breakpoints.up('lg')]: {
            display: 'block',
          },
        }}
      >
        <SubSidebar
          title={space?.name}
          spaceId={params.spaceid.toString()}
          avatar={space?.avatar}
          banner={space?.banner}
        />
      </Stack>

      <Box
        sx={{
          width: 'calc(100% - 280px)',
          [theme.breakpoints.down('lg')]: {
            width: '100%',
          },
          fontFamily: 'Inter',
          backgroundColor: '#222222',
        }}
        flex={'1'}
      >
        <Box
          sx={{
            padding: '20px',
            width: '100%',
            backgroundColor: '#2b2b2b',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            borderBottom: '1px solid #ffffff1a',
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '240px',
            }}
          >
            {space ? (
              <Image
                src={
                  space?.banner ||
                  'https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png'
                }
                alt={space?.name || ''}
                width={200}
                height={200}
                style={{
                  position: 'absolute',
                  inset: 0,
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                  borderRadius: '10px',
                }}
                className="absolute inset-0 object-cover w-full h-full rounded-[10px]"
              />
            ) : (
              <Skeleton variant="rectangular" width={'100%'} height={'100%'} />
            )}
            <Box
              sx={{
                width: '90px',
                height: '90px',
                backgroundColor: '#2b2b2b',
                position: 'absolute',
                bottom: '-30px',
                borderRadius: '100%',
                left: '20px',
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              {space ? (
                <Image
                  loader={() =>
                    space?.avatar ||
                    'https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png'
                  }
                  src={
                    space?.avatar ||
                    'https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png'
                  }
                  style={{ borderRadius: '100%' }}
                  width={80}
                  height={80}
                  alt={space.name}
                />
              ) : (
                <Skeleton variant="circular" width={80} height={80} />
              )}
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
              }}
            >
              {/*<SidebarButton*/}
              {/*  content="Join Space"*/}
              {/*  sx={{*/}
              {/*    padding: '10px 14px',*/}
              {/*    borderRadius: '10px',*/}
              {/*    backgroundColor: '#ffffff0a',*/}
              {/*    '&:hover': {*/}
              {/*      backgroundColor: '#ffffff1a',*/}
              {/*    },*/}
              {/*    display: 'flex',*/}
              {/*    flexDirection: 'row',*/}
              {/*    gap: '10px',*/}
              {/*    cursor: 'pointer',*/}
              {/*    whiteSpace: 'nowrap',*/}
              {/*    alignItems: 'center',*/}
              {/*  }}*/}
              {/*  icon={<PlusCircleIcon />}*/}
              {/*/>*/}
              <CopyToClipboard
                text={currentHref}
                onCopy={() => {
                  setShowCopyToast(true);
                }}
              >
                <SidebarButton
                  sx={{
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff0a',
                    '&:hover': { backgroundColor: '#ffffff1a' },
                    cursor: 'pointer',
                  }}
                  icon={<ShareIcon />}
                >
                  <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    open={showCopyToast}
                    autoHideDuration={800}
                    onClose={() => {
                      setShowCopyToast(false);
                    }}
                  >
                    <Alert severity="success" variant="filled">
                      Copy share link to clipboard
                    </Alert>
                  </Snackbar>
                </SidebarButton>
              </CopyToClipboard>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              paddingLeft: '20px',
              paddingRight: '20px',
            }}
          >
            <Typography fontWeight={700} fontSize={'25px'} lineHeight={'120%'}>
              {space ? space.name : <Skeleton width={200} />}
            </Typography>
            <Typography color={'#bebebe'}>
              {space ? space.tagline : <Skeleton />}
            </Typography>
            <Box
              sx={{
                color: '#7b7b7b',
                fontSize: '10px',
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                textTransform: 'uppercase',
              }}
            >
              <p>{space?.category}</p>
            </Box>
          </Box>
        </Box>
        <Box sx={{ width: '100%', backgroundColor: '#222222' }}>
          <Box
            sx={{
              padding: '20px',
              gap: '20px',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
            }}
          >
            {space ? (
              <>
                <Box
                  sx={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#919191',
                  }}
                >
                  About {space.name}
                </Box>
                <Box
                  sx={{
                    padding: '20px',
                    width: '100%',
                    backgroundColor: '#ffffff05',
                    borderRadius: '10px',
                    height: !showMore ? '157px' : 'fit-content',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      fontWeight: '700',
                      color: 'white',
                      marginTop: '12px',
                      fontSize: '18px',
                      lineHeight: '160%',
                    }}
                  >
                    {space.name}
                  </Box>
                  <TextEditor
                    holder="space-detail-editor"
                    readonly={true}
                    value={JSON.parse(space.description.replaceAll('\\"', '"'))}
                    sx={{
                      fontFamily: 'Inter',
                      color: 'white',
                      borderRadius: '10px',
                      height: 'auto',
                      overflow: 'auto',
                      padding: '0px',
                      '& > div > div': {
                        paddingBottom: '0px !important',
                      },
                      '& .ce-block__content': {
                        maxWidth: '100% !important', // Adjust the margin value as needed
                      },
                    }}
                  />
                </Box>
              </>
            ) : (
              <Skeleton variant="rounded" width={'100%'} height={60} />
            )}

            {space && (
              <SidebarButton
                sx={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#2b2b2b',
                  '&:hover': {
                    backgroundColor: '#ffffff1a',
                  },
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
                onClick={() => {
                  setShowMore((v) => !v);
                }}
              >
                <Stack direction="row" spacing={'10px'} alignItems={'center'}>
                  {showMore ? (
                    <ChevronDownIcon size={4} />
                  ) : (
                    <ChevronUpIcon size={4} />
                  )}
                  <span>{showMore ? 'Show Less' : 'Show More'}</span>
                </Stack>
              </SidebarButton>
            )}
          </Box>
          {events.length > 0 && (
            <Box
              sx={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <Box
                  sx={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#919191',
                  }}
                >
                  Upcoming Events ({events.length})
                </Box>
                <SidebarButton
                  onClick={() => {
                    router.push(`/spaces/${params.spaceid}/events`);
                  }}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '4px 10px',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#e6e6e61a',
                    },
                    backgroundColor: 'transparent',
                    borderRadius: '10px',
                    opacity: 0.7,
                  }}
                >
                  <Stack
                    direction={'row'}
                    alignItems={'center'}
                    spacing={'10px'}
                  >
                    <span style={{ fontSize: 16, fontWeight: 400 }}>
                      View All Events
                    </span>
                    <RightArrowCircleSmallIcon />
                  </Stack>
                </SidebarButton>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {Object.entries(groupEventsByMonth(events)).map(
                  ([key, value], index) => {
                    return (
                      <div key={key + index}>
                        <Box
                          sx={{
                            width: '100%',
                            boxSizing: 'border-box',
                            fontSize: '18px',
                            fontWeight: '600',
                            paddingLeft: '14px',
                            paddingRight: '14px',
                            paddingTop: '8px',
                            paddingBottom: '8px',
                            border: '1px solid #ffffff1a',
                            borderRadius: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'sticky',
                            backdropFilter: 'blur(40px)',
                            top: '10px',
                            backgroundColor: '#222222cc',
                          }}
                        >
                          {key}
                        </Box>
                        <Box>
                          {value.map((event, index) => {
                            return (
                              <EventCard
                                id={event.id}
                                key={`EventCard-${event.id}`}
                                spaceId={event.spaceId}
                                event={event}
                                by={space?.name}
                              />
                            );
                          })}
                        </Box>
                      </div>
                    );
                  },
                )}
              </Box>
              <Box
                sx={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                {/*<Box*/}
                {/*  sx={{*/}
                {/*    display: 'flex',*/}
                {/*    width: '100%',*/}
                {/*    justifyContent: 'space-between',*/}
                {/*    alignItems: 'center',*/}
                {/*    flexDirection: 'row',*/}
                {/*  }}*/}
                {/*>*/}
                {/*  <Box*/}
                {/*    sx={{*/}
                {/*      fontSize: '18px',*/}
                {/*      fontWeight: '700',*/}
                {/*      color: '#919191',*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    Past Events ({MOCK_DATA.pastEvents.length})*/}
                {/*  </Box>*/}
                {/*  <SidebarButton*/}
                {/*    sx={{*/}
                {/*      display: 'flex',*/}
                {/*      flexDirection: 'row',*/}
                {/*      padding: '4px 10px',*/}
                {/*      cursor: 'pointer',*/}
                {/*      '&:hover': {*/}
                {/*        backgroundColor: '#e6e6e61a',*/}
                {/*      },*/}
                {/*      backgroundColor: 'transparent',*/}
                {/*      borderRadius: '10px',*/}
                {/*      opacity: 0.7,*/}
                {/*    }}*/}
                {/*    content="See All"*/}
                {/*  ></SidebarButton>*/}
                {/*</Box>*/}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
