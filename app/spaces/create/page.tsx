'use client';
import { useState, useEffect } from "react";
import { Stack, Box, Typography, Button, Input } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextEditor } from "@/components/editor/editor";
import { Header } from "./components";
import BpCheckbox from "@/components/event/Checkbox";
import { ZuButton } from "@/components/core";
import { XMarkIcon, PlusCircleIcon, PlusIcon, SpacePlusIcon } from "@/components/icons";

const Home = () => {
  const [person, setPerson] = useState(true);
  const [online, setOnline] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && file.type.substr(0, 5) === 'image') {
      setImage(file);
    } else {
      setImage(null);
    }
  };

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && file.type.substr(0, 5) === 'image') {
      setBanner(file);
    } else {
      setBanner(null);
    }
  };

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setImagePreview(null);
    }
  }, [image]);

  useEffect(() => {
    if (banner) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(banner);
    } else {
      setBannerPreview(null);
    }
  }, [image]);

  return (
    <Stack>
      <Header />
      <Stack direction="row" justifyContent="center">
        <Box display="flex" flexDirection="column" gap="20px" padding={3} width="800px">
          <Box bgcolor="#2d2d2d" borderRadius="10px">
            <Box
              padding="20px"
              display="flex"
              justifyContent="space-between"
            >
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
              <Box>
                <Typography
                  color="white"
                  fontSize="18px"
                  fontWeight={700}
                  fontFamily="Inter"
                >
                  Space Description
                </Typography>
                <Typography
                  color="white"
                  variant="caption"
                >
                  This is a description greeting for new members. You can also update descriptions.
                </Typography>
                <TextEditor
                  holder="Write"
                  placeholder="Write a short, one-sentence tagline for your event"
                  sx={{
                    backgroundColor: '#ffffff0d',
                    fontFamily: 'Inter',
                    color: 'white',
                    padding: '12px 12px 12px 80px',
                    borderRadius: '10px',
                  }}
                />
              </Box>
            </Box>
          </Box>
          <Box bgcolor="#2d2d2d" borderRadius="10px">
            <Box
              padding="20px"
              display="flex"
              justifyContent="space-between"
            >
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
              <Input
                type="file"
                onChange={handleImageChange}
                sx={{ display: 'none' }}
                id="image-button-file"
              />
              <Box component="label" htmlFor="image-button-file">
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
              </Box>
              {imagePreview ? (
                <Box
                  component="img"
                  src={imagePreview}
                  width="200px"
                  height="200px"
                />
              ) : (
                <Box
                  width="200px"
                  height="200px"
                  bgcolor="#373737"
                  borderRadius="50%"
                />
              )}
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
              <Input
                type="file"
                onChange={handleBannerChange}
                sx={{ display: 'none' }}
                id="banner-button-file"
              />
              <Box component="label" htmlFor="banner-button-file">
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
              </Box>
              {bannerPreview ? (
                <Box
                  component="img"
                  src={bannerPreview}
                  width="200px"
                  height="200px"
                />
              ) : (
                <Box
                  height="200px"
                  bgcolor="#373737"
                  borderRadius="10px"
                />
              )}
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
                flex: 1
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
                border: '1px solid rgba(103, 219, 255, 0.20)'
              }}
              startIcon={<SpacePlusIcon color="#67DBFF" />}
            >
              Create Space
            </Button>
          </Box>
        </Box>
      </Stack>
    </Stack>
  )
}

export default Home;