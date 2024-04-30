import { HTMLAttributes } from 'react';
import { Stack, StackProps } from '@mui/material';

interface SidebarButtonPropTypes extends StackProps {
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
  console.log(Object.keys.length > 0)
  return (
    <Stack
      sx={
        Object.keys.length > 0 ? sx : {
          padding: '8px 10px',
          backgroundColor: isActive ? '#ffffff1a' : 'transparent',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          gap: '10px',
          borderRadius: '10px',
          cursor: 'pointer',
          '&:hover': {
            opacity: 1,
            backgroundColor: '#ffffff1a'
          },
          opacity: 0.8,
        }
      }
      {...props}
    >
      <div>{icon && icon}</div>
      <Stack
        sx={{
          fontSize: '16px',
          fontWeight: '700'
        }}
      >
        {content}
        {children}
      </Stack>
      <div>{rightIcon && rightIcon}</div>
    </Stack>
  );
}
