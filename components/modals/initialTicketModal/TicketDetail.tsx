import { ZuButton } from "@/components/core"
import { Box, Input, Stack, TextField, Typography } from "@mui/material"

export const TicketDetail = () => {
    return (
        <Stack
            sx={{
                width: '100%',
                padding: '20px',
                boxSizing: 'border-box',
                height: '100%',
                overflow: 'auto'
            }}
        >
            <Stack
                sx={{
                    width: '100%',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '30px'
                }}
            >
                <Typography fontSize={'20px'} fontWeight={700} lineHeight={'120%'}>
                    Ticket Basics
                </Typography>

                <Stack
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '30px'
                    }}
                >
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        gap={'10px'}
                    >
                        <Typography fontSize={'16px'} fontWeight={700} lineHeight={'120%'}>
                            Ticket Name
                        </Typography>
                        <Input
                            disableUnderline={true}
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                padding: '12px',
                                borderRadius: '10px',
                                fontSize: '16px'
                            }}
                        />
                    </Box>
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        gap={'10px'}
                    >
                        <Typography fontSize={'16px'} fontWeight={700} lineHeight={'120%'}>
                            Ticket Price
                        </Typography>
                        <Input
                            disableUnderline={true}
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                padding: '12px',
                                borderRadius: '10px',
                                fontSize: '16px'
                            }}
                        />
                        <Typography textTransform={'uppercase'} fontSize={'10px'} sx={{ opacity: '0.7' }}>
                            Input an amount
                        </Typography>
                    </Box>
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        gap={'10px'}
                    >
                        <Typography fontSize={'16px'} fontWeight={700} lineHeight={'120%'}>
                            Quantity
                        </Typography>
                        <Input
                            disableUnderline={true}
                            type={'number'}
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                padding: '12px',
                                borderRadius: '10px',
                                fontSize: '16px'
                            }}
                        />
                    </Box>
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        gap={'10px'}
                    >
                        <Typography fontSize={'16px'} fontWeight={700} lineHeight={'120%'}>
                            Quantity
                        </Typography>
                        <Input
                            disableUnderline={true}
                            type={'number'}
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                padding: '12px',
                                borderRadius: '10px',
                                fontSize: '16px'
                            }}
                        />
                    </Box>
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        gap={'10px'}
                    >
                        <Typography fontSize={'16px'} fontWeight={700} lineHeight={'120%'}>
                            Ticket Description
                        </Typography>
                        <TextField
                            variant="filled"
                            multiline
                            rows={3}
                            maxRows={3}
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                padding: '12px',
                                borderRadius: '10px',
                                fontSize: '16px',
                                '& > div': {
                                    backgroundColor: 'transparent',
                                    padding: '0px',
                                    content: 'unset',
                                    border: 'none',
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    },
                                    '&:focus': {
                                        backgroundColor: 'transparent'
                                    }
                                },
                                '& > div > textarea': {
                                    padding: '0px'
                                }
                            }}
                        />
                    </Box>
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        gap={'10px'}
                    >
                        <Typography fontSize={'16px'} fontWeight={700} lineHeight={'120%'}>Ticket Image</Typography>
                        <Typography fontSize={'13px'} fontWeight={400} lineHeight={'140%'} sx={{ opacity: '0.6' }}>Recommend min of 200x200px (1:1 Ratio)</Typography>
                        <ZuButton
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '6px',
                                padding: '6px 10px',
                                fontSize: '13px',
                                fontWeight: 700,
                                lineHeight: '120%'
                            }}
                        >
                            Upload Image
                        </ZuButton>
                        <Box
                            width={'200px'}
                            height={'200px'}
                            borderRadius={'10px'}
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.05)'
                            }}
                        ></Box>
                    </Box>
                </Stack>
            </Stack>
        </Stack>
    )
}