import { Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState, useCallback } from 'react';
import { CommonWrapper, Title, Item, ButtonGroup } from './Common';
import { ItemType } from './types';
import { isAddress } from 'viem';
import { Controller, useFormContext } from 'react-hook-form';

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
        handleNext={handleNextWithValidation}
        handleBack={handleClose}
      />
    </Stack>
  );
};
