import React, { useRef, useEffect, useMemo } from 'react';
import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import { Event } from '@/types';

interface TabbarProps {
  tabName: string;
  setTabName: (value: string | ((prevVar: string) => string)) => void;
  event?: Event;
}

interface TabItems {
  name: string;
  label: string;
  needPoint?: boolean;
}

const Tabbar: React.FC<TabbarProps> = ({ tabName, setTabName, event }) => {
  const isSmallScreen = useMediaQuery('(max-width: 550px)');
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const tabItems: TabItems[] = useMemo(
    () => [
      { name: 'Overview', label: 'Overview' },
      {
        name: 'Registration',
        label: 'Registration',
        needPoint: (event?.regAndAccess?.edges?.length ?? 0) === 0,
      },
      { name: 'Announcements', label: 'Announcements' },
      { name: 'Venue', label: 'Venue' },
      { name: 'Attendees', label: 'Attendees' },
    ],
    [event?.regAndAccess?.edges?.length],
  );

  useEffect(() => {
    if (isSmallScreen && tabsContainerRef.current) {
      const activeTab = tabsContainerRef.current.querySelector(
        `[data-tab-name="${tabName}"]`,
      );
      activeTab?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [tabName, isSmallScreen]);

  return (
    <Box
      ref={tabsContainerRef}
      bgcolor="#2b2b2b"
      height="45px"
      display="flex"
      gap="10px"
      padding="0px 20px"
      paddingBottom="0px"
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
      overflow={isSmallScreen ? 'auto' : 'hidden'}
      position="sticky"
      top="50px"
      zIndex={3}
      sx={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {tabItems.map((item) => (
        <TabItem
          key={item.name}
          name={item.name}
          label={item.label}
          isActive={tabName === item.name}
          needPoint={item.needPoint}
          onClick={() => setTabName(item.name)}
        />
      ))}
    </Box>
  );
};

interface TabItemProps {
  name: string;
  label: string;
  needPoint?: boolean;
  isActive: boolean;
  onClick: () => void;
}

const TabItem: React.FC<TabItemProps> = ({
  name,
  label,
  isActive,
  onClick,
  needPoint,
}) => (
  <Stack
    direction="row"
    alignItems="center"
    spacing="5px"
    paddingRight={needPoint ? '14px' : '0'}
    borderBottom={isActive ? '1px solid white' : 'none'}
  >
    <Typography
      onClick={onClick}
      color="white"
      fontFamily="Inter"
      fontSize="15px"
      fontWeight={600}
      padding={!needPoint ? '0 14px' : '0 0 0 14px'}
      height="100%"
      lineHeight="45px"
      sx={{ cursor: 'pointer' }}
      data-tab-name={name}
    >
      {label}
    </Typography>
    {needPoint && (
      <Box width="8px" height="8px" bgcolor="#7DFFD1" borderRadius="50%" />
    )}
  </Stack>
);

export default Tabbar;
