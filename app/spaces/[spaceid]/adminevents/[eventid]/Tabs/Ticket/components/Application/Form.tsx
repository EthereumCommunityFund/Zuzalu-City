import { Box, Stack, Typography, TextField, IconButton } from '@mui/material';
import FormHeader from '@/components/form/FormHeader';
import { CommonWrapper, Title, ButtonGroup } from '../Common';
import { useCallback } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PlusIcon, XCricleIcon } from '@/components/icons';
import { ZuButton } from '@/components/core';

interface FormProps {
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

export default function Form({ questions = [''], onClose }: FormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
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

  const onSubmit = useCallback((data: any) => {
    console.log('submit', data);
  }, []);

  return (
    <Box>
      <FormHeader handleClose={onClose} title="Application Form" />
      <Stack padding="20px" spacing="20px">
        <Stack spacing="10px">
          <Typography fontSize={20} fontWeight={700} lineHeight={1.2}>
            Create Application Form
          </Typography>
          <Typography fontSize={16} lineHeight={1.6} sx={{ opacity: 0.6 }}>
            Create the application form for users to submit
          </Typography>
        </Stack>
        <CommonWrapper>
          <Title title="Form Fields" />
          <Stack spacing={2}>
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
          </Stack>
        </CommonWrapper>
        <ButtonGroup
          isBackButton={false}
          isConfirmButton
          handleNext={handleSubmit(onSubmit)}
          handleBack={onClose}
        />
      </Stack>
    </Box>
  );
}
