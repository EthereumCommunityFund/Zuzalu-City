import * as React from 'react';
import { Stack, Typography, useMediaQuery } from '@mui/material';
import ZuButton from 'components/core/Button';
import {
  ThreeVerticalIcon,
  CheckCircleIcon,
  EyeSlashIcon,
} from 'components/icons';
import Image from 'next/image';
import { shortenAddress } from '@/utils/format';
import { mUSDC_TOKEN } from '@/constant';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export type TicketCardProps = {
  // name: string;
  // price: string;
  // open: string;
  // status: boolean;
  // sold: number;
  // tokenSymbol?: string;
  // address: string;
  ticket: any;
  index: number;
  ticketAddresses: Array<string>;
  setToggleAction?: React.Dispatch<React.SetStateAction<string>>;
  setVaultIndex?: React.Dispatch<React.SetStateAction<number>>;
  onToggle?: (anchor: Anchor, open: boolean) => void;
};

const TicketCard: React.FC<TicketCardProps> = ({
  // name,
  // price,
  // open,
  // status,
  // sold,
  // tokenSymbol,
  // address,
  ticket,
  index,
  ticketAddresses,
  setVaultIndex,
  setToggleAction,
  onToggle = (anchor: Anchor, open: boolean) => {},
}) => {
  const isMobile = useMediaQuery('(max-width:500px)');
  let status = true;

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2.5}
      borderRadius={2}
      padding={1.5}
      bgcolor="#2d2d2d"
      sx={{ cursor: 'pointer' }}
      onClick={() => {
        setToggleAction && setToggleAction('ViewVault'),
          onToggle('right', true);
        setVaultIndex && setVaultIndex(index);
      }}
    >
      <Image
        alt={'24.webp'}
        src={'/24.webp'}
        width={100}
        height={100}
        objectFit="cover"
        style={{
          width: isMobile ? '100%' : undefined,
          height: isMobile ? '100%' : undefined,
        }}
      />

      <Stack direction="column" spacing={1}>
        <Stack
          gap={1}
          direction={{ xs: 'column', sm: 'row' }}
          alignItems="center"
        >
          <Typography variant="h5" color="white">
            {ticket[0]?.result}
          </Typography>{' '}
          <Typography classes="subtitle2" color="white">
            {(ticket[3].result / BigInt(10 ** 18)).toString()}{' '}
            {ticket[2]?.result === mUSDC_TOKEN ? 'USDC' : 'USDT'}
          </Typography>
        </Stack>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems="center"
        >
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
            <Typography
              style={{ marginLeft: '1px' }}
              color={status ? '#65C0A0' : '#C09965'}
            >
              :
            </Typography>
            <Typography color={status ? '#65C0A0' : '#C09965'}>
              To All
            </Typography>
          </Stack>
          <Typography>Sold: {String(ticket[4]?.result)}</Typography>
        </Stack>
        <Typography variant="caption">
          ADDRESS: {shortenAddress(ticketAddresses[index])}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default TicketCard;
