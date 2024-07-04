import React, { ChangeEvent, useState } from "react";
import { Button, CircularProgress, Typography, Box } from "@mui/material";

const ImageUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  }

  const handleUpload = async () => {
    if (!file) {
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    setLoading(false);

    if (response.ok) {
      console.log('File upload successfully');
    } else {
      console.error('File upload failed');
    }
  }

  return (
    <Box display='flex' flexDirection='column' alignItems='center'>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="upload-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="upload-file">
        <Button variant="contained">
          Choose File
        </Button>
      </label>
      {file && <Typography variant="bodyBB">{file.name}</Typography>}
      <Button variant="contained" onClick={handleUpload} disabled={loading || !file}>
        Upload
      </Button>
      {loading && <CircularProgress />}
    </Box>
  )
}

export default ImageUploader;