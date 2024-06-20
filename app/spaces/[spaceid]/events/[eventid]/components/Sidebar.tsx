import * as React from 'react';
import {
  Stack,
  Typography,
  OutlinedInput,
  InputAdornment,
  Box,
  Skeleton,
} from '@mui/material';
import {
  SearchIcon,
  HomeIcon,
  MegaPhoneIcon,
  EventIcon,
  ChevronDownIcon,
} from 'components/icons';
import { useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';

interface SidebarProps {
  spaceId: string;
  title?: string;
  avatar?: string;
  banner?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  spaceId,
  title,
  avatar,
  banner,
}) => {
  const router = useRouter();
  return (
    <Stack
      padding={2}
      direction="column"
      spacing={1}
      width={'280px'}
      bgcolor="#222222"
      height="auto"
      position={'fixed'}
      top={'50px'}
    >
      <div
        style={{
          backgroundImage: `url(${banner})`,
        }}
        className={styles.spaceButton}
      >
        <Stack
          borderRadius="10px"
          padding="10px 14px"
          direction="row"
          spacing="10px"
          alignItems="center"
          sx={{
            cursor: 'pointer',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backgroundColor: 'rgba(34,34,34,0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            component="img"
            width={35}
            height={35}
            borderRadius={'100%'}
            src={avatar || '/1.webp'}
          />
          <Typography
            flex={1}
            variant="subtitleS"
            color="white"
            fontSize={'18px'}
            lineHeight={'22px'}
            sx={{ textWrap: 'wrap' }}
          >
            {title ? (
              title
            ) : (
              <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            )}
          </Typography>
          <ChevronDownIcon size={5} />
        </Stack>
      </div>
      <Stack
        direction="column"
        spacing={0.5}
        paddingY={2}
        borderBottom="1px solid #383838"
        borderTop="1px solid #383838"
      >
        <OutlinedInput
          placeholder="Search"
          sx={{
            backgroundColor: '#222222',
            paddingX: '10px',
            paddingY: '13px',
            borderRadius: '10px',
            height: '35px',
            // border: '1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))',
            fontFamily: 'Inter',
            opacity: 0.7,
            color: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&:hover': {
              backgroundColor:
                'var(--Inactive-White, rgba(255, 255, 255, 0.05))',
            },
          }}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
        <Stack
          direction="row"
          alignItems="center"
          padding={1}
          spacing={1}
          borderRadius="10px"
          onClick={() => router.replace('/')}
          sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#383838' } }}
        >
          <HomeIcon />
          <Typography color="white" variant="bodyBB">
            Home
          </Typography>
        </Stack>
        {/*<Stack*/}
        {/*  direction="row"*/}
        {/*  alignItems="center"*/}
        {/*  padding={1}*/}
        {/*  spacing={1}*/}
        {/*  borderRadius="10px"*/}
        {/*  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#383838' } }}*/}
        {/*>*/}
        {/*  <MegaPhoneIcon />*/}
        {/*  <Typography color="white" variant="bodyBB">*/}
        {/*    Announcements*/}
        {/*  </Typography>*/}
        {/*</Stack>*/}
        <Stack
          direction="row"
          alignItems="center"
          padding={1}
          spacing={1}
          borderRadius="10px"
          onClick={() => router.push('/events')}
          sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#383838' } }}
        >
          <EventIcon />
          <Typography color="white" variant="bodyBB">
            Events
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Sidebar;
