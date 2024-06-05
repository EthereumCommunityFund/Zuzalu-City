'use client';
import * as React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { LeftArrowIcon, QRCodeIcon, ScrollIcon } from '@/components/icons';
import Image from 'next/image';
import { ZuButton } from '@/components/core';
import { useRouter } from 'next/navigation';
import QRCode from '../components/QRCode';

const Home = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  let ticketDetails = [1];
  return (
    <Stack direction="row">
      <Stack direction="column" flex={1}>
        <Box
          display="flex"
          justifyContent={'center'}
          flexDirection={'column'}
          gap="15px"
          padding={'30px'}
          sx={{ margin: '0 auto' }}
          maxWidth={'700px'}
          width={'100%'}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <ZuButton
              sx={{ backgroundColor: '#333333', marginRight: '20px' }}
              startIcon={<LeftArrowIcon />}
              onClick={() => router.back()}
            >
              Back
            </ZuButton>
            <Box>
              <Image alt={'23.webp'} src={'/23.webp'} width={30} height={30} />
            </Box>
            <Typography
              variant="h6"
              color="white"
              marginLeft={'10px'}
              lineHeight="40px"
            >
              EventName
            </Typography>
          </Stack>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ticketDetails.length > 1 ? (
              ticketDetails.map((ticket, index) => (
                <div
                  key={index}
                  className="col-span-1 rounded-[10px] h-auto bg-[rgba(255,255,255,0.05)] p-4 shadow-md"
                >
                  <Image
                    style={{
                      width: '100%',
                      height: 'auto',
                    }}
                    alt={'/23.webp'}
                    src={'/23.webp'}
                    width={100}
                    height={100}
                  />

                  <div className="text-white font-[700] ">
                    <div className="my-2.5 text-[18px] leading-[120%]">
                      TicketName
                    </div>
                    <div className="border-b border-white pb-5 flex text-[13px] opacity-50">
                      <div className="mr-2.5">05/15/2024</div>
                      <div className="">420 USDT</div>
                    </div>

                    <button
                      onClick={() => setIsOpen(true)}
                      className="flex items-center w-full mt-[14px] p-2.5 rounded-[10px] border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.05)]"
                    >
                      <div className="mr-[14px]">
                        <QRCodeIcon />
                      </div>
                      <div className="leading-[120%]">
                        <div className="font-[700] text-[18px] mb-1 flex items-start">
                          Open QR Code
                        </div>
                        <div className="text-[10px] opacity-70">
                          Generate a proof of your ticket
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="col-span-2 my-5 max-w-[640px] rounded-[10px] w-full bg-[url('/23.webp')] bg-cover bg-center bg-no-repeat">
                  <div className="backdrop-blur-xl rounded-[10px] h-auto bg-[rgba(45,45,45,0.80)] border border-[rgba(255,255,255,0.10)] p-4 shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="col-span-1">
                        <Image
                          style={{
                            width: '100%',
                            height: 'auto',
                          }}
                          alt={'/23.webp'}
                          src={'/23.webp'}
                          width={100}
                          height={100}
                        />
                      </div>
                      <div className=" col-span-1 text-white font-[700] ">
                        <div className="mb-2.5 text-[25px] leading-[120%]">
                          TicketName
                        </div>
                        <div className="border-b border-white pb-5 flex text-[13px] opacity-50">
                          <div className="mr-2.5">05/15/2024</div>
                          <div className="">420 USDT</div>
                        </div>

                        <button
                          onClick={() => setIsOpen(true)}
                          className="w-full mt-[14px] p-2.5 rounded-[10px] border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.05)]"
                        >
                          <div className="flex">
                            <div className="mr-[14px]">
                              <QRCodeIcon />
                            </div>
                            <div className="">
                              <div className="font-[700] text-[18px] leading-[120%] mb-1">
                                Open QR Code
                              </div>
                              <div className="text-[10px] opacity-70 leading-[120%]">
                                Generate a proof of your ticket
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 p-[20px] text-white rounded-[10px] border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.05)]">
                  <div className="font-[700] text-[20px] opacity-[0.6]">
                    Ticket Description
                  </div>
                  <p className="mt-5 opacity-[0.8]">
                    Get ready to groove at the Summer Music Festival! Join us
                    for a day filled with live music, food trucks, and good
                    vibes. Experience an eclectic lineup of bands and solo
                    artists across various genres, from indie rock to electronic
                    beats. Whether you&apos;re dancing with friends or lounging
                    on the grass, this event promises to be a highlight of your
                    summer. Don&apos;t miss out on the ultimate music
                    celebration under the sun!
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="">
            <ScrollIcon />
          </div>
        </Box>
      </Stack>
      <QRCode isOpen={isOpen} setIsOpen={setIsOpen} />
    </Stack>
  );
};

export default Home;
