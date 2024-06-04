import * as React from 'react';
import { Typography, Stack } from '@mui/material';
import { ZuSwitch } from 'components/core';
import { GroupIcon, QRCodeIcon } from '@/components/icons';

const TicketHeader = () => {
  const [isChecked, setIsChecked] = React.useState(true);

  return (
    <Stack
      direction="column"
      spacing={2}
      paddingBottom={'30px'}
      borderBottom={'1px solid rgba(255,255,255,0.10)'}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
      >
        <Typography variant="h5" color="white">
          Ticketing
        </Typography>
        <Typography variant="body2" color="white">
          Total Sold: 18
        </Typography>
      </Stack>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
        <div className="col-span-1 gap-x-4 cursor-pointer p-[10px] flex items-center rounded-[10px] bg-[rgba(255,255,255,0.05)]">
          <ZuSwitch
            checked={isChecked}
            onChange={() => setIsChecked((prev) => !prev)}
          />
          <Stack direction="column">
            <Typography variant="subtitle2" color="white">
              Registration Status
            </Typography>
            <Typography variant="body2" color="white">
              CLOSED
            </Typography>
          </Stack>
        </div>
        <div className="col-span-1 p-[10px] flex items-center rounded-[10px] bg-[rgba(255,255,255,0.05)]">
          <div className="mr-[10px]">
            <GroupIcon />
          </div>
          <div className="">
            <div className="mb-[4px] text-white opacity-50 text-[18px] leading-[120%] font-[700]">
              Event Capacity
            </div>
            <div className="text-[10px] text-white opacity-50">
              SETTING COMING SOON
            </div>
          </div>
        </div>
        <div className="col-span-1 cursor-pointer p-[10px] flex items-center rounded-[10px] bg-[rgba(255,255,255,0.05)]">
          <div className="mr-[10px]">
            <QRCodeIcon />
          </div>
          <div className="">
            <div className="mb-[4px] text-white text-[18px] leading-[120%] font-[700]">
              Scan QR Code
            </div>
            <div className="text-[10px] leading-[120%] text-[rgba(255,255,255,0.7)]">
              No tracks
            </div>
          </div>
        </div>
      </div>
    </Stack>
  );
};

export default TicketHeader;
