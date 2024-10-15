import {
  Box,
  Stack,
  Typography,
  TextField,
  IconButton,
  Divider,
} from '@mui/material';
import FormHeader from '@/components/form/FormHeader';
import { CommonWrapper, Title, ButtonGroup } from '../Common';
import { useCallback, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PlusIcon, XCricleIcon } from '@/components/icons';
import { ZuButton } from '@/components/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRegAndAccess } from '@/services/event/regAndAccess';
import { useParams } from 'next/navigation';
import { useCeramicContext } from '@/context/CeramicContext';
import { RegistrationAndAccess } from '@/types';
import { TicketingMethod } from '../types';
interface FormProps {
  regAndAccess?: RegistrationAndAccess;
  questions: string[];
  onClose: () => void;
}

const schema = yup.object().shape({
  questions: yup.array().of(
    yup.object().shape({
      question: yup.string().required('Question is required'),
    }),
  ),
});

export default function Form({
  questions = [''],
  onClose,
  regAndAccess,
}: FormProps) {
  const id = regAndAccess?.id;
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    values: {
      questions: questions.map((question) => ({ question })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const queryClient = useQueryClient();
  const pathname = useParams();
  const { profile } = useCeramicContext();
  const profileId = profile?.id || '';
  const eventId = pathname.eventid.toString();

  const updateMutation = useMutation({
    mutationFn: updateRegAndAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fetchEventById'],
      });
      reset();
      onClose();
    },
  });
  const isLoading = updateMutation.isPending;

  const onSubmit = useCallback(
    (data: yup.InferType<typeof schema>) => {
      updateMutation.mutate({
        type: 'question',
        id: id!,
        applicationForm: data.questions?.map((q) => q.question).join(','),
        profileId,
        eventId,
      });
    },
    [updateMutation, profileId, id, eventId],
  );

  const fixQuestions = useMemo(() => {
    if (!regAndAccess) return null;
    if (regAndAccess.ticketType === TicketingMethod.NoTicketing) return null;
    const list = [];
    if (regAndAccess.ticketType === TicketingMethod.ScrollPass) {
      list.push({
        text: 'Receiving Address',
        type: 'scrollPass',
      });
      if (regAndAccess.scrollPassTickets?.length) {
        list.push({
          text: 'Selected Ticket',
          type: 'scrollPass',
        });
      }
    }
    if (regAndAccess.ticketType === TicketingMethod.ZuPass) {
      list.push({
        text: 'Applicant Email',
        type: 'zuPass',
      });
    }
    return (
      <>
        <Divider />
        <Stack spacing="10px">
          <Typography fontSize={14} lineHeight={1.6} sx={{ opacity: 0.5 }}>
            Default required fields for applicants
          </Typography>
          {list.map((item) => (
            <Stack
              key={item.text}
              spacing="10px"
              direction="row"
              alignItems="center"
            >
              <Typography fontSize={16} fontWeight={700} lineHeight={1.2}>
                {item.text}
              </Typography>
              <Typography
                fontSize={13}
                lineHeight={1.4}
                sx={{
                  p: '4px 10px',
                  borderRadius: '6px',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                }}
              >
                {item.type === 'scrollPass'
                  ? 'Scrollpass Required Field'
                  : 'ZuPass Required Field'}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </>
    );
  }, [regAndAccess]);

  return (
    <Box>
      <FormHeader handleClose={onClose} title="Application Form" />
      <Stack padding="20px" spacing="20px">
        <Stack spacing="10px">
          <Typography fontSize={20} fontWeight={700} lineHeight={1.2}>
            {questions.length ? 'Edit' : 'Create'} Application Form
          </Typography>
          <Typography fontSize={16} lineHeight={1.6} sx={{ opacity: 0.6 }}>
            Create the application form for users to submit
          </Typography>
        </Stack>
        <CommonWrapper>
          <Title title="Form Fields" />
          <Stack spacing="20px">
            {fields.map((field, index) => (
              <Stack key={field.id} spacing="10px">
                <Typography fontSize={16} fontWeight={700} lineHeight={1.2}>
                  Question {index + 1}
                </Typography>
                <Stack direction="row" spacing="10px" alignItems="center">
                  <Controller
                    name={`questions.${index}.question`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        error={!!errors.questions?.[index]?.question}
                        helperText={
                          errors.questions?.[index]?.question?.message
                        }
                      />
                    )}
                  />
                  <IconButton onClick={() => remove(index)}>
                    <XCricleIcon size={6} color="rgba(255, 255, 255, 0.5)" />
                  </IconButton>
                </Stack>
              </Stack>
            ))}
            <ZuButton
              startIcon={<PlusIcon size={4} />}
              sx={{ width: '100%', p: '10px', fontWeight: 600 }}
              onClick={() => append({ question: '' })}
            >
              Add Question
            </ZuButton>
            {fixQuestions}
          </Stack>
        </CommonWrapper>
        <ButtonGroup
          isBackButton={false}
          isConfirmButton
          isLoading={isLoading}
          isDisabled={!isDirty}
          handleNext={handleSubmit(onSubmit)}
          handleBack={onClose}
        />
      </Stack>
    </Box>
  );
}
