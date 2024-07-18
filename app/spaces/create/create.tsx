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
  ListItemText,
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
import Checkbox from '@mui/material/Checkbox';
import VisuallyHiddenInput from '@/components/input/VisuallyHiddenInput';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import SelectCheckItem from '@/components/select/selectCheckItem';
import SelectCategories from '@/components/select/selectCategories';

const validationSchema = yup.object({
  name: yup
    .string()
    .min(3, 'Name must be at least 3 characters.')
    .required('Name is required.'),
  tagline: yup
    .string()
    .min(3, 'Tagline must be at least 3 characters.')
    .required('Tagline is required.'),
  categories: yup
    .array()
    .min(1, 'Categories are required.')
    .max(15, 'Categories select up to 15 items.')
    .required('Categories are required.'),
});

const Create = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const [avatarURL, setAvatarURL] = useState<string>();
  const [bannerURL, setBannerURL] = useState<string>();
  const [description, setDescription] = useState<OutputData>();
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState<number[]>([0]);
  const [customLinks, setCustomLinks] = useState<number[]>([0]);
  const [submitting, setSubmitting] = useState(false);

  const { ceramic, composeClient, isAuthenticated, profile } =
    useCeramicContext();

  const profileId = profile?.id || '';
  const adminId = ceramic?.did?.parent || '';
  const socialLinksRef = useRef<HTMLDivElement>(null);
  const customLinksRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState({
    avatar: false,
    banner: false,
  });

  const uploadFile = async (fileToUpload: File, type: string) => {
    try {
      setUploading((v) => ({
        ...v,
        [type]: true,
      }));
      const data = new FormData();
      data.set('file', fileToUpload);
      const res = await fetch('/api/pinata', {
        method: 'POST',
        body: data,
      });
      const resData = await res.json();
      if (type === 'avatar') {
        setAvatarURL(resData.url);
      } else {
        setBannerURL(resData.url);
      }
    } catch (e) {
      console.log(e);
      alert('Trouble uploading file');
    } finally {
      setUploading((v) => ({
        ...v,
        [type]: false,
      }));
    }
  };

  const handleImageChange = (e: any, type: string) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadFile(file, type);
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
      setSubmitting(true);
      await validationSchema.validate({
        name: name,
        tagline: tagline,
        categories: categories,
      });
      const result = await composeClient.executeQuery(
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
      if (result.errors?.length) {
        throw new Error('Error creating space.');
      }
      setShowModal(true);
    } catch (err: any) {
      console.log(err);
      if (err.message) {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (value: string[]) => {
    setCategories(value);
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
      <Dialog
        title="Space Created"
        message="Create process probably complete after few minute. Please check it in Space List page."
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false);
          router.push('/spaces');
        }}
      />
      <Header />
      <Stack direction="row" justifyContent="center">
        <Box
          display="flex"
          flexDirection="column"
          gap="20px"
          padding={'24px'}
          width="762px"
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
              gap="30px"
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
                <Typography variant="subtitle2" color="white">
                  Space Description*
                </Typography>
                <Typography color="text.secondary" variant="body2">
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
                    padding: '12px',
                    borderRadius: '10px',
                    height: 'auto',
                    minHeight: '270px',
                  }}
                />
                <Stack direction="row" justifyContent="flex-end">
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
                  <Typography variant="subtitle2" color="white">
                    Community Tags (Max: 15)*
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Search or create categories related to your space
                  </Typography>
                </Box>
                <Box>
                  <SelectCategories onChange={handleChange} />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box bgcolor="#2d2d2d" borderRadius="10px">
            <Box padding="20px" display="flex" justifyContent="space-between">
              <Typography variant="subtitleMB" color="text.secondary">
                Space Avatar & Banner
              </Typography>
            </Box>
            <Stack spacing="10px" padding="20px">
              <Typography variant="subtitle2" color="white">
                Space Avatar
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Recommend min of 200x200px (1:1 Ratio)
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <Button
                  component="label"
                  tabIndex={-1}
                  disabled={uploading.avatar}
                  sx={{
                    color: 'white',
                    borderRadius: '10px',
                    backgroundColor: '#373737',
                    border: '1px solid #383838',
                    width: '140px',
                  }}
                >
                  {uploading.avatar ? 'Uploading...' : 'Upload Image'}
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(e) => handleImageChange(e, 'avatar')}
                  />
                </Button>
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
              <Typography variant="subtitle2" color="white">
                Space Banner
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Recommend min of 730x220 Accept PNG GIF or JPEG
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <Button
                  component="label"
                  tabIndex={-1}
                  disabled={uploading.banner}
                  sx={{
                    color: 'white',
                    borderRadius: '10px',
                    backgroundColor: '#373737',
                    border: '1px solid #383838',
                    width: '140px',
                  }}
                >
                  {uploading.banner ? 'Uploading...' : 'Upload Image'}
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(e) => handleImageChange(e, 'banner')}
                  />
                </Button>
                <PreviewFile
                  sx={{ width: '100%', height: '200px', borderRadius: '10px' }}
                  file={bannerURL}
                />
              </Box>
            </Stack>
          </Box>
          <Box bgcolor="#2d2d2d" borderRadius="10px">
            <Box padding="20px" display="flex" justifyContent="space-between">
              <Typography variant="subtitleMB" color="text.secondary">
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
              <Typography variant="subtitleSB" color="text.secondary">
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
                      <Typography variant="subtitle2" color="white">
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
                      <Typography variant="subtitle2" color="white">
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
                        <CancelIcon sx={{ fontSize: 20 }} />
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
                <Typography variant="buttonMSB" color="white">
                  Add Social Link
                </Typography>
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
              <Typography variant="subtitleSB" color="text.secondary">
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
                      <Typography variant="subtitle2" color="white">
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
                      <Typography variant="subtitle2" color="white">
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
                        <CancelIcon sx={{ fontSize: 20 }} />
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
                <Typography variant="buttonMSB" color="white">
                  Add Custom Link
                </Typography>
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
              startIcon={<XMarkIcon size={5} />}
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
              disabled={!name || submitting}
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
