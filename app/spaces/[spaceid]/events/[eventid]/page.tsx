'use client';
import React, { useState } from 'react';
import { Stack, Grid, useTheme, useMediaQuery, Box, Typography, SwipeableDrawer } from '@mui/material';
import { IconSidebar, Header, Thumb, Sidebar, Initial, Disclaimer, Email, Payment, Completion, Rush } from './components';
import {
  EventName,
  EventAbout,
  EventDetail,
  EventRegister,
} from 'components/event';
import { ZuButton } from '@/components/core';
import { ArrowUpRightIcon, XMarkIcon } from '@/components/icons';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const Home = () => {
  const [tabName, setTabName] = React.useState<string>('Overview');
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.down('xl'));

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const [isInitial, setIsInitial] = useState<boolean>(false);
  const [isDisclaimer, setIsDisclaimer] = useState<boolean>(false);
  const [isEmail, setIsEmail] = useState<boolean>(false);
  const [isPayment, setIsPayment] = useState<boolean>(false);
  const [isCompletion, setIsCompletion] = useState<boolean>(false);
  const [isRush, setIsRush] = useState<boolean>(false);

  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };

  const List = (anchor: Anchor) => {

    const handleClose = () => {
      toggleDrawer('right', false);
    };

    return (
      <Box
        sx={{
          width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '700px',
          backgroundColor: '#222222',
        }}
        role="presentation"
        zIndex="10"
        borderLeft="1px solid #383838"
        height="100%"
      >
        <Stack
          direction="row"
          spacing="14px"
          alignItems="center"
          height="50px"
          borderBottom="1px solid #383838"
          paddingX={3}
        >
          <ZuButton startIcon={<XMarkIcon />} onClick={() => handleClose()}>
            Close
          </ZuButton>
          <Typography
            variant="subtitleSB"
          >
            Register for Event
          </Typography>
        </Stack>
        {!isInitial && !isDisclaimer && !isEmail && !isPayment && !isCompletion && !isRush && <Initial setIsInitial={setIsInitial} />}
        {isInitial && !isDisclaimer && !isEmail && !isPayment && !isCompletion && !isRush && <Disclaimer setIsInitial={setIsInitial} setIsDisclaimer={setIsDisclaimer} />}
        {!isInitial && isDisclaimer && !isEmail && !isPayment && !isCompletion && !isRush && <Email setIsDisclaimer={setIsDisclaimer} setIsEmail={setIsEmail} />}
        {!isInitial && !isDisclaimer && isEmail && !isPayment && !isCompletion && !isRush && <Payment setIsEmail={setIsEmail} setIsPayment={setIsPayment} />}
        {!isInitial && !isDisclaimer && !isEmail && isPayment && !isCompletion && !isRush && <Completion setIsPayment={setIsPayment} setIsCompletion={setIsCompletion} />}
        {!isInitial && !isDisclaimer && !isEmail && !isPayment && isCompletion && !isRush && <Rush />}
      </Box>
    );
  };

  return (
    <Stack direction="row">
      {!isDesktop && <IconSidebar />}
      {!isDesktop && <Sidebar />}
      <Stack flex={1} borderLeft="1px solid #383838">
        <Header />
        <Thumb tabName={tabName} setTabName={setTabName} />
        <Stack padding="40px" justifyContent="center" alignItems="center">
          <Stack width={900}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <EventName />
              </Grid>
              <Grid item xs={12} md={5}>
                <EventRegister onToggle={toggleDrawer} />
              </Grid>
              <Grid item xs={12} md={7}>
                <EventAbout />
              </Grid>
              <Grid item xs={12} md={5}>
                <EventDetail />
              </Grid>
            </Grid>
          </Stack>
        </Stack>
        <SwipeableDrawer
          hideBackdrop={true}
          sx={{
            '& .MuiDrawer-paper': {
              marginTop: '50px',
              height: 'calc(100% - 50px)',
              boxShadow: 'none',
            },
          }}
          anchor="right"
          open={state['right']}
          onClose={() => toggleDrawer('right', false)}
          onOpen={() => toggleDrawer('right', true)}
        >
          {List('right')}
        </SwipeableDrawer>
      </Stack>
    </Stack>
  );
};

export default Home;
