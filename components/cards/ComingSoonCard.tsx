import { Box, styled, Typography } from '@mui/material';
import Image from 'next/image';

const SpaceComingSoonCard = () => {
  return (
    <Wrapper>
      <SpaceContentWrapper>
        <Image
          src="/card/trafficCone.png"
          alt="Coming Soon"
          width={40}
          height={40}
        />
        <Typography color="text.primary" variant="subtitleSB">
          Spaces Coming Soon!
        </Typography>
        <Typography color="text.secondary" variant="bodyM">
          Stay tuned for the launch of our beta
        </Typography>
      </SpaceContentWrapper>
    </Wrapper>
  );
};

const EventComingSoonCard = () => {
  return (
    <Wrapper>
      <EventContentWrapper>
        <Image
          src="/card/trafficCone.png"
          alt="Coming Soon"
          width={40}
          height={40}
        />
        <EventRightWrapper>
          <Typography color="text.primary" variant="subtitleSB">
            Event Creation Coming Soon!
          </Typography>
          <Typography color="text.secondary" variant="bodyM">
            Stay tuned for the launch of our beta
          </Typography>
        </EventRightWrapper>
      </EventContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SpaceContentWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 290px;
  padding: 20px;
  height: 100%;
`;

const EventContentWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 20px;
  height: 94px;
`;

const EventRightWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export { SpaceComingSoonCard, EventComingSoonCard };
