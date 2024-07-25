import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react';
import { useCeramicContext } from '@/context/CeramicContext';
import { useAccount, useEnsName } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Box, Button, OutlinedInput } from '@mui/material';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import { useDisconnect } from 'wagmi';

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
  const { disconnect } = useDisconnect();
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
                fullWidth
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
      } else if (!existingUsername && isAuthPromptVisible && isConnected) {
        disconnect();
        setAuthState('CONNECT_WALLET');
      }
    };
    authenticateLoggedUser();
  }, [isAuthPromptVisible]);

  useEffect(() => {
    const authenticateUser = async (needSetState = true) => {
      try {
        authenticateCalled.current = true;
        await authenticate();
      } catch (error) {
        console.error('Authentication failed:', error);
        needSetState && setAuthState('CONNECT_WALLET');
      }
    };
    if (
      isConnected &&
      isAuthPromptVisible &&
      !authenticateCalled.current &&
      !localStorage.getItem('username')
    ) {
      authenticateUser();
    }
    if (
      isConnected &&
      localStorage.getItem('username') &&
      !authenticateCalled.current
    ) {
      authenticateUser(false);
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
        title={title}
        message={message}
        showModal={isAuthPromptVisible}
        onClose={hideAuthPrompt}
        actions={actions}
      />
    );
  }
  return null;
};

export default AuthPrompt;
