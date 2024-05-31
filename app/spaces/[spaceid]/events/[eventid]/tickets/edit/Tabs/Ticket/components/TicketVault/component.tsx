import { ZuButton } from "@/components/core"
import { CloseIcon, RightArrowIcon, ScrollIcon, SendIcon } from "@/components/icons"
import { Box, Button, Input, Typography } from "@mui/material"
import React from "react"

export const WithdrawToken = () => {

    const [showWithdrawalModal, setShowWithdrawalModal] = React.useState(false)

    return (
        <Box>
            <ConfirmWithdrawalTransaction showWithdrawalModal={showWithdrawalModal} setShowWithdrawalModal={setShowWithdrawalModal} />
            <Box marginTop={"30px"} sx={{ display: "flex", alignItems: "center" }}>
                <SendIcon />
                <Typography marginLeft={"10px"} fontSize="20px" fontWeight="bold" lineHeight={"120%"}>
                    Withdrawal
                </Typography>
            </Box>
            <Box marginTop={"14px"} sx={{ display: "flex", alignItems: "center" }}>
                <Typography fontSize="14px" fontWeight={600} lineHeight={"160%"}>
                    1,680.43  USDT
                </Typography>
                <Typography marginLeft={"10px"} fontSize="13px" lineHeight={"140%"} letterSpacing={"0.13px"} sx={{ opacity: "0.8" }}>
                    ($ 1,680.43  USD)
                </Typography>
            </Box>

            <Box marginTop={"30px"}>
                <Typography
                    color="white"
                    fontSize="16px"
                    fontWeight={700}
                    fontFamily="Inter"
                    marginBottom="10px"
                >
                    To Address
                </Typography>
                <Input
                    sx={{
                        color: 'white',
                        backgroundColor: '#2d2d2d',
                        padding: '12px 10px',
                        borderRadius: '8px',
                        width: '100%',
                        fontSize: '15px',
                        fontFamily: 'Inter',
                        '&::after': {
                            borderBottom: 'none',
                        },
                        '&::before': {
                            borderBottom: 'none',
                        },
                        '&:hover:not(.Mui-disabled, .Mui-error):before': {
                            borderBottom: 'none',
                        },
                    }}
                    placeholder="0x000"
                />
                <Typography
                    color="white"
                    fontSize="16px"
                    fontWeight={700}
                    fontFamily="Inter"
                    marginBottom="10px"
                    marginTop="20px"
                >
                    Amount
                </Typography>
                <Box sx={{ position: "relative" }}>
                    <Input
                        sx={{
                            color: 'white',
                            backgroundColor: '#2d2d2d',
                            padding: '12px 10px',
                            borderRadius: '8px',
                            width: '100%',
                            fontSize: '15px',
                            fontFamily: 'Inter',
                            '&::after': {
                                borderBottom: 'none',
                            },
                            '&::before': {
                                borderBottom: 'none',
                            },
                            '&:hover:not(.Mui-disabled, .Mui-error):before': {
                                borderBottom: 'none',
                            },
                        }}
                        placeholder="000"
                    />
                    <ZuButton
                        sx={{
                            height: "25px",
                            padding: "10px 14px",
                            color: "white",
                            borderRadius: "10px",
                            border: "1px solid rgba(255, 255, 255, 0.20)",
                            background: "rgba(255, 255, 255, 0.10)",
                            position: "absolute",
                            right: "12px",
                            top: "14px",
                        }}>Max</ZuButton>
                </Box>

                {/* <Box marginTop={"14px"} gap={"20px"} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
            <Box sx={{
              width: "100%"
            }}>
              <Box display={"flex"} alignItems={"center"}>
                <Typography
                  color="white"
                  fontSize="16px"
                  fontWeight={700}
                  fontFamily="Inter"
                  marginBottom="10px"
                >
                  Gas Price
                </Typography>
                <Typography
                  color="#FFC77D"
                  fontSize="13px"
                  fontWeight={700}
                  fontFamily="Inter"
                  marginBottom="10px"
                  marginLeft="8px"
                >
                  Medium
                </Typography>
              </Box>
              <Box>
                <Typography>15.4 Gwei</Typography>
                <Slider
                  onChange={(e: any) => setGasPrice(e.target.value)}
                  defaultValue={50}
                  sx={{
                    '.mui-ttgsjq-MuiSlider-track': {
                      color: '#67DBFF',
                    },
                    '.mui-7o8aqz-MuiSlider-rail': {
                      color: 'rgba(255, 255, 255, 0.10)'
                    },
                    '.mui-vr4mn8-MuiSlider-thumb': {
                      color: 'white',
                      height: "19px",
                      width: "19px",
                      borderRadius: "50%"
                    },
                  }} aria-label="Default" valueLabelDisplay="auto" />
              </Box>
            </Box>
            <Box sx={{
              width: "100%"
            }}>
              <Typography
                color="white"
                fontSize="16px"
                fontWeight={700}
                fontFamily="Inter"
                marginBottom="10px"
              >
                Gas Limit:
              </Typography>
              <Input
                sx={{
                  color: 'white',
                  backgroundColor: '#2d2d2d',
                  padding: '12px 10px',
                  borderRadius: '8px',
                  width: '100%',
                  fontSize: '15px',
                  fontFamily: 'Inter',
                  '&::after': {
                    borderBottom: 'none',
                  },
                  '&::before': {
                    borderBottom: 'none',
                  },
                  '&:hover:not(.Mui-disabled, .Mui-error):before': {
                    borderBottom: 'none',
                  },
                }}
                placeholder="21000"
              />
            </Box>
          </Box> */}
            </Box>

            <Box marginTop={"30px"}>
                <Button
                    onClick={() => setShowWithdrawalModal(true)}
                    sx={{
                        backgroundColor: '#2f474e',
                        color: '#67DAFF',
                        width: '100%',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: 600,
                        fontFamily: 'Inter',
                    }}
                    startIcon={<RightArrowIcon color="#67DAFF" />}
                >
                    Submit
                </Button>
            </Box>
        </Box>
    )
}

