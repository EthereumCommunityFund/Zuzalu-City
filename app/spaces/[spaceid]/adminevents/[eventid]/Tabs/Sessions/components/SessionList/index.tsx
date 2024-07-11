import * as React from 'react';
import { Divider, Stack, Typography } from '@mui/material';
import {
  InformationIcon,
  ListIcon,
  PlusIcon,
  SearchIcon,
  TableIcon,
  PlusCircleIcon,
} from 'components/icons';
import { ZuButton, ZuInput } from 'components/core';
import SessionCard from './SessionCard';

import { Session, SessionData } from '@/types';
import SessionAdd from '../SessionAdd';
import RowCalendar from '@/components/calendar/RowCalendar';
import dayjs from 'dayjs';
import { format } from 'date-fns';
import { supabase } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';

type SessionsListProps = {
  sessions?: Session[];
  setSelectedSession: React.Dispatch<React.SetStateAction<Session>> | any;
};

const SessionList: React.FC<SessionsListProps> = ({ sessions = [], setSelectedSession, }) => {

  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [searchString, setSearchString] = React.useState<string>('');
  const [filteredSessions, setFilteredSessions] = React.useState<Session[]>([]);
  const params = useParams();

  const getSessions = async (searchString?: string, selectedDate?: Date) => {
    try {
      const eventId = params.eventid.toString();
      const { data } = await supabase
        .from('sessions')
        .select('*')
        .eq('eventId', eventId)
        .ilike('title', `%${searchString}%`)
        .ilike('startTime', selectedDate ? `%${dayjs(
          selectedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }),
        ).format('YYYY-MM-DDT')}%` : '%%')
      if (data) {
        setFilteredSessions(data);
      }
    } catch (err) {
      console.log(err);
    }
  };


  React.useEffect(() => {
    getSessions(searchString, selectedDate)
  }, [selectedDate, searchString])

  return (
    sessions.length > 0 ? <Stack direction={'column'} spacing={2}>
      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} paddingTop={'20px'}>
        <Typography>{sessions.length} sessions</Typography>
        <Stack direction={'row'} spacing={2} alignItems={'center'}>
          <Stack
            direction={'row'}
            bgcolor={'#2a2a2a'}
            padding={'4px'}
            borderRadius={'10px'}
            spacing={1}
            alignItems={'center'}
          >
            <Stack bgcolor={'#404040'} padding={'2px'} borderRadius={'5px'}>
              <ListIcon />
            </Stack>
            <Stack>
              <TableIcon />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <ZuInput
        startAdornment={
          <Stack
            sx={{
              paddingRight: '10px'
            }}
          >
            <SearchIcon />
          </Stack>
        }
        placeholder='Search Sessions'
        sx={{
          border: '1px solid rgba(255, 255, 255, 0.10)',
          borderRadius: '10px'
        }}
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
      />
      <RowCalendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <Divider
        variant='fullWidth'
        orientation='horizontal'
        sx={{
          borderBottom: '2px solid #383838'
        }}
      />

      <Typography
        align="left"
        paddingY={'14px'}
        paddingLeft={'12px'}
        bgcolor={'#272727'}
        fontSize={'13px'}
        color={'rgba(255, 255, 255, 0.60)'}
        marginTop={'2px !important'}
      >
        {
          format(selectedDate, 'E · dd MMM yyyy')
        }
      </Typography>
      <Stack spacing={2} divider={<Divider sx={{ borderColor: '#383838' }} />}>
        {/* <SessionCard />
        <SessionCard />
        <SessionCard /> */}
        {filteredSessions.map((session, index) => (
          <SessionCard
            key={`SessionCard-${index}`}
            session={session}
            setSelectedSession={setSelectedSession}
          />
        ))}
      </Stack>
    </Stack>
      : <SessionAdd />
  );
};

export default SessionList;
