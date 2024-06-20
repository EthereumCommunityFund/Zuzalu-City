import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Stack, Typography, Box } from '@mui/material';
import { RightArrowIcon } from 'components/icons';
import { SOCIAL_TYPES } from '@/constant';

type UserLink = {
  title: string;
  links: string;
};
interface IEventDetail {
  status?: string;
  links?: [UserLink];
}

const EventDetail: React.FC<IEventDetail> = ({
  status = 'In-Person',
  links = [],
}) => {
  const router = useRouter();

  return (
    <Stack spacing="20px">
      <Typography
        color="white"
        variant="subtitleMB"
        borderBottom="1px solid #383838"
        paddingY="14px"
      >
        Event Details
      </Typography>
      <Stack spacing="5px">
        <Typography color="white" variant="bodyB">
          Format: {status}
        </Typography>
        <Typography color="white" variant="bodyB">
          Type: Meet-up
        </Typography>
      </Stack>
      <Stack spacing="10px">
        <Typography color="white" variant="bodyBB" paddingBottom="20px">
          Links
        </Typography>
        {links?.length !== 0 && (
          <>
            {links?.map((link, index) => (
              <Link
                href={link.links}
                target="_blank"
                key={`UserLink-${index}`}
                style={{ textDecoration: 'none' }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  bgcolor="#2a2a2a"
                  padding="10px 14px"
                  borderRadius="10px"
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography color="white" variant="bodyB">
                    {
                      SOCIAL_TYPES.filter((item) => item.key === link.title)[0]
                        .value
                    }
                  </Typography>
                  <RightArrowIcon />
                </Stack>
              </Link>
            ))}
          </>
        )}
      </Stack>
      <Stack spacing="5px">
        <Typography color="white" variant="bodyBB" paddingY="20px">
          Location
        </Typography>
        <Typography color="white" variant="bodyMB">
          City, Country
        </Typography>
        <Typography color="white" variant="bodyS">
          Apply to see address
        </Typography>
        <Box
          component="img"
          borderRadius="10px"
          height={'182px'}
          src="/15.webp"
        />
      </Stack>
    </Stack>
  );
};

export default EventDetail;
