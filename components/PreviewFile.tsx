import type { CroppedFile, SelectedFile, UploadFile, UploadResult } from '@lxdao/uploader3';
import React from 'react';
import { Img3 } from '@lxdao/img3';
import { Stack } from '@mui/material';


export const PreviewFile = (props: {
  file?: SelectedFile | UploadFile | UploadResult | CroppedFile;
  style?: React.CSSProperties;
}) => {
  const { file } = props;

  const tempSrc = "https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png?scale-down-to=512 512w"
  return (
    <Stack
      sx={{
        width: '85px',
        height: '85px',
        borderRadius: '60px',
        boxShadow: '0 0 0 6px #2e2e2e',
      }}
    >
      {
        file && <Img3 style={{ maxHeight: '100%', maxWidth: '100%', borderRadius: '60px' }} src={file ? file.previewUrl : tempSrc} alt={file.name} />
      }
    </Stack>
  );
};