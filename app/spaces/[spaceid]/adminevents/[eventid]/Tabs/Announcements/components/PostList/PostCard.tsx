import React, { useCallback, useMemo, useState } from 'react';
import { Box, Menu, MenuItem, Stack, Typography } from '@mui/material';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ThreeVerticalIcon,
} from '@/components/icons';
import { Post } from '@/types';
import { useMutation } from '@tanstack/react-query';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import Drawer from '@/components/drawer';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { deletePost } from '@/services/announcements';
import { ZuButton } from '@/components/core';
import PostForm from '@/components/form/PostForm';

const EditorPreview = dynamic(
  () => import('@/components/editor/EditorPreview'),
  {
    ssr: false,
  },
);

type PostCardProps = {
  refetch: () => void;
  post: Post;
};

const options = ['Edit', 'Delete'];

const PostCard: React.FC<PostCardProps> = ({ refetch, post }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [drawOpen, setDrawOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isCanCollapse, setIsCanCollapse] = useState<boolean>(false);
  const open = Boolean(anchorEl);

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      refetch();
    },
  });

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const handleMenuItemClick = useCallback(
    (type: string) => {
      if (type === 'Edit') {
        setDrawOpen(true);
      } else if (type === 'Delete') {
        setOpenDialog(true);
      }
      handleClose();
    },
    [handleClose],
  );

  const handleDialogClose = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    deletePostMutation.mutate(post.id);
    setOpenDialog(false);
  }, [deletePostMutation, post.id]);

  const toggleDrawer = useCallback(() => {
    setDrawOpen((v) => !v);
  }, []);

  const user = useMemo(() => {
    try {
      return JSON.parse(post.creator);
    } catch (error) {
      return {};
    }
  }, [post.creator]);

  return (
    <>
      <Stack
        direction="row"
        spacing="14px"
        padding="10px"
        borderRadius={'10px'}
        border="1px solid rgba(255, 255, 255, 0.06)"
        bgcolor="#2d2d2d"
        sx={{
          ':hover': {
            backgroundColor: '#383838',
          },
        }}
      >
        <Drawer open={drawOpen} onClose={toggleDrawer} onOpen={toggleDrawer}>
          {drawOpen ? (
            <PostForm
              handleClose={toggleDrawer}
              refetch={refetch}
              initialData={post}
            />
          ) : null}
        </Drawer>
        <Dialog
          showModal={openDialog}
          title="Deleting Post"
          message="Are you sure you want to delete this post?"
          confirmText="Delete"
          onClose={handleDialogClose}
          onConfirm={handleDeleteConfirm}
        />
        <Box
          component="img"
          width="40px"
          height="40px"
          borderRadius="50%"
          src={user.avatar || '/user/avatar_p.png'}
        />
        <Stack spacing="10px" flex="1">
          <Typography variant="bodyMB" sx={{ opacity: 0.6 }}>
            {user.username}
          </Typography>
          <Typography variant="buttonLB">{post.title}</Typography>
          <EditorPreview
            value={post.description}
            fontSize={13}
            collapsed={isCollapsed}
            onCollapse={(collapsed) => {
              setIsCanCollapse((v) => {
                return v || collapsed;
              });
              setIsCollapsed(collapsed);
            }}
            style={{ opacity: 0.8 }}
          />
          {isCanCollapse && (
            <ZuButton
              startIcon={
                isCollapsed ? (
                  <ChevronDownIcon size={4} />
                ) : (
                  <ChevronUpIcon size={4} />
                )
              }
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                width: '100%',
                marginTop: 0,
              }}
              onClick={() => setIsCollapsed((prev) => !prev)}
            >
              {isCollapsed ? 'Show More' : 'Show Less'}
            </ZuButton>
          )}
          <Typography variant="caption" sx={{ opacity: 0.5 }}>
            {dayjs(post.created_at).format('YYYY-MM-DD')} CREATED |{' '}
            {post.tags
              .split(',')
              .map((tag) => `# ${tag}`)
              .join(' ')}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          padding="10px"
          alignItems="center"
          bgcolor="#383838"
          borderRadius="6px"
          height="fit-content"
          sx={{ cursor: 'pointer' }}
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          aria-label="more"
          id="long-button"
          onClick={handleClick}
        >
          <ThreeVerticalIcon size={5} />
        </Stack>
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {options.map((option) => (
            <MenuItem key={option} onClick={() => handleMenuItemClick(option)}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Stack>
    </>
  );
};

export default PostCard;
