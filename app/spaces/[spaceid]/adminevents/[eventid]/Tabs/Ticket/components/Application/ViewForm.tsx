import FormHeader from '@/components/form/FormHeader';
import { CheckIcon, XMarkIcon } from '@/components/icons';
import { Box, Button, Stack, Typography } from '@mui/material';
import { CommonWrapper } from '../Common';

interface ViewFormProps {
  onClose: () => void;
  handleOperate: (type: 'approve' | 'deny') => void;
}

export default function ViewForm({ onClose, handleOperate }: ViewFormProps) {
  const questions = ['Q1', 'Q2', 'Q3'];
  const answers = ['A1', 'A2', 'A3'];
  const isOperated = true;
  const isApproved = true;

  return (
    <Box>
      <FormHeader handleClose={onClose} title="Application Submission" />
      <Stack padding="20px" spacing="20px">
        <Stack spacing="10px">
          <Typography
            fontSize={20}
            fontWeight={700}
            lineHeight={1.2}
            sx={{ opacity: 0.7 }}
          >
            Manage Submission
          </Typography>
          <Typography
            fontSize={14}
            fontWeight={600}
            lineHeight={1.6}
            sx={{ opacity: 0.8 }}
          >
            Name
          </Typography>
          {!isOperated && (
            <Stack gap="20px" direction="row">
              <Button
                sx={{
                  color: '#FF5E5E',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 94, 94, 0.05)',
                  fontSize: '14px',
                  padding: '6px 16px',
                  border: '1px solid rgba(255, 94, 94, 0.20)',
                  flex: 1,
                }}
                startIcon={<XMarkIcon size={5} />}
                onClick={() => handleOperate('deny')}
              >
                Deny Applicant
              </Button>
              <Button
                sx={{
                  color: '#7DFFD1',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(125, 255, 209, 0.10)',
                  fontSize: '14px',
                  padding: '6px 16px',
                  border: '1px solid rgba(125, 255, 209, 0.20)',
                  flex: 1,
                }}
                startIcon={<CheckIcon size={5} />}
                onClick={() => handleOperate('approve')}
              >
                Approve Applicant
              </Button>
            </Stack>
          )}
        </Stack>
        <CommonWrapper>
          {isOperated && (
            <Stack spacing="10px">
              <Typography
                fontSize={14}
                fontWeight={600}
                lineHeight={1.6}
                sx={{ opacity: 0.8 }}
                color={isApproved ? '#7DFFD1' : '#FF5E5E'}
              >
                This applicant&apos;s submission was{' '}
                {isApproved ? 'approved' : 'denied'}
              </Typography>
              <Stack spacing="20px" direction="row" alignItems="center">
                <Typography
                  fontSize={14}
                  lineHeight={1.6}
                  sx={{ opacity: 0.8 }}
                >
                  Do you want to {!isApproved ? 'approve' : 'deny'} this
                  submission?
                </Typography>
                <Button
                  variant="text"
                  startIcon={
                    !isApproved ? (
                      <CheckIcon size={5} />
                    ) : (
                      <XMarkIcon size={5} color="#FF5E5E" />
                    )
                  }
                  sx={{
                    fontSize: '14px',
                    color: '#fff',
                    opacity: 0.8,
                    fontWeight: 600,
                    lineHeight: 1.6,
                    '& > .MuiButton-startIcon': {
                      marginRight: '5px',
                    },
                  }}
                  onClick={() => handleOperate(isApproved ? 'deny' : 'approve')}
                >
                  {!isApproved ? 'Approve' : 'Deny'}
                </Button>
              </Stack>
            </Stack>
          )}
          <Typography
            fontSize={20}
            fontWeight={700}
            lineHeight={1.2}
            sx={{ opacity: 0.7 }}
          >
            Answers
          </Typography>
          {questions.map((question, index) => (
            <Stack key={index} spacing="10px">
              <Typography fontSize={16} lineHeight={1.6}>
                {question}
              </Typography>
              <Typography fontSize={14} lineHeight={1.6}>
                {answers[index]}
              </Typography>
            </Stack>
          ))}
        </CommonWrapper>
      </Stack>
    </Box>
  );
}
