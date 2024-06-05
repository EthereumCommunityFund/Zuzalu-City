'use client';
import * as React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { MOCK_DATA } from 'mock';
import { ArrowForwardIcon, QRCodeIcon } from '@/components/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  return (
    <Stack direction="row">
      <Stack direction="column" flex={1}>
        <div className="text-white flex items-center border-b border-[#383838] px-[20px] text-[16px] font-[600]">
          <div className="p-[14px]">Overview</div>
          <div className="p-[14px]">Tickets</div>
        </div>

        <Box
          display="flex"
          justifyContent={'center'}
          flexDirection={'column'}
          gap="15px"
          paddingX={'20px'}
          sx={{ margin: '0 auto' }}
          maxWidth={'680px'}
          width={'100%'}
        >
          <Box sx={{ borderBottom: '1px solid #383838', paddingY: '30px' }}>
            <Typography
              color="white"
              fontSize={'24px'}
              fontWeight={'700'}
              lineHeight={'120%'}
            >
              Your Passport
            </Typography>

            <div className="mt-10 grid grid-cols-1 gap-3 md:gap-5">
              <div
                onClick={() => router.push(`/passport/scanqr/${1}`)}
                className="col-span-1 cursor-pointer p-[10px] flex items-center rounded-[10px] bg-[rgba(255,255,255,0.05)]"
              >
                <div className="mr-[10px]">
                  <QRCodeIcon />
                </div>
                <div className="">
                  <div className="mb-[4px] text-white text-[18px] leading-[120%] font-[700]">
                    Scan QR Code
                  </div>
                  <div className="text-[10px] leading-[120%] text-[rgba(255,255,255,0.7)]">
                    Scan tickets
                  </div>
                </div>
              </div>
              {/* <div className="col-span-1 p-[10px] flex items-center rounded-[10px] bg-[rgba(255,255,255,0.05)]">
                <div className="mr-[10px]">
                  <GroupIcon opacity="0.5" />
                </div>
                <div className="">
                  <div className="mb-[4px] text-white opacity-50">***</div>
                  <div className="text-[10px] text-white opacity-50">SETTING COMING SOON</div>
                </div>
              </div> */}
            </div>
          </Box>
          <Box sx={{ marginTop: '40px' }}>
            <Typography
              color="white"
              fontSize={'20px'}
              fontWeight={'700'}
              lineHeight={'120%'}
            >
              Event Credentials
            </Typography>
          </Box>
          <Box sx={{ paddingY: '30px', borderBottom: '1px solid #383838' }}>
            {MOCK_DATA.eventCredential.map((item, index) => (
              <div
                onClick={() => router.push(`passport/${index}`)}
                key={index}
                className="bg-[rgba(255,255,255,0.02)] mb-2.5 last-of-type:mb-0 rounded-[10px] flex justify-between p-[10px]"
              >
                <div className="flex items-center">
                  <div className="mr-[14px]">
                    <Image
                      alt={item.name}
                      src={item.image}
                      width={50}
                      height={50}
                    />
                  </div>
                  <div className="">
                    <div className="text-[18px] font-bold text-white leading-[120%] mb-[4px]">
                      {item.name}
                    </div>
                    <div className="text-[10px] leading-[120%] text-[rgba(255,255,255,0.7)]">
                      {item.desc}
                    </div>
                  </div>
                </div>
                <ArrowForwardIcon />
              </div>
            ))}
          </Box>

          {/* <Box sx={{ marginTop: "40px" }}>
            <Typography
              color="white"
              fontSize={"20px"}
              fontWeight={"700"}
              lineHeight={"120%"}
            >
              Invited Event Management
            </Typography>
          </Box>


          <Box sx={{ paddingY: "30px", borderBottom: '1px solid #383838' }}>

            <div className="bg-[rgba(255,255,255,0.02)] rounded-[10px] flex justify-between p-[10px]">
              <div className="flex items-center">
                <div className="mr-[14px]">
                  <Image alt={"wepb"} src={"/20.webp"} width={50} height={50} />
                </div>
                <div className="">
                  <div className="text-[18px] font-bold text-white leading-[120%] mb-[4px]">ZuVillage Georgia</div>
                  <div className="text-[10px] leading-[120%] text-[rgba(255,255,255,0.7)]">You have 1 ticket</div>
                </div>

              </div>
              <ArrowForwardIcon />
            </div>

          </Box> */}
        </Box>
      </Stack>
    </Stack>
  );
};

export default Home;
