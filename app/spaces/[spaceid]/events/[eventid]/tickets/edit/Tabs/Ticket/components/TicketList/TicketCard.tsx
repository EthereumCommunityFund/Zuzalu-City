import * as React from 'react';
import { Stack, Typography, useMediaQuery } from '@mui/material';
import ZuButton from 'components/core/Button';
import {
  ThreeVerticalIcon,
  CheckCircleIcon,
  EyeSlashIcon,
} from 'components/icons';
import Image from 'next/image';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export type TicketCardProps = {
  name: string;
  price: string;
  open: string;
  status: boolean;
  sold: number;
  tokenSymbol?: string;
  address: string;
  setToggleAction?: React.Dispatch<React.SetStateAction<string>>;
  onToggle?: (anchor: Anchor, open: boolean) => void;
};

const TicketCard: React.FC<TicketCardProps> = ({
  name,
  price,
  open,
  status,
  sold,
  tokenSymbol,
  address,
  setToggleAction,
  onToggle = (anchor: Anchor, open: boolean) => { }
}) => {
  const isMobile = useMediaQuery('(max-width:500px)')
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2.5}
      borderRadius={2}
      padding={1.5}
      bgcolor="#2d2d2d"
      sx={{ cursor: "pointer" }}
      onClick={() => {
        setToggleAction && setToggleAction("ViewVault"),
          onToggle('right', true)
      }}
    >
      <Image alt={"24.webp"} src={"/24.webp"}
        width={100}
        height={100}
        objectFit="cover"
        style={{
          width: isMobile ? '100%' : undefined,
          height: isMobile ? '100%' : undefined,
        }}
      />

      <Stack
        direction="column"
        spacing={1}
      >
        <Stack gap={1}
          direction={{ xs: 'column', sm: 'row' }} alignItems="center">
          <Typography variant="h5" color="white">
            {name}
          </Typography>{' '}
          <Typography classes="subtitle2" color="white">
            {price}{" "}
            {tokenSymbol}
          </Typography>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
          <Stack
            direction="row"
            alignItems="center"
            padding="4px 10px"
            spacing={1}
            borderRadius={3}
            sx={{ backgroundColor: '#384A44' }}
          >
            {status ? (
              <CheckCircleIcon color="#65C0A0" />
            ) : (
              <EyeSlashIcon color="#C09965" />
            )}
            <Typography color={status ? '#65C0A0' : '#C09965'}>
              {status ? 'Available' : 'Hidden'}
            </Typography>
            <Typography style={{ marginLeft: "1px" }} color={status ? '#65C0A0' : '#C09965'}>:</Typography>
            <Typography color={status ? '#65C0A0' : '#C09965'}>{open}</Typography>
          </Stack>
          <Typography>Sold: {sold}</Typography>
        </Stack>
        <Typography variant='caption'>ADDRESS: {address}</Typography>
      </Stack>
    </Stack>
  );
};

export default TicketCard;
