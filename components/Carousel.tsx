'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import SpaceCard from './cards/SpaceCard';
import { useTheme, useMediaQuery } from '@mui/material';
import { Space } from '@/types';

export interface CarouselProps {
  items: Space[];
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

  function isValidJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  return (
    <Box
      ref={carouselRef}
      onMouseDown={handleTouchMove}
      onMouseMove={handleTouchMove}
      sx={{
        display: 'flex',
        overflowX: 'auto',
        gap: '10px',
        scrollbarWidth: 'thin',
      }}
    >
      {items.map((item) => (
        <SpaceCard
          id={item.id}
          key={`SpaceCard-${item.id}`}
          logoImage={
            item.avatar !== 'undefined' &&
            item.avatar &&
            !item.avatar.includes('blob')
              ? item.avatar
              : '/1.webp'
          }
          bgImage={
            item.banner !== 'undefined' &&
            item.banner &&
            !item.banner.includes('blob')
              ? item.banner
              : '/5.webp'
          }
          tagline={item.tagline}
          title={item.name}
          description={item.description}
          members={item.members}
          categories={item.category}
        />
      ))}
    </Box>
  );
};

export default Carousel;
