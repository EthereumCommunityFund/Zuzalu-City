import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Button, Link, Stack, Typography } from '@mui/material';
import { RightArrowIcon } from '@/components/icons';

const doclink = process.env.NEXT_PUBLIC_LEARN_DOC_V2_URL || '';

const EmblaVerticalCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ axis: 'y', loop: true }, [
    Autoplay({ stopOnInteraction: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi && emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const slides = [
    {
      image: '/banner/banner_1.png',
      text: (
        <Stack ml="40px" mt="30px">
          <Typography
            fontSize="49px"
            fontWeight={700}
            lineHeight={1.2}
            color="#222222"
          >
            Zuzalu City
          </Typography>
          <Typography
            mt="10px"
            fontSize="16px"
            fontWeight={600}
            lineHeight={1.2}
            color="#222222"
            sx={{ opacity: 0.8 }}
          >
            Welcome to the new Zuzalu City
          </Typography>
          <Link href={doclink} target="_blank">
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#383838',
                color: 'white',
                borderRadius: '10px',
                p: '10px',
                gap: '10px',
                mt: '30px',
                width: 'auto',
              }}
              startIcon={<RightArrowIcon />}
            >
              Join Alpha Testing
            </Button>
          </Link>
        </Stack>
      ),
    },
    { image: '/banner/banner_2.png' },
  ];

  return (
    <div className="relative h-[240px] w-full">
      <div className="overflow-hidden h-full rounded-[30px]" ref={emblaRef}>
        <div className="flex flex-col h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-shrink-0 h-full bg-center bg-no-repeat bg-cover relative"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              {slide.text}
            </div>
          ))}
        </div>
      </div>
      <div
        className="flex flex-col items-center justify-center 
            absolute overflow-hidden 
            pointer-events-auto
            left-[10px] top-1/2 -translate-y-1/2
            rounded-[50px]
            bg-black/20 backdrop-blur-[4px]"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className="flex items-center justify-center 
            overflow-hidden
            bg-transparent
            cursor-pointer
            border-none
            m-0
            p-[6px_6px_5px]"
          >
            <div
              className={`rounded-full 
            bg-white
            cursor-pointer
            border-none
            flex items-center justify-center
            p-0
            w-[6px] h-[6px]
            ${selectedIndex === index ? 'opacity-100' : 'opacity-50'}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmblaVerticalCarousel;
