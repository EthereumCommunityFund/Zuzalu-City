import {
  Box,
  Checkbox,
  CheckboxProps,
  Paper,
  Stack,
  Typography,
  Collapse,
  Divider,
  Button,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { ItemType, OptionType, TagProps } from '../types';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  CloseIcon,
  ExclamationCircleIcon,
  LeftArrowIcon,
  LottoPGFIcon,
  RightArrowIcon,
  ScrollPassIcon,
  SettingIcon,
  ZuPassIcon,
} from '@/components/icons';
import { ZuButton, ZuSwitch } from '@/components/core';

export const CommonWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack
      sx={{
        border: '1px solid rgba(255, 255, 255, 0.10)',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '10px',
      }}
      spacing="20px"
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
  description?: string;
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
      {description && (
        <Typography fontSize={14} lineHeight={1.6} sx={{ opacity: 0.6 }}>
          {description}
        </Typography>
      )}
    </Stack>
  );
};

interface ItemProps {
  item: ItemType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  expandedContent?: React.ReactNode;
  options?: OptionType[];
  selectedOptions?: string[];
  onOptionsChange?: (optionIds: string[]) => void;
}

export const RoundCheckbox: React.FC<CheckboxProps> = (props) => {
  return (
    <Checkbox
      {...props}
      icon={
        <RadioButtonUncheckedIcon
          sx={{
            width: 16,
            height: 16,
          }}
        />
      }
      checkedIcon={<CheckCircleIcon sx={{ width: 16, height: 16 }} />}
      sx={{
        p: 0,
        ...props.sx,
      }}
    />
  );
};

export const Item: React.FC<ItemProps> = ({
  item,
  isSelected,
  onSelect,
  expandedContent,
  options = [],
  selectedOptions = [],
  onOptionsChange,
}) => {
  const {
    id,
    name,
    description,
    icon,
    disabled,
    customName,
    isExternal,
    warning,
  } = item;

  const handleClick = useCallback(() => {
    if (!disabled) {
      onSelect(id);
    }
  }, [disabled, id, onSelect]);

  const handleOptionToggle = useCallback(
    (optionId: string) => {
      if (!isSelected) return;
      const newSelectedOptions = selectedOptions.includes(optionId)
        ? selectedOptions.filter((id) => id !== optionId)
        : [...selectedOptions, optionId];
      onOptionsChange?.(newSelectedOptions);
    },
    [selectedOptions, onOptionsChange, isSelected],
  );

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
            {icon && icon}
            {name ? (
              <Typography fontSize={16} lineHeight={1.6}>
                {name}
              </Typography>
            ) : (
              customName
            )}
            {isExternal && (
              <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.8 }}>
                (External Management)
              </Typography>
            )}
          </Box>
          {!disabled ? (
            <RoundCheckbox checked={isSelected} disabled={disabled} />
          ) : null}
        </Stack>
        {typeof description === 'string' ? (
          <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.6 }}>
            {description}
          </Typography>
        ) : (
          description
        )}
        {warning && (
          <Typography
            fontSize={10}
            lineHeight={1.2}
            color="#FF9C66"
            sx={{ opacity: 0.8 }}
          >
            {warning}
          </Typography>
        )}
        {(expandedContent || options.length > 0) && (
          <Collapse in={isSelected}>
            <Divider
              sx={{
                margin: '0 0 10px',
              }}
            />
            {expandedContent ? (
              expandedContent
            ) : (
              <>
                <Typography
                  fontSize={14}
                  lineHeight={1.6}
                  sx={{ opacity: 0.6 }}
                >
                  Optional:
                </Typography>
                {options.map((option) => (
                  <Stack key={option.id} spacing="10px">
                    <Box
                      display="flex"
                      gap="10px"
                      alignItems="center"
                      onClick={() => {
                        handleOptionToggle(option.id);
                      }}
                    >
                      <RoundCheckbox
                        checked={selectedOptions.includes(option.id)}
                      />
                      <Typography fontSize={16} lineHeight={1.6}>
                        {option.name}
                      </Typography>
                    </Box>
                    {option.warning && (
                      <Typography
                        fontSize={13}
                        lineHeight={1.4}
                        color="#FF9C66"
                      >
                        {option.warning}
                      </Typography>
                    )}
                  </Stack>
                ))}
              </>
            )}
          </Collapse>
        )}
      </Stack>
    </Paper>
  );
};

