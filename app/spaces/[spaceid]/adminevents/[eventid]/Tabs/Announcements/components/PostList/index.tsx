import * as React from 'react';
import {
  Stack,
  Typography,
  OutlinedInput,
  InputAdornment,
  useTheme,
} from '@mui/material';
import ZuButton from 'components/core/Button';
import {
  PlusIcon,
  PlusCircleIcon,
  InformationIcon,
  SearchIcon,
} from 'components/icons';
import { Venue, Event } from '@/types';
import VenueCard from './PostCard';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface PostListListProps {
  venues?: Venue[];
  event?: Event;
  onToggle: (anchor: Anchor, open: boolean) => void;
  refetch: () => void;
  setSearchValue: React.Dispatch<React.SetStateAction<string>> | any;
}

const PostList: React.FC<PostListListProps> = ({
  venues,
  event,
  onToggle,
  setSearchValue,
  refetch,
}) => {
  const theme = useTheme();

  return (
    <Stack direction="column" spacing="20px">
      <Stack spacing="10px">
        <Stack direction="row" justifyContent="space-between">
          <Stack spacing="10px" direction="row" alignItems="center">
            <Typography variant="subtitleMB">Posts</Typography>
            <InformationIcon size={5} />
          </Stack>
          <ZuButton
            startIcon={<PlusIcon />}
            onClick={() => onToggle('right', true)}
          >
            Add a Post
          </ZuButton>
        </Stack>
        <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
          Announcement post live in the event view under a tab of the same name.
        </Typography>
      </Stack>
      <Stack spacing="20px">
        {venues?.length === 0 ? (
          <Stack
            direction="column"
            alignItems="center"
            bgcolor="#2d2d2d"
            padding="20px 10px"
            borderRadius={2}
            onClick={() => onToggle('right', true)}
            sx={{ cursor: 'pointer' }}
          >
            <PlusCircleIcon color="#6c6c6c" size={15} />
            <Typography variant="subtitle2">No Posts</Typography>
            <Typography variant="body2" sx={{ opacity: 0.5 }}>
              Add a Post
            </Typography>
          </Stack>
        ) : (
          venues?.map((venue, index) => (
            <VenueCard
              key={`VenueCard-${index}`}
              venue={venue}
              event={event}
              refetch={refetch}
            />
          ))
        )}
      </Stack>
    </Stack>
  );
};

export default PostList;
