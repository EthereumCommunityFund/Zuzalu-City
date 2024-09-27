import {
  Box,
  Checkbox,
  CheckboxProps,
  Paper,
  Stack,
  Typography,
  Collapse,
  Divider,
} from '@mui/material';
import { RegistrationMethod } from './types';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useCallback } from 'react';

export const CommonWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack
      sx={{
        border: '1px solid rgba(255, 255, 255, 0.10)',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '10px',
      }}
      spacing="30px"
    >
      {children}
    </Stack>
  );
};

export const Title = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <Stack spacing="10px">
      <Typography
        fontSize={20}
        fontWeight={700}
        lineHeight={1.2}
        sx={{ opacity: 0.7 }}
      >
        {title}
      </Typography>
      <Typography fontSize={14} lineHeight={1.6} sx={{ opacity: 0.6 }}>
        {description}
      </Typography>
    </Stack>
  );
};

interface ItemProps {
  method: RegistrationMethod;
  isSelected: boolean;
  onSelect: (id: string) => void;
  hasExpandableContent?: boolean;
  expandedContent?: React.ReactNode;
}

const RoundCheckbox: React.FC<CheckboxProps> = (props) => {
  return (
    <Checkbox
      {...props}
      icon={<RadioButtonUncheckedIcon />}
      checkedIcon={<CheckCircleIcon />}
      sx={{
        p: 0,
        ...props.sx,
      }}
    />
  );
};

export const Item: React.FC<ItemProps> = ({
  method,
  isSelected,
  onSelect,
  hasExpandableContent = false,
  expandedContent,
}) => {
  const { id, name, description, icon, disabled, hasWhitelisting } = method;

  const handleClick = useCallback(() => {
    if (!disabled) {
      onSelect(id);
    }
  }, [disabled, id, onSelect]);

  return (
    <Paper
      sx={{
        border: '1px solid rgba(255, 255, 255, 0.10)',
        bgcolor: isSelected
          ? 'rgba(255, 255, 255, 0.10)'
          : 'rgba(255, 255, 255, 0.02)',
        p: '10px',
        borderRadius: '10px',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        '&:hover': {
          bgcolor: 'rgba(255, 255, 255, 0.05)',
        },
      }}
      onClick={handleClick}
    >
      <Stack direction="column" spacing="10px">
        <Stack direction="row" justifyContent="space-between">
          <Box display="flex" gap="10px" alignItems="center">
            {icon}
            <Typography fontSize={16} lineHeight={1.6}>
              {name}
            </Typography>
            <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.8 }}>
              {hasWhitelisting ? '(+ whitelisting)' : '(External)'}
            </Typography>
          </Box>
          {!disabled ? (
            <RoundCheckbox checked={isSelected} disabled={disabled} />
          ) : null}
        </Stack>
        <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.6 }}>
          {description}
        </Typography>
        {hasExpandableContent && (
          <Collapse in={isSelected} timeout="auto" unmountOnExit>
            <Divider
              sx={{
                margin: '0 0 10px',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            />
            {expandedContent}
          </Collapse>
        )}
      </Stack>
    </Paper>
  );
};