export const SendNFTTicket = () => {
    const [showNFTTicketModal, setShowNFTTicketModal] = React.useState(false)
    return (
        <Box>
            <ConfirmSendNFTTicketTransaction showNFTTicketModal={showNFTTicketModal} setShowNFTTicketModal={setShowNFTTicketModal} />
            <Box marginTop={"30px"} sx={{ display: "flex", alignItems: "center" }}>
                <SendIcon />
                <Typography marginLeft={"10px"} fontSize="20px" fontWeight="bold" lineHeight={"120%"}>
                    Send Ticket
                </Typography>
            </Box>
            <Box marginTop={"14px"} sx={{ display: "flex", alignItems: "center" }}>
                <Typography fontSize="14px" fontWeight={600} lineHeight={"160%"}>
                    89
                </Typography>
                <Typography marginLeft={"10px"} fontSize="13px" lineHeight={"140%"} letterSpacing={"0.13px"} sx={{ opacity: "0.8" }}>
                    out of 200
                </Typography>
            </Box>

            <Box marginTop={"30px"}>
                <Typography
                    color="white"
                    fontSize="16px"
                    fontWeight={700}
                    fontFamily="Inter"
                    marginBottom="10px"
                >
                    To Address
                </Typography>
                <Input
                    sx={{
                        color: 'white',
                        backgroundColor: '#2d2d2d',
                        padding: '12px 10px',
                        borderRadius: '8px',
                        width: '100%',
                        fontSize: '15px',
                        fontFamily: 'Inter',
                        '&::after': {
                            borderBottom: 'none',
                        },
                        '&::before': {
                            borderBottom: 'none',
                        },
                        '&:hover:not(.Mui-disabled, .Mui-error):before': {
                            borderBottom: 'none',
                        },
                    }}
                    placeholder="0x000"
                />
            </Box>

            <Box marginTop={"30px"}>
                <Button
                    onClick={() => setShowNFTTicketModal(true)}
                    sx={{
                        backgroundColor: '#2f474e',
                        color: '#67DAFF',
                        width: '100%',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: 600,
                        fontFamily: 'Inter',
                    }}
                    startIcon={<RightArrowIcon color="#67DAFF" />}
                >
                    Submit
                </Button>
            </Box>
        </Box>
    )
}

