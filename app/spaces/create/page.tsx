'use client';
import React, { useState, ChangeEvent } from 'react';
import { Stack, Box, Typography, Button, Input } from '@mui/material';
import TextEditor from '@/components/editor/editor';
import { Header } from './components';
import {
  XMarkIcon,
  SpacePlusIcon,
} from '@/components/icons';
import { useRouter } from 'next/navigation';
import { useCeramicContext } from '@/context/CeramicContext';
import { PreviewFile } from '@/components';
import { Uploader3, SelectedFile } from '@lxdao/uploader3';
import { OutputData } from '@editorjs/editorjs';

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

interface Inputs {
  name: string;
  tagline: string;
}

const Home = () => {
  const router = useRouter();
  const [avatar, setAvatar] = useState<SelectedFile>();
  const [banner, setBanner] = useState<SelectedFile>();
  const [description, setDescription] = useState<OutputData | undefined>();
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

  const [inputs, setInputs] = useState<Inputs>({
    name: '',
    tagline: '',
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value
    }));
  };
  const profileId = profile?.id || '';
  const adminId = ceramic?.did?.parent || '';
  // const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const { value } = event.target;

  //   setSpaceDescription(value);
  // }

  const createSpace = async () => {
    if (!isAuthenticated) return;
    try {
      const update = await composeClient.executeQuery(`
      mutation {
        createSpace(
          input: {
            content: {
              name: "${inputs.name}",
              description: "${description}",
              tagline: "${inputs.tagline}",
              admin: "${adminId}",
              profileId: "${profileId}",
              avatar: "${avatar?.name}",
              banner: "${banner?.previewUrl}"
            }
          }
        ) {
          document {
            id
            name
            description
            admin {
              id
            }
            profileId,
            avatar,
            banner
          }
        }
      }
      `);
      console.log(update)
      window.alert("Success!")
      router.push("/spaces")

    } catch (err) {
      console.log(err)
    }
  };

  return (
    <Stack>
      <Header />
      <Stack direction="row" justifyContent="center">
        <Box
          display="flex"
          flexDirection="column"
          gap="20px"
          padding={3}
          width="800px"
        >
          <Box bgcolor="#2d2d2d" borderRadius="10px">
            <Box padding="20px" display="flex" justifyContent="space-between">
              <Typography
                color="white"
                fontSize="18px"
                fontWeight={700}
                fontFamily="Inter"
              >
                Space Profile
              </Typography>
            </Box>
            <Box
              padding="20px"
              display="flex"
              flexDirection="column"
              gap="20px"
            >
              <Box>
                <Typography
                  color="white"
                  fontSize="18px"
                  fontWeight={700}
                  fontFamily="Inter"
                >
                  Space Name
                </Typography>
                <Input
                  name='name'
                  onChange={handleInputChange}
                  sx={{
                    color: 'white',
                    backgroundColor: '#373737',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    width: '100%',
                    fontSize: '15px',
                    fontFamily: 'Inter',
                    '&::after': {
                      borderBottom: 'none',
                    },
                    '&::before': {
                      borderBottom: 'none',
                    },
                    '&:hover:not(.Mui-disabled, .Mui-error):before': {
                      borderBottom: 'none',
                    },
                  }}
                  placeholder="Type an awesome name"
                />
              </Box>
              <Box>
                <Typography
                  color="white"
                  fontSize="18px"
                  fontWeight={700}
                  fontFamily="Inter"
                >
                  Space Tagline
                </Typography>
                <Input
                  name='tagline'
                  onChange={handleInputChange}
                  sx={{
                    color: 'white',
                    backgroundColor: '#373737',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    width: '100%',
                    fontSize: '15px',
                    fontFamily: 'Inter',
                    '&::after': {
                      borderBottom: 'none',
                    },
                    '&::before': {
                      borderBottom: 'none',
                    },
                    '&:hover:not(.Mui-disabled, .Mui-error):before': {
                      borderBottom: 'none',
                    },
                  }}
                  placeholder="Write a short, one-sentence tagline for your event"
                />
              </Box>
              <Stack spacing="10px">
                <Typography
                  color="white"
                  fontSize="18px"
                  fontWeight={700}
                  fontFamily="Inter"
                >
                  Space Description
                </Typography>
                <Typography color="white" variant="caption">
                  This is a description greeting for new members. You can also
                  update descriptions.
                </Typography>
                <TextEditor
                  holder='Space Description'
                  value={description}
                  setData={setDescription}
                  placeholder="Write a short, one-sentence tagline for your event"
                  sx={{
                    backgroundColor: '#ffffff0d',
                    fontFamily: 'Inter',
                    color: 'white',
                    padding: '12px 12px 12px 80px',
                    borderRadius: '10px',
                  }}
                />
                <Stack direction="row" justifyContent="space-between">
                  <Stack
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '6px',
                      alignItems: 'center',
                    }}
                  >
                    <svg
                      width="20"
                      height="15"
                      viewBox="0 0 20 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_4575_7884)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4.80085 4.06177H2.83984V11.506H4.88327V7.3727L6.82879 10.0394L8.68199 7.3727V11.506H10.6226V4.06177H8.68199L6.82879 6.81714L4.80085 4.06177ZM1.55636 0.794922H18.4436C19.3028 0.794922 20 1.59076 20 2.57247V13.0174C20 13.9989 19.3032 14.7949 18.4436 14.7949H1.55636C0.697166 14.7949 0 13.9991 0 13.0174V2.57247C0 1.59091 0.696805 0.794922 1.55636 0.794922ZM14.0078 4.10603H13.9884V7.92826H12.1206L15 11.506L17.8795 7.90628H15.9347V4.10603H14.0078Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_4575_7884">
                          <rect
                            width="20"
                            height="14"
                            fill="white"
                            transform="translate(0 0.794922)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    <Typography color="white" variant="caption">
                      Markdown Available
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="white">
                    000 Characters Left
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>
          <Box bgcolor="#2d2d2d" borderRadius="10px">
            <Box padding="20px" display="flex" justifyContent="space-between">
              <Typography
                color="white"
                fontSize="18px"
                fontWeight={700}
                fontFamily="Inter"
              >
                Space Avatar & Banner
              </Typography>
            </Box>
            <Stack spacing="10px" padding="20px">
              <Typography
                color="white"
                fontSize="18px"
                fontWeight={700}
                fontFamily="Inter"
              >
                Space Avatar
              </Typography>
              <Typography
                color="white"
                fontSize="13px"
                fontWeight={500}
                fontFamily="Inter"
              >
                Recommend min of 200x200px (1:1 Ratio)
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <Uploader3
                  accept={['.gif', '.jpeg', '.gif']}
                  api={'/api/upload/file'}
                  multiple={false}
                  crop={false} // must be false when accept is svg
                  onChange={(files) => {
                    setAvatar(files[0]);
                  }}
                  onUpload={(file: any) => {
                    setAvatar(file);
                  }}
                  onComplete={(file: any) => {
                    setAvatar(file);
                  }}
                >
                  <Button
                    component="span"
                    sx={{
                      color: 'white',
                      borderRadius: '10px',
                      backgroundColor: '#373737',
                      border: '1px solid #383838',
                    }}
                  >
                    Upload
                  </Button>
                </Uploader3>
                <PreviewFile file={avatar} />
              </Box>
            </Stack>
            <Stack spacing="10px" padding="20px">
              <Typography
                color="white"
                fontSize="18px"
                fontWeight={700}
                fontFamily="Inter"
              >
                Space Banner
              </Typography>
              <Typography
                color="white"
                fontSize="13px"
                fontWeight={500}
                fontFamily="Inter"
              >
                Recommend min of 730x220 (1:1 Ratio)
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <Uploader3
                  accept={['.gif', '.jpeg', '.gif']}
                  api={'/api/upload/file'}
                  multiple={false}
                  crop={false} // must be false when accept is svg
                  onChange={(files) => {
                    setBanner(files[0]);
                  }}
                  onUpload={(file: any) => {
                    setBanner(file);
                  }}
                  onComplete={(file: any) => {
                    setBanner(file);
                  }}
                >
                  <Button
                    component="span"
                    sx={{
                      color: 'white',
                      borderRadius: '10px',
                      backgroundColor: '#373737',
                      border: '1px solid #383838',
                    }}
                  >
                    Upload
                  </Button>
                </Uploader3>
                <PreviewFile file={banner} />
              </Box>
            </Stack>
          </Box>
          <Box display="flex" gap="20px">
            <Button
              sx={{
                color: 'white',
                borderRadius: '10px',
                backgroundColor: '#373737',
                fontSize: '14px',
                padding: '6px 16px',
                border: '1px solid #383838',
                flex: 1,
              }}
              startIcon={<XMarkIcon />}
            >
              Discard
            </Button>
            <Button
              sx={{
                color: '#67DBFF',
                borderRadius: '10px',
                backgroundColor: 'rgba(103, 219, 255, 0.10)',
                fontSize: '14px',
                padding: '6px 16px',
                flex: 1,
                border: '1px solid rgba(103, 219, 255, 0.20)',
              }}
              startIcon={<SpacePlusIcon color="#67DBFF" />}
              onClick={createSpace}
            >
              Create Space
            </Button>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Home;
