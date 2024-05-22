import type { CroppedFile, SelectedFile, UploadFile, UploadResult } from '@lxdao/uploader3';
import React from 'react';
import { Img3 } from '@lxdao/img3';
import { Stack } from '@mui/material';


export const PreviewFile = (props: {
  file?: SelectedFile | UploadFile | UploadResult | CroppedFile;
  sx: {
    [key: string]: string
  }
}) => {
  const { file, sx } = props;

  const tempSrc = "https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png?scale-down-to=512 512w"
  return (
    <Stack
      sx={{
        ...sx,
        backgroundColor: '#313131'
      }}
    >
      {
        file && <Img3 style={{ maxHeight: '100%', maxWidth: '100%', ...sx }} src={file ? file.previewUrl : tempSrc} alt={file.name} />
      }
    </Stack>
  );
};