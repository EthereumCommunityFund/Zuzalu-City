'use client';

import { HomeIcon, SearchIcon, StreamIcon } from 'components/icons';
import SidebarButton from './SidebarButton';
import { ChatsIcon } from 'components/icons/Chats';
import { AnnouncementsIcon } from 'components/icons/Announcements';
import Image from 'next/image';
import { ManageEventsIcon } from 'components/icons/ManageEvents';

export default function SubSidebar() {
  const buttonList = [
    {
      content: 'Search',
      icon: <SearchIcon />,
    },
    {
      content: 'Home',
      icon: <HomeIcon />,
    },
    {
      content: 'Space Stream',
      icon: <StreamIcon />,
    },
    {
      content: 'Announcements',
      icon: <AnnouncementsIcon />,
    },
    {
      content: 'Chats',
      icon: <ChatsIcon />,
    },
  ];

  return (
    <div className="min-w-[280px] w-[280px] bg-[#222] border-r border-r-[#ffffff1a] hidden lg:block">
      <div className="w-full p-[10px] border-b broder-b-[#ffffff1a] flex flex-col gap-[10px]">
        <div className="w-full rounded-[10px] border border-[#ffffff1a] p-[10px] flex items-center gap-[10px] overflow-hidden relative">
          <Image
            loader={() =>
              'https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png?scale-down-to=512'
            }
            src={
              'https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png?scale-down-to=512'
            }
            alt=""
            width={260}
            height={64}
            className="blur-[20px] grayscale-[40] absolute opacity-25 before:hidden after:block"
          ></Image>
          <Image
            loader={() =>
              'https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png'
            }
            src={
              'https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png'
            }
            width={35}
            height={35}
            className="max-w-[35px] max-h-[35px]"
            alt="Zuzalu City"
          />
          <p className="whitespace-pre-wrap break-words text-[18px] font-bold leading-5">
            Zuzalu City Contributors
          </p>
        </div>
        <SidebarButton
          content="Exit Space"
          className="bg-[#ffffff05] hover:bg-[#ffffff1a] px-[10px] py-2 rounded-[10px] cursor-pointer opacity-60 hover:opacity-100"
        ></SidebarButton>
      </div>
      <div className="w-full flex flex-col gap-[20px]">
        <div className="w-full flex flex-col gap-[10px] p-[10px]">
          {buttonList.map((item, index) => {
            if (item.content === 'Search') {
              return (
                <SidebarButton
                  icon={item.icon}
                  content={item.content}
                  key={index}
                  isActive={false}
                  className="bg-transparent hover:bg-[#ffffff1a] px-[10px] py-2 rounded-[10px] cursor-pointer opacity-60 hover:opacity-80 flex gap-[10px]"
                ></SidebarButton>
              );
            }
            return (
              <SidebarButton
                icon={item.icon}
                content={item.content}
                key={index}
                isActive={false}
              ></SidebarButton>
            );
          })}
        </div>
        <div className="w-full p-[10px] flex flex-col gap-[14px] border-t broder-t-[#ffffff1a]">
          <p className="uppercase text-[10px]">admins</p>
          <SidebarButton
            content="Manage Events"
            icon={<ManageEventsIcon />}
          ></SidebarButton>
        </div>
      </div>
    </div>
  );
}
