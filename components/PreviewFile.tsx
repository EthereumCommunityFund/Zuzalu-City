import type {
  CroppedFile,
  SelectedFile,
  UploadFile,
  UploadResult,
} from '@lxdao/uploader3';
import React from 'react';
import { Img3 } from '@lxdao/img3';
import { Stack } from '@mui/material';

export const PreviewFile = (props: {
  // file?: SelectedFile | UploadFile | UploadResult | CroppedFile;
  file?: string;
  sx?: {
    [key: string]: string;
  };
}) => {
  const { file, sx } = props;

  const tempSrc =
    'https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png?scale-down-to=512';
  return (
    <Stack
      sx={{
        ...sx,
        backgroundColor: '#313131',
        position: 'relative'
      }}
    >
      {file && (
        <Img3
          style={{ maxHeight: '100%', maxWidth: '100%', ...sx, position: 'absolute', objectFit: 'cover' }}
          src={tempSrc}
          alt={file}
        />
      )}
    </Stack>
  );
};
