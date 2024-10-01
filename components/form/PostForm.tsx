import {
  Box,
  Chip,
  FormHelperText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import FormHeader from './FormHeader';
import {
  FormLabel,
  FormLabelDesc,
  FormTitle,
} from '../typography/formTypography';
import { ZuInput } from '../core';
import SelectCheckItem from '../select/selectCheckItem';
import SuperEditor from '../editor/SuperEditor';
import FormFooter from './FormFooter';
import { useEditorStore } from '../editor/useEditorStore';
import Yup from '@/utils/yupExtensions';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { POST_TAGS } from '@/constant';
import { createPost, updatePost } from '@/services/announcements';
import { useCeramicContext } from '@/context/CeramicContext';
import { useParams } from 'next/navigation';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import { useMutation } from '@tanstack/react-query';
import { Post } from '@/types';
import SelectCategories from '../select/selectCategories';

interface PostFormProps {
  handleClose: () => void;
  initialData?: Post;
  refetch: () => void;
}

const schema = Yup.object().shape({
  title: Yup.string().required('Post title is required'),
  tags: Yup.array(Yup.string().required('Tag is required')).min(
    1,
    'At least one tag is required',
  ),
  description: Yup.string(),
});

type FormData = Yup.InferType<typeof schema>;

const PostForm: React.FC<PostFormProps> = ({
  handleClose,
  initialData,
  refetch,
}) => {
  const { breakpoints } = useTheme();
  const descriptionEditorStore = useEditorStore();
  const { profile } = useCeramicContext();
  const params = useParams();
  const eventId = params.eventid.toString();

  const [blockClickModal, setBlockClickModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: initialData?.title || '',
      tags: initialData?.tags.split(',') || [],
    },
  });

  const tags = watch('tags') || [];

  useEffect(() => {
    if (initialData?.description) {
      descriptionEditorStore.setValue(initialData.description);
    }
  }, [initialData]);

  const resetForm = useCallback(() => {
    reset();
    descriptionEditorStore.clear();
  }, [descriptionEditorStore, reset]);

  const submitMutation = useMutation({
    mutationFn: ({ type, data }: { type: 'create' | 'edit'; data: any }) => {
      if (type === 'create') {
        return createPost(data);
      } else {
        return updatePost(data.id, data);
      }
    },
    onSuccess: () => {
      setShowModal(true);
      setBlockClickModal(false);
      resetForm();
      refetch();
    },
  });

  const handlePost = useCallback(
    async (data: FormData) => {
      if (
        !descriptionEditorStore.value ||
        !descriptionEditorStore.value.blocks ||
        descriptionEditorStore.value.blocks.length == 0
      ) {
        setError('description', {
          message: 'Description is required',
        });
        window.alert('Description is required');
        return;
      }
      const { title, tags = [] } = data;
      const description = descriptionEditorStore.getValueString();

      if (initialData) {
        await submitMutation.mutateAsync({
          type: 'edit',
          data: {
            id: initialData.id,
            title,
            tags: tags.join(','),
            description,
          },
        });
      } else {
        await submitMutation.mutateAsync({
          type: 'create',
          data: {
            eventId,
            title,
            tags: tags.join(','),
            description,
            creator: JSON.stringify(profile),
          },
        });
      }
    },
    [
      descriptionEditorStore,
      initialData,
      setError,
      submitMutation,
      eventId,
      profile,
    ],
  );

  const onFormError = useCallback(() => {
    window.alert('Please input all necessary fields.');
  }, []);

  const handleDialogClose = useCallback(() => {
    setShowModal(false);
    setBlockClickModal(false);
    handleClose();
  }, [handleClose]);

  const initialTags = useMemo(() => {
    if (!initialData) return [];
    return POST_TAGS.filter((item) => initialData?.tags.includes(item.value));
  }, [initialData]);

  return (
    <Box>
      <Dialog
        title={initialData ? 'Post Updated' : 'Post Created'}
        message="Please view it."
        showModal={showModal}
        onClose={handleDialogClose}
        onConfirm={handleDialogClose}
      />
      <Dialog
        showModal={blockClickModal}
        showActions={false}
        title={initialData ? 'Post Updated' : 'Post Created'}
        message={`Please wait while the post is being ${
          initialData ? 'updated...' : 'created...'
        }`}
      />
      <FormHeader
        title={initialData ? 'Edit Post' : 'Create Post'}
        handleClose={handleClose}
      />
      <Box
        display="flex"
        flexDirection="column"
        gap="20px"
        padding={3}
        flex={1}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <FormTitle>Post Announcment</FormTitle>
        </Stack>
        <Stack
          direction={'column'}
          spacing="30px"
          bgcolor="#262626"
          padding="20px"
          borderRadius="10px"
        >
          <FormTitle>Post Details</FormTitle>
          <Stack spacing="10px">
            <FormLabel>Post Title*</FormLabel>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <ZuInput {...field} placeholder="Type a title" />
              )}
            />
            {errors?.title && (
              <FormHelperText error>{errors?.title.message}</FormHelperText>
            )}
          </Stack>
          <Stack spacing="20px">
            <Stack spacing="10px">
              <FormLabel>Post Tags</FormLabel>
              <FormLabelDesc>
                Search or create categories related to your post
              </FormLabelDesc>
            </Stack>
            <Box>
              <Controller
                control={control}
                name="tags"
                render={({ field }) => (
                  <SelectCategories
                    onChange={(value) => {
                      setValue('tags', value);
                    }}
                    initialValues={initialTags}
                    options={POST_TAGS}
                  />
                )}
              />
              {errors?.tags && (
                <FormHelperText error>{errors?.tags.message}</FormHelperText>
              )}
            </Box>
            <Stack spacing="10px">
              <Typography variant="subtitle2" color="white">
                Post Content*
              </Typography>
              <FormLabelDesc>Write your post here</FormLabelDesc>
              <SuperEditor
                placeholder="Type post content"
                value={descriptionEditorStore.value}
                onChange={(val) => {
                  descriptionEditorStore.setValue(val);
                }}
              />
              {errors?.description && (
                <FormHelperText error>
                  {errors?.description.message}
                </FormHelperText>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Box padding={3}>
        <FormFooter
          confirmText={
            initialData ? 'Update Announcement' : 'Post Announcement'
          }
          disabled={false}
          handleClose={handleClose}
          handleConfirm={handleSubmit(handlePost, onFormError)}
        />
      </Box>
    </Box>
  );
};

export default PostForm;
