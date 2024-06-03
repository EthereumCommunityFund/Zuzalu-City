'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stack, Box, Typography, Button } from '@mui/material';
import React, { useState, ChangeEvent } from 'react';
import { Stack, Box, Typography, Button, Input, Select, MenuItem, OutlinedInput, Chip, IconButton, TextField } from '@mui/material';
import TextEditor from '@/components/editor/editor';
import { ZuInput } from '@/components/core';
import { Header } from './components';
import { XMarkIcon, SpacePlusIcon } from '@/components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import { PreviewFile } from '@/components';
import { createConnector } from '@lxdao/uploader3-connector';
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

const Create = () => {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const [avatar, setAvatar] = useState<SelectedFile>();
  const [avatarURL, setAvatarURL] = useState<string>();
  const [banner, setBanner] = useState<SelectedFile>();
  const [bannerURL, setBannerURL] = useState<string>();
  // const [description, setDescription] = useState<string>('');
  const [description, setDescription] = useState<OutputData>();
  const [error, setError] = useState(false);
  const [editor, setEditorInst] = useState<any>();
  const [categories, setCategories] = useState<string[]>([]);

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

  const connector = createConnector('NFT.storage', {
    token: process.env.CONNECTOR_TOKEN ?? ''
  });

  const profileId = profile?.id || '';
  const adminId = ceramic?.did?.parent || '';

  const createSpace = async () => {
    // if (!isAuthenticated) return;
    const output = await editor.save();
    let strDesc: any = JSON.stringify(output);
    if (!strDesc.blocks || strDesc.blocks.length == 0) {
      setError(true);
      return;
    }
    strDesc = strDesc.replaceAll('"', '\\"');
    console.log('strDesc: ', strDesc);
    try {
      const update = await composeClient.executeQuery(`
      mutation {
        createSpace(
          input: {
            content: {
              name: "${name}",
              description: "${strDesc}",
              tagline: "${tagline}",
              admin: "${adminId}",
              profileId: "${profileId}",
              avatar: "${avatarURL}",
              banner: "${bannerURL}"
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
      typeof window !== 'undefined' && window.alert('Success!');
      router.push('/spaces');
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e: any) => {
    console.log(e.target.value)
    setCategories(
      typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value,
    );
  }

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
                variant="subtitleSB"
                color="white"
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
              <Stack spacing="10px">
                <Typography
                  variant="subtitleSB"
                  color="white"
                >
                  Space Name
                </Typography>
                <ZuInput
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Type an awesome name"
                />
              </Stack>
              <Stack spacing="10px">
                <Typography
                  variant="subtitleSB"
                  color="white"
                >
                  Space Tagline
                </Typography>
                <ZuInput
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Write a short, one-sentence tagline for your event"
                />
              </Stack>
              <Stack spacing="10px">
                <Typography
                  variant="subtitleSB"
                  color="white"
                >
                  Space Description
                </Typography>
                <Typography color="white" variant="caption">
                  This is a description greeting for new members. You can also
                  update descriptions.
                </Typography>
                <TextEditor
                  holder="space_description"
                  value={description}
                  editor={editor}
                  setEditorInst={setEditorInst}
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
                    1000 Characters Left
                  </Typography>
                </Stack>
              </Stack>
              <Box
                display={'flex'}
                flexDirection={'column'}
                gap={'20px'}
              >
                <Box>
                  <Typography
                    color="white"
                    fontSize="18px"
                    fontWeight={700}
                    fontFamily="Inter"
                  >
                    Community Categories
                  </Typography>
                  <Typography color="white" variant="caption" sx={{ opacity: '0.6' }}>
                    Search or create categories related to your space
                  </Typography>
                </Box>
                <Box>
                  <Select
                    multiple
                    value={categories}
                    style={{ width: '100%' }}
                    onChange={handleChange}
                    input={<OutlinedInput label="Name" />}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          backgroundColor: '#222222'
                        }
                      }
                    }}
                  >
                    {
                      SPACE_CATEGORIES.map((category, index) => {
                        return (
                          <MenuItem
                            value={category.value}
                            key={index}
                          >
                            {
                              category.label
                            }
                          </MenuItem>
                        )
                      })
                    }
                  </Select>
                </Box>
                <Box display={'flex'} flexDirection={'row'} gap={'10px'} flexWrap={'wrap'}>
                  {
                    categories.map((category, index) => {
                      return (
                        <Chip
                          label={SPACE_CATEGORIES.find((item) => item.value === category)?.label}
                          sx={{
                            borderRadius: '10px'
                          }}
                          onDelete={
                            () => {
                              const newArray = categories.filter((item) => item !== category);
                              setCategories(newArray)
                            }
                          }
                          key={index}
                        />
                      )
                    })
                  }
                </Box>
              </Box>
            </Box>
          </Box>
          <Box bgcolor="#2d2d2d" borderRadius="10px">
            <Box padding="20px" display="flex" justifyContent="space-between">
              <Typography
                variant="subtitleSB"
                color="white"
              >
                Space Avatar & Banner
              </Typography>
            </Box>
            <Stack spacing="10px" padding="20px">
              <Typography
                variant="subtitleSB"
                color="white"
              >
                Space Avatar
              </Typography>
              <Typography
                variant="bodyS"
                color="white"
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
                  accept={['.gif', '.jpeg', '.jpg']}
                  // api={'/api/upload/file'}
                  connector={connector}
                  multiple={false}
                  crop={false} // must be false when accept is svg
                  onChange={(files) => {
                    setAvatar(files[0]);
                  }}
                  onUpload={(result: any) => {
                    console.log('upload', result);
                    setAvatar(result);
                  }}
                  onComplete={(result: any) => {
                    console.log('complete', result);
                    setAvatarURL(result?.url);
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
                <PreviewFile
                  sx={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '60%',
                  }}
                  file={avatarURL}
                />
              </Box>
            </Stack>
            <Stack spacing="10px" padding="20px">
              <Typography
                variant="subtitleSB"
                color="white"
              >
                Space Banner
              </Typography>
              <Typography
                variant="bodyS"
                color="white"
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
                  accept={['.gif', '.jpeg', '.jpg']}
                  // api={'/api/upload/file'}
                  connector={connector}
                  multiple={false}
                  crop={false} // must be false when accept is svg
                  onChange={(files) => {
                    setBanner(files[0]);
                  }}
                  onUpload={(file: any) => {
                    setBanner(file);
                  }}
                  onComplete={(result: any) => {
                    console.log('banner', result)
                    setBannerURL(result?.url);
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
                <PreviewFile
                  sx={{ width: '100%', height: '200px', borderRadius: '10px' }}
                  file={bannerURL}
                />
              </Box>
            </Stack>
          </Box>
          <Box bgcolor="#2d2d2d" borderRadius="10px">
            <Box padding="20px" display="flex" justifyContent="space-between">
              <Typography
                color="white"
                fontSize="18px"
                fontWeight={700}
                fontFamily="Inter"
              >
                Links
              </Typography>
            </Box>
            <Box padding={'20px'} display={'flex'} flexDirection={'column'} gap={'30px'}>
              <Typography fontSize={'18px'} fontWeight={700} lineHeight={'120%'} color={'white'}>
                Social Links
              </Typography>
              <Box display={'flex'} flexDirection={'row'} gap={'20px'}>
                <Box display={'flex'} flexDirection={'column'} gap={'10px'} flex={1}>
                  <Typography fontSize={'16px'} fontWeight={700} color={'white'}>Select Social</Typography>
                  <Select
                    placeholder='Select'
                    MenuProps={{
                      PaperProps: {
                        style: {
                          backgroundColor: '#222222'
                        }
                      }
                    }}
                    sx={{
                      '& > div': {
                        padding: '8.5px 12px',
                        borderRadius: '10px'
                      },
                    }}
                  >
                  </Select>
                </Box>
                <Box display={'flex'} flexDirection={'column'} gap={'10px'} flex={1}>
                  <Typography fontSize={'16px'} fontWeight={700} color={'white'}>URL</Typography>
                  <TextField variant="outlined" placeholder='https://' sx={{
                    opacity: '0.6',
                    '& > div > input': {
                      padding: '8.5px 12px'
                    }
                  }} />
                </Box>
                <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-end'}>
                  <Box sx={{ borderRadius: '10px', width: '40px', height: '40px', padding: '10px 14px', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <CancelIcon />
                  </Box>
                </Box>
              </Box>
              <Button
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '10px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  textTransform: 'unset',
                  color: 'white'
                }}
              >
                <AddCircleIcon />
                <Typography color='white'>Add Social Link</Typography>
              </Button>
            </Box>
            <Box padding={'20px'} display={'flex'} flexDirection={'column'} gap={'30px'} borderTop={'1px solid rgba(255, 255, 255, 0.10)'}>
              <Typography fontSize={'18px'} fontWeight={700} lineHeight={'120%'} color={'white'}>
                Custom Links
              </Typography>
              <Box display={'flex'} flexDirection={'row'} gap={'20px'}>
                <Box display={'flex'} flexDirection={'column'} gap={'10px'} flex={1}>
                  <Typography fontSize={'16px'} fontWeight={700} color={'white'}>Link Title</Typography>
                  <TextField variant="outlined" placeholder='Type a name' sx={{
                    '& > div > input': {
                      padding: '8.5px 12px'
                    },
                    opacity: '0.6'
                  }} />
                </Box>
                <Box display={'flex'} flexDirection={'column'} gap={'10px'} flex={1}>
                  <Typography fontSize={'16px'} fontWeight={700} color={'white'}>URL</Typography>
                  <TextField variant="outlined" placeholder='https://' sx={{
                    '& > div > input': {
                      padding: '8.5px 12px'
                    },
                    opacity: '0.6'
                  }} />
                </Box>
                <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-end'}>
                  <Box sx={{ borderRadius: '10px', width: '40px', height: '40px', padding: '10px 14px', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <CancelIcon />
                  </Box>
                </Box>
              </Box>
              <Button
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '10px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  textTransform: 'unset'
                }}
              >
                <AddCircleIcon />
                <Typography color='white'>Add Custom Link</Typography>
              </Button>
            </Box>
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
                opacity: '1',
                '&:disabled': {
                  opacity: '0.6',
                  color: '#67DBFF'
                }
              }}
              startIcon={<SpacePlusIcon color="#67DBFF" />}
              disabled={!name}
              onClick={createSpace}
            >
              Create Space
            </Button>
          </Box>
          {
            error && <Typography color={'red'} textAlign={'end'}>Please check Description.</Typography>
          }
        </Box>
      </Stack>
    </Stack>
  );
};

export default Create;