export const ConfirmSendNFTTicketTransaction = ({ showNFTTicketModal, setShowNFTTicketModal }: any) => {

    return (
        <>
            {
                showNFTTicketModal && (
                    <div className="fixed z-50 overflow-y-auto top-1/2 left-1/2 transform -translate-x-1/2 md:-translate-y-1/2 w-[535px]">
                        <div className="backdrop-blur-xl rounded-[10px] bg-[rgba(52,52,52,0.80)] border-2 border-[rgba(255,255,255,0.10)] relative p-5 shadow-lg">
                            <div className="flex justify-between items-center mb-[14px]">
                                <Box display={"flex"} alignItems={"center"}>
                                    <SendIcon />

                                    <Typography marginLeft="10px" fontSize={"18px"} color={"white"} fontWeight={"bold"}>Confirm Transaction</Typography>
                                </Box>


                                <div onClick={() => setShowNFTTicketModal(false)} className="cursor-pointer p-2.5 rounded-[10px] bg-[rgba(255,255,255,0.05)] text-white">
                                    <CloseIcon />
                                </div>
                            </div>

                            <Box
                                marginY={"20px"}
                                padding={"10px"}
                                sx={{
                                    borderRadius: "10px",
                                    border: "1px solid rgba(255, 255, 255, 0.10)",
                                    background: "rgba(255, 255, 255, 0.05)"
                                }}

                            >

                                <Box
                                    marginBottom={"10px"}
                                    display={"flex"} alignItems={"center"}>
                                    <Typography fontSize={"14px"} fontWeight={"600"} lineHeight={"160%"}>To Addess:</Typography>
                                    <Typography marginLeft={"6px"} fontSize={"14px"} lineHeight={"160%"} sx={{ opacity: "0.8" }}>0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E</Typography>
                                </Box>

                                <Box
                                    marginBottom={"10px"}
                                    display={"flex"} alignItems={"center"}>
                                    <Typography fontSize={"14px"} fontWeight={"600"} lineHeight={"160%"}>Token ID:</Typography>
                                    <Typography marginLeft={"6px"} fontSize={"14px"} lineHeight={"160%"} sx={{ opacity: "0.8" }}>1</Typography>
                                </Box>

                                <Box
                                    marginBottom={"10px"}
                                    display={"flex"} alignItems={"center"}>
                                    <Typography fontSize={"14px"} fontWeight={"600"} lineHeight={"160%"}>Amount:</Typography>
                                    <Typography marginLeft={"6px"} fontSize={"14px"} lineHeight={"160%"} sx={{ opacity: "0.8" }}>1</Typography>
                                </Box>

                                <Box
                                    display={"flex"} alignItems={"center"}>
                                    <Typography fontSize={"14px"} fontWeight={"600"} lineHeight={"160%"}>Contract execution fee(?):</Typography>
                                    <Typography marginLeft={"6px"} fontSize={"14px"} lineHeight={"160%"} sx={{ opacity: "0.8" }}>0.0000</Typography>
                                </Box>

                            </Box>


                            <Box display={"flex"} gap={"14px"} justifyContent={"space-between"} alignItems={"center"} marginTop={"10px"}>
                                <Button
                                    onClick={() => setShowNFTTicketModal(false)}
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        color: 'white',
                                        width: '100%',
                                        borderRadius: '10px',
                                        fontSize: '18px',
                                        fontWeight: 600,
                                        fontFamily: 'Inter',
                                        textTransform: "capitalize"
                                    }}
                                // startIcon={<LeftArrowIcon />}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    // onClick={() => { setPurchasingTicket(true), setGoToSummary(false) }}
                                    sx={{
                                        backgroundColor: '#2f474e',
                                        color: '#67DAFF',
                                        width: '100%',
                                        borderRadius: '10px',
                                        fontSize: '18px',
                                        fontWeight: 600,
                                        fontFamily: 'Inter',
                                        textTransform: "capitalize"
                                    }}
                                    startIcon={<RightArrowIcon />}
                                >
                                    Transfer Amount
                                </Button>

                            </Box>
                            <Box display="flex" justifyContent={"center"} marginTop={"30px"}>
                                <ScrollIcon />
                            </Box>

                        </div>
                    </div>
                )
            }
        </>

    )
}


