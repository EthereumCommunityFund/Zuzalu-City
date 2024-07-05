'use client';
import React, { ChangeEvent, useState } from "react";
import { Button, CircularProgress, Typography, Box } from "@mui/material";
import s3 from "@/utils/aws/aws-config";
import { PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";

const ImageUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      }
      reader.readAsDataURL(file);
    }
  }

  const handleUpload = async () => {
    if (!file) {
      return;
    }
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: file.name,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read' as ObjectCannedACL
    }

    try {
      const command = new PutObjectCommand(params);
      const response = await s3.send(command);
      const uploadedUrl = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${file.name}`;
      console.log('File uploaded successfully:', uploadedUrl);
      setUploadedImageUrl(uploadedUrl);
    } catch (error) {
      console.error("Error", error);
    }
  }

  return (
    <Box>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" style={{ width: '200px', marginTop: '10px' }} />}
      <Button variant="contained" color="primary" onClick={handleUpload} disabled={!file}>
        Upload
      </Button>
      {uploadedImageUrl && (
        <Box mt={2}>
          <h3>Uploaded Image:</h3>
          <img src={uploadedImageUrl} alt="Uploaded" style={{ width: '200px', marginTop: '10px' }} />
        </Box>
      )}
    </Box>
  )
}

export default ImageUploader;