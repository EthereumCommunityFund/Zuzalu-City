import React from 'react';
import { Img3 } from '@lxdao/img3';
import {
  type CroppedFile,
  type SelectedFile,
  type UploadFile,
  type UploadResult,
  Uploader3FileStatus,
} from '@lxdao/uploader3';
import { Stack } from '@mui/material';
import DownloadingRoundedIcon from '@mui/icons-material/DownloadingRounded';
import styled from '@emotion/styled';

const LoadingWrapper = styled.div`
  display: ${(props: { isLoading: boolean; isError: boolean }) =>
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
  color: ${(props: { isError: boolean }) => (props.isError ? 'red' : 'white')};

  .loading-icon {
    ${(props: { isLoading: boolean }) => {
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
  file?: SelectedFile | UploadFile | UploadResult | CroppedFile;
  src?: string;
  sx?: {
    [key: string]: string;
  };
}) => {
  const { file, sx, src } = props;

  let imgSrc: string = src || tempSrc;
  if (file) {
    if (file.status === Uploader3FileStatus.uploading) {
      imgSrc = file.thumbData || file.imageData;
    } else if (file.status === Uploader3FileStatus.done) {
      imgSrc = file.url;
    } else if (file.status === Uploader3FileStatus.cropped) {
      imgSrc = file.thumbData;
    } else if (file.status === Uploader3FileStatus.notCropped) {
      // with the component cropped but full size
      imgSrc = file.previewUrl;
    } else {
      imgSrc = file.previewUrl;
    }
  }

  const loading = file?.status === Uploader3FileStatus.uploading;
  const error = file?.status === Uploader3FileStatus.error;

  return (
    <Stack sx={{ ...sx, backgroundColor: '#313131', position: 'relative' }}>
      <LoadingWrapper isError={error} isLoading={loading} style={{ ...sx }}>
        <DownloadingRoundedIcon
          className={'loading-icon'}
          sx={{
            fontSize: 40,
            transform: 'rotate(180deg)',
          }}
        />
      </LoadingWrapper>
      {imgSrc && (
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
          alt={''}
        />
      )}
    </Stack>
  );
};
