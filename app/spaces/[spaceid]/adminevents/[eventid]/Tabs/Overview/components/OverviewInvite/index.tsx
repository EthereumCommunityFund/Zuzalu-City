'use client';
import { InformationIcon, PlusIcon } from 'components/icons';
import { Event } from '@/types';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Stack, Typography, Box } from '@mui/material';
import { ZuButton, ZuInput } from '@/components/core';
import { PlusCircleIcon, XCricleIcon } from '@/components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import { Space, SpaceData } from '@/types';
import { DID } from 'dids';
import { chainID } from '@/constant';
interface IMember {
  id: string;
  mvpProfile?: {
    username: string;
  };
}
interface PropTypes {
  event?: Event;
}
const OverviewInvite = ({ event }: PropTypes) => {
  const params = useParams();
  const { composeClient, isAuthenticated, ceramic, profile } =
    useCeramicContext();
  const [initialMember, setInitialMember] = useState<string>('');
  const [initialAdmin, setInitialAdmin] = useState<string>('');
  const [extraAdmin, setExtraAdmin] = useState<string[]>([]);
  const [extraMember, setExtraMember] = useState<string[]>([]);
  // const [space, setSpace] = useState<ISpace>({
  //   id: '',
  //   members: ['']
  // });
  const [members, setMembers] = useState<IMember[]>([]);
  const [admins, setAdmins] = useState<IMember[]>([]);
  const [author, setAuthor] = useState<string>('');
  const getEventList = async () => {
    try {
      const GET_Event_QUERY = `
      query GetEvent($id: ID!) {
        node(id: $id) {
            ... on Event {
              id
              admins {
                id
                mvpProfile {
                  username
                }
              }
              members {
                id
                mvpProfile {
                  username
                }
              }
              author {
                id
              }
            }
          }
        }
      `;

      const response: any = await composeClient.executeQuery(GET_Event_QUERY, {
        id: params.eventid,
      });
      setMembers(response.data.node.members);
      setAdmins(response.data.node.admins);
      setAuthor(response.data.node.author.id);
      console.log(response.data.node.members);
    } catch (error) {
      console.error('Failed to fetch event:', error);
    }
  };
  const updateEventAdmin = async () => {
    if (!isAuthenticated) return;
    const updatedAdmins = [
      ...admins.map((admin) => admin.id),
      `did:pkh:eip155:${chainID.toString()}:${initialAdmin}`,
    ];
    console.log(updatedAdmins);
    const query = `
      mutation UpdateEvent($i: UpdateEventInput!) {
       updateEvent(input: $i) {
         document {
           id
         }
        }
      }
      `;

    const variables = {
      i: {
        id: params.eventid,
        content: {
          admins: updatedAdmins,
        },
      },
    };

    try {
      const result: any = await composeClient.executeQuery(query, variables);
      await getEventList();
    } catch (err) {
      console.log(err);
    }
  };

  const updateEventMember = async () => {
    if (!isAuthenticated) return;
    const updatedMembers = members
      ? [
          ...members.map((member) => member.id),
          `did:pkh:eip155:${chainID.toString()}:${initialMember}`,
        ]
      : [`did:pkh:eip155:${chainID.toString()}:${initialMember}`];
    const query = `
      mutation UpdateEvent($i: UpdateEventInput!) {
       updateEvent(input: $i) {
         document {
           id
         }
        }
      }
      `;

    const variables = {
      i: {
        id: params.eventid,
        content: {
          members: updatedMembers,
        },
      },
    };

    try {
      const result: any = await composeClient.executeQuery(query, variables);
      await getEventList();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getEventList();
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <Stack direction="column" spacing={3} marginBottom={3}>
      <Typography variant="subtitleMB">Invite Event Admins</Typography>
      <Stack
        padding="20px"
        spacing="30px"
        borderRadius="10px"
        bgcolor="#262626"
      >
        <Stack spacing="10px">
          <>
            <Typography variant="bodyBB">Input Address</Typography>
            <ZuInput onChange={(e) => setInitialAdmin(e.target.value)} />
          </>
          {/*extraAdmin.map((item, index) => (
            <>
              <Typography variant="bodyBB">Input Address</Typography>
              <Stack direction="row" spacing="10px" alignItems="center">
                <ZuInput
                  value={item}
                  onChange={(e) =>
                    setExtraAdmin((prev) =>
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
                    setExtraAdmin((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  <XCricleIcon />
                </Box>
              </Stack>
            </>
          ))*/}
          <Stack direction="row" justifyContent="space-between">
            {/*<ZuButton
              startIcon={<PlusCircleIcon />}
              onClick={() => {
                setExtraAdmin((prev) => {
                  const newState = [...prev, ''];
                  return newState;
                });
              }}
            >
              Add More
            </ZuButton>*/}
            {ceramic &&
            ceramic.did &&
            author === ceramic.did.parent.toString() ? (
              <ZuButton
                sx={{
                  color: '#67DBFF',
                  border: '1px solid rgba(103, 219, 255, 0.20)',
                  backgroundColor: 'rgba(103, 219, 255, 0.10)',
                }}
                onClick={updateEventAdmin}
              >
                Invite
              </ZuButton>
            ) : null}
          </Stack>
        </Stack>
        <Stack spacing="10px">
          <Typography variant="bodySB">Admins</Typography>
          {admins !== null &&
            admins.map((admin: IMember, index: number) => (
              <Stack
                direction="row"
                alignItems="center"
                spacing="10px"
                key={`member-${index}`}
              >
                <Box
                  component="img"
                  width="24px"
                  height="24px"
                  borderRadius="20px"
                  src="/17.jpg"
                />
                {/*<Typography variant="bodyM" flex={2}>
                  {admin.mvpProfile?.username}
                </Typography>*/}
                <Typography variant="bodyM" flex={2}>
                  {admin.id.split(':').pop()}
                </Typography>
                <Typography variant="bodyM" flex={1}>
                  Admin
                </Typography>
                {/*<ZuButton
                  startIcon={<XCricleIcon color="#FF5E5E" />}
                  sx={{
                    color: '#FF5E5E',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(235, 87, 87, 0.20)',
                  }}
                >
                  Remove
                </ZuButton>*/}
              </Stack>
            ))}
        </Stack>
      </Stack>
      <Typography variant="subtitleMB">Invite Event Member</Typography>
      <Stack
        padding="20px"
        spacing="30px"
        borderRadius="10px"
        bgcolor="#262626"
      >
        <Stack spacing="10px">
          <>
            <Typography variant="bodyBB">Input Address</Typography>
            <ZuInput onChange={(e) => setInitialMember(e.target.value)} />
          </>
          {/*{extraMember.map((item, index) => (
            <>
              <Typography variant="bodyBB">Input Address</Typography>
              <Stack direction="row" spacing="10px" alignItems="center">
                <ZuInput
                  value={item}
                  onChange={(e) =>
                    setExtraMember((prev) =>
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
                    setExtraMember((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  <XCricleIcon />
                </Box>
              </Stack>
            </>
          ))*/}
          <Stack direction="row" justifyContent="space-between">
            {/*<ZuButton
              startIcon={<PlusCircleIcon />}
              onClick={() => {
                setExtraMember((prev) => {
                  const newState = [...prev, ''];
                  return newState;
                });
              }}
            >
              Add More
            </ZuButton>*/}
            {ceramic &&
            ceramic.did &&
            author === ceramic.did.parent.toString() ? (
              <ZuButton
                sx={{
                  color: '#67DBFF',
                  border: '1px solid rgba(103, 219, 255, 0.20)',
                  backgroundColor: 'rgba(103, 219, 255, 0.10)',
                }}
                onClick={updateEventMember}
              >
                Invite
              </ZuButton>
            ) : null}
          </Stack>
        </Stack>
        <Stack spacing="10px">
          <Typography variant="bodySB">Members</Typography>
          {members !== null &&
            members.map((member: IMember, index: number) => (
              <Stack
                direction="row"
                alignItems="center"
                spacing="10px"
                key={`member-${index}`}
              >
                <Box
                  component="img"
                  width="24px"
                  height="24px"
                  borderRadius="20px"
                  src="/17.jpg"
                />
                {/*<Typography variant="bodyM" flex={2}>
                  {member.mvpProfile?.username}
                </Typography>*/}
                <Typography variant="bodyM" flex={2}>
                  {member.id.split(':').pop()}
                </Typography>
                <Typography variant="bodyM" flex={1}>
                  Member
                </Typography>
                {/*<ZuButton
                  startIcon={<XCricleIcon color="#FF5E5E" />}
                  sx={{
                    color: '#FF5E5E',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(235, 87, 87, 0.20)',
                  }}
                >
                  Remove
                </ZuButton>*/}
              </Stack>
            ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default OverviewInvite;
