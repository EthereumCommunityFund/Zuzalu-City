import { Box, BoxProps, Typography } from '@mui/material';

interface PropTypes extends BoxProps {
  icon: React.ReactNode;
  content: string;
  description: string;
}

export const VenueOptionButton = ({
  icon,
  content,
  description,
  onClick,
  ...props
}: PropTypes) => {
  return (
    <Box
      {...props}
      onClick={onClick}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '10px',
        background:
          'linear-gradient(117deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.05) 100%)',
        borderRadius: '10px',
        width: '100%',
        boxSizing: 'border-box',
        padding: '10px',
        cursor: 'pointer',
        overflow: 'hidden', // Ensure the overlay doesn't overflow
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(117deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
          opacity: 0, // Initially invisible
          transition: 'opacity 0.3s ease-in', // Transition the opacity property
        },
        '&:hover::before': {
          opacity: 1, // Show the overlay on hover
        },
      }}
    >
      <Box
        sx={{
          opacity: '0.5',
          transformOrigin: '50% 50% 0px',
          width: '30px',
        }}
      >
        {icon}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          opacity: '0.8',
        }}
      >
        <Typography fontWeight={600}>{content}</Typography>
        <Typography fontSize={'10px'} color={'#909090'}>
          {description}
        </Typography>
      </Box>
    </Box>
  );
};
