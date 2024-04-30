'use client';

import { useTheme } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';
import { EventCard } from 'components';
import AnnouncementCard from 'components/AnnouncementCart';
import {
  EventIcon,
  HomeIcon,
  PlusCircleIcon,
  ShareIcon,
} from 'components/icons';
import { MoreIcon } from 'components/icons/More';
import { RightArrowCircleSmallIcon } from 'components/icons/RightArrowCircleSmall';
import SidebarButton from 'components/layout/Sidebar/SidebarButton';
import { MOCK_DATA } from 'mock';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function SpaceDetailPage() {
  const [aboutContent, setAboutContent] = useState<
    { title: string; content: string }[]
  >([]);
  const [showMore, setShowMore] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    if (showMore) {
      setAboutContent(MOCK_DATA.zuzaContributorContent);
    } else {
      setAboutContent([MOCK_DATA.zuzaContributorContent[0]]);
    }
  }, [showMore]);

  return (
    <Stack
      sx={{
        width: "100%",
        [theme.breakpoints.down('lg')]: {
          width: "calc(100% - 280px)"
        },
        [theme.breakpoints.down('md')]: {
          width: '100%'
        }
      }}
    >
      <Stack
        sx={{
          padding: '20px',
          width: '100%',
          backgroundColor: '#2b2b2b',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          borderBottom: '1px solid #ffffff1a'
        }}
      >
        <Stack
          sx={{
            position: 'relative',
            width: '100%',
            height: '240px'
          }}
        >
          <Image
            loader={() =>
              'https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png?scale-down-to=512 512w, https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png?scale-down-to=1024 1024w, https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png 1920w'
            }
            src={
              'https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png?scale-down-to=512 512w, https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png?scale-down-to=1024 1024w, https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png 1920w'
            }
            alt=""
            width={'100'}
            height={'240'}
            style={{
              position: 'absolute',
              inset: 0,
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              borderRadius: '10px'
            }}
            className="absolute inset-0 object-cover w-full h-full rounded-[10px]"
          />
          <Stack
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
              flexDirection: 'row'
            }}
          >
            <Image
              loader={() =>
                'https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png'
              }
              src={
                'https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png'
              }
              width={80}
              height={80}
              alt=""
            />
          </Stack>
        </Stack>
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }}
        >
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px'
            }}
          >
            <SidebarButton
              content="Join Space"
              sx={{
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: '#ffffff0a',
                '&:hover': {
                  backgroundColor: '#ffffff1a'
                },
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
              icon={<PlusCircleIcon />}
            ></SidebarButton>
            <SidebarButton
              sx={{
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: '#ffffff0a',
                '&:hover': {
                  backgroundColor: '#ffffff1a'
                },
                cursor: 'pointer'
              }}
              icon={<ShareIcon />}
            ></SidebarButton>
            <SidebarButton
              sx={{
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: '#ffffff0a',
                '&:hover': {
                  backgroundColor: '#ffffff1a'
                },
                cursor: 'pointer'
              }}
              icon={<MoreIcon />}
            ></SidebarButton>
          </Stack>
        </Stack>
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            paddingLeft: '20px',
            paddingRight: '20px'
          }}
        >
          <Typography
            fontWeight={700}
            fontSize={'25px'}
            lineHeight={'120%'}
          >
            Zuzalu City Contributors
          </Typography>
          <Typography
            color={'#bebebe'}
          >
            First-of-its-kind pop-up city to create, live longer and healthier
            lives, and build self-sustaining communities.
          </Typography>
          <Stack className="text-[#7b7b7b] text-[10px] flex gap-[10px] uppercase">
            <p>ai</p>
            <p>community tools</p>
            <p>+3</p>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        sx={{
          width: '100%',
          height: '187px',
          gap: 10,
          backgroundColor: '#222222'
        }}
      >
        <Stack
          sx={{
            width: '100%',
            height: "187px",
            padding: "20px"
          }}
        >
          <Stack
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%'
            }}
          >
            <Image
              loader={() =>
                'https://framerusercontent.com/images/TdxVYQUr9Y7YXNQIAMRRg3viRTs.png?scale-down-to=2048'
              }
              src={
                'https://framerusercontent.com/images/TdxVYQUr9Y7YXNQIAMRRg3viRTs.png?scale-down-to=2048'
              }
              alt=""
              width={'100'}
              height={'240'}
              className="absolute inset-0 object-cover w-full h-full rounded-[10px]"
            />
            <Stack
              sx={{
                position: 'absolute',
                backgroundColor: '#222c',
                width: '100%',
                height: '100%',
                borderRadius: '10px'
              }}
            ></Stack>
            <Stack
              sx={{
                position: 'absolute',
                top: "20px",
                left: "20px",
                fontWeight: "700"
              }}
            >
              Community Canvas
            </Stack>
          </Stack>
        </Stack>
        <Stack
          sx={{
            padding: "20px",
            gap: "20px",
            display: 'flex'
          }}
        >
          <Stack
            sx={{
              fontSize: '18px',
              fontWeight: "700",
              color: '#919191'
            }}
          >
            About Zuzalu City Contributors
          </Stack>
          <Stack
            sx={{
              padding: "20px",
              width: '100%',
              backgroundColor: '#ffffff05',
              borderRadius: '10px',
              height: showMore ? 'fit-content' : "147px"
            }}
          >
            {aboutContent.length > 0 &&
              aboutContent.map((content, index) => {
                return (
                  <Stack key={index}>
                    <Stack
                      sx={{
                        fontWeight: "700",
                        color: '#bebebe',
                        marginTop: index !== 0 ? '12px' : ''
                      }}
                    >
                      {content.title}
                    </Stack>
                    <Stack
                      sx={{
                        marginTop: '12px',
                        color: '#bebebe',
                        fontWeight: "600"
                      }}
                    >
                      {content.content}
                    </Stack>
                  </Stack>
                );
              })}
          </Stack>
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
              cursor: 'pointer'
            }}
            content={showMore ? 'Show Less' : 'Show More'}
            onClick={() => {
              console.log('clicked!');
              setShowMore(!showMore);
            }}
          ></SidebarButton>
        </Stack>
        <Stack
          sx={{
            padding: "20px",
            display: 'flex',
            gap: "20px"
          }}
        >
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Stack
              sx={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#919191'
              }}
            >
              Latest Announcements
            </Stack>
            <SidebarButton
              sx={{
                display: 'flex',
                flexDirection: 'row',
                padding: '4px 10px',
                gap: '10px',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: '#e6e6e61a'
                },
                borderRadius: '10px',
                opacity: 0.7
              }}
              content="View All Posts"
              rightIcon={<RightArrowCircleSmallIcon />}
            ></SidebarButton>
          </Stack>
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20'
            }}
          >
            {MOCK_DATA.announcements.map((announcement, index) => {
              return (
                <AnnouncementCard
                  {...announcement}
                  key={index}
                ></AnnouncementCard>
              );
            })}
          </Stack>
        </Stack>
        <Stack
          sx={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <Stack
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row'
            }}
          >
            <Stack
              sx={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#919191',
              }}
            >
              Upcoming Events ({MOCK_DATA.upcomingEvents.length})
            </Stack>
            <SidebarButton
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                padding: '4px 10px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#e6e6e61a'
                },
                backgroundColor: 'transparent',
                borderRadius: '10px',
                opacity: 0.7
              }}
              content="View All Events"
              rightIcon={<RightArrowCircleSmallIcon />}
            ></SidebarButton>
          </Stack>
          <Stack
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <Stack
              sx={{
                width: '100%',
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
                backgroundColor: '#222222cc'
              }}
            >
              October 2023
            </Stack>
            {MOCK_DATA.upcomingEvents.map((event, index) => {
              return (
                <Stack
                  key={index}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <Stack
                    sx={{
                      '&:hover': {
                        backgroundColor: '#ffffff1a'
                      },
                      transition: 'all',
                      transitionTimingFunction: 'ease-in',
                      transitionDuration: '300',
                      cursor: 'pointer',
                      borderRadius: '10px'
                    }}
                  >
                    <EventCard />
                  </Stack>
                  <Stack
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '20px'
                    }}
                  >
                    {event.sideEvents > 0 && (
                      <SidebarButton
                        sx={{
                          padding: '6px 10px',
                          backgroundColor: '#ffffff05',
                          '&:hover': {
                            backgroundColor: '#e6e6e60f'
                          },
                          transition: 'all',
                          transitionTimingFunction: 'ease-in',
                          transitionDuration: '300',
                          borderRadius: '100px',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: '10px',
                          width: 'fit-content',
                          cursor: 'pointer'
                        }}
                        icon={
                          <Stack
                            sx={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '100%',
                              backgroundColor: '#ffffff14',
                              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                            }}
                          >
                            <Stack
                              sx={{
                                transform: 'scale(0.75)'
                              }}
                            >
                              <HomeIcon />
                            </Stack>
                          </Stack>
                        }
                      >
                        <span>{event.sideEvents}&nbsp;</span>
                        <span
                          style={{
                            color: '#ffffff80',
                            fontSize: '16px',
                            fontWeight: '500'
                          }}
                        >
                          side events around&nbsp;
                        </span>
                        <span>{event.topic}</span>
                      </SidebarButton>
                    )}
                    <SidebarButton
                      icon={<EventIcon />}
                      sx={{
                        padding: '6px 10px',
                        '&:hover': {
                          backgroundColor: '#ffffff1a'
                        },
                        backgroundColor: 'transparent',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '10px',
                        width: 'fit-content',
                        cursor: 'pointer'
                      }}
                      content={event.topic}
                    ></SidebarButton>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
        <Stack
          sx={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <Stack
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row'
            }}
          >
            <Stack
              sx={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#919191'
              }}
            >
              Past Events ({MOCK_DATA.pastEvents.length})
            </Stack>
            <SidebarButton
              sx={{
                display: 'flex',
                flexDirection: 'row',
                padding: '4px 10px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#e6e6e61a',
                },
                backgroundColor: 'transparent',
                borderRadius: '10px',
                opacity: 0.7
              }}
              content="See All"
            ></SidebarButton>
          </Stack>
          {MOCK_DATA.pastEvents.map((event, index) => {
            return (
              <Stack
                sx={{
                  '&:hover': {
                    backgroundColor: '#ffffff1a'
                  },
                  transition: 'all',
                  transitionTimingFunction: 'ease-in',
                  transitionDuration: '300',
                  cursor: 'pointer',
                  borderRadius: '10px'
                }}
                key={index}
              >
                <EventCard />
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Stack>
  );
}
