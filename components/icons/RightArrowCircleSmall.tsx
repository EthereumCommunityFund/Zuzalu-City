import { Box } from '@mui/material';

export const RightArrowCircleSmallIcon = () => {
  return (
    <Box
      sx={{
        padding: '4px',
        borderRadius: '100%',
        backgroundColor: '#ffffff0f',
        width: '16px',
        height: '16px',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        color="rgb(255, 255, 255)"
        style={{
          width: '16px',
          height: '16px',
        }}
      >
        <path
          fillRule="evenodd"
          d="M3.75 12a.75.75 0 0 1 .75-.75h13.19l-5.47-5.47a.75.75 0 0 1 1.06-1.06l6.75 6.75a.75.75 0 0 1 0 1.06l-6.75 6.75a.75.75 0 1 1-1.06-1.06l5.47-5.47H4.5a.75.75 0 0 1-.75-.75Z"
          clipRule="evenodd"
        ></path>
      </svg>
    </Box>
  );
};
