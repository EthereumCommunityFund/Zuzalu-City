import * as React from 'react';
import { Stack, Typography, useTheme, Link } from '@mui/material';
import OverviewButton from './OverviewButton';
import { Event } from '@/types';
import { Anchor, ProfileEdge, Profile } from '@/types';
import { useCeramicContext } from '@/context/CeramicContext';
import { useParams } from 'next/navigation';
import dayjs, { Dayjs } from 'dayjs';
import { QRReader } from '@/components/modals/QRScanModal/QRReader';
import { supabase } from '@/utils/supabase/client';

interface PropTypes {
  event?: Event;
  setTabName: (value: string | ((prevVar: string) => string)) => void;
}

const OverviewHeader = ({ event, setTabName }: PropTypes) => {
  const { composeClient, isAuthenticated, profile } = useCeramicContext();

  const needShow = (event?.regAndAccess?.edges?.length ?? 0) > 0;

  const params = useParams();
  const eventId = params.eventid.toString();
  const profileId = profile?.id || '';
  const { breakpoints } = useTheme();

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [showQRScanner, setShowQRScanner] = React.useState(false);
  const [people, setPeople] = React.useState<Profile[]>([]);
  const [locations, setLocations] = React.useState<string[]>([]);
  const [person, setPerson] = React.useState(true);
  const [online, setOnline] = React.useState(false);
  const [sessionName, setSessionName] = React.useState<string>('');
  const [sessionTrack, setSessionTrack] = React.useState<string>('');
  const [sessionTags, setSessionTags] = React.useState<Array<string>>([]);
  const [sessionType, setSessionType] = React.useState<string>('');
  const [sessoinStatus, setSessionStatus] = React.useState<string>('');
  const [sessionGated, setSessionGated] = React.useState<string>('');
  const [sessionExperienceLevel, setSessionExperienceLevel] =
    React.useState<string>('');
  // const [sessionFormat, setSessionFormat] = useState<string>("");
  const [sessionVideoURL, setSessionVideoURL] = React.useState<string>('');
  const [sessionDate, setSessionDate] = React.useState<Dayjs | null>(dayjs());
  const [sessionStartTime, setSessionStartTime] = React.useState<Dayjs | null>(
    dayjs(),
  );
  const [sessionEndTime, setSessionEndTime] = React.useState<Dayjs | null>(
    dayjs(),
  );
  const [sessionOrganizers, setSessionOrganizers] = React.useState<
    Array<string>
  >([]);
  const [sessionSpeakers, setSessionSpeakers] = React.useState<Array<string>>(
    [],
  );
  const [sessionLocation, setSessionLocation] = React.useState<string>();

  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };

  const getSession = async () => {
    try {
      const { data } = await supabase
        .from('sessions')
        .select('*')
        .eq('eventId', eventId);
      if (data) {
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getPeople = async () => {
    try {
      const response: any = await composeClient.executeQuery(`
        query MyQuery {
          zucityProfileIndex(first: 20) {
            edges {
              node {
                id
                username
                avatar
              }
            }
          }
        }
      `);

      if ('zucityProfileIndex' in response.data) {
        const profileData: ProfileEdge = response.data as ProfileEdge;
        const fetchedPeople: Profile[] =
          profileData.zucityProfileIndex.edges.map((edge) => edge.node);
        setPeople(fetchedPeople);
      } else {
        console.error('Invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch sesssions:', error);
    }
  };

  const handleChange = (val: string[]) => {
    setSessionTags(val);
  };

  const handleSpeakerChange = (e: any) => {
    setSessionSpeakers(
      typeof e.target.value === 'string'
        ? e.target.value.split(',')
        : e.target.value,
    );
  };

  const handleOrganizerChange = (e: any) => {
    setSessionOrganizers(
      typeof e.target.value === 'string'
        ? e.target.value.split(',')
        : e.target.value,
    );
  };

  const createSession = async () => {
    if (!isAuthenticated) {
      return;
    }

    const error =
      !eventId ||
      !sessionStartTime ||
      !sessionEndTime ||
      !sessionName ||
      !sessoinStatus ||
      !sessionTags ||
      !sessionTrack ||
      !profileId;

    if (error) {
      typeof window !== 'undefined' &&
        window.alert('Please fill necessary fields!');
      return;
    }

    const format = person ? 'person' : 'online';

    const { data } = await supabase.from('sessions').insert({
      title: sessionName,
      description: '', // TODO:
      experience_level: sessionExperienceLevel,
      createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]').toString(),
      startTime: sessionStartTime?.format('YYYY-MM-DDTHH:mm:ss[Z]').toString(),
      endTime: sessionEndTime?.format('YYYY-MM-DDTHH:mm:ss[Z]').toString(),
      profileId,
      eventId,
      tags: sessionTags.join(','),
      type: sessionType,
      status: sessoinStatus,
      format,
      track: sessionTrack,
      gated: sessionGated,
      timezone: dayjs.tz.guess().toString(),
      video_url: sessionVideoURL,
    });

    toggleDrawer('right', false);
    // await getSession();

    // if (person) {
    //   const update = await composeClient.executeQuery(`
    //   mutation {
    //     createSession(
    //       input: {
    //         content: {
    //           title: "${sessionName}",
    //           createdAt: "${dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]')}",
    //           startTime: "${sessionStartTime?.format('YYYY-MM-DDTHH:mm:ss[Z]')}",
    //           endTime: "${sessionEndTime?.format('YYYY-MM-DDTHH:mm:ss[Z]')}",
    //           profileId: "${profileId}",
    //           eventId: "${params.eventid.toString()}",
    //           tags: "${sessionTags.join(',')}",
    //           status: "${sessoinStatus}",
    //           format: "person",
    //           track: "${sessionTrack}",
    //           gated: "${sessionGated}",
    //           description: "${strDesc}"
    //         }
    //       }
    //     ) {
    //       document {
    //         id
    //         title
    //         createdAt
    //         startTime
    //         endTime
    //         eventId
    //         profileId
    //       }
    //     }
    //   }
    //   `);
    //   toggleDrawer('right', false);
    // } else {
    //   const update = await composeClient.executeQuery(`
    //   mutation {
    //     createSession(
    //       input: {
    //         content: {
    //           title: "${sessionName}",
    //           createdAt: "${dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]')}",
    //           startTime: "${sessionStartTime?.format('YYYY-MM-DDTHH:mm:ss[Z]')}",
    //           endTime: "${sessionEndTime?.format('YYYY-MM-DDTHH:mm:ss[Z]')}",
    //           profileId: "${profileId}",
    //           eventId: "${params.eventid.toString()}",
    //           tags: "${sessionTags.join(',')}",
    //           status: "${sessoinStatus}",
    //           format: "online",
    //           track: "${sessionTrack}",
    //           gated: "${sessionGated}",
    //           description: "${strDesc}"
    //         }
    //       }
    //     ) {
    //       document {
    //         id
    //         title
    //         createdAt
    //         startTime
    //         endTime
    //         eventId
    //         profileId
    //       }
    //     }
    //   }
    //   `);
    //   toggleDrawer('right', false);
    // }
  };

  React.useEffect(() => {
    getPeople();
  }, []);

  return event ? (
    <Stack direction="column" spacing={3} marginBottom={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          [breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
          },
        }}
      >
        <Typography variant="h5" color="white">
          {event.title}
        </Typography>
        <Stack direction="row">
          <Typography variant="body1" color="white">
            Today&apos;s Date:&nbsp;
          </Typography>
          <Typography variant="body1" color="white" sx={{ opacity: 0.7 }}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </Stack>
      </Stack>
      {!needShow && (
        <Stack
          p="20px"
          spacing="10px"
          borderRadius="10px"
          sx={{
            background:
              'linear-gradient(182deg, rgba(255, 255, 255, 0.10) 1.74%, rgba(255, 255, 255, 0.03) 98.26%)',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography fontSize={25} fontWeight={500} lineHeight={1.2}>
              Welcome to your event!
            </Typography>
          </Stack>
          <Typography fontSize={16} lineHeight={1.6} sx={{ opacity: 0.8 }}>
            Setup your event&apos;s pass configuration and check-in status in
            the{' '}
            <Link
              onClick={() => setTabName('Registration')}
              sx={{ cursor: 'pointer' }}
            >
              Registration
            </Link>{' '}
            tab
          </Typography>
        </Stack>
      )}
      <Stack
        direction="row"
        sx={{
          gap: '8px',
          [breakpoints.down('sm')]: {
            flexDirection: 'column',
          },
          borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
          paddingBottom: '30px',
        }}
      >
        <OverviewButton type={0} onClick={() => toggleDrawer('right', true)} />
        <OverviewButton
          type={1}
          onClick={() => {
            setShowQRScanner(!showQRScanner);
          }}
        />
      </Stack>
      {/* <SwipeableDrawer
        hideBackdrop={true}
        sx={{
          '& .MuiDrawer-paper': {
            marginTop: '50px',
            height: 'calc(100% - 50px)',
            boxShadow: 'none',
          },
        }}
        anchor="right"
        open={state['right']}
        onClose={() => toggleDrawer('right', false)}
        onOpen={() => toggleDrawer('right', true)}
      >
        {
          <List
            anchor={'right'}
            createSession={createSession}
            handleChange={handleChange}
            handleOrganizerChange={handleOrganizerChange}
            handleSpeakerChange={handleSpeakerChange}
            locations={locations}
            online={online}
            people={people}
            person={person}
            sessionDate={sessionDate}
            sessionDescription={sessionDescription}
            sessionEndTime={sessionEndTime}
            sessionLocation={sessionLocation}
            sessionOrganizers={sessionOrganizers}
            sessionSpeakers={sessionSpeakers}
            sessionStartTime={sessionStartTime}
            sessionTags={sessionTags}
            sessionVideoURL={sessionVideoURL}
            setLocations={setLocations}
            setOnline={setOnline}
            setPerson={setPerson}
            setSessionDate={setSessionDate}
            setSessionDescription={setSessionDescription}
            setSessionEndTime={setSessionEndTime}
            setSessionExperienceLevel={setSessionExperienceLevel}
            setSessionGated={setSessionGated}
            setSessionLocation={setSessionLocation}
            setSessionName={setSessionName}
            setSessionOrganizers={setSessionOrganizers}
            setSessionSpeakers={setSessionSpeakers}
            setSessionStartTime={setSessionStartTime}
            setSessionStatus={setSessionStatus}
            setSessionTags={setSessionTags}
            setSessionTrack={setSessionTrack}
            setSessionType={setSessionType}
            setSessionVideoURL={setSessionVideoURL}
            toggleDrawer={toggleDrawer}
          />
        }
      </SwipeableDrawer> */}
      {showQRScanner && <QRReader />}
    </Stack>
  ) : (
    <></>
  );
};

export default OverviewHeader;
