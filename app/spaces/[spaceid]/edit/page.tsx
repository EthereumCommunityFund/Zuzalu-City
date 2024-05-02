'use client'
import { Box, Input, Stack, Typography } from "@mui/material";
import SpaceEditSidebar from "./components/Sidebar";
import { useState } from "react";
import { useTheme } from '@mui/material/styles';
import { TextEditor } from "components/editor/editor";
import Image from "next/image";

export default function SpaceEditPage() {

    const [isOnInput, setIsOnInput] = useState(false);
    const [isOnTextArea, setIsOnTextArea] = useState(false);

    const theme = useTheme();

    return (
        <Stack
            sx={{
                display: 'flex',
                flexDirection: 'row',
                width: 'calc(100% - 260px)',
                [theme.breakpoints.down('md')]: {
                    width: '100%'
                },
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
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        width: '100%',
                    }}
                >
                    <Typography fontSize={'18px'} fontWeight={700} lineHeight={'120%'}>
                        Space Description
                    </Typography>
                    <Typography fontSize={'13px'} fontWeight={500} lineHeight={'140%'}>
                        This is a description greeting for new members. You can also update descriptions.
                    </Typography>
                    <TextEditor
                        holder="space_description"
                        sx={{
                            backgroundColor: '#ffffff0d',
                            fontFamily: 'Inter',
                            color: 'white',
                            padding: '12px 12px 12px 80px',
                            borderRadius: '10px'
                        }}
                    />
                    <Stack
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '6px',
                            alignItems: 'center'
                        }}
                    >
                        <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_4575_7884)">
                                <path fillRule="evenodd" clipRule="evenodd" d="M4.80085 4.06177H2.83984V11.506H4.88327V7.3727L6.82879 10.0394L8.68199 7.3727V11.506H10.6226V4.06177H8.68199L6.82879 6.81714L4.80085 4.06177ZM1.55636 0.794922H18.4436C19.3028 0.794922 20 1.59076 20 2.57247V13.0174C20 13.9989 19.3032 14.7949 18.4436 14.7949H1.55636C0.697166 14.7949 0 13.9991 0 13.0174V2.57247C0 1.59091 0.696805 0.794922 1.55636 0.794922ZM14.0078 4.10603H13.9884V7.92826H12.1206L15 11.506L17.8795 7.90628H15.9347V4.10603H14.0078Z" fill="white" />
                            </g>
                            <defs>
                                <clipPath id="clip0_4575_7884">
                                    <rect width="20" height="14" fill="white" transform="translate(0 0.794922)" />
                                </clipPath>
                            </defs>
                        </svg>
                        <Typography>
                            Markdown Available
                        </Typography>
                    </Stack>
                </Box>
                <Box
                    sx={{
                        alignItems: 'flex-start',
                        display: 'flex',
                        flexDirection: 'column',
                        flexWrap: 'nowrap',
                        gap: '30px',
                        padding: '20px 0px 0px',
                        width: '100%',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexWrap: 'nowrap',
                            gap: '10px',
                        }}
                    >
                        <Typography fontSize={'18px'} fontWeight={700} lineHeight={'120%'}>
                            Space Avatar
                        </Typography>
                        <Typography fontSize={'13px'} fontWeight={500} lineHeight={'140%'}>
                            200 x 200 Min. (1:1 Ratio) Upload PNG, GIF or JPEG
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                            }}
                        >
                            <Stack
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                    borderRadius: '58px',
                                    padding: '6px 16px',
                                    width: 'fit-content'
                                }}
                                fontSize={'14px'}
                                fontFamily={'Inter'}
                                fontWeight={600}
                                color={"rgba(255, 255, 255, 0.7)"}
                            >
                                Upload
                            </Stack>

                            <Stack
                                sx={{
                                    width: '85px',
                                    height: '85px',
                                    borderRadius: '60px',
                                    boxShadow: '0 0 0 6px #2e2e2e'
                                }}
                            >
                                <Image
                                    loader={() => "https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png"}
                                    src="https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png"
                                    width={85}
                                    height={85}
                                    alt=""
                                    style={{
                                        borderRadius: '60px'
                                    }}
                                ></Image>
                            </Stack>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            width: '100%'
                        }}
                    >
                        <Typography fontSize={'18px'} fontWeight={700} lineHeight={'120%'}>
                            Space Main Banner
                        </Typography>
                        <Typography fontSize={'13px'} fontWeight={500} lineHeight={'140%'}>
                            200 x 200 Min. (1:1 Ratio) Upload PNG, GIF or JPEG
                        </Typography>
                        <Stack
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                borderRadius: '58px',
                                padding: '6px 16px'
                            }}
                            fontSize={'14px'}
                            fontFamily={'Inter'}
                            fontWeight={600}
                            color={"rgba(255, 255, 255, 0.7)"}
                            width={'fit-content'}
                        >
                            Upload
                        </Stack>
                        <Stack
                            sx={{
                                width: '100%',
                                height: '240px',
                                borderRadius: '10px',
                                boxShadow: '0 .6021873017743928px .6021873017743928px -1.25px #0000002e, 0 2.288533303243457px 2.288533303243457px -2.5px #00000029, 0 10px 10px -3.75px #00000010',
                                position: 'relative'
                            }}
                        >
                            <Image
                                loader={() =>
                                    'https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png?scale-down-to=512 512w, https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png?scale-down-to=1024 1024w, https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png 1920w'
                                }
                                src={
                                    'https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png?scale-down-to=512 512w, https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png?scale-down-to=1024 1024w, https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png 1920w'
                                }
                                alt=""
                                width={'100'}
                                height={'240'}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '10px'
                                }}
                            />
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </Stack >
    )
}