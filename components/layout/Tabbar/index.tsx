import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';

interface TabbarProps {
  tabName: string;
  setTabName: (value: string | ((prevVar: string) => string)) => void;
}

interface TabItems {
  name: string;
  label: string;
}

const tabItems: TabItems[] = [
  { name: 'Overview', label: 'Overview' },
  { name: 'Announcements', label: 'Announcements' },
  { name: 'Venue', label: 'Venue' },
  { name: 'Tickets', label: 'Tickets' },
  { name: 'Attendees', label: 'Attendees' },
];

const Tabbar: React.FC<TabbarProps> = ({ tabName, setTabName }) => {
  const isSmallScreen = useMediaQuery('(max-width: 550px)');

  return (
    <Box
      bgcolor="#2b2b2b"
      height="45px"
      display="flex"
      gap="10px"
      padding="0px 10px"
      paddingBottom="0px"
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
      overflow={isSmallScreen ? 'auto' : 'hidden'}
      position="sticky"
      top="50px"
      zIndex={3}
      sx={{ scrollbarWidth: 'none' }}
    >
      {tabItems.map((item) => (
        <TabItem
          key={item.name}
          name={item.name}
          label={item.label}
          isActive={tabName === item.name}
          onClick={() => setTabName(item.name)}
        />
      ))}
    </Box>
  );
};

interface TabItemProps {
  name: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ label, isActive, onClick }) => (
  <Typography
    onClick={onClick}
    color="white"
    fontFamily="Inter"
    fontSize="15px"
    fontWeight={600}
    paddingX="10px"
    height="100%"
    lineHeight="45px"
    borderBottom={isActive ? '1px solid white' : 'none'}
    sx={{ cursor: 'pointer' }}
  >
    {label}
  </Typography>
);

export default Tabbar;
