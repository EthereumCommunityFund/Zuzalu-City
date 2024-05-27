'use client';
import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { ZuButton, ZuInput } from '@/components/core';
import { PlusCircleIcon, XCricleIcon } from '@/components/icons';

const Invite = () => {
  return (
    <Stack direction="row" justifyContent="center">
      <Stack spacing="30px" padding="20px 30px" width="700px">
        <Typography variant="subtitleMB">
          Invite Space Admins
        </Typography>
        <Typography variant="bodyB">
          Disclaimer: During beta, invites will only have one role i.e. admin. Admins will have access to all management functions for this event.
        </Typography>
        <Stack padding="20px" spacing="30px">
          <Stack spacing="10px">
            <Typography variant="bodyBB">
              Input Address
            </Typography>
            <ZuInput />
            <Stack direction="row" justifyContent="space-between">
              <ZuButton startIcon={<PlusCircleIcon />}>
                Add More
              </ZuButton>
              <ZuButton sx={{ color: '#67DBFF', border: '1px solid rgba(103, 219, 255, 0.20)', backgroundColor: 'rgba(103, 219, 255, 0.10)' }}>
                Invite
              </ZuButton>
            </Stack>
          </Stack>
          <Stack spacing="10px">
            <Typography variant="bodySB">
              Pending Invites
            </Typography>
            <Stack spacing="10px">
              <Stack direction="row" alignItems="center" spacing="10px">
                <Box component="img" width="24px" height="24px" borderRadius="20px" src="/17.jpg" />
                <Typography variant="bodyM" flex={2}>
                  drivenfast
                </Typography>
                <Typography variant="bodyM" flex={1}>
                  0x001234
                </Typography>
                <Typography variant="bodyM" flex={1}>
                  Admin
                </Typography>
                <ZuButton
                  startIcon={<XCricleIcon />}
                  sx={{
                    color: "#FF5E5E",
                    borderRadius: "20px",
                    backgroundColor: "rgba(235, 87, 87, 0.20)",
                  }}
                >
                  Remove
                </ZuButton>
              </Stack>
            </Stack>
          </Stack>
          <Stack spacing="10px">
            <Typography variant="bodySB">
              Members
            </Typography>
            <Stack direction="row" alignItems="center" spacing="10px">
              <Box component="img" width="24px" height="24px" borderRadius="20px" src="/17.jpg" />
              <Typography variant="bodyM" flex={2}>
                drivenfast
              </Typography>
              <Typography variant="bodyM" flex={1}>
                0x001234
              </Typography>
              <Typography variant="bodyM" flex={1}>
                Creator
              </Typography>
              <ZuButton
                startIcon={<XCricleIcon />}
                sx={{
                  color: "#FF5E5E",
                  borderRadius: "20px",
                  backgroundColor: "rgba(235, 87, 87, 0.20)",
                }}
              >
                Remove
              </ZuButton>
            </Stack>
            <Stack direction="row" alignItems="center" spacing="10px">
              <Box component="img" width="24px" height="24px" borderRadius="20px" src="/17.jpg" />
              <Typography variant="bodyM" flex={2}>
                drivenfast
              </Typography>
              <Typography variant="bodyM" flex={1}>
                0x001234
              </Typography>
              <Typography variant="bodyM" flex={1}>
                Admin
              </Typography>
              <ZuButton
                startIcon={<XCricleIcon />}
                sx={{
                  color: "#FF5E5E",
                  borderRadius: "20px",
                  backgroundColor: "rgba(235, 87, 87, 0.20)",
                }}
              >
                Remove
              </ZuButton>
            </Stack>
            <Stack direction="row" alignItems="center" spacing="10px">
              <Box component="img" width="24px" height="24px" borderRadius="20px" src="/17.jpg" />
              <Typography variant="bodyM" flex={2}>
                drivenfast
              </Typography>
              <Typography variant="bodyM" flex={1}>
                0x001234
              </Typography>
              <Typography variant="bodyM" flex={1}>
                Admin
              </Typography>
              <ZuButton
                startIcon={<XCricleIcon />}
                sx={{
                  color: "#FF5E5E",
                  borderRadius: "20px",
                  backgroundColor: "rgba(235, 87, 87, 0.20)",
                }}
              >
                Remove
              </ZuButton>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Invite;