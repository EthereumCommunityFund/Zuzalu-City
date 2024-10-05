import {
  Box,
  Collapse,
  Divider,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState, useCallback } from 'react';
import { CommonWrapper, Title, Item, ButtonGroup } from '../Common';
import {
  ItemType,
  ConfigFormType,
  RegistrationAccess,
  TicketingMethod,
  ApplyRule,
  ApplyOption,
} from '../types';
import { isAddress } from 'viem';
import { Controller, useFormContext } from 'react-hook-form';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationCircleIcon,
  InformationIcon,
  LottoPGFIcon,
  MegaPhoneIcon,
  ScrollPassIcon,
  ZuPassIcon,
} from '@/components/icons';

interface CommonProps {
  handleClose: () => void;
  handleNext: () => void;
}

export const StepOne = ({ handleClose, handleNext }: CommonProps) => {
  const [addressError, setAddressError] = useState('');

  const { watch, setValue, control } = useFormContext<ConfigFormType>();
  const whitelist = watch('whitelist') || '';
  const access = watch('access') || '';

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
        id: RegistrationAccess.OpenToAll,
        name: 'Open-to-all',
        description: 'Anybody can register',
      },
      {
        id: RegistrationAccess.Whitelist,
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
    id: TicketingMethod.NoTicketing,
    name: 'No Ticketing Required',
    description:
      'This option allows you whitelisting of user addresses for access to this event’s schedule',
  },
  {
    id: TicketingMethod.ScrollPass,
    name: 'Scrollpass',
    description:
      'Decentralized NFT/Ticketing System via Scrollwith Whitelisting on Zuzalu.city',
    icon: <ScrollPassIcon size={5} />,
    warning:
      'Disclaimer: This protocol has only been audited internally by the Scroll team, use at your own risk.'.toUpperCase(),
  },
  {
    id: TicketingMethod.ZuPass,
    name: 'Zupass',
    description:
      'Ticketing System with Zero-Knowledge with Whitelisting on Zuzalu.city',
    icon: <ZuPassIcon size={5} />,
    isExternal: true,
  },
  {
    id: TicketingMethod.LottoPGF,
    name: 'LottoPGF',
    description: 'COMING SOON',
    disabled: true,
    isExternal: true,
    icon: <LottoPGFIcon size={5} />,
  },
];

export const StepTwo = ({
  handleClose,
  handleNext,
  isFirstStep = false,
}: CommonProps & { isFirstStep: boolean }) => {
  const { watch, setValue } = useFormContext<ConfigFormType>();
  const pass = watch('pass') || '';

  const [openTips, setOpenTips] = useState(false);

  const handlePassChange = useCallback(
    (id: string) => {
      if (id !== pass) {
        setValue('apply', '');
        setValue('options', '');
      }
      setValue('pass', id);
    },
    [setValue, pass],
  );

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
          <Stack
            direction="row"
            alignItems="center"
            spacing="5px"
            justifyContent="center"
          >
            <ExclamationCircleIcon size={4} color="#FF9C66" />
            <Typography
              fontSize={13}
              lineHeight={1.4}
              color="#FF9C66"
              sx={{ opacity: 0.8 }}
              textAlign="center"
            >
              Selection below cannot be undone after confirmation
            </Typography>
          </Stack>
          {stepTwoItems.slice(1).map((item) => (
            <Item
              key={item.id}
              item={item}
              isSelected={item.id === pass}
              onSelect={() => handlePassChange(item.id)}
              expandedContent={item.expandedContent}
            />
          ))}
        </Stack>
        <Stack
          borderTop="1px dashed rgba(255, 255, 255, 0.10)"
          pt="20px"
          spacing="10px"
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ cursor: 'pointer' }}
            onClick={() => setOpenTips(!openTips)}
          >
            <Typography
              fontSize={13}
              lineHeight={1.2}
              fontWeight={700}
              sx={{ opacity: 0.8 }}
            >
              Whitelisting is a default function for every option
            </Typography>
            <Stack direction="row" alignItems="center" gap="4px">
              <Typography fontSize={13} lineHeight={1.4}>
                What is Whitelisting?
              </Typography>
              {openTips ? (
                <ChevronDownIcon size={3} />
              ) : (
                <ChevronUpIcon size={3} />
              )}
            </Stack>
          </Stack>
          <Collapse in={openTips}>
            <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.8 }}>
              What is whitelisting? A whitelist is a list or register of
              entities (EVM-based blockchain addresses) that are being provided
              a particular privilege, service, mobility, access or recognition.
              Entities on the list will be accepted, approved and/or recognized.
            </Typography>
          </Collapse>
        </Stack>
      </CommonWrapper>
      <Stack
        p="10px"
        spacing="20px"
        direction="row"
        bgcolor="rgba(255, 255, 255, 0.02)"
        borderRadius="10px"
      >
        <MegaPhoneIcon
          style={{ flexShrink: 0 }}
          color="rgba(255, 255, 255, 0.8)"
        />
        <Typography fontSize={14} lineHeight={1.6} sx={{ opacity: 0.8 }}>
          More apps for ticketing will be integrated in the near future. Stay
          updated{' '}
          <Link
            href="https://zuzalu.gitbook.io/zuzalucitybeta/stay-updated/how-to-stay-updated"
            target="_blank"
          >
            here
          </Link>
          . For integration, get involved in our community{' '}
          <Link
            href="https://matrix.to/#/#zuzalusoftware:matrix.org"
            target="_blank"
          >
            here
          </Link>
          .
        </Typography>
      </Stack>
      <ButtonGroup
        isBackButton={!isFirstStep}
        isDisabled={!pass}
        handleNext={handleNext}
        handleBack={handleClose}
      />
    </Stack>
  );
};

