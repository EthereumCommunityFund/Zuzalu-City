'use client';
import { InformationIcon, PlusIcon } from 'components/icons';
import { AddAdminRequest, Event, AddMemberRequest } from '@/types';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Stack, Typography, Box } from '@mui/material';
import { ZuButton, ZuInput } from '@/components/core';
import { PlusCircleIcon, XCricleIcon } from '@/components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import { Space, SpaceData } from '@/types';
import { DID } from 'dids';
import { chainID } from '@/constant';
import { updateAdmin } from '@/services/event/addAdmin';
import { updateMember } from '@/services/event/addMember';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import { tempUpdateTrack } from '@/services/event/tempAddTrack';
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
  const [newTrack, setNewTrack] = useState<string>('');
  const [initialAdmin, setInitialAdmin] = useState<string>('');
  const [extraAdmin, setExtraAdmin] = useState<string[]>([]);
  const [extraMember, setExtraMember] = useState<string[]>([]);
  // const [space, setSpace] = useState<ISpace>({
  //   id: '',
  //   members: ['']
  // });
  const [members, setMembers] = useState<IMember[]>([]);
  const [admins, setAdmins] = useState<IMember[]>([]);
  const [superAdmin, setSuperAdmin] = useState<IMember[]>([]);
  const [author, setAuthor] = useState<string>('');
  const [eventData, setEventData] = useState<Event>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [blockClickModal, setBlockClickModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
              superAdmin {
                id
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
              tracks
            }
          }
        }
      `;

      const response: any = await composeClient.executeQuery(GET_Event_QUERY, {
        id: params.eventid,
      });
      setEventData(response.data.node);
      setMembers(response.data.node.members);
      setAdmins(response.data.node.admins);
      return response.data.node;
    } catch (error) {
      console.error('Failed to fetch event:', error);
    }
  };
  const updateEventAdmin = async () => {
    const addAdminInput: AddAdminRequest = {
      eventId: params.eventid as string,
      adminAddress: initialAdmin,
    };
    try {
      setBlockClickModal(true);
      const response = await updateAdmin(addAdminInput);
      if (response.status === 200) {
        setShowModal(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setBlockClickModal(false);
      getEventList();
    }
  };

  const updateEventMember = async () => {
    const addMemberInput: AddMemberRequest = {
      eventId: params.eventid as string,
      memberAddress: initialMember,
    };
    try {
      setBlockClickModal(true);
      const response = await updateMember(addMemberInput);

      if (response.status === 200) {
        setShowModal(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setBlockClickModal(false);
      getEventList();
    }
  };
  const updateTrack = async () => {
    const addTrackInput = {
      eventId: params.eventid as string,
      newTrack: newTrack,
    };
    try {
      setBlockClickModal(true);
      const response = await tempUpdateTrack(addTrackInput);
      if (response.status === 200) {
        setShowModal(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setBlockClickModal(false);
      getEventList();
      setNewTrack('');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const event = await getEventList();
        const admins =
          event?.admins?.map((admin: any) => admin.id.toLowerCase()) || [];

        const superAdmins =
          event?.superAdmin?.map((superAdmin: any) =>
            superAdmin.id.toLowerCase(),
          ) || [];
        const userDID = ceramic?.did?.parent.toString().toLowerCase() || '';

        if (admins.includes(userDID) || superAdmins.includes(userDID)) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <Stack direction="column" spacing={3} marginBottom={3}>
      <Dialog
        title="Updated"
        message="Please view it."
        showModal={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        onConfirm={() => {
          setShowModal(false);
        }}
      />
      <Dialog
        showModal={blockClickModal}
        showActions={false}
        title="Updating"
        message="Please wait while the data is being updated..."
      />
      <Box padding="20px" borderRadius="10px" bgcolor="#262626">
        <Typography variant="subtitleMB">Add Track (Temp Solution)</Typography>
        <Stack
          padding="20px"
          spacing="30px"
          borderRadius="10px"
          bgcolor="#262626"
          mt={2}
        >
          <Stack spacing="10px">
            <Typography variant="bodyBB">Input New Track</Typography>
            <ZuInput
              value={newTrack}
              onChange={(e) => setNewTrack(e.target.value)}
            />
            <ZuButton variant="contained" color="primary" onClick={updateTrack}>
              Add Track
            </ZuButton>
          </Stack>
          <Stack spacing="10px">{eventData?.tracks}</Stack>
        </Stack>
      </Box>
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
            {ceramic && ceramic.did && isAdmin ? (
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
            {ceramic && ceramic.did && isAdmin ? (
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
