import React from 'react';
import { Img3 } from '@lxdao/img3';
import { Stack } from '@mui/material';
import DownloadingRoundedIcon from '@mui/icons-material/DownloadingRounded';
import styled from '@emotion/styled';

const LoadingWrapper = styled.div`
  display: ${(props: { isLoading?: boolean; isError?: boolean }) =>
    props.isLoading || props.isError ? 'flex' : 'none'};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  color: ${(props: { isError?: boolean }) => (props.isError ? 'red' : 'white')};

  .loading-icon {
    ${(props: { isLoading?: boolean }) => {
      if (props.isLoading) {
        return `animation: blink 1s infinite;`;
      }
    }}
  }

  @keyframes blink {
    0% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.3;
    }
  }
`;

const tempSrc =
  'https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png?scale-down-to=512';

export const PreviewFile = (props: {
  src?: string;
  isLoading?: boolean;
  isError?: boolean;
  sx?: {
    [key: string]: string;
  };
}) => {
  const { sx, src, isLoading, isError } = props;

  const imgSrc = src || tempSrc;

  return (
    <Stack sx={{ ...sx, backgroundColor: '#313131', position: 'relative' }}>
      <LoadingWrapper isError={isError} isLoading={isLoading} style={{ ...sx }}>
        <DownloadingRoundedIcon
          className={'loading-icon'}
          sx={{
            fontSize: 40,
            transform: 'rotate(180deg)',
          }}
        />
      </LoadingWrapper>
      <Img3
        gateways={[
          'https://ipfs.io/ipfs/',
          'https://gateway.lighthouse.storage/ipfs/',
        ]}
        style={{
          maxHeight: '100%',
          maxWidth: '100%',
          ...sx,
          position: 'absolute',
          objectFit: 'cover',
        }}
        src={imgSrc}
        alt={imgSrc}
      />
    </Stack>
  );
};
