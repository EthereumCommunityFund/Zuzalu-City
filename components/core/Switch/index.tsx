import { styled, SwitchProps, Switch } from '@mui/material';

interface ZuSwitchProps extends SwitchProps {
  width?: number;
  height?: number;
}

const ZuSwitch = styled((props: ZuSwitchProps) => {
  const { width, height, ...otherProps } = props;
  return (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...otherProps}
    />
  );
})(({ theme, width = 42, height = 26 }) => ({
  width,
  height,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: `translateX(${width - height + 2}px)`,
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#58A68B',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: height - 4,
    height: height - 4,
  },
  '& .MuiSwitch-track': {
    borderRadius: height / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

export default ZuSwitch;
