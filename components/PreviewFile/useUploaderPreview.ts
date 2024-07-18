import { useState } from 'react';
import type {
  CroppedFile,
  SelectedFile,
  UploadFile,
  UploadResult,
} from '@lxdao/uploader3';

export const useUploaderPreview = (link: string = '') => {
  const [url, setUrl] = useState<string | undefined>(link);
  const [file, setFile] = useState<
    SelectedFile | UploadFile | UploadResult | CroppedFile
  >();

  return {
    url,
    setUrl,
    file,
    setFile,
  };
};
