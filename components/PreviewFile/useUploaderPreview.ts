import { useState } from 'react';
import {
  CroppedFile,
  SelectedFile,
  Uploader3FileStatus,
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

    getUrl() {
      if (file) {
        if (file.status === Uploader3FileStatus.uploading) {
          return file.thumbData || file.imageData;
        } else if (file.status === Uploader3FileStatus.done) {
          return file.url;
        } else if (file.status === Uploader3FileStatus.cropped) {
          return file.thumbData;
        } else if (file.status === Uploader3FileStatus.notCropped) {
          return file.previewUrl;
        } else {
          return file.previewUrl;
        }
      }
      return url;
    },
  };
};
