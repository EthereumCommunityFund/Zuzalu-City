import { ClickAwayListener, Stack, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { RefreshIcon } from "components/icons/RefreshIcon";
import { ZuSwitch } from "components/core";
import { InformationIcon } from "components/icons";


const QrReader = require('react-qr-scanner');

interface PropTypes {
    showModal: boolean,
    setShowModal: Dispatch<SetStateAction<boolean>>
}

export const QRScanModal = ({ showModal, setShowModal }: PropTypes) => {

    const [delay, setDelay] = useState(1000);
    const [scanResult, setScanResult] = useState();
    const [isZKMode, setIsZKMode] = useState(false);
    const [error, setError] = useState("");

    const handleScan = (data: any) => {
        setScanResult(data);
    }

    const handleError = (err: string) => {
        setError(err)
    }

    const handleSwitch = (event: ChangeEvent<HTMLInputElement>) => {
        setIsZKMode(event.target.checked)
    }

    return (
        showModal ? <Stack
            sx={{
                backgroundColor: '#2226',
                inset: 0,
                position: 'fixed',
                userSelect: 'none',
                zIndex: 4,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                top: '0px',
                left: '0px',
            }}
        >
            <ClickAwayListener onClickAway={() => setShowModal(false)}>
                <Stack
                    sx={{
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        backgroundColor: 'rgba(52, 52, 52, 0.8)',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        padding: '20px',
                        boxSizing: 'border-box',
                        alignItems: 'center',
                        width: '360px'
                    }}
                >
                    <Stack
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}
                    >
                        <Stack sx={{ width: '40px', height: '40px' }}></Stack>
                        <Typography fontSize={'18px'} fontWeight={700} lineHeight={'140%'}>QR Code</Typography>
                        <Stack
                            sx={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onClick={() => setShowModal(false)}
                        >
                            <CloseIcon sx={{ width: '20px', height: '20px' }} />
                        </Stack>
                    </Stack>
                    <Stack
                        sx={{
                            width: '300px',
                            height: '300px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        {/* video scan part */}
                        {
                            error ? <Typography textAlign={'center'}>
                                {
                                    "Please check your camera accessibility or QR Code"
                                }
                            </Typography> :
                                <QrReader
                                    delay={delay}
                                    style={{
                                        width: '300px',
                                        height: '300px'
                                    }}
                                    onError={handleError}
                                    onScan={handleScan}
                                />

                        }
                    </Stack>
                    <Stack
                        sx={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            padding: '10px',
                            boxSizing: 'border-box'
                        }}
                    >
                        <Stack
                            sx={{
                                width: '20px',
                                height: '20px',
                                cursor: "pointer"
                            }}
                        >
                            <RefreshIcon />
                        </Stack>
                    </Stack>
                    <Stack
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '14px',
                            alignItems: 'center'
                        }}
                    >
                        <Typography
                            fontSize={'18px'}
                            fontWeight={700}
                            lineHeight={'120%'}
                        >
                            Username
                        </Typography>
                        <Typography
                            fontSize={'13px'}
                            color={'rgba(255, 255, 255, 0.5)'}
                        >
                            username@gmail.com
                        </Typography>
                    </Stack>
                    <Stack
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '10px',
                            padding: '10px',
                            borderRadius: '10px',
                            background: 'linear-gradient(117deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.05) 100%)',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%'
                        }}
                    >
                        <ZuSwitch onChange={handleSwitch} />
                        <Typography fontSize={'16px'} lineHeight={'120%'} sx={{ opacity: '0.5' }}>Zero-Knowledge Mode</Typography>
                        <Stack
                            sx={{
                                opacity: '0.5'
                            }}
                        >
                            <InformationIcon />
                        </Stack>
                    </Stack>
                </Stack>
            </ClickAwayListener>
        </Stack>
            : <></>
    )
}