'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import SpaceCard from './SpaceCard';
import { useTheme, useMediaQuery } from '@mui/material';

export interface CarouselProps {
  items: {
    bgImage: string;
    logoImage: string;
    title: string;
    description: string;
    joined: boolean;
  }[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const slideWidth = useRef(0); // To store calculated slide width

  useEffect(() => {
    slideWidth.current = carouselRef.current
      ? carouselRef.current.offsetWidth / items.length
      : 0;
  }, [items]); // Recalculate on item change

  const handleTouchMove = (event: React.MouseEvent) => {
    const deltaX = event.movementX || 0; // Handle compatibility with older browsers
    if (Math.abs(deltaX) > slideWidth.current / 2) {
      deltaX > 0
        ? setCurrentIndex((prev) => Math.max(prev - 1, 0))
        : setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1));
    }
  };

  return (
    <Box
      ref={carouselRef}
      onMouseDown={handleTouchMove}
      onMouseMove={handleTouchMove}
      sx={{
        display: 'flex',
        overflowX: 'scroll',
        scrollSnapType: 'x mandatory',
        gap: '10px',
        '&::-webkit-scrollbar': { width: 0, backgroundColor: 'transparent' },
      }}
    >
      {items.map((item, index) => (
        <SpaceCard
          logoImage={item.logoImage}
          bgImage={item.bgImage}
          title={item.title}
          description={item.description}
          joined={item.joined}
          key={`SpaceCard-${index}`}
        />
      ))}
    </Box>
  );
};

export default Carousel;
