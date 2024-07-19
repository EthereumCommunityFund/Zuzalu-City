import { useState } from 'react';
import {
  CroppedFile,
  SelectedFile,
  Uploader3FileStatus,
  UploadFile,
  UploadResult,
} from '@lxdao/uploader3';

export const useUploaderPreview = (src?: string) => {
  const [url, setUrl] = useState<string | undefined>(src);
  const [file, setFile] = useState<
    SelectedFile | UploadFile | UploadResult | CroppedFile
  >();

  const getUrl = (defaultUrl?: string) => {
    if (!file) return url || defaultUrl;
    switch (file.status) {
      case Uploader3FileStatus.uploading:
        return file.thumbData || file.imageData;
      case Uploader3FileStatus.done:
        return file.url;
      case Uploader3FileStatus.cropped:
      case Uploader3FileStatus.notCropped:
        return file.thumbData || file.previewUrl;
      default:
        return file.previewUrl;
    }
  };

  const isLoading = () => file?.status === Uploader3FileStatus.uploading;
  const isError = () => file?.status === Uploader3FileStatus.error;

  return { url, setUrl, file, setFile, getUrl, isLoading, isError };
};
