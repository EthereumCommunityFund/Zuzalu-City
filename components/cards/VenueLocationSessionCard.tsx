import { Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { EditIcon } from 'components/icons';
import Image from 'next/image';

interface PropTypes {
  imageLink: string;
  topic: string;
  bookingAmount: number;
  capacity: number;
  categories: string[];
  type: string;
}

export default function VenueLocationSessionCard({
  imageLink,
  topic,
  bookingAmount,
  capacity,
  categories,
  type,
}: PropTypes) {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        backgroundColor: '#dddddd0d',
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        padding: '10px',
        boxSizing: 'border-box',
        width: '100%',
        cursor: 'pointer',
        borderRadius: '10px',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <Box
        sx={{
          borderRadius: '4px',
          height: '40px',
          width: '40px',
          border: '1px solid rgba(255, 255, 255, .1)',
          position: 'relative',
        }}
      >
        <Image
          loader={() => imageLink}
          src={imageLink}
          width={40}
          height={40}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        ></Image>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '14px',
          flex: '1 0 0px',
          [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
          },
        }}
      >
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            opacity: '0.8',
            paddingRight: categories.length > 1 ? '20px' : '0px',
            borderRight: categories.length > 1 ? '1px solid #ffffff1a' : '',
            [theme.breakpoints.down('md')]: {
              paddingRight: '0px',
              paddingBottom: '20px',
              borderRightWidth: '0px',
              borderBottom: categories.length > 1 ? '1px solid #ffffff1a' : '',
            },
          }}
        >
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
            }}
          >
            <Typography fontSize={'16px'} fontWeight={600}>
              {topic}
            </Typography>
            {categories.length === 1 && (
              <Typography
                sx={{
                  backgroundColor: '#ffffff0d',
                  borderRadius: '10px',
                  padding: '2px 8px',
                }}
                fontSize={'12px'}
                fontWeight={500}
              >
                {categories[0]}
              </Typography>
            )}
          </Stack>
          <Typography
            fontSize={'13px'}
            sx={{ opacity: '0.8' }}
            lineHeight={'120%'}
          >
            {`Sessions Booked: ${bookingAmount}`}
          </Typography>
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
            }}
          >
            <Typography
              fontSize={'10px'}
              lineHeight={'120%'}
              sx={{ opacity: '0.7' }}
            >
              {`Capacity: ${capacity}`}
            </Typography>
            {type && (
              <Typography
                fontSize={'10px'}
                lineHeight={'120%'}
                sx={{ opacity: '0.7' }}
              >
                {type}
              </Typography>
            )}
          </Stack>
        </Stack>
        {categories.length > 1 && (
          <Stack
            sx={{
              flex: '1 0 0px',
              opacity: '0.8',
            }}
          >
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '10px',
                width: '100%',
              }}
            >
              {categories.map((category, index) => (
                <Typography
                  sx={{
                    backgroundColor: '#ffffff0d',
                    borderRadius: '10px',
                    padding: '2px 8px',
                  }}
                  fontSize={'12px'}
                  fontWeight={500}
                  key={index}
                >
                  {category}
                </Typography>
              ))}
            </Stack>
          </Stack>
        )}
      </Box>
      <Box
        sx={{
          opacity: '0.5',
          width: '20px',
          height: '20px',
        }}
      >
        <EditIcon size={5} />
      </Box>
    </Stack>
  );
}
