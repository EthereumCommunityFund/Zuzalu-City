import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { ZuInput, ZuButton } from '@/components/core';
import { Uploader3 } from '@lxdao/uploader3';
import { PreviewFile } from '@/components';
import { useCeramicContext } from '@/context/CeramicContext';
import { Space } from '@/types';
import { useUploaderPreview } from '@/components/PreviewFile/useUploaderPreview';
import SuperEditor from '@/components/editor/SuperEditor';
import { useEditorStore } from '@/components/editor/useEditorStore';
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
import { createUrl, createUrlWhenEdit } from '@/services/url';
import { covertNameToUrlName } from '@/utils/format';

const Overview = () => {
  const theme = useTheme();
  const params = useParams();
  const { composeClient } = useCeramicContext();

  const [space, setSpace] = useState<Space>();
  const [name, setName] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const avatarUploader = useUploaderPreview();
  const bannerUploader = useUploaderPreview();
  const router = useRouter();
  const descriptionEditorStore = useEditorStore();

  const getSpace = useCallback(async () => {
    try {
      const response: any = await composeClient.executeQuery(
        `
        query GetSpace($id: ID!) {
          node(id: $id) {
            ...on Space {
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
      `,
        { id: params.spaceid },
      );

      const editSpace: Space = response.data.node as Space;
      setSpace(editSpace);
      setName(editSpace.name);
      avatarUploader.setUrl(editSpace.avatar);
      bannerUploader.setUrl(editSpace.banner);
      console.log(editSpace.description);
      descriptionEditorStore.setValue(editSpace.description);
      setTagline(editSpace.tagline);
    } catch (error) {
      console.error('Failed to fetch spaces:', error);
    }
  }, []);

  const updateSpace = useCallback(
    async (data: {
      id: string;
      name: string;
      tagline: string;
      avatar: string;
      banner: string;
      description: string;
    }) => {
      const { id, name, tagline, avatar, banner, description } = data;
      try {
        const query = `
          mutation UpdateSpace($i: UpdateSpaceInput!) {
            updateSpace(input: $i) {
              document {
                id
              },
            }
          }
        `;
        const variables = {
          i: {
            id,
            content: {
              name,
              tagline,
              avatar,
              banner,
              description,
            },
          },
        };
        await composeClient.executeQuery(query, variables);
        if (name !== space?.name) {
          const urlName = covertNameToUrlName(name);
          await createUrlWhenEdit(urlName, id, 'spaces');
        }
      } catch (error) {
        console.error('Failed to update space:', error);
      }
    },
    [space?.name],
  );

  useEffect(() => {
    getSpace().catch((error) => {
      console.error('An error occurred:', error);
    });
  }, []);

  const save = () => {
    const data = {
      id: space!.id,
      name,
      tagline,
      avatar: avatarUploader.getUrl() as string,
      banner: bannerUploader.getUrl() as string,
      description: descriptionEditorStore.getValueString(),
    };
    console.log('data', data);
    updateSpace(data)
      .then((res) => {
        console.info('Space updated:', res);
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };
  const deleteSpace = async () => {
    try {
      const enableIndexingSpaceMutation = `mutation enableIndexingSpace($input: EnableIndexingSpaceInput!) {
      enableIndexingSpace(input: $input) {
        document {
          id
        }
      }
    }`;
      const response = await composeClient.executeQuery(
        enableIndexingSpaceMutation,
        {
          input: {
            id: params.spaceid,
            shouldIndex: false,
          },
        },
      );
      router.push('/');
    } catch (error) {
      console.error('Failed to update space:', error);
    }
  };
  return (
    <Stack
      spacing="20px"
      padding="40px"
      sx={{ width: '100%', maxWidth: 762, margin: '0 auto', gap: '10px' }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <Stack>
          <Typography fontSize={'18px'} fontWeight={700} marginBottom={'10px'}>
            Space Name
          </Typography>
          <ZuInput
            placeholder="Type an awesome name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Stack>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <Stack sx={{ gap: '10px' }}>
          <Typography fontSize={'18px'} fontWeight={700}>
            Space Tagline
          </Typography>
          <ZuInput
            placeholder="Write a short, one-sentence tagline for your event"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            multiline
            minRows={3}
          />
          <Stack direction="row" justifyContent="flex-end">
            <Typography variant={'caption'} color="white">
              3 characters available
            </Typography>
          </Stack>
        </Stack>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <Typography fontSize={'18px'} fontWeight={700} lineHeight={'120%'}>
          Space Description
        </Typography>
        {/* why?  first render is empty */}
        {descriptionEditorStore.value ? (
          <>
            <SuperEditor
              placeholder="This is a description greeting for new members. You can also update
          descriptions."
              value={descriptionEditorStore.value}
              onChange={(val) => {
                descriptionEditorStore.setValue(val);
              }}
            />
            <Stack direction="row" justifyContent="flex-end">
              <Typography variant={'caption'} color="white">
                {5000 - descriptionEditorStore.length} Characters Left
              </Typography>
            </Stack>
          </>
        ) : (
          <Skeleton
            variant="rectangular"
            height={270}
            sx={{ backgroundColor: '#ffffff0d', borderRadius: '10px' }}
          />
        )}
        {/* <Stack
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
        </Stack> */}
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <Typography fontSize={'18px'} fontWeight={700} lineHeight={'120%'}>
          Space Avatar
        </Typography>
        <Typography fontSize={'13px'} fontWeight={500} lineHeight={'140%'}>
          200 x 200 Min. (1:1 Ratio) Upload PNG, GIF or JPEG
        </Typography>

        <Uploader3
          accept={['.gif', '.jpeg', '.gif', '.png']}
          api={'/api/file/upload'}
          multiple={false}
          crop={{
            size: { width: 400, height: 400 },
            aspectRatio: 1,
          }} // must be false when accept is svg
          onUpload={(file) => {
            avatarUploader.setFile(file);
          }}
          onComplete={(file) => {
            avatarUploader.setFile(file);
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
            Upload Image
          </Button>
        </Uploader3>
        <PreviewFile
          sx={{ width: '150px', height: '150px', borderRadius: '60%' }}
          src={avatarUploader.getUrl()}
          errorMessage={avatarUploader.errorMessage()}
          isLoading={avatarUploader.isLoading()}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <Typography fontSize={'18px'} fontWeight={700} lineHeight={'120%'}>
          Space Main Banner
        </Typography>
        <Typography fontSize={'13px'} fontWeight={500} lineHeight={'140%'}>
          Recommend min of 730x220 Accept PNG GIF or JPEG
        </Typography>

        <Uploader3
          accept={['.gif', '.jpeg', '.gif', '.png']}
          api={'/api/file/upload'}
          multiple={false}
          crop={{
            size: { width: 600, height: 400 },
            aspectRatio: 740 / 200,
          }}
          onUpload={(file) => {
            bannerUploader.setFile(file);
          }}
          onComplete={(file) => {
            bannerUploader.setFile(file);
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
            Upload Image
          </Button>
        </Uploader3>
        <PreviewFile
          sx={{ width: '100%', height: '200px', borderRadius: '10px' }}
          src={bannerUploader.getUrl()}
          errorMessage={bannerUploader.errorMessage()}
          isLoading={bannerUploader.isLoading()}
        />
      </Box>
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
            color: '#67DBFF',
          },
        }}
        startIcon={<SaveAsRoundedIcon />}
        onClick={save}
      >
        Save
      </Button>
      <ZuButton
        sx={{
          color: 'white',
          borderRadius: '10px',
          backgroundColor: 'red',
          fontSize: '14px',
          padding: '6px 16px',
          flex: 1,
          border: '1px solid rgba(103, 219, 255, 0.20)',
          opacity: '1',
          '&:disabled': {
            opacity: '0.6',
            color: '#67DBFF',
          },
        }}
        onClick={() => deleteSpace()}
      >
        Delete Space
      </ZuButton>
    </Stack>
  );
};

export default Overview;