interface ButtonGroupProps {
  handleBack: () => void;
  handleNext: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  isBackButton?: boolean;
  isConfirmButton?: boolean;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  handleBack,
  handleNext,
  isLoading = false,
  isDisabled = false,
  isBackButton = true,
  isConfirmButton = false,
}) => {
  const breakpoints = useTheme().breakpoints;
  return (
    <Stack
      gap="20px"
      direction="row"
      sx={{
        [breakpoints.down('sm')]: {
          flexDirection: 'column',
          gap: '10px',
        },
      }}
    >
      <Button
        sx={{
          color: 'white',
          borderRadius: '10px',
          backgroundColor: '#373737',
          fontSize: '14px',
          padding: '6px 16px',
          border: '1px solid rgba(255, 255, 255, 0.20)',
          flex: 1,
        }}
        startIcon={
          isBackButton ? <LeftArrowIcon size={5} /> : <CloseIcon size={5} />
        }
        onClick={handleBack}
        disabled={isLoading}
      >
        {isBackButton ? 'Back' : 'Close'}
      </Button>
      <Button
        sx={{
          color: '#67DBFF',
          borderRadius: '10px',
          backgroundColor: 'rgba(103, 219, 255, 0.10)',
          fontSize: '14px',
          padding: '6px 16px',
          border: '1px solid rgba(103, 219, 255, 0.20)',
          flex: 1,
        }}
        startIcon={
          !isLoading ? (
            isConfirmButton ? (
              <CheckCircleIcon sx={{ color: '#67DBFF', fontSize: '20px' }} />
            ) : (
              <RightArrowIcon size={5} color="#67DBFF" />
            )
          ) : null
        }
        onClick={handleNext}
        disabled={isDisabled || isLoading}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : isConfirmButton ? (
          'Confirm'
        ) : (
          'Next'
        )}
      </Button>
    </Stack>
  );
};

