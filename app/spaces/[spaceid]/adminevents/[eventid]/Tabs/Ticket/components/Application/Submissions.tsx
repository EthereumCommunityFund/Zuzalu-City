import { useCallback, useState } from 'react';
import { ZuButton } from '@/components/core';
import { Divider, Stack, Typography } from '@mui/material';
import { ConfigButton } from '../Common';
import { CheckIcon, XMarkIcon } from '@/components/icons';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import useOpenDraw from '@/hooks/useOpenDraw';
import ViewForm from './ViewForm';
import Draw from '@/components/drawer';

interface ItemProps {
  isLast: boolean;
  handleOperate: (type: 'approve' | 'deny') => void;
  handleView: () => void;
}

const Item = ({ isLast, handleOperate, handleView }: ItemProps) => {
  const isOperated = true;
  const isApproved = false;

  return (
    <Stack spacing="10px">
      <Stack
        direction="row"
        spacing="40px"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack spacing="10px" direction="row" alignItems="center">
          <ZuButton sx={{ padding: '4px 10px' }} onClick={handleView}>
            View
          </ZuButton>
          <Typography
            fontSize={14}
            fontWeight={600}
            lineHeight={1.6}
            sx={{ opacity: 0.8 }}
          >
            Name
          </Typography>
        </Stack>
        <Stack spacing="10px" direction="row" alignItems="center">
          {isOperated ? (
            <>
              <ConfigButton onClick={() => handleOperate('approve')}>
                Approve
              </ConfigButton>
              <ConfigButton onClick={() => handleOperate('deny')}>
                Deny
              </ConfigButton>
            </>
          ) : (
            <Stack
              p="4px 10px"
              spacing="8px"
              direction="row"
              alignItems="center"
              borderRadius="8px"
              bgcolor={
                isApproved
                  ? 'rgba(125, 255, 209, 0.10)'
                  : 'rgba(255, 94, 94, 0.10)'
              }
              color={isApproved ? '#7DFFD1' : '#FF5E5E'}
            >
              {isApproved ? <CheckIcon size={4} /> : <XMarkIcon size={4} />}
              <Typography fontSize={14} fontWeight={600} lineHeight={1.2}>
                {isApproved ? 'Approved' : 'Denied'}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
      {!isLast && <Divider />}
    </Stack>
  );
};

export default function Submissions() {
  const { open, handleOpen, handleClose } = useOpenDraw();
  const [showDialog, setShowDialog] = useState(false);
  const [needApprove, setNeedApprove] = useState(false);

  const handleDialog = useCallback(() => {
    setShowDialog((v) => !v);
  }, []);

  const handleOperate = useCallback(
    (type: 'approve' | 'deny') => {
      handleDialog();
      setNeedApprove(type === 'approve');
    },
    [handleDialog],
  );

  const handleView = useCallback(() => {
    handleOpen();
  }, [handleOpen]);

  const handleConfirm = useCallback(() => {
    handleDialog();
  }, [handleDialog]);

  const list = Array.from({ length: 10 }, (_, i) => i);

  return (
    <Stack
      p="20px"
      spacing="20px"
      bgcolor="rgba(255, 255, 255, 0.02)"
      sx={{ borderRadius: '10px' }}
    >
      <Dialog
        title={needApprove ? 'Approve Applicant' : 'Deny Applicant'}
        message={
          needApprove
            ? 'Do you want to approve this applicant?'
            : 'Do you want to deny this applicant?'
        }
        confirmText="Confirm"
        showModal={showDialog}
        onClose={handleDialog}
        onConfirm={handleConfirm}
      />
      <Draw open={open} onClose={handleClose} onOpen={handleOpen}>
        <ViewForm onClose={handleClose} handleOperate={handleOperate} />
      </Draw>
      <Typography
        fontSize={16}
        fontWeight={600}
        lineHeight={1.2}
        sx={{ opacity: 0.8 }}
      >
        Application Submissions
      </Typography>
      <Stack spacing="10px">
        {list.length === 0 ? (
          <Typography fontSize={14} lineHeight={1.6} sx={{ opacity: 0.8 }}>
            No Submissions
          </Typography>
        ) : (
          list.map((item, index) => (
            <Item
              key={item}
              isLast={index === list.length - 1}
              handleOperate={handleOperate}
              handleView={handleView}
            />
          ))
        )}
      </Stack>
    </Stack>
  );
}
