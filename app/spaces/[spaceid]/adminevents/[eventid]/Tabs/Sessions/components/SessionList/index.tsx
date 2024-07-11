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
import { useCeramicContext } from '@/context/CeramicContext';
import { format } from 'date-fns';

type SessionsListProps = {
  sessions?: Session[];
  setSelectedSession: React.Dispatch<React.SetStateAction<Session>> | any;
};

const SessionList: React.FC<SessionsListProps> = ({ sessions = [], setSelectedSession, }) => {

  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [searchString, setSearchString] = React.useState<string>('');
  const [filteredSessions, setFilteredSessions] = React.useState<Session[]>([]);

  const { composeClient, profile, isAuthenticated } = useCeramicContext();

  const getSessions = async (searchString?: string, selectedDate?: Date) => {
    try {

      let filter = {};
      let variable = {};
      const query = `
        query MyQuery ($filter: SessionFiltersInput) {
          sessionIndex(first: 20, filters: $filter) {
            edges {
              node {
                id
                title
                createdAt
                profileId
                startTime
                endTime
                eventId
                tags
                type
                track
                format
                status
                timezone
                video_url
                description
                meeting_url
                experience_level
              }
            }
          }
        }
      `;

      if(searchString) {
        filter = {...filter, title: {
          equalTo: searchString
        }}

        variable = {
          filter: {
            where: filter
          }
        }
      }

      if(selectedDate) {
        filter = {...filter, startTime: {
          equalTo: dayjs(
            selectedDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }),
          ).format('YYYY-MM-DDTHH:mm:ss[Z]')
        }}

        variable = {
          filter: {
            where: filter
          }
        }
      }
      const response: any = await composeClient.executeQuery(query, variable)
      if ('sessionIndex' in response.data) {
        const sessionData: SessionData = response.data as SessionData;
        const fetchedSessions: Session[] = sessionData.sessionIndex.edges.map(
          (edge) => edge.node,
        );
        setFilteredSessions(fetchedSessions);
      } else {
        console.error('Invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch sesssions:', error);
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
            <SearchIcon/>
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
