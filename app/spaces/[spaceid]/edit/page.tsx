'use client'
import { Box, Input, Stack, Typography } from "@mui/material";
import SpaceEditSidebar from "./components/Sidebar";
import { useState } from "react";
import { useTheme } from '@mui/material/styles';

export default function SpaceEditPage() {

    const [isOnInput, setIsOnInput] = useState(false);
    const [isOnTextArea, setIsOnTextArea] = useState(false);

    const theme = useTheme();

    return (
        <Stack
            sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                gap: '20px',
                justifyContent: 'center',
                boxSizing: 'border-box'
            }}
        >
            <SpaceEditSidebar />
            <Box
                sx={{
                    maxWidth: '890px',
                    width: 'calc(100% - 280px)',
                    [theme.breakpoints.down('md')]: {
                        width: '100%'
                    },
                    padding: '20px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    flexWrap: 'wrap',
                    borderRadius: '10px'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexWrap: 'nowrap',
                        gap: '20px',
                        justifyContent: 'center',
                        paddingBottom: '20px',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                    >
                        <Stack>
                            <Typography fontSize={'18px'} fontWeight={700} marginBottom={'10px'}>
                                Space Name
                            </Typography>
                            <input
                                onFocus={() => setIsOnInput(true)}
                                onBlur={() => setIsOnInput(false)}
                                style={{
                                    appearance: "none",
                                    width: "100%",
                                    height: "auto",
                                    outline: "none",
                                    border: "none",
                                    padding: "12px",
                                    borderRadius: "10px",
                                    fontSize: "16px",
                                    background: "rgba(255, 255, 255, 0.05)",
                                    color: "rgb(255, 255, 255)",
                                    transitionProperty: 'box-shadow',
                                    transitionDuration: '3000',
                                    transitionTimingFunction: 'ease-in',
                                    boxShadow: isOnInput ? "rgba(255, 255, 255, 0.2) 0px 0px 0px 2px inset" : "rgba(255, 255, 255, 0.2) 0px 0px 0px 0px inset",
                                    boxSizing: 'border-box',
                                    marginBottom: '8px'
                                }}
                            ></input>
                        </Stack>
                        <Stack>
                            <Typography fontSize={'18px'} fontWeight={700} marginBottom={'10px'}>Space Tagline</Typography>
                            <textarea
                                onFocus={() => setIsOnTextArea(true)}
                                onBlur={() => setIsOnTextArea(false)}
                                style={{
                                    appearance: "none",
                                    width: "100%",
                                    height: "auto",
                                    outline: "none",
                                    border: "none",
                                    padding: "12px",
                                    borderRadius: "10px",
                                    fontSize: "16px",
                                    background: "rgba(255, 255, 255, 0.05)",
                                    color: "rgb(255, 255, 255)",
                                    transitionProperty: 'box-shadow',
                                    transitionDuration: '3000',
                                    transitionTimingFunction: 'ease-in',
                                    boxShadow: isOnTextArea ? "rgba(255, 255, 255, 0.2) 0px 0px 0px 2px inset" : "rgba(255, 255, 255, 0.2) 0px 0px 0px 0px inset",
                                    boxSizing: 'border-box',
                                    marginBottom: '8px'
                                }}
                            >
                            </textarea>
                            <Stack
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end'
                                }}
                            >
                                <Typography fontSize={'13px'} lineHeight={'120%'} color={'#bbb'}>3 characters availale</Typography>
                            </Stack>
                        </Stack>
                    </Box>
                    <Box>

                    </Box>
                </Box>
            </Box>
        </Stack >
    )
}