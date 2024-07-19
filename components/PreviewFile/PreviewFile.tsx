import React from 'react';
import { Img3 } from '@lxdao/img3';
import { Stack, Typography } from '@mui/material';
import DownloadingRoundedIcon from '@mui/icons-material/DownloadingRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import styled from '@emotion/styled';
import { css } from '@emotion/css';

const blink = css`
  animation: blink-animation 1s infinite;
  @keyframes blink-animation {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }
`;

const LoadingWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const tempSrc =
  'https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png?scale-down-to=512';

export const PreviewFile = (props: {
  src?: string;
  isLoading?: boolean;
  errorMessage?: string;
  sx?: { [key: string]: string };
}) => {
  const { src = tempSrc, isLoading, errorMessage, sx } = props;
  return (
    <>
      <Stack sx={{ ...sx, backgroundColor: '#313131', position: 'relative' }}>
        {src && (
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
            src={src}
            alt={src}
          />
        )}
        {(isLoading || errorMessage) && (
          <LoadingWrapper style={{ ...sx }}>
            {isLoading && (
              <DownloadingRoundedIcon
                className={blink}
                color="success"
                fontSize="large"
                sx={{ transform: 'rotate(180deg)' }}
              />
            )}
            {errorMessage && (
              <ErrorOutlineRoundedIcon fontSize="large" color="error" />
            )}
          </LoadingWrapper>
        )}
      </Stack>
      {errorMessage ? (
        <Typography variant={'caption'} color={'error'}>
          {errorMessage}
        </Typography>
      ) : null}
    </>
  );
};