const stepThreeItemObject: Record<string, ItemType[]> = {
  [TicketingMethod.NoTicketing]: [
    {
      id: ApplyRule.Join,
      name: 'Apply to Join',
      description: 'Requires users to apply and be approved to join',
    },
    {
      id: ApplyRule.NoApplication,
      name: 'No Application Required',
      description: 'Registration to event is open',
      options: [
        {
          id: ApplyOption.RequireBasicInfo,
          name: 'Require basic information about user?',
        },
      ],
    },
  ],
  [TicketingMethod.ZuPass]: [
    {
      id: ApplyRule.RequireApplication,
      name: 'Require Application Form',
      description: (
        <>
          Zupass requires <b>email address</b> to issue Zupasses. Application
          form will have a required field for email address.
        </>
      ),
      icon: <ZuPassIcon size={5} />,
    },
  ],
  [TicketingMethod.ScrollPass]: [
    {
      id: ApplyRule.Purchase,
      name: 'Apply to Purchase (whitelist to contract)',
      description:
        'Require users to apply and be approved to the event before they mint',
    },
    {
      id: ApplyRule.NoApplication,
      name: 'No Application Required (no whitelisting)',
      description:
        'No approval required to purchase. This allows anyone to mint a ticket, even outside of Zuzalu.city.',
      options: [
        {
          id: ApplyOption.RequireBasicInfo,
          name: 'Require basic information about user?',
          warning:
            'Please note that if a user interacts with the Scrollpass contract outside of Zuzalu.city, they can mint a ticket without filling out the required basic information.',
        },
      ],
    },
  ],
};

export const StepThree = ({ handleClose, handleNext }: CommonProps) => {
  const { watch, setValue } = useFormContext<ConfigFormType>();
  const apply = watch('apply') || '';
  const pass = watch('pass') || '';
  const options = watch('options') || '';

  return (
    <Stack padding="20px" spacing="20px">
      <CommonWrapper>
        <Title
          title="Applying to Event"
          description="Choose an option for users to apply to join this event"
        />
        <Stack spacing="10px">
          {stepThreeItemObject[pass].map((item) => (
            <Item
              key={item.id}
              item={item}
              isSelected={item.id === apply}
              onSelect={() => {
                if (item.id !== apply) {
                  setValue('options', '');
                }
                setValue('apply', item.id);
              }}
              options={item.options}
              onOptionsChange={(optionIds) =>
                setValue('options', optionIds.join(','))
              }
              selectedOptions={options.split(',') || []}
            />
          ))}
          <Typography fontSize={14} lineHeight={1.6} color="#7DFFD1">
            Application setting will be available in your event panel.
          </Typography>
          <Typography fontSize={14} lineHeight={1.6} color="#7DFFD1">
            {options.includes('form') &&
              'Form setting will be available in your event panel.'}
          </Typography>
        </Stack>
      </CommonWrapper>
      <ButtonGroup
        isDisabled={!apply}
        handleNext={handleNext}
        handleBack={handleClose}
      />
    </Stack>
  );
};

export const StepFour = ({ handleClose, handleNext }: CommonProps) => {
  const { watch } = useFormContext<ConfigFormType>();
  const access = watch('access') || '';
  const apply = watch('apply') || '';
  const pass = watch('pass') || '';
  const options = watch('options') || '';

  const list = useMemo(() => {
    return [
      {
        name: 'Registration Access:',
        value: access,
        desc: `You are allowing ${access === RegistrationAccess.OpenToAll ? 'anybody' : 'whitelisted addresses'} to interact with registration to apply or directly join/purchase.`,
      },
      {
        name: 'Ticketing Method:',
        value: pass,
        desc:
          pass === TicketingMethod.NoTicketing ? (
            'You are choosing no ticketing for this event. You can choose to switch to a ticketing method at a later time.'
          ) : pass === TicketingMethod.ZuPass ? (
            'You are choosing Zupass for this event. You cannot be undone after confirmation.'
          ) : (
            <>
              In order to use ScrollPass, this event will need to be added to
              the parent contract.{' '}
              <b>You will sign a transaction for this process on Scroll.</b>
            </>
          ),
      },
      {
        name: 'Event Join Rule:',
        value: apply,
        desc:
          apply === ApplyRule.Join
            ? `Require users to submit an application through an approval process before gaining access to the event's schedule.`
            : 'Need Copy',
      },
    ];
  }, [access, pass, apply]);

  return (
    <Stack padding="20px" spacing="20px">
      <CommonWrapper>
        <Title title="Your Configuration Summary" />
        <Stack p="20px" bgcolor="rgba(255, 255, 255, 0.02)" borderRadius="10px">
          {list.map((item, index) => (
            <Stack spacing="10px" key={index} mt={index !== 0 ? '15px' : '0'}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography
                  fontSize={16}
                  lineHeight={1.2}
                  fontWeight={600}
                  sx={{ opacity: 0.8 }}
                >
                  {item.name}
                </Typography>
                <Typography
                  fontSize={16}
                  lineHeight={1.6}
                  sx={{ opacity: 0.8 }}
                >
                  {item.value}
                </Typography>
              </Stack>
              <Typography fontSize={13} lineHeight={1.6} sx={{ opacity: 0.6 }}>
                {item.desc}
              </Typography>
              {index !== list.length - 1 && <Divider />}
            </Stack>
          ))}
        </Stack>
      </CommonWrapper>
      <ButtonGroup
        isConfirmButton
        handleNext={handleNext}
        handleBack={handleClose}
      />
    </Stack>
  );
};
