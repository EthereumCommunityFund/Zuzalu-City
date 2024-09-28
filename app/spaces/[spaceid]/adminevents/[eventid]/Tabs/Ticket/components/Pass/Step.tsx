import { Box, Divider, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState, useCallback } from 'react';
import { CommonWrapper, Title, Item, ButtonGroup } from './Common';
import { ItemType } from './types';
import { isAddress } from 'viem';
import { Controller, useFormContext } from 'react-hook-form';
import { MegaPhoneIcon, ScrollPassIcon, ZuPassIcon } from '@/components/icons';

interface CommonProps {
  handleClose: () => void;
  handleNext: () => void;
}

export const StepOne = ({ handleClose, handleNext }: CommonProps) => {
  const [addressError, setAddressError] = useState('');

  const { watch, setValue, control } = useFormContext();
  const whitelist = watch('whitelist');
  const access = watch('access');

  const validateAddresses = useCallback((input: string) => {
    if (!input) {
      setAddressError('Please enter addresses');
      return false;
    }
    const addressList = input.split(',').map((addr) => addr.trim());
    const invalidAddresses = addressList.filter((addr) => !isAddress(addr));

    const hasInvalidAddresses = invalidAddresses.length > 0;
    setAddressError(
      hasInvalidAddresses
        ? `Invalid addresses: ${invalidAddresses.join(', ')}`
        : '',
    );
    return !hasInvalidAddresses;
  }, []);

  const handleNextWithValidation = useCallback(() => {
    if (access === 'Private Whitelist' && !validateAddresses(whitelist)) {
      return;
    }
    handleNext();
  }, [access, validateAddresses, whitelist, handleNext]);

  const stepOneItems = useMemo<ItemType[]>(
    () => [
      {
        id: 'Open-to-all',
        name: 'Open-to-all',
        description: 'Anybody can register',
      },
      {
        id: 'Private Whitelist',
        name: 'Private Whitelist',
        description: 'Only invited addresses can register',
        expandedContent: (
          <Stack spacing="10px" p="10px">
            <Typography fontSize={16} lineHeight={1.2} fontWeight={700}>
              Input Initial Whitelisted Addresses (EVM-based addresses)
            </Typography>
            <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.6 }}>
              Use a comma to add multiple addresses in the input field.
            </Typography>
            <Controller
              name="whitelist"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  maxRows={4}
                  minRows={4}
                  autoFocus
                  error={!!addressError}
                  helperText={addressError}
                />
              )}
            />
            <Typography
              fontSize={14}
              lineHeight={1.6}
              color="#7DFFD1"
              textAlign="right"
            >
              This list can be edited later
            </Typography>
          </Stack>
        ),
      },
      {
        id: 'Require Credential',
        customName: (
          <>
            <Typography fontSize={16} lineHeight={1.6}>
              Require Credential
            </Typography>
            <Typography fontSize={14} lineHeight={1.6} fontWeight={600}>
              [COMING SOON]
            </Typography>
          </>
        ),
        description: 'Anybody with these credentials can register',
        disabled: true,
      },
    ],
    [control, addressError],
  );

  return (
    <Stack padding="20px" spacing="20px">
      <CommonWrapper>
        <Title
          title="Registration Access"
          description="Choose who can register to this event"
        />
        <Stack spacing="10px">
          {stepOneItems.map((item) => (
            <Item
              key={item.id}
              item={item}
              isSelected={item.id === access}
              onSelect={() => setValue('access', item.id)}
              expandedContent={item.expandedContent}
            />
          ))}
        </Stack>
      </CommonWrapper>
      <ButtonGroup
        isBackButton={false}
        isDisabled={!access}
        handleNext={handleNextWithValidation}
        handleBack={handleClose}
      />
    </Stack>
  );
};

const stepTwoItems: ItemType[] = [
  {
    id: 'no',
    name: 'No Ticketing Required',
    description:
      'This option allows you whitelisting of user addresses for access to this event’s schedule',
  },
  {
    id: 'scrollpass',
    name: 'Scrollpass',
    description:
      'Decentralized NFT/Ticketing System via Scrollwith Whitelisting on Zuzalu.city',
    icon: <ScrollPassIcon size={5} />,
  },
  {
    id: 'zupass',
    name: 'Zupass',
    description:
      'Ticketing System with Zero-Knowledge with Whitelisting on Zuzalu.city',
    icon: <ZuPassIcon size={5} />,
  },
  {
    id: 'zulotto',
    name: 'ZuLotto Ticketing',
    description: 'COMING SOON',
    disabled: true,
    hasWhitelisting: true,
  },
];

export const StepTwo = ({ handleClose, handleNext }: CommonProps) => {
  const { watch, setValue, control } = useFormContext();
  const pass = watch('pass');

  return (
    <Stack padding="20px" spacing="20px">
      <CommonWrapper>
        <Title
          title="Select a Ticketing App"
          description="Select a ticketing method for this event to use"
        />
        {stepTwoItems.slice(0, 1).map((item) => (
          <Item
            key={item.id}
            item={item}
            isSelected={item.id === pass}
            onSelect={() => setValue('pass', item.id)}
            expandedContent={item.expandedContent}
          />
        ))}
        <Stack spacing="10px">
          <Divider />
          <Typography
            fontSize={13}
            lineHeight={1.4}
            color="#FF9C66"
            sx={{ opacity: 0.8 }}
            textAlign="center"
          >
            Selection below cannot be undone after confirmation
          </Typography>
          {stepTwoItems.slice(1).map((item) => (
            <Item
              key={item.id}
              item={item}
              isSelected={item.id === pass}
              onSelect={() => setValue('pass', item.id)}
              expandedContent={item.expandedContent}
            />
          ))}
        </Stack>
        <Stack
          borderTop="1px dashed rgba(255, 255, 255, 0.10)"
          pt="20px"
          spacing="10px"
        >
          <Typography
            fontSize={13}
            lineHeight={1.2}
            fontWeight={700}
            sx={{ opacity: 0.8 }}
          >
            Whitelisting is a default function for every option
          </Typography>
          <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.8 }}>
            What is whitelisting? A whitelist is a list or register of entities
            (EVM-based blockchain addresses) that are being provided a
            particular privilege, service, mobility, access or recognition.
            Entities on the list will be accepted, approved and/or recognized.
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
          More apps for ticketing will be integrated in the near future. Stay
          updated here [link here]. For integration, get involved in our
          community here [link here].
        </Typography>
      </Stack>
      <ButtonGroup
        isDisabled={!pass}
        handleNext={handleNext}
        handleBack={handleClose}
      />
    </Stack>
  );
};
