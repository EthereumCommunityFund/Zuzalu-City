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
import React, { Fragment, useEffect, useState } from 'react';
import SubSidebar from 'components/layout/Sidebar/SubSidebar';
import { useCeramicContext } from '@/context/CeramicContext';
import { Space, Event, SpaceEventData } from '@/types';
import { Sidebar } from '@/components/layout';
import {
  EventCardMonthGroup,
  EventCardSkeleton,
  filterUpcomingEvents,
  groupEventsByMonth,
} from '@/components/cards/EventCard';
import { ChevronUpIcon } from '@/components/icons/ChevronUp';
import TextEditor from '@/components/editor/editor';
// import { SubSidebar } from '@/components/layout';

export default function SpaceDetailPage() {
  const params = useParams();
  const theme = useTheme();
  const router = useRouter();
  const { composeClient, ceramic } = useCeramicContext();
  const [showMore, setShowMore] = useState(false);
  const [space, setSpace] = useState<Space>();
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState<boolean>(true);
  const [currentHref, setCurrentHref] = useState('');

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const getSpaceByID = async () => {
    setIsEventsLoading(true);
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
            admins {
              id
            }
            superAdmin {
              id
            }
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
                  space {
                    avatar
                    name
                  }
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
  };
  useEffect(() => {
    const fetchData = async () => {
      setCurrentHref(window.location.href);
      const space = await getSpaceByID();
      document.title = space?.name + ' - ' + 'Zuzalu City';
      const admins =
        space?.admins?.map((admin) => admin.id.toLowerCase()) || [];
      const superAdmins =
        space?.superAdmin?.map((superAdmin) => superAdmin.id.toLowerCase()) ||
        [];
      const userDID = ceramic?.did?.parent.toString().toLowerCase() || '';
      if (admins.includes(userDID) || superAdmins.includes(userDID)) {
        setIsAdmin(true);
      }
    };

    fetchData()
      .catch((error) => {
        console.error('An error occurred:', error);
      })
      .finally(() => {
        setIsEventsLoading(false);
      });
  }, []);

  const hasShowMore = (spaceDescription?: string) => {
    if (!spaceDescription) return false;
    const descData = JSON.parse(spaceDescription.replaceAll('\\"', '"'));
    const { blocks } = descData;
    if (blocks.length === 0) return false;
    if (blocks.length > 5) return true;
    const totalLength = blocks.reduce((acc: number, block: any) => {
      return acc + block.data?.text?.length || 0;
    }, 0);
    return totalLength > 300;
  };

  const isContentLarge = hasShowMore(space?.description);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        overflowY: 'auto',
      }}
    >
      <SubSidebar
        title={space?.name}
        spaceId={params.spaceid.toString()}
        avatar={space?.avatar}
        banner={space?.banner}
        isAdmin={isAdmin}
      />
      <Box
        sx={{
          width: 'calc(100% - 280px)',
          maxHeight: 'calc(100vh - 50px)',
          overflowY: 'auto',
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
                  space.banner ||
                  'https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png'
                }
                alt={space.name || ''}
                width={1280}
                height={240}
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
              <Skeleton
                variant="rectangular"
                width={'100%'}
                height={'100%'}
                sx={{ borderRadius: '10px' }}
              />
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
                  sx={{ fontSize: '18px', fontWeight: '700', color: '#919191' }}
                >
                  About {space.name}
                </Box>
                <Box
                  sx={{
                    padding: '20px',
                    width: '100%',
                    backgroundColor: '#ffffff05',
                    borderRadius: '10px',
                    height: !showMore ? '180px' : 'unset',
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
                    fullWidth={true}
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
                      opacity: 0.8,
                    }}
                  />
                </Box>
              </>
            ) : (
              <>
                <Typography variant={'h6'}>
                  <Skeleton width={200} />
                </Typography>
                <Skeleton variant="rounded" width={'100%'} height={80} />
              </>
            )}

            {isContentLarge && (
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
                    <ChevronUpIcon size={4} />
                  ) : (
                    <ChevronDownIcon size={4} />
                  )}
                  <span>{showMore ? 'Show Less' : 'Show More'}</span>
                </Stack>
              </SidebarButton>
            )}
          </Box>
          {isEventsLoading ? (
            <Box
              sx={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <EventCardMonthGroup>
                <Skeleton width={60}></Skeleton>
              </EventCardMonthGroup>
              <EventCardSkeleton />
              <EventCardSkeleton />
            </Box>
          ) : events.length > 0 ? (
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
                  Upcoming Events ({filterUpcomingEvents(events).length})
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
                  gap: '20px',
                }}
              >
                {Object.entries(
                  groupEventsByMonth(filterUpcomingEvents(events)),
                ).map(([key, value], index) => {
                  return (
                    <Fragment key={key + index}>
                      <EventCardMonthGroup>{key}</EventCardMonthGroup>
                      {value.map((event) => {
                        return <EventCard key={event.id} event={event} />;
                      })}
                    </Fragment>
                  );
                })}
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
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
