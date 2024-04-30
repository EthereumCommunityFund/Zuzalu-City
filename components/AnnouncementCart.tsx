import { Box } from '@mui/material';
import Image from 'next/image';
import { useTheme } from '@mui/material/styles'

interface AnnouncementCardProps {
  title: string;
  content: string;
  author: string;
  authorId: string;
  avatar: string;
  role: string;
  image: string;
}

export default function AnnouncementCard({
  title,
  content,
  author,
  authorId,
  avatar,
  role,
  image,
}: AnnouncementCardProps) {

  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        padding: '10px',
        boxSizing: 'border-box',
        border: '1px solid #ffffff0f',
        borderRadius: '10px',
        backgroundColor: '#ffffff05',
        display: 'flex',
        flexDirection: 'row',
        gap: '14px',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#ffffff1a'
        },
        transitionProperty: 'all',
        transitionTimingFunction: 'ease-in',
        transitionDuration: '300'
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <Box
          sx={{
            fontSize: '18px',
            fontWeight: '600'
          }}
        >{title}</Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}
          >
            <Image
              loader={() => avatar}
              src={avatar}
              width={30}
              height={30}
              alt=""
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '100%'
              }}
            ></Image>
            <Box
              sx={{
                display: 'flex',
                gap: '6px',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '8px',
                  alignItems: 'center'
                }}
              >
                <Box
                  fontSize={'13px'}
                >{author}</Box>
                <Box
                  fontSize={'11px'}
                  fontWeight={600}
                  sx={{
                    opacity: '0.6',
                  }}
                >
                  {authorId}
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              padding: '2px 10px',
              backgroundColor: '#24323a',
              borderRadius: '4px',
              textTransform: 'capitalize',
              color: '#5eafff',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            {role}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <Box
            sx={{
              fontSize: '12px',
              fontWeight: '600',
              opacity: '0.7'
            }}
          >
            {content.slice(0, 97) + '...'}
          </Box>
          <Box
            sx={{
              textTransform: 'uppercase',
              fontSize: '10px',
              opacity: '0.7'
            }}
          >2 days ago</Box>
        </Box>
      </Box>
      <Box
        sx={{
          position: 'relative',
          [theme.breakpoints.up('md')]: {
            minWidth: '160px',
            width: '160px',
            minHeight: '160px',
            height: '160px'
          },
          minWidth: '80px',
          width: '80px',
          minHeight: '80px',
          height: '80px'
        }}
      >
        <Image
          loader={() => image}
          src={image}
          width={160}
          height={160}
          style={{
            position: 'absolute',
            inset: '0',
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            borderRadius: '10px'
          }}
          alt=""
        ></Image>
      </Box>
    </Box>
  );
}
