'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Stack, Typography, Box } from '@mui/material';
import { ZuButton, ZuInput } from '@/components/core';
import { PlusCircleIcon, XCricleIcon } from '@/components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import { Space, SpaceData } from '@/types';

interface IMember {
  id: string;
  mvpProfile?: {
    username: string;
  }
}

const Invite = () => {
  const params = useParams();
  const { composeClient, isAuthenticated, ceramic, profile } = useCeramicContext();
  const [initial, setInitial] = useState<string>('');
  const [extra, setExtra] = useState<string[]>([]);
  // const [space, setSpace] = useState<ISpace>({
  //   id: '',
  //   members: ['']
  // });
  const [members, setMembers] = useState<IMember[]>([]);
  console.log('ex', extra);

  const getSpace = async () => {
    console.log('Fetching spaces...');
    try {
      const response: any = await composeClient.executeQuery(`
        query {
          spaceIndex(first: 20) {
            edges {
              node {
                id
                members {
                  id
                }
              }
            }
          }
        }
      `);

      if ('spaceIndex' in response.data) {
        const fetchedSpaces = response.data.spaceIndex.edges.map((item: any) => item.node);
        const editSpace = fetchedSpaces.filter((item: any) => item.id === params.spaceid.toString());
        // setSpace(editSpace);
        console.log('Spaces fetched:', editSpace);
        console.log('Spaces fetched:', editSpace[0].members);
        setMembers(editSpace[0].members);

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
        await getSpace();
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchData();
  }, []);

  const updateSpace = async () => {
    if (!isAuthenticated)
      return;
    try {
      const update = await composeClient.executeQuery(`
        mutation {
          updateSpace(
            input: {
              id: "${params.spaceid.toString()}",
              content: {
                members: "${"did:pkh:eip155:1:" + initial}"
              }
            }
          ) {
            document {
              id
              name
              description
              members {
                id
              }
            }
          }
        }
      `)
      console.log("members", update);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Stack spacing="30px" padding="40px" width="700px">
      <Typography variant="subtitleMB">Invite Space Admins</Typography>
      <Typography variant="bodyB">
        Disclaimer: During beta, invites will only have one role i.e. admin.
        Admins will have access to all management functions for this event.
      </Typography>
      <Stack padding="20px" spacing="30px" borderRadius='10px' bgcolor='#262626'>
        <Stack spacing="10px">
          <>
            <Typography variant="bodyBB">Input Address</Typography>
            <ZuInput onChange={(e) => setInitial(e.target.value)} />
          </>
          {extra.map((item, index) => (
            <>
              <Typography variant="bodyBB">Input Address</Typography>
              <Stack direction="row" spacing="10px" alignItems="center">
                <ZuInput
                  value={item}
                  onChange={(e) =>
                    setExtra((prev) =>
                      prev.map((item, i) =>
                        i === index ? e.target.value : item,
                      ),
                    )
                  }
                />
                <Box
                  padding="8px 10px 6px 10px"
                  bgcolor="#373737"
                  borderRadius="10px"
                  sx={{ cursor: 'pointer' }}
                  onClick={() =>
                    setExtra((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  <XCricleIcon />
                </Box>
              </Stack>
            </>
          ))}
          <Stack direction="row" justifyContent="space-between">
            <ZuButton
              startIcon={<PlusCircleIcon />}
              onClick={() => {
                setExtra((prev) => {
                  const newState = [...prev, ''];
                  return newState;
                });
              }}
            >
              Add More
            </ZuButton>
            <ZuButton
              sx={{
                color: '#67DBFF',
                border: '1px solid rgba(103, 219, 255, 0.20)',
                backgroundColor: 'rgba(103, 219, 255, 0.10)',
              }}
              onClick={updateSpace}
            >
              Invite
            </ZuButton>
          </Stack>
        </Stack>
        <Stack spacing="10px">
          <Typography variant="bodySB">Pending Invites</Typography>
          <Stack spacing="10px">
            <Stack direction="row" alignItems="center" spacing="10px">
              <Box
                component="img"
                width="24px"
                height="24px"
                borderRadius="20px"
                src="/17.jpg"
              />
              <Typography variant="bodyM" flex={2}>
                drivenfast
              </Typography>
              <Typography variant="bodyM" flex={1}>
                0x001234
              </Typography>
              <Typography variant="bodyM" flex={1}>
                Admin
              </Typography>
              <ZuButton
                startIcon={<XCricleIcon color="#FF5E5E" />}
                sx={{
                  color: '#FF5E5E',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(235, 87, 87, 0.20)',
                }}
              >
                Remove
              </ZuButton>
            </Stack>
          </Stack>
        </Stack>
        <Stack spacing="10px">
          <Typography variant="bodySB">Members</Typography>
          {
            members.length > 0 && members.map((member: IMember, index: number) => (
              <Stack direction="row" alignItems="center" spacing="10px">
                <Box
                  component="img"
                  width="24px"
                  height="24px"
                  borderRadius="20px"
                  src="/17.jpg"
                />
                <Typography variant="bodyM" flex={2}>
                  drivenfast
                </Typography>
                <Typography variant="bodyM" flex={1}>
                  {member.id.split(':').pop()?.substring(0, 8)}
                </Typography>
                <Typography variant="bodyM" flex={1}>
                  Creator
                </Typography>
                <ZuButton
                  startIcon={<XCricleIcon color="#FF5E5E" />}
                  sx={{
                    color: '#FF5E5E',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(235, 87, 87, 0.20)',
                  }}
                >
                  Remove
                </ZuButton>
              </Stack>
            ))
          }
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Invite;
