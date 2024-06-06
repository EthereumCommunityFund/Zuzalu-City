'use client';
import React, { useState } from 'react';
import { Stack, Typography, Box, Divider, Grid, Modal } from '@mui/material';
import { useQRCode } from 'next-qrcode';
import { ArrowPathIcon, CloseIcon, InformationIcon, LeftArrowIcon, QRCodeIcon, ScrollIcon } from '@/components/icons';
import { ZuButton, ZuSwitch } from '@/components/core';
import { useRouter } from 'next/navigation';
import QRCode from '../components/QRCode';
import { ArrowLeftIcon } from '@mui/x-date-pickers/icons';

const Home = () => {
  const router = useRouter();
  const { Canvas } = useQRCode();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tickets, setTickets] = useState<Array<string>>(['1']);
  const [isZk, setIsZk] = useState<boolean>(false);
  const [errorCorrectionLevel, setErrorCorrectionLevel] =
    useState<string>('M');

  return (
    <Stack>
      <Stack
        justifyContent="center"
        spacing="20px"
        paddingY="30px"
        sx={{ margin: '0 auto' }}
        width="700px"
      >
        <Stack direction="row" spacing="20px" alignItems="center">
          <ZuButton
            startIcon={<LeftArrowIcon />}
            onClick={() => router.back()}
          >
            Back
          </ZuButton>
          <Stack direction="row" spacing="10px" alignItems="center">
            <Box component="img" alt={'23.webp'} src={'/23.webp'} width={30} height={30} borderRadius="4px" />
            <Typography
              variant="subtitleLB"
              color="white"
            >
              EventName
            </Typography>
          </Stack>
        </Stack>

        {
          tickets.length > 1 ? (
            <Stack spacing="20px">
              <Typography color="white" variant="subtitleMB">
                Tickets:
              </Typography>
              <Grid container spacing="20px">
                {
                  tickets.map((ticket, index) => (
                    <Grid item xs={12} md={6}>
                      <Stack padding="20px" spacing="20px" borderRadius="10px"
                        border="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
                        sx={{ background: 'rgba(45, 45, 45, 0.80)', backdropFilter: 'blur(20px)' }}>
                        <Box component="img" width={300} height={300} borderRadius="10px" src="/23.webp" alt="23.webp" />
                        <Stack spacing="14px" flex="1">
                          <Stack justifyContent="center" spacing="10px" pb="20px" borderBottom="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))">
                            <Typography
                              variant="subtitleLB"
                              color="white"
                              textAlign="center"
                            >
                              Ticket One
                            </Typography>
                            <Stack direction="row" spacing="10px" justifyContent="center">
                              <Typography color="white" variant="bodySB">
                                05/15/2024
                              </Typography>
                              <Typography color="white" variant="bodySB">
                                420 USDT
                              </Typography>
                            </Stack>
                          </Stack>
                          <Stack
                            onClick={() => setIsOpen(true)}
                            sx={{ background: "var(--Inactive-White, rgba(255, 255, 255, 0.05))" }}
                            border="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
                            direction="row" spacing="14px" padding="10px" alignItems="center" borderRadius="10px">
                            <QRCodeIcon />
                            <Stack spacing="4px">
                              <Typography variant="subtitleSB" color="white">
                                Open QR Code
                              </Typography>
                              <Typography variant="caption" color="white">
                                Generate a proof of your ticket
                              </Typography>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Grid>
                  ))
                }
              </Grid>
            </Stack>
          ) : (
            <Stack spacing="20px">
              <Stack direction="row" padding="20px" spacing="20px" borderRadius="10px"
                border="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
                sx={{ background: 'rgba(45, 45, 45, 0.80)', backdropFilter: 'blur(20px)' }}>
                <Box component="img" width={300} height={300} borderRadius="10px" src="/23.webp" alt="23.webp" />
                <Stack spacing="14px" flex="1">
                  <Stack spacing="10px" pb="20px" borderBottom="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))">
                    <Typography
                      variant="subtitleLB"
                      color="white"
                    >
                      Ticket One
                    </Typography>
                    <Stack direction="row" spacing="10px">
                      <Typography color="white" variant="bodySB">
                        05/15/2024
                      </Typography>
                      <Typography color="white" variant="bodySB">
                        420 USDT
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack
                    onClick={() => setIsOpen(true)}
                    sx={{ background: "var(--Inactive-White, rgba(255, 255, 255, 0.05))", cursor: "pointer" }}
                    border="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
                    direction="row" spacing="14px" padding="10px" alignItems="center" borderRadius="10px">
                    <QRCodeIcon />
                    <Stack spacing="4px">
                      <Typography variant="subtitleSB" color="white">
                        Open QR Code
                      </Typography>
                      <Typography variant="caption" color="white">
                        Generate a proof of your ticket
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
              <Stack padding="20px" borderRadius="10px" spacing="20px"
                border="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
                sx={{ background: "var(--Inactive-White, rgba(255, 255, 255, 0.05))" }}
              >
                <Typography
                  variant="subtitleMB"
                  color="white"
                >
                  Ticket Description
                </Typography>
                <Typography
                  variant="bodyB"
                  color="white"
                >
                  Get ready to groove at the Summer Music Festival! Join us for a day filled with live music, food trucks, and good vibes.
                </Typography>
                <Divider sx={{ borderColor: '#383838' }} />
                <Stack spacing="5px">
                  <Typography color="white" variant="bodyMB">
                    Contract/Address (?)
                  </Typography>
                  <Stack direction="row" spacing="10px">
                    <Typography color="white" variant="bodyM">
                      0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E
                    </Typography>

                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          )
        }
        <ScrollIcon />
      </Stack>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <QRCode />
      </Modal>
    </Stack>
  );
};

export default Home;
