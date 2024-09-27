import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import FormHeader from '@/components/form/FormHeader';
import {
  LeftArrowIcon,
  MegaPhoneIcon,
  RightArrowIcon,
  ScrollPassIcon,
  ZuPassIcon,
} from '@/components/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { updateCheckinPass } from '@/services/event/updateEvent';
import { CommonWrapper, Title, Item } from './Common';
import { ItemType } from './types';
import { StepOne } from './Step';
import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const registrationMethods: ItemType[] = [
  {
    id: 'scrollpass',
    name: 'Scrollpass',
    description:
      'Decentralized NFT/Ticketing System via Scrollwith Whitelisting on Zuzalu.city',
    icon: <ScrollPassIcon size={5} />,
    selectedIcon: <ScrollPassIcon size={7.5} />,
    hasWhitelisting: true,
  },
  {
    id: 'zupass',
    name: 'Zupass',
    description:
      'Ticketing System with Zero-Knowledge with Whitelisting on Zuzalu.city',
    icon: <ZuPassIcon size={5} />,
    selectedIcon: <ZuPassIcon size={7.5} />,
    hasWhitelisting: false,
  },
  {
    id: 'none',
    name: 'None',
    description: `This option allows you whitelisting of user addresses for access to this event's schedule`,
    icon: '',
    hasWhitelisting: true,
    selectedIcon: '',
  },
  {
    id: 'zulotto',
    name: 'ZuLotto Ticketing',
    description: 'COMING SOON',
    icon: <ZuPassIcon size={5} />,
    selectedIcon: <ZuPassIcon size={7.5} />,
    disabled: true,
    hasWhitelisting: true,
  },
];

interface RegistrationMethodSelectorProps {
  onClose: () => void;
}

const schema = yup.object().shape({
  access: yup.string(),
  whitelist: yup.string(),
});

const ConfigForm: React.FC<RegistrationMethodSelectorProps> = ({ onClose }) => {
  const [selectedMethod, setSelectedMethod] = useState('scrollpass');
  const [step, setStep] = useState(1);

  const queryClient = useQueryClient();
  const pathname = useParams();
  const formMethods = useForm({
    resolver: yupResolver(schema),
  });

  const eventId = pathname.eventid.toString();

  const updateEventPass = useMutation({
    mutationFn: ({ eventId, pass }: { eventId: string; pass: string }) => {
      return updateCheckinPass(eventId, pass);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['fetchEventById', eventId],
      });
      setStep(1);
      onClose();
    },
  });
  const isLoading = updateEventPass.isPending;

  const handleMethodChange = useCallback((methodId: string) => {
    setSelectedMethod(methodId);
  }, []);

  const handleStep = useCallback(
    (type: 'next' | 'back') => {
      if (step === 2) {
        updateEventPass.mutateAsync({
          eventId,
          pass: selectedMethod,
        });
        return;
      }
      setStep((v) => (type === 'next' ? v + 1 : v - 1));
    },
    [eventId, selectedMethod, step, updateEventPass],
  );

  const method = useMemo(
    () => registrationMethods.find((item) => item.id === selectedMethod),
    [selectedMethod],
  );

  return (
    <Box
      sx={{
        width: '700px',
      }}
      role="presentation"
      zIndex="100"
      borderLeft="1px solid #383838"
    >
      <FormHeader handleClose={onClose} title="Configure Passes" />
      <FormProvider {...formMethods}>
        {step === 1 ? (
          <StepOne
            handleClose={onClose}
            handleNext={() => handleStep('next')}
          />
        ) : step === 2 ? (
          <Stack padding="20px" spacing="20px">
            <CommonWrapper>
              <Title
                title="Select a Registration Method"
                description="Select a method of registration and ticketing for this event to use this selection cannot be changed once confirmed."
              />
              <Stack spacing="10px">
                {registrationMethods.map((method) => (
                  <Item
                    key={method.id}
                    method={method}
                    isSelected={method.id === selectedMethod}
                    onSelect={handleMethodChange}
                    hasExpandableContent={!method.disabled}
                  />
                ))}
                <Typography
                  fontSize={13}
                  lineHeight={1.4}
                  fontWeight={700}
                  sx={{ opacity: 0.6 }}
                >
                  <span style={{ color: '#FF9C66' }}>
                    What is whitelisting?
                  </span>{' '}
                  A whitelist is a list or register of entities (EVM-compatible
                  blockchain addresses) that are being provided a particular
                  privilege, service, mobility, access or recognition. Entities
                  on the list will be accepted, approved and/or recognized.
                </Typography>
              </Stack>
            </CommonWrapper>
            <Stack
              p="10px"
              spacing="20px"
              direction="row"
              bgcolor="rgba(255, 255, 255, 0.02)"
              borderRadius="10px"
            >
              <MegaPhoneIcon style={{ flexShrink: 0 }} />
              <Typography fontSize={14} lineHeight={1.6} sx={{ opacity: 0.6 }}>
                More methods for registration will added in the near future.
                Stay updated [link here]. To propose new methods for event
                registration, get involved in our community [link here].
              </Typography>
            </Stack>
            <Button
              sx={{
                color: '#67DBFF',
                borderRadius: '10px',
                backgroundColor: 'rgba(103, 219, 255, 0.10)',
                fontSize: '14px',
                padding: '6px 16px',
                border: '1px solid rgba(103, 219, 255, 0.20)',
              }}
              startIcon={<RightArrowIcon size={5} color="#67DBFF" />}
              onClick={() => handleStep('next')}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Confirm'
              )}
            </Button>
          </Stack>
        ) : (
          <Stack padding="20px" spacing="20px">
            <Stack
              p="20px"
              spacing="30px"
              direction="column"
              sx={{
                borderRadius: '10px',
                bgcolor: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <Typography
                fontSize={20}
                fontWeight={700}
                lineHeight={1.2}
                sx={{ opacity: 0.7 }}
              >
                You Selected
              </Typography>
              <Box display="flex" gap="15px" alignItems="center">
                {method?.selectedIcon}
                <Typography fontSize={27} lineHeight={1.2}>
                  {method?.name}
                </Typography>
              </Box>
              <Typography fontSize={16} lineHeight={1.6} sx={{ opacity: 0.6 }}>
                {method?.description}
              </Typography>
            </Stack>
            <Stack spacing="20px" direction="row">
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
                startIcon={<LeftArrowIcon size={5} />}
                onClick={() => handleStep('back')}
                disabled={isLoading}
              >
                Back
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
                  !isLoading && <RightArrowIcon size={5} color="#67DBFF" />
                }
                onClick={() => handleStep('next')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Confirm'
                )}
              </Button>
            </Stack>
          </Stack>
        )}
      </FormProvider>
    </Box>
  );
};

export default ConfigForm;
