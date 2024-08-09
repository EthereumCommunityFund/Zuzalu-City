import { Stack, Typography, useTheme } from "@mui/material";
import { TrafficConeIcon } from "../icons/TrafficCone";

export function EventStaticCard() {

    const { breakpoints } = useTheme();

    return (
        <Stack
            width={'100%'}
            padding={'20px'}
            gap={'14px'}
            direction="row"
            alignItems={'center'}
            justifyContent={'left'}
            bgcolor={'rgba(255, 255, 255, 0.02)'}
            border={'1px solid rgba(255, 255, 255, 0.10)'}
            borderRadius={'10px'}
        >
            <Stack
                sx={{
                    display: 'block',
                    [breakpoints.down('md')]: {
                        display: 'none'
                    }
                }}
            >
                <TrafficConeIcon />
            </Stack>
            <Stack
                gap="10px"
            >
                <Typography fontSize={'18px'} fontWeight={700} color={'white'}>Event Creation Coming Soon!</Typography>
                <Typography fontSize={'14PX'} color={'white'} sx={{ opacity: '0.6' }}>Stay tuend for the launch of our beta</Typography>
            </Stack>
        </Stack>
    )
}