export const ConfirmWithdrawalTransaction = ({ showWithdrawalModal, setShowWithdrawalModal }: any) => {

    return (
        <>
            {
                showWithdrawalModal && (
                    <div className="fixed z-50 overflow-y-auto top-1/2 left-1/2 transform -translate-x-1/2 md:-translate-y-1/2 w-[535px]">
                        <div className="backdrop-blur-xl rounded-[10px] bg-[rgba(52,52,52,0.80)] border-2 border-[rgba(255,255,255,0.10)] relative p-5 shadow-lg">
                            <div className="flex justify-between items-center mb-[14px]">
                                <Box display={"flex"} alignItems={"center"}>
                                    <SendIcon />

                                    <Typography marginLeft="10px" fontSize={"18px"} color={"white"} fontWeight={"bold"}>Confirm Transaction</Typography>
                                </Box>


                                <div onClick={() => setShowWithdrawalModal(false)} className="cursor-pointer p-2.5 rounded-[10px] bg-[rgba(255,255,255,0.05)] text-white">
                                    <CloseIcon />
                                </div>
                            </div>

                            <Box
                                marginY={"20px"}
                                padding={"10px"}
                                sx={{
                                    borderRadius: "10px",
                                    border: "1px solid rgba(255, 255, 255, 0.10)",
                                    background: "rgba(255, 255, 255, 0.05)"
                                }}

                            >

                                <Box
                                    marginBottom={"10px"}
                                    display={"flex"} alignItems={"center"}>
                                    <Typography fontSize={"14px"} fontWeight={"600"} lineHeight={"160%"}>To Addess:</Typography>
                                    <Typography marginLeft={"6px"} fontSize={"14px"} lineHeight={"160%"} sx={{ opacity: "0.8" }}>0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E</Typography>
                                </Box>

                                <Box
                                    marginBottom={"10px"}
                                    display={"flex"} alignItems={"center"}>
                                    <Typography fontSize={"14px"} fontWeight={"600"} lineHeight={"160%"}>Token:</Typography>
                                    <Typography marginLeft={"6px"} fontSize={"14px"} lineHeight={"160%"} sx={{ opacity: "0.8" }}>USDT</Typography>
                                </Box>

                                <Box
                                    marginBottom={"10px"}
                                    display={"flex"} alignItems={"center"}>
                                    <Typography fontSize={"14px"} fontWeight={"600"} lineHeight={"160%"}>Amount:</Typography>
                                    <Typography marginLeft={"6px"} fontSize={"14px"} lineHeight={"160%"} sx={{ opacity: "0.8" }}>000.00</Typography>
                                </Box>

                                <Box
                                    display={"flex"} alignItems={"center"}>
                                    <Typography fontSize={"14px"} fontWeight={"600"} lineHeight={"160%"}>Contract execution fee(?):</Typography>
                                    <Typography marginLeft={"6px"} fontSize={"14px"} lineHeight={"160%"} sx={{ opacity: "0.8" }}>0.0000</Typography>
                                </Box>

                            </Box>


                            <Box display={"flex"} gap={"14px"} justifyContent={"space-between"} alignItems={"center"} marginTop={"10px"}>
                                <Button
                                    onClick={() => setShowWithdrawalModal(false)}
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        color: 'white',
                                        width: '100%',
                                        borderRadius: '10px',
                                        fontSize: '18px',
                                        fontWeight: 600,
                                        fontFamily: 'Inter',
                                        textTransform: "capitalize"
                                    }}
                                // startIcon={<LeftArrowIcon />}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    // onClick={() => { setPurchasingTicket(true), setGoToSummary(false) }}
                                    sx={{
                                        backgroundColor: '#2f474e',
                                        color: '#67DAFF',
                                        width: '100%',
                                        borderRadius: '10px',
                                        fontSize: '18px',
                                        fontWeight: 600,
                                        fontFamily: 'Inter',
                                        textTransform: "capitalize"
                                    }}
                                    startIcon={<RightArrowIcon />}
                                >
                                    Transfer Amount
                                </Button>

                            </Box>
                            <Box display="flex" justifyContent={"center"} marginTop={"30px"}>
                                <ScrollIcon />
                            </Box>

                        </div>
                    </div>
                )
            }
        </>
    )
}
