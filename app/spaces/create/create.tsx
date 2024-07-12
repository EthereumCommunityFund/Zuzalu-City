'use client';
import React, { useState, useRef } from 'react';
import {
  Stack,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  TextField,
} from '@mui/material';
import * as yup from 'yup';
import TextEditor from '@/components/editor/editor';
import { ZuInput } from '@/components/core';
import { Header } from './components';
import { XMarkIcon, SpacePlusIcon } from '@/components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import { PreviewFile } from '@/components';
import { OutputData } from '@editorjs/editorjs';
import { SOCIAL_TYPES, SPACE_CATEGORIES } from '@/constant';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useRouter } from 'next/navigation';

const validationSchema = yup.object({
  name: yup.string().required('Name is required.'),
  tagline: yup.string().required('Tagline is required.'),
  categories: yup
    .array()
    .min(1, 'Categories are required.')
    .max(15, 'Categories select up to 15 items.')
    .required('Categories are required.'),
});

const Create = () => {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const [avatarURL, setAvatarURL] = useState<string>();
  const [bannerURL, setBannerURL] = useState<string>();
  const [description, setDescription] = useState<OutputData>();
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState<number[]>([0]);
  const [customLinks, setCustomLinks] = useState<number[]>([0]);

  const { ceramic, composeClient, isAuthenticated, profile } =
    useCeramicContext();

  const profileId = profile?.id || '';
  const adminId = ceramic?.did?.parent || '';
  const socialLinksRef = useRef<HTMLDivElement>(null);
  const customLinksRef = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState('');
  const [uploading, setUploading] = useState(false);
  const inputFile = useRef<HTMLInputElement>(null);

  const uploadFile = async (fileToUpload: File, image: string) => {
    try {
      setUploading(true);
      const data = new FormData();
      data.set('file', fileToUpload);
      const res = await fetch('/api/pinata', {
        method: 'POST',
        body: data,
      });
      const resData = await res.json();
      if (image === 'Avatar') {
        setAvatarURL(resData.url);
      } else {
        setBannerURL(resData.url);
      }
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert('Trouble uploading file');
    }
  };

  const handleImageChange = (e: any) => {
    setFile(e.target.files[0]);
    uploadFile(e.target.files[0], e.target.id);
  };

  const createSpace = async () => {
    let strDesc: any = JSON.stringify(description);

    if (!description || !description.blocks || description.blocks.length == 0) {
      setError('Description is required.');
      return;
    }
    strDesc = strDesc.replaceAll('"', '\\"');

    let socialLinks = {};
    let customLinks = [];
    if (
      socialLinksRef.current &&
      socialLinksRef &&
      socialLinksRef.current.children.length > 2
    ) {
      for (let i = 0; i < socialLinksRef.current.children.length - 2; i++) {
        const key =
          socialLinksRef.current.children[i + 1].children[0].querySelector(
            'input',
          )?.value;
        const value =
          socialLinksRef.current.children[i + 1].children[1].querySelector(
            'input',
          )?.value;
        if (key) {
          socialLinks = { ...socialLinks, [key]: value };
        }
      }
    }

    if (
      customLinksRef.current &&
      customLinksRef &&
      customLinksRef.current.children.length > 2
    ) {
      for (let i = 0; i < customLinksRef.current.children.length - 2; i++) {
        const key =
          customLinksRef.current.children[i + 1].children[0].querySelector(
            'input',
          )?.value;
        const value =
          customLinksRef.current.children[i + 1].children[1].querySelector(
            'input',
          )?.value;
        if (key) {
          customLinks.push({
            links: value,
            title: key,
          });
        }
      }
    }

    if (!isAuthenticated) return;

    try {
      await validationSchema.validate({
        name: name,
        tagline: tagline,
        categories: categories,
      });
      await composeClient.executeQuery(
        `
      mutation CreateSpaceMutation($input: CreateSpaceInput!) {
        createSpace(
          input: $input
        ) {
          document {
            id
            name
            description
            admin {
              id
            }
            profileId
            avatar
            banner
            category
          }
        }
      }
      `,
        {
          input: {
            content: {
              customLinks,
              ...socialLinks,
              name: name,
              description: strDesc,
              tagline: tagline,
              admin: adminId,
              profileId: profileId,
              avatar:
                avatarURL ||
                'https://nftstorage.link/ipfs/bafybeifcplhgttja4hoj5vx4u3x7ucft34acdpiaf62fsqrobesg5bdsqe',
              banner:
                bannerURL ||
                'https://nftstorage.link/ipfs/bafybeifqan4j2n7gygwkmekcty3dsp7v4rxbjimpo7nrktclwxgxreiyay',
              category: categories.join(', '),
            },
          },
        },
      );
      typeof window !== 'undefined' &&
        window.alert(
          'Submitted! Create process probably complete after few minute. Please check it in Space List page.',
        );
      router.push('/spaces');
    } catch (err: any) {
      console.log(err);
      if (err.message) {
        setError(err.message);
      }
    }
  };

  const handleChange = (e: any) => {
    setCategories(
      typeof e.target.value === 'string'
        ? e.target.value.split(',')
        : e.target.value,
    );
  };

  const handleAddSocialLink = () => {
    if (socialLinks.length === 0) {
      setSocialLinks([0]);
      return;
    }
    const nextItem = Math.max(...socialLinks);
    const temp = [...socialLinks, nextItem + 1];
    setSocialLinks(temp);
  };

  const handleRemoveSociaLink = (index: number) => {
    const temp = socialLinks.filter((item) => item !== index);
    setSocialLinks(temp);
  };

  const handleAddCustomLink = () => {
    if (customLinks.length === 0) {
      setCustomLinks([0]);
      return;
    }
    const nextItem = Math.max(...customLinks);
    const temp = [...customLinks, nextItem + 1];
    setCustomLinks(temp);
  };

  const handleRemoveCustomLink = (index: number) => {
    const temp = customLinks.filter((item) => item !== index);
    setCustomLinks(temp);
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
              <Typography variant="subtitleMB" color="text.secondary">
                Space Profile
              </Typography>
            </Box>
            <Box
              padding="20px"
              display="flex"
              flexDirection="column"
              gap="20px"
            >
              <Box display={'flex'} flexDirection={'column'} gap={'10px'}>
                <Typography variant="subtitle2" color="white">
                  Space Name*
                </Typography>
                <ZuInput
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Type an awesome name"
                />
              </Box>
              <Box display={'flex'} flexDirection={'column'} gap={'10px'}>
                <Typography variant="subtitle2" color="white">
                  Space Tagline*
                </Typography>
                <ZuInput
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Write a short, one-sentence tagline for your event"
                />
              </Box>
              <Stack spacing="10px">
                <Typography variant="subtitleSB" color="white">
                  Space Description*
                </Typography>
                <Typography color="white" variant="caption">
                  This is a description greeting for new members. You can also
                  update descriptions.
                </Typography>
                <TextEditor
                  holder="space_description"
                  value={description}
                  setData={setDescription}
                  sx={{
                    backgroundColor: '#ffffff0d',
                    fontFamily: 'Inter',
                    color: 'white',
                    padding: '12px 12px 12px 80px',
                    borderRadius: '10px',
                    height: 'auto',
                    minHeight: '270px',
                    overflow: 'auto',
                    '& > div > div': {
                      paddingBottom: '0px !important',
                    },
                  }}
                />
                <Stack direction="row" justifyContent="space-between">
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
                    <Typography color="white" variant="caption">
                      Markdown Available
                    </Typography>
                  </Stack> */}
                  <Typography variant="caption" color="white">
                    {5000 -
                      (description
                        ? description.blocks
                            .map((item) => item.data.text.length)
                            .reduce((prev, current) => prev + current, 0)
                        : 0)}{' '}
                    Characters Left
                  </Typography>
                </Stack>
              </Stack>
              <Box display={'flex'} flexDirection={'column'} gap={'20px'}>
                <Box>
                  <Typography
                    color="white"
                    fontSize="18px"
                    fontWeight={700}
                    fontFamily="Inter"
                  >
                    Community Categories (Max: 15)*
                  </Typography>
                  <Typography
                    color="white"
                    variant="caption"
                    sx={{ opacity: '0.6' }}
                  >
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
                          backgroundColor: '#222222',
                        },
                      },
                    }}
                  >
                    {SPACE_CATEGORIES.map((category, index) => {
                      return (
                        <MenuItem value={category.value} key={index}>
                          {category.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Box>
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  gap={'10px'}
                  flexWrap={'wrap'}
                >
                  {categories.map((category, index) => {
                    return (
                      <Chip
                        label={
                          SPACE_CATEGORIES.find(
                            (item) => item.value === category,
                          )?.label
                        }
                        sx={{
                          borderRadius: '10px',
                        }}
                        onDelete={() => {
                          const newArray = categories.filter(
                            (item) => item !== category,
                          );
                          setCategories(newArray);
                        }}
                        key={index}
                      />
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Box>
          <Box bgcolor="#2d2d2d" borderRadius="10px">
            <Box padding="20px" display="flex" justifyContent="space-between">
              <Typography variant="subtitleSB" color="white">
                Space Avatar & Banner
              </Typography>
            </Box>
            <Stack spacing="10px" padding="20px">
              <Typography variant="subtitleSB" color="white">
                Space Avatar
              </Typography>
              <Typography variant="bodyS" color="white">
                Recommend min of 200x200px (1:1 Ratio)
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <ZuInput
                  type="file"
                  id="Avatar"
                  ref={inputFile}
                  onChange={handleImageChange}
                />
                {/*<Button
                  disabled={uploading}
                  onClick={() => inputFile.current && inputFile.current.click()}
                  sx={{
                    color: 'white',
                    borderRadius: '10px',
                    backgroundColor: '#373737',
                    border: '1px solid #383838',
                  }}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>*/}
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
              <Typography variant="subtitleSB" color="white">
                Space Banner
              </Typography>
              <Typography variant="bodyS" color="white">
                Recommend min of 730x220 (1:1 Ratio)
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <ZuInput
                  type="file"
                  id="Banner"
                  ref={inputFile}
                  onChange={handleImageChange}
                />
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

            <Box
              padding={'20px'}
              display={'flex'}
              flexDirection={'column'}
              gap={'30px'}
              ref={socialLinksRef}
            >
              <Typography
                fontSize={'18px'}
                fontWeight={700}
                lineHeight={'120%'}
                color={'white'}
              >
                Social Links
              </Typography>
              {socialLinks.map((item, index) => {
                return (
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    gap={'20px'}
                    key={index}
                  >
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      gap={'10px'}
                      flex={1}
                    >
                      <Typography
                        fontSize={'16px'}
                        fontWeight={700}
                        color={'white'}
                      >
                        Select Social
                      </Typography>
                      <Select
                        placeholder="Select"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              backgroundColor: '#222222',
                            },
                          },
                        }}
                        sx={{
                          '& > div': {
                            padding: '8.5px 12px',
                            borderRadius: '10px',
                          },
                        }}
                      >
                        {SOCIAL_TYPES.map((social, index) => {
                          return (
                            <MenuItem value={social.key} key={index}>
                              {social.value}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </Box>
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      gap={'10px'}
                      flex={1}
                    >
                      <Typography
                        fontSize={'16px'}
                        fontWeight={700}
                        color={'white'}
                      >
                        URL
                      </Typography>
                      <TextField
                        variant="outlined"
                        placeholder="https://"
                        sx={{
                          opacity: '0.6',
                          '& > div > input': {
                            padding: '8.5px 12px',
                          },
                        }}
                      />
                    </Box>
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      justifyContent={'flex-end'}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleRemoveSociaLink(item)}
                    >
                      <Box
                        sx={{
                          borderRadius: '10px',
                          width: '40px',
                          height: '40px',
                          padding: '10px 14px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                        }}
                      >
                        <CancelIcon />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
              <Button
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '10px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  textTransform: 'unset',
                  color: 'white',
                }}
                onClick={handleAddSocialLink}
              >
                <AddCircleIcon />
                <Typography color="white">Add Social Link</Typography>
              </Button>
            </Box>
            <Box
              padding={'20px'}
              display={'flex'}
              flexDirection={'column'}
              gap={'30px'}
              borderTop={'1px solid rgba(255, 255, 255, 0.10)'}
              ref={customLinksRef}
            >
              <Typography
                fontSize={'18px'}
                fontWeight={700}
                lineHeight={'120%'}
                color={'white'}
              >
                Custom Links
              </Typography>
              {customLinks.map((item, index) => {
                return (
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    gap={'20px'}
                    key={index}
                  >
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      gap={'10px'}
                      flex={1}
                    >
                      <Typography
                        fontSize={'16px'}
                        fontWeight={700}
                        color={'white'}
                      >
                        Link Title
                      </Typography>
                      <TextField
                        variant="outlined"
                        placeholder="Type a name"
                        sx={{
                          '& > div > input': {
                            padding: '8.5px 12px',
                          },
                          opacity: '0.6',
                        }}
                      />
                    </Box>
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      gap={'10px'}
                      flex={1}
                    >
                      <Typography
                        fontSize={'16px'}
                        fontWeight={700}
                        color={'white'}
                      >
                        URL
                      </Typography>
                      <TextField
                        variant="outlined"
                        placeholder="https://"
                        sx={{
                          '& > div > input': {
                            padding: '8.5px 12px',
                          },
                          opacity: '0.6',
                        }}
                      />
                    </Box>
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      justifyContent={'flex-end'}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleRemoveCustomLink(item)}
                    >
                      <Box
                        sx={{
                          borderRadius: '10px',
                          width: '40px',
                          height: '40px',
                          padding: '10px 14px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                        }}
                      >
                        <CancelIcon />
                      </Box>
                    </Box>
                  </Box>
                );
              })}

              <Button
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '10px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  textTransform: 'unset',
                }}
                onClick={handleAddCustomLink}
              >
                <AddCircleIcon />
                <Typography color="white">Add Custom Link</Typography>
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
                  color: '#67DBFF',
                },
              }}
              startIcon={<SpacePlusIcon color="#67DBFF" />}
              disabled={!name}
              onClick={createSpace}
            >
              Create Space
            </Button>
          </Box>
          {error && (
            <Typography color={'red'} textAlign={'end'}>
              {error}
            </Typography>
          )}
        </Box>
      </Stack>
    </Stack>
  );
};

export default Create;
