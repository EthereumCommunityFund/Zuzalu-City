import React, { useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { ChevronDownIcon, ChevronUpIcon } from '@/components/icons';
import { Post } from '@/types';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { ZuButton } from '@/components/core';

const EditorPreview = dynamic(
  () => import('@/components/editor/EditorPreview'),
  {
    ssr: false,
  },
);

type PostCardProps = {
  post: Post;
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isCanCollapse, setIsCanCollapse] = useState<boolean>(false);

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
          <Typography variant="caption" sx={{ opacity: 0.5 }}>
            {post.tags
              .split(',')
              .map((tag) => `# ${tag}`)
              .join(' ')}
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
            {dayjs(post.created_at).format('YYYY-MM-DD')} CREATED
          </Typography>
        </Stack>
      </Stack>
    </>
  );
};

export default PostCard;
