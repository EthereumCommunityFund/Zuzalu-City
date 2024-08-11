import { ZuButton } from '@/components/core';
import { LockIcon } from '@/components/icons';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { Popper, Stack, styled, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useCallback, useState } from 'react';

export default function HomeSigninBanner() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl((v) => (v ? null : event.currentTarget));
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? 'signin-popper' : undefined;

  return (
    <SigninBannerWrapper>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 10],
            },
          },
        ]}
      >
        <PopperWrapper>
          <PopperHead>
            <LockIcon size={5} opacity={0.8} />
            <Typography variant="bodyBB" color="#fff">
              Sign In
            </Typography>
          </PopperHead>
          <Typography variant="body2" color="#fff" sx={{ opacity: 0.7 }}>
            First Time?
          </Typography>
          <CheckinButton
            startIcon={
              <Image
                src="/user/wallet.png"
                alt="wallet"
                height={24}
                width={24}
                style={{ opacity: 0.5 }}
              />
            }
          >
            Check-In
          </CheckinButton>
          <Typography variant="body2" color="#fff" sx={{ opacity: 0.7 }}>
            or
          </Typography>
          <PopperSigninButton startIcon={<ArrowCircleRightIcon />}>
            Sign in
          </PopperSigninButton>
        </PopperWrapper>
      </Popper>
      <BannerLeft>
        <Image
          width={40}
          height={40}
          src="/home/zuvillage.png"
          alt="zuvillage"
        />
        <Typography variant="subtitleSB" color="#fff">
          Are You Attending ZuVillage?
        </Typography>
      </BannerLeft>
      <SigninButton
        startIcon={
          <Image
            src="/user/wallet.png"
            alt="wallet"
            height={24}
            width={24}
            style={{ opacity: 0.5 }}
          />
        }
        onClick={handleClick}
      >
        Sign In
      </SigninButton>
    </SigninBannerWrapper>
  );
}

const SigninBannerWrapper = styled(Stack)`
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(
    90deg,
    rgba(20, 143, 114, 0.1) 20%,
    rgba(0, 0, 0, 0) 100%
  );
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const BannerLeft = styled(Stack)`
  gap: 10px;
  flex-direction: row;
  align-items: center;
`;

const CheckinButton = styled(ZuButton)`
  background-color: rgba(255, 255, 255, 0.05);
  padding: 8px 14px;
  width: 100%;
`;

const SigninButton = styled(ZuButton)`
  background: #17645b;
  padding: 8px 14px;
`;

const PopperSigninButton = styled(ZuButton)`
  background: rgba(215, 255, 196, 0.1);
  padding: 8px 14px;
  width: 100%;
  color: #d7ffc4;
`;

const PopperWrapper = styled(Stack)`
  width: 230px;
  padding: 10px;
  gap: 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(34, 34, 34, 0.8);
  backdrop-filter: blur(10px);
  align-items: center;
`;

const PopperHead = styled(Stack)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;
