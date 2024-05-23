import React, {
  useState,
  useEffect,
  Fragment,
  ReactNode,
  useCallback,
} from 'react';
import { useCeramicContext } from '../context/CeramicContext';
import { useAccount, useEnsName } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import {
  Box,
  Typography,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Button,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { authenticateCeramic } from '@/utils/ceramicAuth';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ComposeClient } from '@composedb/client';
import { RuntimeCompositeDefinition } from '@composedb/types';
import { definition } from '../composites/definition.js';
//const AuthPrompt: React.FC<{ onAuthenticated: () => void }> = ({
type AuthPromptContent =
  | {
      title: string;
      message: string;
      actions: Element[];
    }
  | {
      title: string;
      message: string;
      actions: { text: string; onClick: () => void }[];
    }
  | undefined;

const AuthPrompt: React.FC<{}> = () => {
  const { address, isConnected } = useAccount();
  const [isVisible, setIsVisible] = useState(true);
  const { data: ensName } = useEnsName({ address });
  const [inputUsername, setInputUsername] = useState('');
  const {
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
  //const { ceramic, composeClient } = clients;
  const [authState, setAuthState] = useState('');
  const isLogged = () => {
    return localStorage.getItem('logged_in') == 'true';
  };

  const handleOpen = () => {
    if (localStorage.getItem('logged_in')) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const [isLoading, setIsLoading] = useState(true);
  const handleKeyDid = () => {
    localStorage.setItem('ceramic:auth_type', 'key');
    authenticate;
    setIsVisible(false);
  };

  const handleConnectWallet = () => {
    if (isConnected) {
      setAuthState('NEW_USER');
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputUsername(newValue);
  };
  const handleEthPkh = () => {
    localStorage.setItem('ceramic:auth_type', 'eth');
    authenticate;
    setIsVisible(false);
  };

  const getDialogContent = useCallback(() => {
    switch (authState) {
      case 'CONNECT_WALLET':
        return {
          title: 'Sign In to Zuzalu City',
          message: 'Sign in or register a new account',
          actions: [
            <Fragment key="connectButton">
              <ConnectButton
                key="connect"
                showBalance={{
                  smallScreen: false,
                  largeScreen: false,
                }}
              />
            </Fragment>,
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
              sx={{
                width: '100%',
                height: '100%',
                p: 3,
                bgcolor: 'rgba(34, 34, 34, 0.6)', // Background color
                color: 'white', // Text color
                borderRadius: 2,
                border: '1px rgba(255, 255, 255, 0.10) solid',
                backdropFilter: 'blur(40px)',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 3,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <OutlinedInput
                placeholder="Enter text here"
                value={inputUsername}
                onChange={handleInputChange}
                style={{ width: '100%', color: 'white' }}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: '100%',
                  gap: 2,
                }}
              >
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
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.10)',
                  }}
                >
                  Skip
                </Button>
                <Button
                  onClick={() => {
                    createProfile(inputUsername);
                    setAuthState('Logged_In');
                  }}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.10)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                    },
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
                onClick={() => hideAuthPrompt()}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.10)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  },
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
    setAuthState,
    profile,
    hideAuthPrompt,
    inputUsername,
    setInputUsername,
  ]);
  const clients = useCeramicContext();
  const { ceramic, composeClient } = clients;
  const handleLogin = useCallback(async () => {
    const accounts = await authenticateCeramic(ceramic, composeClient);
    if (accounts) {
      setAuthState('Logged_In');
    }
    return accounts;
  }, [ceramic, composeClient]);
  useEffect(() => {
    if (isAuthPromptVisible) {
      const existingusername = localStorage.getItem('username');
      if (existingusername) {
        setAuthState('Logged_In');
      }
      getDialogContent();
    }
  }, [isAuthPromptVisible]);

  useEffect(() => {
    if (localStorage.getItem("did")) {
      handleLogin();
    }
  }, [handleLogin]);

  useEffect(() => {
    const checkUserState = async () => {
      if (isConnected) {
        try {
          await handleLogin();
          console.log('Wallet is connected with address:', address);
          if (newUser) {
            setAuthState('NEW_USER');
          } else {
            setAuthState('Logged_In');
          }
        } catch (error) {
          console.error('Authentication failed:', error);
          setAuthState('CONNECT_WALLET');
        }
      } else {
        setAuthState('CONNECT_WALLET');
      }
    };
    checkUserState();
  }, [isConnected, newUser]);

  const content = getDialogContent();
  if (content) {
    const { title, message, actions } = content as {
      title: string;
      message: string;
      actions: ReactNode[];
    };

    return (
      <div>
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
            {' '}
            {/* Center align actions */}
            {actions}
          </DialogActions>
        </Dialog>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default AuthPrompt;
