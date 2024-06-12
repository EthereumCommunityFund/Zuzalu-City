'use client';
import React, { useState } from 'react';
import { Stack, Typography, Box, Divider } from '@mui/material';
import { ScrollIcon, RightArrowIcon, LeftArrowIcon, ChevronDownIcon, ArrowUpLeftIcon, RefreshIcon, ChevronUpIcon, Square2StackIcon, ArrowTopRightSquareIcon } from '@/components/icons';
import { ZuButton, ZuInput } from '@/components/core';

const Home = () => {
  const [complete, setComplete] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);
  return (
    <Stack alignItems="center">
      <Stack pt="40px" spacing="33px" color="white" width="600px">
        <Stack direction="row" spacing="10px">
          <Typography variant="caption">
            TICKETING PROTOCOL:
          </Typography>
          <ScrollIcon />
        </Stack>
        <Stack spacing="20px">
          <Stack spacing="10px">
            <Stack direction="row" spacing="10px" alignItems="center">
              <Box component="img" height="30px" width="30px" borderRadius="2px" src="/24.webp" />
              <Typography variant="subtitleLB">
                EventName
              </Typography>
            </Stack>
            <Typography variant="h1">
              Your Ticket
            </Typography>
          </Stack>
          <Typography variant="bodyBB">
            {complete ? "Registration complete!" : "Complete your registration below to purchase your ticket"}
          </Typography>
        </Stack>
        <Stack borderRadius="10px" border="1px solid #383838" padding="20px" spacing="20px">
          <Typography variant="subtitleLB">
            Attendees Must Know
          </Typography>
          <Typography variant="bodyBB">
            This content is pulled from the field "Add Agreement" in a ticket form
          </Typography>
          <ZuButton startIcon={<RightArrowIcon color="#67DBFF" />}
            sx={{ width: "100%", backgroundColor: '#2c383b', color: "#67DBFF" }}
          >
            Agree and Continue
          </ZuButton>
        </Stack>
        <Stack borderRadius="10px" border="1px solid #383838" padding="20px" spacing="20px">
          <Typography variant="subtitleLB">
            Email Verification
          </Typography>
          <Typography variant="bodyBB">
            We will send you a verification code in your email
          </Typography>
          <ZuInput placeholder="Type your email address" />
          <ZuButton startIcon={<RightArrowIcon color="#67DBFF" />}
            sx={{ width: "100%", backgroundColor: '#2c383b', color: "#67DBFF" }}
          >
            Send
          </ZuButton>
        </Stack>
        <Stack borderRadius="10px" border="1px solid #383838" padding="20px" spacing="20px">
          <Typography variant="subtitleLB">
            Provide Code
          </Typography>
          <Stack>
            <Typography variant="bodyBB">
              We have sent a code to your email.
            </Typography>
            <Typography>
              If you do not find in your main inbox, be sure to also check your junk inbox
            </Typography>
          </Stack>
          <Stack spacing="10px">
            <ZuInput placeholder="Input Code" />
            <Stack direction="row" spacing="10px" alignItems="center">
              <Stack direction="row" spacing="4px" alignItems="center">
                <RefreshIcon />
                <Typography variant="bodySB">
                  Resend Email Code
                </Typography>
              </Stack>
              <Typography variant="bodyS">
                60s
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" spacing="20px">
            <ZuButton startIcon={<LeftArrowIcon />}
              sx={{ flex: 1 }}
            >
              Back
            </ZuButton>
            <ZuButton startIcon={<RightArrowIcon color="#67DBFF" />}
              sx={{ width: "100%", backgroundColor: '#2c383b', color: "#67DBFF", flex: 1 }}
            >
              Payment
            </ZuButton>
          </Stack>
        </Stack>
        <Stack borderRadius="10px" border="1px solid #383838" padding="20px" spacing="20px" alignItems="center">
          <Box component="img" width="250px" height="250px" borderRadius="20px" src="26.png" />
          <Stack spacing="10px" padding="20px" borderRadius="20px" border="1px solid #383838" divider={<Divider sx={{ border: "1px solid #383838" }} />}>
            <Stack direction="row" spacing="10px">
              <Typography variant="bodyM">
                Ticket:
              </Typography>
              <Typography variant="bodyBB">
                Full Pass
              </Typography>
            </Stack>
            <Stack direction="row" spacing="10px" alignItems="end">
              <Typography variant="bodyM">
                Accommodation:
              </Typography>
              <Typography variant="bodyBB">
                Shared Room
              </Typography>
            </Stack>
            <Stack direction="row" spacing="10px" alignItems="end">
              <Typography variant="bodyM">
                Contributing Amount:
              </Typography>
              <Typography variant="bodyBB">
                0000
              </Typography>
              <Typography variant="caption">
                TOKEN
              </Typography>
            </Stack>
            <Stack spacing="10px">
              <Typography variant="bodyM">
                Description:
              </Typography>
              <Typography variant="bodyS">
                Get ready to groove at the Summer Music Festival! Join us for a day filled with live music, food trucks, and good vibes.
              </Typography>
            </Stack>
          </Stack>
          <Typography variant="bodyS">
            Please be sure to use the address you will use to later verify your ticket
          </Typography>
          <ZuButton startIcon={<RightArrowIcon color="#67DBFF" />}
            sx={{ width: "100%", backgroundColor: '#2c383b', color: "#67DBFF", flex: 1 }}
          >
            Mint Ticket
          </ZuButton>
        </Stack>
        <Stack borderRadius="10px" border="1px solid #383838" padding="20px" spacing="20px" alignItems="center">
          <Typography variant="subtitleLB">
            Congrats, you received
          </Typography>
          <Box component="img" width="250px" height="250px" borderRadius="20px" src="26.png" />
          <Stack borderRadius="10px" border="1px solid #383838" width="100%"
            sx={{ cursor: "pointer" }}
            onClick={() => setView(prev => !prev)}
          >
            {
              !view ? (
                <Stack direction="row" spacing="10px" padding="10px 20px" justifyContent="center">
                  <Typography variant="bodyM">
                    View Transaction Details
                  </Typography>
                  <ChevronDownIcon size={4.5} />
                </Stack>
              ) :
                (
                  <Stack padding="20px" spacing="10px">
                    <Stack direction="row" spacing="10px" justifyContent="center">
                      <Typography variant="bodyM">
                        Close Transaction Details
                      </Typography>
                      <ChevronUpIcon size={4.5} />
                    </Stack>
                    <Stack spacing="10px" divider={<Divider sx={{ border: "1px solid #383838" }} />}>
                      <Stack spacing="10px">
                        <Stack spacing="4px">
                          <Typography variant="bodyM">
                            Transaction ID:
                          </Typography>
                          <Typography variant="caption">
                            This is the transaction you approved in your wallet
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing="10px" alignItems="center">
                          <Typography variant="bodyM">
                            0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E
                          </Typography>
                          <Square2StackIcon size={5} />
                          <ArrowTopRightSquareIcon size={5} />
                        </Stack>
                      </Stack>
                      <Stack spacing="10px">
                        <Stack spacing="4px">
                          <Typography variant="bodyM">
                            Contract Address:
                          </Typography>
                          <Typography variant="caption">
                            This is the contract your wallet interacted with to mint an NFT
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing="10px" alignItems="center">
                          <Typography variant="bodyM">
                            0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E
                          </Typography>
                          <Square2StackIcon size={5} />
                          <ArrowTopRightSquareIcon size={5} />
                        </Stack>
                      </Stack>
                      <Stack spacing="10px">
                        <Stack spacing="4px">
                          <Typography variant="bodyM">
                            NFT Address:
                          </Typography>
                          <Typography variant="caption">
                            This is the address of the NFT you minted
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing="10px" alignItems="center">
                          <Typography variant="bodyM">
                            0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E
                          </Typography>
                          <Square2StackIcon size={5} />
                          <ArrowTopRightSquareIcon size={5} />
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>
                )
            }
          </Stack>
          <ZuButton startIcon={<ArrowUpLeftIcon size={5} color="#67DBFF" />}
            sx={{ width: "100%", backgroundColor: '#2c383b', color: "#67DBFF" }}
          >
            Back to Event View
          </ZuButton>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Home;