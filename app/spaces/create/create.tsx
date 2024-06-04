'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stack, Box, Typography, Button } from '@mui/material';
import TextEditor from '@/components/editor/editor';
import { ZuInput } from '@/components/core';
import { Header } from './components';
import { XMarkIcon, SpacePlusIcon } from '@/components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import { PreviewFile } from '@/components';
import { createConnector } from '@lxdao/uploader3-connector';
import { Uploader3, SelectedFile } from '@lxdao/uploader3';
import { OutputData } from '@editorjs/editorjs';

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
  const [editor, setEditorInst] = useState<any>();
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
    if (!isAuthenticated) return;
    console.log(ceramic);
    console.log(profile);
    const output = await editor.save();
    let strDesc = JSON.stringify(output);
    strDesc = strDesc.replaceAll('"', '\\"');
    try {
      const update = await composeClient.executeQuery(`
      mutation MyMutation {
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
      console.log(update);
      typeof window !== 'undefined' && window.alert('Success!');
      router.push('/spaces');
    } catch (err) {
      console.log(err);
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
                    000 Characters Left
                  </Typography>
                </Stack>
              </Stack>
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

export default Create;
