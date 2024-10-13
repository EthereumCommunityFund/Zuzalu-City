import { ZuButton } from '@/components/core';
import { Collapse, Divider, Stack, Typography } from '@mui/material';
import { ChevronDownIcon, ChevronUpIcon, WrenchIcon } from '@/components/icons';
import { useMemo, useState } from 'react';
import { RoundCheckbox, useStatusContext } from '../Common';
import { RegistrationAndAccess } from '@/types';
import { RegistrationAccess, TicketingMethod } from '../types';
import useRegAndAccess from '@/hooks/useRegAndAccess';

interface ChecklistProps {
  regAndAccess?: RegistrationAndAccess;
}

export default function CheckList({ regAndAccess }: ChecklistProps) {
  const [showGuide, setShowGuide] = useState(true);
  const { hasCheckin, noApplication, showAccessRuleCheckin } = useRegAndAccess({
    regAndAccess,
  });
  const { status } = useStatusContext();

  const checklistItems = useMemo(() => {
    if (!regAndAccess) return [];
    const list = [];
    const {
      registrationAccess,
      registrationWhitelist,
      applicationForm,
      ticketType,
      zuPassInfo,
      scrollPassTickets,
      zuLottoInfo,
    } = regAndAccess;
    const { registrationOpen, checkinOpen } = status;
    if (registrationOpen && (hasCheckin ? checkinOpen : true)) {
      return [];
    }
    if (registrationAccess === RegistrationAccess.Whitelist) {
      list.push({
        title: 'Add addresses to your private whitelist',
        checked: registrationWhitelist?.length > 0,
      });
    }
    if (ticketType !== TicketingMethod.NoTicketing) {
      list.push({
        title: 'Create a Ticket',
        checked: !!zuPassInfo || !!scrollPassTickets || !!zuLottoInfo,
      });
    }
    if (
      ticketType === TicketingMethod.ZuPass ||
      ticketType === TicketingMethod.ScrollPass
    ) {
      list.push({
        title: 'Configure Access Rules',
        checked: showAccessRuleCheckin,
      });
    }
    if (!noApplication) {
      list.push({
        title: 'Create Event Application Form',
        checked: !!applicationForm,
      });
    }
    list.push({
      title: 'Open Registration!',
      checked: registrationOpen,
    });
    if (hasCheckin) {
      list.push({
        title: 'Open Check-in!',
        checked: checkinOpen,
      });
    }
    return list;
  }, [regAndAccess, status, hasCheckin, noApplication, showAccessRuleCheckin]);

  if (checklistItems.length === 0) return null;

  return (
    <Stack p="10px" borderRadius="10px" bgcolor="rgba(255, 156, 102, 0.10)">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center" gap="10px">
          <WrenchIcon size={5} />
          <Typography fontSize="13px" lineHeight={1.3} color="#FF9C66">
            Optimal Guide to Configure Event Registration
          </Typography>
        </Stack>
        <ZuButton
          endIcon={
            showGuide ? (
              <ChevronUpIcon size={4} />
            ) : (
              <ChevronDownIcon size={4} />
            )
          }
          sx={{
            p: '2px 10px',
            gap: '4px',
            borderRadius: '5px',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
          }}
          onClick={() => setShowGuide(!showGuide)}
        >
          Show Checklist
        </ZuButton>
      </Stack>
      <Collapse in={showGuide}>
        <Stack
          color="#FF9C66"
          borderTop="1px dashed rgba(255, 156, 102, 0.20)"
          mt="10px"
          pt="10px"
        >
          <Stack
            p="10px"
            border="1px solid rgba(255, 255, 255, 0.10)"
            bgcolor="rgba(255, 255, 255, 0.05)"
            borderRadius="10px"
            spacing="20px"
          >
            <Typography fontSize="16px" fontWeight={600} lineHeight={1.2}>
              Checklist: (these are optimal steps based on your configuration)
            </Typography>
            <Stack spacing="10px">
              {checklistItems.map((item, index) => (
                <Stack
                  key={index}
                  direction="row"
                  alignItems="center"
                  spacing="10px"
                >
                  <RoundCheckbox
                    checked={item.checked}
                    iconColor="#FF9C66"
                    sx={{ color: 'rgba(255, 156, 102, 0.3)' }}
                  />
                  <Typography fontSize="14px" lineHeight={1.6}>
                    {item.title}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Collapse>
    </Stack>
  );
}
