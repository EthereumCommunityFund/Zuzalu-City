'use client';
import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { ChevronDownIcon } from '../icons';
import * as util from '../../utils/index';

type SelectButtonProps = {
  onOpened: () => void;
  onClosed: () => void;
  Icon: any;
  title: string;
};

const SelectButton: React.FC<SelectButtonProps> = (props) => {
  const { title, onOpened, onClosed, Icon } = props;
  const [opened, setOpened] = useState<boolean>(false);

  const onOpenChange = useCallback(() => {
    const res: boolean = !opened;
    if (res) {
      onOpened();
    } else {
      onClosed();
    }
    setOpened(res);
  }, [opened]);

  return (
    <Box
      // backgroundColor={'rgba(255, 255, 255, 0.1)'}
      borderRadius={'5px'}
      padding={'0 5px'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      gap={'3px'}
      onClick={() => onOpenChange()}
      sx={{ cursor: 'pointer' }}
      color={'rgba(255, 255, 255, 0.7)'}
    >
      <Icon size={2} />
      <span>{title}</span>
      <ChevronDownIcon />
    </Box>
  );
};

export default SelectButton;
