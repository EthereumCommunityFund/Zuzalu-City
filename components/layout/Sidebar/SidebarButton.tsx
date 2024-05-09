import { BoxProps, Box } from '@mui/material';

interface SidebarButtonPropTypes extends BoxProps {
  isActive?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  content?: string;
}

export default function SidebarButton({
  icon,
  content,
  isActive = false,
  sx,
  children,
  rightIcon,
  ...props
}: SidebarButtonPropTypes) {
  return (
    <Box
      sx={
        sx
          ? sx
          : {
              padding: '8px 10px',
              boxSizing: 'border-box',
              backgroundColor: isActive ? '#ffffff1a' : 'transparent',
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              borderRadius: '10px',
              cursor: 'pointer',
              '&:hover': {
                opacity: 1,
                backgroundColor: '#ffffff1a',
              },
              opacity: 0.8,
            }
      }
      {...props}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon && icon}
      </div>
      <Box
        sx={{
          fontSize: '16px',
          fontWeight: '700',
        }}
      >
        {content}
        {children}
      </Box>
      <div>{rightIcon && rightIcon}</div>
    </Box>
  );
}
