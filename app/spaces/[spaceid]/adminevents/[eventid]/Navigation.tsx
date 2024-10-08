import { Stack, Typography } from '@mui/material';
import { ApplyRule, ApplyOption } from './Tabs/Ticket/components/types';
import { Event } from '@/types';
import { useCallback } from 'react';

interface NavigationProps {
  event?: Event;
}

export default function Navigation({ event }: NavigationProps) {
  const regAndAccess = event?.regAndAccess?.edges[0].node;
  const noApplication =
    regAndAccess?.applyRule === ApplyRule.NoApplication &&
    !regAndAccess?.applyOption?.includes(ApplyOption.RequireBasicInfo);
  let list = [
    'Event Ticketing',
    'Event Registration',
    'Access Rules',
    'Event Applications',
  ];
  noApplication && list.splice(3);

  const handleClick = useCallback((id: string) => {
    document.querySelector(`#${id.replace(/\s+/g, '')}`)?.scrollTo({
      behavior: 'smooth',
      top: 50,
    });
  }, []);

  return (
    <Stack
      position="fixed"
      top="155px"
      right="50px"
      zIndex={1000}
      padding="10px"
    >
      {list.map((item) => (
        <Stack p="10px" onClick={() => handleClick(item)} key={item}>
          <Typography fontSize={14} lineHeight={1.6}>
            {item}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
