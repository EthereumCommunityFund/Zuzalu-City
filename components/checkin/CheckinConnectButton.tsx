import { Stack, Typography } from '@mui/material';
import { ZuButton } from '@/components/core';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Image from 'next/image';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';

interface IProps {
  handleConfirm: () => void;
}

export default function CheckinConnectButton({ handleConfirm }: IProps) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            style={{
              width: '100%',
            }}
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Stack
                    width="100%"
                    gap="18px"
                    height={'100%'}
                    alignItems={'center'}
                    justifyContent={'center'}
                  >
                    <Typography
                      fontSize={'14px'}
                      textAlign={'center'}
                      sx={{ opacity: '0.7' }}
                    >
                      Choose the wallet to be used to sign in to this specific
                      event, if you need to change it contact the event
                      organizer
                    </Typography>
                    <ZuButton
                      startIcon={<ArrowCircleRightIcon />}
                      sx={{
                        width: '100%',
                        border: '1px solid rgba(215, 255, 196, 0.20)',
                        backgroundColor: 'rgba(215, 255, 196, 0.10)',
                        color: '#D7FFC4',
                      }}
                      onClick={() => {
                        openConnectModal();
                      }}
                    >
                      Link Your Wallet
                    </ZuButton>
                    <Image
                      src="/ceramic.png?v=1"
                      alt="wallet"
                      width={78}
                      height={15.5}
                    />
                  </Stack>
                );
              }

              if (chain.unsupported) {
                return (
                  <ZuButton
                    sx={{
                      width: '100%',
                      border: '1px solid rgba(255, 255, 255, 0.10)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }}
                    onClick={openChainModal}
                  >
                    Wrong network
                  </ZuButton>
                );
              }

              if (connected) {
                return (
                  <Stack
                    width="100%"
                    gap="14px"
                    height={'100%'}
                    alignItems={'center'}
                    justifyContent={'center'}
                  >
                    <ZuButton
                      startIcon={
                        <Image
                          src="/user/wallet.png"
                          alt="wallet"
                          height={24}
                          width={24}
                        />
                      }
                      endIcon={<KeyboardArrowDownIcon />}
                      sx={{
                        width: '100%',
                        border: '1px solid rgba(255, 255, 255, 0.10)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      }}
                      onClick={() => {
                        openAccountModal();
                      }}
                    >
                      {account.address.slice(0, 10) + '...'}
                    </ZuButton>
                    <Typography
                      textAlign={'center'}
                      fontSize={'14px'}
                      sx={{ opacity: '0.7' }}
                    >
                      This wallet is going to be used to sign in to this event
                      with a{' '}
                      <a
                        href="https://ceramic.network/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'inherit',
                          textDecoration: 'none',
                          borderBottom: '1px solid',
                        }}
                      >
                        <u>Ceramic DID</u>
                      </a>
                      . <br></br>If you need to change it in the future contact
                      the event organizer
                    </Typography>
                    <ZuButton
                      startIcon={<ArrowCircleRightIcon />}
                      sx={{
                        width: '100%',
                        color: '#D7FFC4',
                        border: '1px solid rgba(215, 255, 196, 0.20)',
                        backgroundColor: 'rgba(215, 255, 196, 0.10)',
                      }}
                      onClick={handleConfirm}
                    >
                      Confirm This Wallet
                    </ZuButton>
                    <Image
                      src="/ceramic.png?v=1"
                      alt="wallet"
                      width={78}
                      height={15.5}
                    />
                  </Stack>
                );
              }
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