export const StatusIndicatorPanel = ({
  name,
  desc,
  checked: initialChecked,
  left,
  onChange,
  disabled = false,
  sx,
  type,
  noWrapper = false,
}: {
  name: string;
  desc?: string;
  checked?: boolean;
  left?: React.ReactNode;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  sx?: React.CSSProperties;
  type?: 'registration' | 'checkin';
  noWrapper?: boolean;
}) => {
  const { setStatus } = useStatusContext();
  const [internalChecked, setInternalChecked] = useState(initialChecked);

  useEffect(() => {
    setInternalChecked(initialChecked);
  }, [initialChecked]);

  const handleToggle = useCallback(() => {
    if (!disabled && !left) {
      const newChecked = !internalChecked;
      setStatus((v) => ({
        ...v,
        [type === 'registration' ? 'registrationOpen' : 'checkinOpen']:
          newChecked,
      }));
      setInternalChecked(newChecked);
      onChange?.(newChecked);
    }
  }, [disabled, left, internalChecked, setStatus, onChange, type]);

  return (
    <Stack
      direction="row"
      spacing="14px"
      borderRadius="10px"
      padding={noWrapper ? undefined : '10px'}
      flex={1}
      sx={{
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: '100%',
        background: noWrapper
          ? 'none'
          : internalChecked
            ? 'linear-gradient(90deg, rgba(125, 255, 209, 0.15) 0, rgba(255, 255, 255, 0.03) 100%)'
            : 'rgba(255, 255, 255, 0.05)',
        ...sx,
      }}
      onClick={handleToggle}
    >
      {left ? (
        left
      ) : (
        <ZuSwitch
          checked={internalChecked}
          disabled={disabled}
          width={40}
          height={20}
        />
      )}
      <Stack direction="column" spacing="4px">
        {noWrapper ? (
          <Typography
            fontSize={14}
            fontWeight={600}
            lineHeight={1.6}
            sx={{ opacity: 0.8 }}
          >
            {name}
          </Typography>
        ) : (
          <Typography fontSize={18} fontWeight={700} lineHeight={1.2}>
            {name}
          </Typography>
        )}
        {desc && (
          <Typography fontSize={10} lineHeight={1.2}>
            {desc}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export const Tag = ({ type, pass, text, bgColor, textColor }: TagProps) => {
  if (type === 'text') {
    return (
      <Box
        p="4px 10px"
        borderRadius="6px"
        bgcolor={bgColor || 'rgba(255, 255, 255, 0.05)'}
      >
        <Typography
          fontSize={13}
          lineHeight={1.4}
          color={textColor || '#FFFFFF'}
        >
          {text}
        </Typography>
      </Box>
    );
  }
  if (type === 'required') {
    return (
      <Stack
        p="4px 8px"
        borderRadius="2px"
        bgcolor="rgba(255, 94, 94, 0.10)"
        gap="4px"
        direction="row"
        alignItems="center"
      >
        <ExclamationCircleIcon size={4} color="#FF5E5E" />
        <Typography
          fontSize={10}
          fontWeight={700}
          lineHeight={1.2}
          color="#FF5E5E"
        >
          {text}
        </Typography>
      </Stack>
    );
  }
  if (type === 'warning') {
    return (
      <Stack
        p="4px 8px"
        borderRadius="2px"
        bgcolor="rgba(255, 156, 102, 0.10)"
        direction="row"
        alignItems="center"
      >
        <Typography
          fontSize={10}
          fontWeight={700}
          lineHeight={1.2}
          color="#FF9C66"
        >
          {text}
        </Typography>
      </Stack>
    );
  }
  if (type === 'pass') {
    return (
      <Stack
        p="4px 10px"
        borderRadius="6px"
        bgcolor="rgba(255, 255, 255, 0.05)"
        spacing="4px"
        direction="row"
        alignItems="center"
      >
        {pass === 'zupass' ? (
          <ZuPassIcon size={4} />
        ) : pass === 'scrollpass' ? (
          <ScrollPassIcon size={4} />
        ) : (
          <LottoPGFIcon size={4} />
        )}
        <Typography fontSize={13} lineHeight={1.4}>
          {pass === 'zupass'
            ? 'Zupass'
            : pass === 'scrollpass'
              ? 'Scrollpass'
              : 'ZuLotto'}
        </Typography>
      </Stack>
    );
  }
  return null;
};

export const ConfigButton = ({
  children,
  ...buttonProps
}: React.PropsWithChildren<React.ComponentProps<typeof ZuButton>>) => {
  return (
    <ZuButton
      startIcon={<SettingIcon size={4} />}
      sx={{
        padding: '4px 10px',
        borderRadius: '10px',
        bgcolor: 'rgba(255, 255, 255, 0.05)',
        fontSize: '14px',
        fontWeight: 600,
        lineHeight: 1.2,
        ...buttonProps.sx,
      }}
      {...buttonProps}
    >
      {children}
    </ZuButton>
  );
};

export const TitleWithTag = ({
  required = true,
  leftIcon,
  tags = [],
  title,
  desc,
  buttonText,
  opacity = 1,
  onClick,
  right,
}: {
  required?: boolean;
  leftIcon?: React.ReactNode;
  tags?: TagProps[];
  title: string;
  desc: string;
  opacity?: number;
  buttonText?: string;
  right?: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <Stack spacing="10px" id={title.replace(/\s+/g, '')}>
      <Stack direction="row" spacing="40px" justifyContent="space-between">
        <Stack alignItems="center" direction="row" gap="10px">
          <Stack alignItems="flex-start" flexDirection="row" gap="10px">
            {required && (
              <Typography
                fontSize={20}
                fontWeight={700}
                lineHeight={1.2}
                color="#FF9C66"
              >
                *
              </Typography>
            )}
            {leftIcon ? leftIcon : null}
            <Typography
              fontSize={20}
              fontWeight={700}
              lineHeight={1.2}
              sx={{ opacity }}
            >
              {title}
            </Typography>
          </Stack>
          {tags.map((tag, index) => (
            <Tag key={index} {...tag} />
          ))}
        </Stack>
        {right
          ? right
          : buttonText && (
              <ConfigButton onClick={onClick}>{buttonText}</ConfigButton>
            )}
      </Stack>
      <Typography fontSize={14} lineHeight={1.6} sx={{ opacity: 0.8 }}>
        {desc}
      </Typography>
    </Stack>
  );
};

interface ConfigPanelProps {
  isGreenBorder?: boolean;
  title: string;
  desc: React.ReactNode;
  icon?: React.ReactNode;
  needButton?: boolean;
  buttonText?: string;
  handleOpen?: () => void;
}

export const ConfigPanel = ({
  isGreenBorder = false,
  title,
  desc,
  icon,
  needButton = true,
  buttonText = 'Go Setup',
  handleOpen,
}: ConfigPanelProps) => {
  return (
    <Stack
      direction="column"
      alignItems="center"
      bgcolor="#2d2d2d"
      padding="20px 10px"
      borderRadius="10px"
      spacing="14px"
      border={!isGreenBorder ? 'none' : '1px solid rgba(125, 255, 209, 0.40)'}
    >
      {icon || <SettingIcon color="#6c6c6c" size={7.5} />}
      <Stack spacing="10px" alignItems="center">
        <Typography
          fontSize="18px"
          fontWeight={700}
          lineHeight={1.2}
          sx={{ opacity: 0.8 }}
        >
          {title}
        </Typography>
        <Typography fontSize="13px" lineHeight={1.4} sx={{ opacity: 0.5 }}>
          {desc}
        </Typography>
      </Stack>
      {needButton && (
        <ZuButton
          sx={{
            padding: '6px 10px',
            borderRadius: '10px',
            opacity: 0.7,
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: 1.2,
          }}
          onClick={handleOpen}
        >
          {buttonText}
        </ZuButton>
      )}
    </Stack>
  );
};

type Status = { checkinOpen: boolean; registrationOpen: boolean };

interface EventContextType {
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
}

const StatusContext = createContext<EventContextType | undefined>(undefined);

export const useStatusContext = () => {
  const context = useContext(StatusContext);
  if (context === undefined) {
    throw new Error('useStatusContext must be used within an StatusProvider');
  }
  return context;
};

interface StatusProviderProps {
  children: ReactNode;
}

export const StatusProvider: React.FC<StatusProviderProps> = ({ children }) => {
  const [status, setStatus] = useState<Status>({
    checkinOpen: false,
    registrationOpen: false,
  });

  return (
    <StatusContext.Provider value={{ status, setStatus }}>
      {children}
    </StatusContext.Provider>
  );
};
