import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Stack, Box, useTheme, Typography, Button } from '@mui/material';
import { ZuInput } from '@/components/core';
import TextEditor from '@/components/editor/editor';
import { OutputData } from '@editorjs/editorjs';
import { Uploader3 } from '@lxdao/uploader3';
import { PreviewFile } from '@/components';
import { createConnector } from '@lxdao/uploader3-connector';
import { useCeramicContext } from '@/context/CeramicContext';
import { Space, SpaceData } from '@/types';

const Overview = () => {
  const theme = useTheme();
  const params = useParams();
  const connector = createConnector('NFT.storage', {
    token: process.env.NEXT_PUBLIC_CONNECTOR_TOKEN ?? '',
  });
  const { composeClient } = useCeramicContext();

  const [space, setSpace] = useState<Space>();
  const [name, setName] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const [avatarURL, setAvatarURL] = useState<string | undefined>(
    space ? space.avatar : '',
  );
  const [bannerURL, setBannerURL] = useState<string | undefined>(
    space ? space.banner : '',
  );
  const [description, setDescription] = useState<OutputData>();
  const [editor, setEditorInst] = useState<any>();

  const getSpace = async () => {
    try {
      const response: any = await composeClient.executeQuery(`
        query MyQuery {
          spaceIndex(first: 20) {
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
        const editSpace = fetchedSpaces.filter(
          (space) => space.id === params.spaceid.toString(),
        )[0];
        setSpace(editSpace);
        setName(editSpace.name);
        setDescription(
          JSON.parse(editSpace.description.replaceAll('\\"', '"')),
        );
        setTagline(editSpace.tagline);
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

  return (
    <Stack
      spacing="20px"
      padding="40px"
      sx={{
        width: 'calc(100% - 420px)',
        [theme.breakpoints.down('md')]: {
          width: '100%',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          gap: '20px',
          justifyContent: 'center',
          paddingBottom: '20px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Stack>
            <Typography
              fontSize={'18px'}
              fontWeight={700}
              marginBottom={'10px'}
            >
              Space Name
            </Typography>
            <ZuInput value={name} onChange={(e) => setName(e.target.value)} />
          </Stack>
          <Stack>
            <Typography
              fontSize={'18px'}
              fontWeight={700}
              marginBottom={'10px'}
            >
              Space Tagline
            </Typography>
            <ZuInput
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              multiline
              minRows={3}
            />
            <Stack
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
            >
              <Typography fontSize={'13px'} lineHeight={'120%'} color={'#bbb'}>
                3 characters availale
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: '100%',
        }}
      >
        <Typography fontSize={'18px'} fontWeight={700} lineHeight={'120%'}>
          Space Description
        </Typography>
        <Typography fontSize={'13px'} fontWeight={500} lineHeight={'140%'}>
          This is a description greeting for new members. You can also update
          descriptions.
        </Typography>
        <TextEditor
          holder="space_description"
          placeholder="Write Space Description"
          sx={{
            backgroundColor: '#ffffff0d',
            fontFamily: 'Inter',
            color: 'white',
            padding: '12px 12px 12px 80px',
            borderRadius: '10px',
          }}
          value={description}
          editor={editor}
          setEditorInst={setEditorInst}
        />
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
          <Typography>Markdown Available</Typography>
        </Stack>
      </Box>
      <Box
        sx={{
          alignItems: 'flex-start',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          gap: '30px',
          padding: '20px 0px 0px',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            gap: '10px',
          }}
        >
          <Typography fontSize={'18px'} fontWeight={700} lineHeight={'120%'}>
            Space Avatar
          </Typography>
          <Typography fontSize={'13px'} fontWeight={500} lineHeight={'140%'}>
            200 x 200 Min. (1:1 Ratio) Upload PNG, GIF or JPEG
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
              connector={connector}
              multiple={false}
              crop={false} // must be false when accept is svg
              onComplete={(result: any) => {
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
              file={avatarURL ? avatarURL : space?.avatar}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '100%',
          }}
        >
          <Typography fontSize={'18px'} fontWeight={700} lineHeight={'120%'}>
            Space Main Banner
          </Typography>
          <Typography fontSize={'13px'} fontWeight={500} lineHeight={'140%'}>
            200 x 200 Min. (1:1 Ratio) Upload PNG, GIF or JPEG
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
              connector={connector}
              multiple={false}
              crop={false} // must be false when accept is svg
              onComplete={(result: any) => {
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
              file={bannerURL ? bannerURL : space?.banner}
            />
          </Box>
        </Box>
      </Box>
    </Stack>
  );
};

export default Overview;
