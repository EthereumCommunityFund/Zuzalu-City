import {
  BoltIcon,
  EventIcon,
  HomeIcon,
  MenuIcon,
  SpaceIcon,
  SpacePlusIcon,
} from '@/components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import {
  Box,
  Button,
  Drawer,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

interface PropTypes {
  open: boolean;
  onClose: () => void;
  selected: string;
}

export default function SidebarDrawer({ open, onClose, selected }: PropTypes) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useCeramicContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const naviButtons = [
    {
      content: 'Home',
      icon: <HomeIcon />,
      function: () => {
        router.push('/');
        onClose();
      },
    },
    {
      content: 'Spaces',
      icon: <SpaceIcon />,
      function: () => {
        router.push('/spaces');
        onClose();
      },
    },
    {
      content: 'Events',
      icon: <EventIcon />,
      function: () => {
        router.push('/events');
        onClose();
      },
    },
    // {
    //     content: 'Zapps',
    //     icon: <BoltIcon />,
    //     function: () => {
    //         onClose();
    //     }
    // }
  ];

  const spaces = [
    {
      src: '/0.webp',
      content: 'Zuzalu City Contributors',
      function: () => {
        router.push('/spaces/123');
        onClose();
      },
    },
    {
      src: '/0.webp',
      content: 'FendiWeb3',
      function: () => {
        router.push('/spaces/123');
        onClose();
      },
    },
    {
      src: '/0.webp',
      content: 'Green Odin',
      function: () => {
        router.push('/spaces/123');
        onClose();
      },
    },
  ];
  return (
    <Drawer open={open} onClose={onClose}>
      <Box
        sx={{
          width: '260px',
          height: '100vh',
          position: 'sticky',
          top: '50px',
          transitionProperty: 'width',
          transitionDuration: '300',
          transitionTimingFunction: 'ease-in-out',
          backgroundColor: '#2d2d2d',
          padding: '10px',
          borderRight: '1px solid rgb(58, 60, 62)',
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap="10px"
          sx={{ cursor: 'pointer' }}
        >
          <Button
            sx={{
              padding: '10px',
              width: '40px',
              minWidth: 'unset',
            }}
          >
            <MenuIcon />
          </Button>

          <Box
            component="img"
            src={isMobile ? '/ZuCityLogo-IconOnly.svg' : '/ZuCityLogo.svg'}
            height="40px"
          />
        </Box>
        <Box display="flex" flexDirection="column" paddingY="20px" gap="15px">
          {naviButtons.map((item, index) => {
            return (
              <Box
                display="flex"
                padding="10px"
                alignItems="center"
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#383838' } }}
                bgcolor={
                  pathname.split('/')[1] === item.content.toLowerCase()
                    ? '#383838'
                    : 'transparent'
                }
                gap="10px"
                borderRadius="10px"
                onClick={item.function}
                key={index}
              >
                {item.icon}
                <Typography color="white" variant="bodyMB">
                  {item.content}
                </Typography>
              </Box>
            );
          })}
        </Box>
        {isAuthenticated && (
          <Box
            display="flex"
            flexDirection="column"
            gap="15px"
            sx={{
              borderTop: '1px solid #383838',
              marginX: '10px',
              paddingTop: '0px',
            }}
          >
            {/*<Typography*/}
            {/*    color="white"*/}
            {/*    variant="bodyS"*/}
            {/*    marginTop="15px"*/}
            {/*>*/}
            {/*    YOUR SPACES*/}
            {/*</Typography>*/}
            {/*{*/}
            {/*    spaces.map((space, index) => {*/}
            {/*        return (*/}
            {/*            <Box*/}
            {/*                display="flex"*/}
            {/*                alignItems="center"*/}
            {/*                gap="10px"*/}
            {/*                onClick={space.function}*/}
            {/*                sx={{ cursor: 'pointer' }}*/}
            {/*                key={index}*/}
            {/*            >*/}
            {/*                <Box component="img" src={space.src} height="40px" width="40px" borderRadius="20px" />*/}
            {/*                <Typography color="white" variant="bodyMB">*/}
            {/*                    {*/}
            {/*                        space.content*/}
            {/*                    }*/}
            {/*                </Typography>*/}
            {/*            </Box>*/}
            {/*        )*/}
            {/*    })*/}
            {/*}*/}
            <br />
            <Box
              display="flex"
              sx={{ cursor: 'pointer' }}
              alignItems="center"
              onClick={() => router.push('/spaces/create')}
              gap="10px"
              paddingLeft="5px"
            >
              <SpacePlusIcon />
              <Typography color="white" variant="bodyMB">
                Create a Space
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
