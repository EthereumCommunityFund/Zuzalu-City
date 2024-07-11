import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react';
import { useCeramicContext } from '../context/CeramicContext';
import { useAccount, useEnsName } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { Box, Button, OutlinedInput, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AuthPrompt: React.FC<{}> = () => {
  const { isConnected, address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [inputUsername, setInputUsername] = useState('');
  const {
    authenticate,
    hideAuthPrompt,
    isAuthPromptVisible,
    newUser,
    profile,
    username,
    createProfile,
  } = useCeramicContext();

  const [authState, setAuthState] = useState('');
  const authenticateCalled = useRef(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUsername(e.target.value);
  };

  const getDialogContent = useCallback(() => {
    switch (authState) {
      case 'CONNECT_WALLET':
        return {
          title: 'Sign In to Zuzalu City',
          message: 'Sign in or register a new account',
          actions: [
            <div data-rk key="connectButton">
              <ConnectButton
                key="connect"
                showBalance={{ smallScreen: false, largeScreen: false }}
              />
            </div>,
          ],
        };
      case 'NEW_USER':
        return {
          title: 'Welcome to Zuzalu City',
          message:
            "Let's get started with your username. You can change your username later or skip this.",
          actions: [
            <Box
              key="action-buttons"
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <OutlinedInput
                placeholder="Enter text here"
                value={inputUsername}
                onChange={handleInputChange}
                style={{ width: '100%' }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  onClick={() => {
                    if (address) {
                      createProfile(
                        (ensName || address.slice(0, 10)) as string,
                      );
                    }
                    setAuthState('Logged_In');
                  }}
                  variant="outlined"
                >
                  Skip
                </Button>
                <Button
                  onClick={() => {
                    createProfile(inputUsername);
                    setAuthState('Logged_In');
                  }}
                  variant="contained"
                >
                  Continue
                </Button>
              </Box>
            </Box>,
          ],
        };
      case 'Logged_In':
        if (profile) {
          return {
            title: `Welcome, ${username}`,
            message:
              'You’re ready! Now explore events and join community spaces.',
            actions: [
              <Button
                key="finish"
                onClick={() => {
                  hideAuthPrompt();
                  setAuthState('');
                  authenticateCalled.current = false;
                }}
                variant="contained"
              >
                Finish
              </Button>,
            ],
          };
        }
    }
  }, [
    authState,
    profile,
    hideAuthPrompt,
    inputUsername,
    address,
    ensName,
    username,
    createProfile,
  ]);

  useEffect(() => {
    const existingUsername = localStorage.getItem('username');
    const authenticateLoggedUser = async () => {
      if (existingUsername && isAuthPromptVisible) {
        await authenticate();
        setAuthState('Logged_In');
      }
    };
    authenticateLoggedUser();
  }, [isAuthPromptVisible]);

  useEffect(() => {
    if (
      isConnected &&
      isAuthPromptVisible &&
      !authenticateCalled.current &&
      !localStorage.getItem('username')
    ) {
      const authenticateUser = async () => {
        try {
          authenticateCalled.current = true;
          await authenticate();
        } catch (error) {
          console.error('Authentication failed:', error);
          setAuthState('CONNECT_WALLET');
        }
      };
      authenticateUser();
    }
  }, [isConnected]);

  useEffect(() => {
    setAuthState(newUser ? 'NEW_USER' : 'Logged_In');
  }, [newUser]);

  useEffect(() => {
    if (isAuthPromptVisible && !isConnected) {
      setAuthState('CONNECT_WALLET');
    }
  }, [isAuthPromptVisible, isConnected]);

  const content = getDialogContent();
  if (content) {
    const { title, message, actions } = content as {
      title: string;
      message: string;
      actions: ReactNode[];
    };

    return (
      <Dialog
        open={isAuthPromptVisible}
        onClose={hideAuthPrompt}
        PaperProps={{
          style: {
            width: '40%',
            height: 'auto',
            padding: '20px 16px',
            backgroundColor: 'rgba(34, 34, 34, 0.9)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            backdropFilter: 'blur(40px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '24px',
          },
        }}
      >
        <DialogTitle
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {title}
          <IconButton
            onClick={hideAuthPrompt}
            style={{ color: 'white', marginRight: '-16px' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          style={{ paddingLeft: '24px', width: '100%', color: 'white' }}
        >
          <DialogContentText style={{ color: 'white' }}>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{ justifyContent: 'center', width: '100%', padding: 0 }}
        >
          {actions}
        </DialogActions>
      </Dialog>
    );
  } else {
    return null;
  }
};

export default AuthPrompt;
