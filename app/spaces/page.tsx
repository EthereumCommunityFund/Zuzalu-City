'use client';
import { useState, useEffect } from 'react';
import { Stack, Grid, useTheme, useMediaQuery } from '@mui/material';
import { Sidebar } from 'components/layout';
import { SpaceHeader } from './components';
import { SpaceCard } from 'components';
import { MOCK_DATA } from 'mock';
import { useCeramicContext } from '@/context/CeramicContext';
interface Space {
  id: string;
  avatar?: string;
  banner?: string;
  description?: string;
  name: string;
  profileId?: string;
  tagline?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  nostr?: string;
  lens?: string;
  github?: string;
  discord?: string;
  ens?: string;
}

interface SpaceEdge {
  node: Space;
}

interface SpaceData {
  spaceIndex: {
    edges: SpaceEdge[];
  };
}
const Home = () => {
  const theme = useTheme();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const {
    ceramic,
    composeClient,
    isAuthenticated,
    authenticate,
    logout,
    showAuthPrompt,
    hideAuthPrompt,
    isAuthPromptVisible,
    newUser,
    profile,
    username,
    createProfile,
  } = useCeramicContext();
  const getSpaces = async () => {
    console.log('Fetching spaces...');
    try {
      const response: any = await composeClient.executeQuery(`
        query MyQuery {
          spaceIndex(first: 10) {
            edges {
              node {
                id
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
              }
            }
          }
        }
      `);

      if ('spaceIndex' in response.data) {
        const spaceData: SpaceData = response.data as SpaceData;
        const fetchedSpaces: Space[] = spaceData.spaceIndex.edges.map(
          (edge) => edge.node,
        );
        setSpaces(fetchedSpaces);
        console.log('Spaces fetched:', fetchedSpaces);
      } else {
        console.error('Invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch spaces:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSpaces();
        console.log(data);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <Stack direction="row">
      {!isTablet && <Sidebar />}
      <Stack direction="column" borderLeft="1px solid #383838" flex={1}>
        <SpaceHeader />
        <Grid container spacing={{ xs: 2, md: 3 }} padding="20px">
          {MOCK_DATA.spaces.map((item, index) => (
            <Grid
              item
              key={`SpaceHeader-Card${index}`}
              xs={12}
              sm={6}
              md={4}
              xl={3}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <SpaceCard {...item} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};

export default Home;
