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
import { useCallback, useEffect } from 'react';
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
import { VENUE_TAGS } from '@/constant';

interface PostFormProps {
  handleClose: () => void;
  initialData?: {
    id: string;
    title: string;
    tags: string[];
    description: string;
  };
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

const PostForm: React.FC<PostFormProps> = ({ handleClose, initialData }) => {
  const { breakpoints } = useTheme();
  const descriptionEditorStore = useEditorStore();

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
      tags: initialData?.tags || [],
    },
  });

  const tags = watch('tags') || [];

  useEffect(() => {
    if (initialData?.description) {
      descriptionEditorStore.setValue(initialData.description);
    }
  }, [initialData, descriptionEditorStore]);

  const resetForm = useCallback(() => {
    reset();
    descriptionEditorStore.clear();
  }, [descriptionEditorStore, reset]);

  const handlePost = useCallback(
    (data: FormData) => {
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
      const { title, tags } = data;
      const description = descriptionEditorStore.value;

      if (initialData) {
        // Edit existing post
        console.log('Editing post:', initialData.id, title, tags, description);
        // TODO: Implement edit post API call
      } else {
        // Create new post
        console.log('Creating new post:', title, tags, description);
        // TODO: Implement create post API call
      }
    },
    [descriptionEditorStore.value, setError, initialData],
  );

  const onFormError = useCallback(() => {
    window.alert('Please input all necessary fields.');
  }, []);

  return (
    <Box
      sx={{
        width: '700px',
        backgroundColor: '#222222',
        [breakpoints.down('md')]: {
          width: '100%',
        },
      }}
      display="flex"
      flexDirection="column"
      role="presentation"
      zIndex="100"
      borderLeft="1px solid #383838"
    >
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
                  <Select
                    {...field}
                    multiple
                    value={field.value || []}
                    style={{ width: '100%' }}
                    input={<OutlinedInput label="Name" />}
                    renderValue={(selected) =>
                      (selected as string[]).join(', ')
                    }
                    MenuProps={{
                      PaperProps: {
                        style: {
                          backgroundColor: '#222222',
                        },
                      },
                    }}
                  >
                    {VENUE_TAGS.map((tag, index) => {
                      return (
                        <MenuItem value={tag.value} key={index}>
                          <SelectCheckItem
                            label={tag.label}
                            isChecked={
                              (field.value || []).findIndex(
                                (item) => item === tag.value,
                              ) > -1
                            }
                          />
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
              />
              {errors?.tags && (
                <FormHelperText error>{errors?.tags.message}</FormHelperText>
              )}
            </Box>
            <Box
              display={'flex'}
              flexDirection={'row'}
              gap={'10px'}
              flexWrap={'wrap'}
            >
              {tags.map((tag, index) => {
                return (
                  <Chip
                    label={VENUE_TAGS.find((item) => item.value === tag)?.label}
                    sx={{
                      borderRadius: '10px',
                    }}
                    onDelete={() => {
                      const newArray = tags.filter((item) => item !== tag);
                      setValue('tags', newArray);
                    }}
                    key={index}
                  />
                );
              })}
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
