import { ClickAwayListener, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Dispatch, SetStateAction, useState } from 'react';
import { ZuButton } from 'components/core';
import TextEditor from 'components/editor/editor';

interface ModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

// TODO: no usages, Pay attention to the style of EditorText when using it
export const PostAnnouncementModal = ({
  showModal,
  setShowModal,
}: ModalProps) => {
  const [selectedTab, setSelectedTab] = useState('post');
  const [editor, setEditorInst] = useState<any>();

  const tabList = [
    {
      name: 'Post',
      index: 'post',
    },
    {
      name: 'Article',
      index: 'article',
    },
    {
      name: 'Poll',
      index: 'poll',
    },
  ];

  const handleClickTab = (tabName: string) => {
    setSelectedTab(tabName);
  };

  return showModal ? (
    <Stack
      sx={{
        backgroundColor: '#0003',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        zIndex: 4,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        top: '0px',
        left: '0px',
        userSelect: 'none',
      }}
    >
      <ClickAwayListener onClickAway={() => setShowModal(false)}>
        <Stack
          sx={{
            width: '620px',
            height: 'auto',
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(34, 34, 34, 0.8)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '10px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <Stack
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingRight: '2px',
              paddingLeft: '4px',
              boxSizing: 'border-box',
            }}
          >
            <Stack
              sx={{
                opacity: '0.7',
              }}
            >
              <Typography fontSize={'18px'} fontWeight={500}>
                Post to Update
              </Typography>
            </Stack>
            <Stack
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                borderRadius: '10px',
                opacity: '0.7',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px',
                cursor: 'pointer',
              }}
              onClick={() => setShowModal(false)}
            >
              <CloseIcon sx={{ width: '26px', height: '26px' }} />
            </Stack>
          </Stack>
          <Stack>
            <TextEditor
              holder="post_anouncement_editor"
              placeholder="Write Your Post Here!"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                fontFamily: 'Inter',
                color: 'white',
                padding: '12px',
                borderRadius: '10px',
                height: 'auto',
                minHeight: '270px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'auto',
              }}
            />
          </Stack>
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              boxSizing: 'border-box',
              padding: '10px',
            }}
          >
            <ZuButton
              sx={{
                backgroundColor: 'rgba(59, 59, 59, 0.8)',
                borderRadius: '10px',
                padding: '10px 14px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              <Typography
                fontSize={'18px'}
                fontWeight={600}
                lineHeight={'120%'}
              >
                Post
              </Typography>
            </ZuButton>
          </Stack>
        </Stack>
      </ClickAwayListener>
    </Stack>
  ) : (
    <></>
  );
};
