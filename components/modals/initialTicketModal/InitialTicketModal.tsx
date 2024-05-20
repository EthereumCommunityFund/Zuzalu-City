import { Box, Stack, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import { ZuButton } from "@/components/core";
import { EthIcon } from "@/components/icons/EthIcon";
import { USDTIcon } from "@/components/icons/USDTIcon";
import { Dispatch, SetStateAction, useState } from "react";
import { CheckedCircleIcon } from "@/components/icons/CheckedCircleIcon";
import { EmptyCircleIcon } from "@/components/icons/EmptyCircleIcon";
import { RightArrowIcon } from "@/components/icons";
import { TokenConfirm } from "./TokenConfirm";
import { TicketDetail } from "./TicketDetail";

interface PropTypes {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>
}

export const InitialTicketModal = ({ showModal, setShowModal }: PropTypes) => {

    const [selectedToken, setSelectedToken] = useState('usdt');
    const [hasConfirmed, setHasConfirmed] = useState(false);

    const handleClose = () => {
        setHasConfirmed(false);
        setShowModal(false);
    }

    return (
        showModal ? <Stack
            sx={{
                width: '100vw',
                height: '100vh',
                position: 'fixed',
                zIndex: 5,
                top: '0px',
                left: '0px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                backgroundColor: '#0003',
                paddingTop: '50px',
                boxSizing: 'border-box'
            }}
        >
            <Stack
                sx={{
                    width: '700px',
                    height: '100%',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
                    backgroundColor: '#222'
                }}
            >
                <Stack
                    sx={{
                        width: '100%',
                        height: '54px',
                        padding: '10px',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '14px',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.10)'
                    }}
                >
                    <Box
                        display={'flex'}
                        flexDirection={'row'}
                        gap={'10px'}
                        padding={'6px 10px'}
                        alignItems={'center'}
                        sx={{
                            cursor: 'pointer'
                        }}
                        onClick={handleClose}
                    >
                        <CloseIcon sx={{ width: '20px', height: '20px' }} />
                        <Typography fontSize={'14px'} fontWeight={600} lineHeight={'160%'}>
                            Close
                        </Typography>
                    </Box>
                    <Typography
                        fontSize={'18px'}
                        fontWeight={700}
                        lineHeight={'120%'}
                    >
                        Create Ticket
                    </Typography>
                </Stack>
                {
                    hasConfirmed ? <TicketDetail></TicketDetail> : <TokenConfirm selectedToken={selectedToken} setSelectedToken={setSelectedToken} setHasConfirmed={setHasConfirmed} />
                }
            </Stack>
        </Stack>
            : <></>
    )
}