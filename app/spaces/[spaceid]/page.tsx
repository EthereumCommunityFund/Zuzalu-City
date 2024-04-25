'use client';

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

  useEffect(() => {
    if (showMore) {
      setAboutContent(MOCK_DATA.zuzaContributorContent);
    } else {
      setAboutContent([MOCK_DATA.zuzaContributorContent[0]]);
    }
  }, [showMore]);

  return (
    <div className="lg:w-[calc(100%-530px)] w-[calc(100%-250px)] h-screen overflow-scroll">
      <div className="p-[20px] w-full bg-[#2b2b2b] flex flex-col gap-[20px] border-b border-b-[#ffffff1a]">
        <div className="relative w-full h-[240px]">
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
            className="absolute inset-0 object-cover w-full h-full rounded-[10px]"
          />
          <div className="w-[90px] h-[90px] bg-[#2b2b2b] absolute bottom-[-30px] rounded-full left-[20px] items-center justify-center flex">
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
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex gap-[10px]">
            <SidebarButton
              content="Join Space"
              className="px-[14px] py-[10px] rounded-[10px] bg-[#ffffff0a] hover:bg-[#ffffff1a] flex gap-[10px] cursor-pointer whitespace-nowrap"
              icon={<PlusCircleIcon />}
            ></SidebarButton>
            <SidebarButton
              className="p-[10px] rounded-[10px] bg-[#ffffff0a] hover:bg-[#ffffff1a] cursor-pointer"
              icon={<ShareIcon />}
            ></SidebarButton>
            <SidebarButton
              className="p-[10px] rounded-[10px] bg-[#ffffff0a] hover:bg-[#ffffff1a] cursor-pointer"
              icon={<MoreIcon />}
            ></SidebarButton>
          </div>
        </div>
        <div className="flex flex-col gap-[10px] px-[20px]">
          <p className="font-bold text-[25px] leading-[120%]">
            Zuzalu City Contributors
          </p>
          <p className="text-[#bebebe]">
            First-of-its-kind pop-up city to create, live longer and healthier
            lives, and build self-sustaining communities.
          </p>
          <div className="text-[#7b7b7b] text-[10px] flex gap-[10px] uppercase">
            <p>ai</p>
            <p>community tools</p>
            <p>+3</p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-[10px] bg-[#222222]">
        <div className="w-full h-[187px] p-[20px]">
          <div className="relative w-full h-full">
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
            <div className="absolute bg-[#222c] w-full h-full rounded-[10px]"></div>
            <div className="absolute top-5 left-5 font-bold">
              Community Canvas
            </div>
          </div>
        </div>
        <div className="p-5 gap-5 flex flex-col">
          <div className="text-[18px] font-bold text-[#919191]">
            About Zuzalu City Contributors
          </div>
          <div
            className={
              'p-5 w-full bg-[#ffffff05] rounded-[10px] ' +
              (showMore ? 'h-fit' : 'h-[147px]')
            }
          >
            {aboutContent.length > 0 &&
              aboutContent.map((content, index) => {
                return (
                  <div key={index}>
                    <div
                      className={
                        (index !== 0 ? 'mt-3' : '') +
                        ' font-bold text-[#bebebe]'
                      }
                    >
                      {content.title}
                    </div>
                    <div className="mt-3 text-[#bebebe] font-semibold">
                      {content.content}
                    </div>
                  </div>
                );
              })}
          </div>
          <SidebarButton
            className="w-full px-[14px] py-[10px] bg-[#2b2b2b] hover:bg-[#ffffff1a] rounded-[10px] flex items-center justify-center cursor-pointer"
            content={showMore ? 'Show Less' : 'Show More'}
            onClick={() => {
              console.log('clicked!');
              setShowMore(!showMore);
            }}
          ></SidebarButton>
        </div>
        <div className="p-5 flex flex-col gap-[20px]">
          <div className="flex w-full justify-between items-center">
            <div className="text-[18px] font-bold text-[#919191]">
              Latest Announcements
            </div>
            <SidebarButton
              className="flex gap-[10px] px-[10px] py-1 cursor-pointer hover:bg-[#e6e6e61a] bg-transparent rounded-[10px] opacity-70"
              content="View All Posts"
              rightIcon={<RightArrowCircleSmallIcon />}
            ></SidebarButton>
          </div>
          <div className="flex flex-col gap-5">
            {MOCK_DATA.announcements.map((announcement, index) => {
              return (
                <AnnouncementCard
                  {...announcement}
                  key={index}
                ></AnnouncementCard>
              );
            })}
          </div>
        </div>
        <div className="p-5 flex flex-col gap-[20px]">
          <div className="flex w-full justify-between items-center">
            <div className="text-[18px] font-bold text-[#919191]">
              Upcoming Events ({MOCK_DATA.upcomingEvents.length})
            </div>
            <SidebarButton
              className="flex gap-[10px] px-[10px] py-1 cursor-pointer hover:bg-[#e6e6e61a] bg-transparent rounded-[10px] opacity-70"
              content="View All Events"
              rightIcon={<RightArrowCircleSmallIcon />}
            ></SidebarButton>
          </div>
          <div className="w-full flex flex-col gap-[10px]">
            <div className="w-full text-[18px] font-semibold px-[14px] py-2 border border-[#ffffff1a] rounded-full flex items-center justify-center sticky backdrop-blur-[40px] top-[10px] bg-[#222222cc]">
              October 2023
            </div>
            {MOCK_DATA.upcomingEvents.map((event, index) => {
              return (
                <div key={index} className="w-full flex flex-col gap-1">
                  <div className="hover:bg-[#ffffff1a] transition ease-in duration-300 cursor-pointer rounded-[10px]">
                    <EventCard />
                  </div>
                  <div className="flex gap-1">
                    {event.sideEvents > 0 && (
                      <SidebarButton
                        className="px-[10px] py-[6px] bg-[#ffffff05] hover:bg-[#e6e6e60f] transition ease-in duration-300 rounded-full flex items-center gap-[10px] w-fit cursor-pointer"
                        icon={
                          <div className="w-6 h-6 rounded-full bg-[#ffffff14] shadow-sm">
                            <div className="scale-75">
                              <HomeIcon />
                            </div>
                          </div>
                        }
                      >
                        <span>{event.sideEvents}&nbsp;</span>
                        <span className="text-[#ffffff80] text-[16px] font-medium">
                          side events around&nbsp;
                        </span>
                        <span>{event.topic}</span>
                      </SidebarButton>
                    )}
                    <SidebarButton
                      icon={<EventIcon />}
                      className="px-[10px] py-[6px] hover:bg-[#ffffff1a] bg-transparent rounded-[10px] flex items-center gap-[10px] w-fit cursor-pointer"
                      content={event.topic}
                    ></SidebarButton>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-5 flex flex-col gap-5">
          <div className="flex w-full justify-between items-center">
            <div className="text-[18px] font-bold text-[#919191]">
              Past Events ({MOCK_DATA.pastEvents.length})
            </div>
            <SidebarButton
              className="flex gap-[10px] px-[10px] py-1 cursor-pointer hover:bg-[#e6e6e61a] bg-transparent rounded-[10px] opacity-70"
              content="See All"
            ></SidebarButton>
          </div>
          {MOCK_DATA.pastEvents.map((event, index) => {
            return (
              <div
                className="hover:bg-[#ffffff1a] transition ease-in duration-300 cursor-pointer rounded-[10px]"
                key={index}
              >
                <EventCard />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
