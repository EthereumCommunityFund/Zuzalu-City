'use client';
import React from "react";
import { ImageUploader } from "@/components";
import { Stack, Typography } from "@mui/material";

const Home: React.FC = () => {
  return (
    <Stack color="white">
      <Typography variant="subtitleLB">
        Image Uploader
      </Typography>
      <ImageUploader />
    </Stack>
  )
}

export default Home;