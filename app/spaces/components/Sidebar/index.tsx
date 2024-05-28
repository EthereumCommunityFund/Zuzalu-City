import { ZuSelect } from "@/components/core";
import { SearchIcon } from "@/components/icons";
import { InputAdornment, OutlinedInput, Stack, Typography } from "@mui/material";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useTheme } from '@mui/material/styles';

export default function SidebarLeft() {

    const { breakpoints } = useTheme()

    return (
        <Stack
            sx={{
                display: "flex",
                padding: "20px 10px",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "10px",
                [breakpoints.down('lg')]: {
                    width: '260px'
                },
                [breakpoints.down('md')]: {
                    display: 'none'
                },
                width: '385px',
                alignSelf: "stretch",
                borderLeft: '1px solid rgba(255, 255, 255, 0.10)'
            }}
        >
            <Stack
                sx={{
                    padding: "10px",
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}
            >
                <OutlinedInput
                    placeholder="Search Events"
                    sx={{
                        backgroundColor:
                            'var(--Inactive-White, rgba(255, 255, 255, 0.05))',
                        paddingX: '15px',
                        paddingY: '13px',
                        borderRadius: '10px',
                        height: '35px',
                        border: '1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))',
                        fontFamily: 'Inter',
                        opacity: 0.7,
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                    }}
                    startAdornment={
                        <InputAdornment position="start" sx={{ opacity: 0.6 }}>
                            <SearchIcon />
                        </InputAdornment>
                    }
                />
                <Stack
                    sx={{
                        padding: '20px 10px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
                    }}
                >
                    <Typography fontSize={'18px'} fontWeight={'700'} lineHeight={'120%'} color={'white'}>
                        Sort & Filter Spaces
                    </Typography>
                </Stack>
                <ZuSelect sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', opacity: '0.6' }} icon={<LocalOfferIcon />} options={[{ value: 'category', label: 'By Category' }]} />
            </Stack>
        </Stack >
    )
}