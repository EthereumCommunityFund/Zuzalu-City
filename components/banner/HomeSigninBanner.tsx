import { ZuButton } from '@/components/core';
import { Stack, styled, Typography } from '@mui/material';
import Image from 'next/image';

export default function HomeSigninBanner() {
  return (
    <SigninBannerWrapper>
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

const SigninButton = styled(ZuButton)`
  background: #17645b;
  padding: 8px 14px;
`;
