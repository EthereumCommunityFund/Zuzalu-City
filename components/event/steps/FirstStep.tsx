import { ChevronDownIcon, ChevronUpIcon, LeftArrowIcon, RightArrowCircleIcon } from "@/components/icons";
import { Divider, Stack, Typography } from "@mui/material";
import BpCheckbox from "../Checkbox";
import { ZuButton } from "@/components/core";
import { Dispatch, SetStateAction, useState } from "react";
import { Anchor } from "@/types";

interface PropTypes {
    handleStep: (val: number) => void;
    handleRegisterAsSponsor: () => void;
}

export const FirstStep = ({
    handleStep,
    handleRegisterAsSponsor
}: PropTypes) => {

    const [selectedPackage, setSelectedPackage] = useState<string>('');

    const sponsorPackages: {
        name: string,
        price: number,
        currency: string,
        description: string
    }[] = [
            {
                name: 'Sponsor Package One',
                price: 2000,
                currency: 'USDT',
                description: 'Get ready to groove at the Summer Music Festival! Join us for a day filled with live music, food trucks, and good vibes. '
            },
            {
                name: 'Sponsor Package Two',
                price: 10000,
                currency: 'USDT',
                description: 'one two three four five six seven eight nine ten elevane'
            }
        ];

    const handleSelectPackage = (val: string) => {
        if(selectedPackage === val) {
            setSelectedPackage('');
        } else {
            setSelectedPackage(val);
        }
    }

    return (
        <Stack padding={'20px'} gap={'20px'}>
            <Stack gap="4px">
                <Typography color="white" variant="bodyMB" sx={{ opacity: '0.7' }}>
                    Sponsor Packages: (single)
                </Typography>
                <Typography color="#FF9C66" variant="bodyS" sx={{ opacity: '0.8' }}>
                    Sponsors may require approval
                </Typography>
            </Stack>
            <Stack
                direction={'row'}
                padding={'6px'}
                gap={'10px'}
                alignItems={'center'}
                onClick={() => handleStep(0)}
            >
                <LeftArrowIcon />
                <Typography
                    fontSize={'14px'}
                    fontWeight={600}
                    lineHeight={'160%'}
                >
                    Back to Attendee Tickets
                </Typography>
            </Stack>
            <Stack
                direction={'column'}
                gap={'10px'}
            >
                {
                    sponsorPackages.map((sPackage, index) => {
                        return (
                            <Stack
                                key={index}
                                gap={'5px'}
                                borderRadius={'10px'}
                                padding={'10px'}
                                sx={{
                                    backgroundColor: selectedPackage === sPackage.name ? '' : 'rgba(255, 255, 255, 0.02)',
                                    background: selectedPackage === sPackage.name ? 'linear-gradient(93deg, rgba(215, 255, 196, 0.07) 0.75%, rgba(255, 255, 255, 0.10) 99.86%)' : ''
                                }}
                                onClick={() => handleSelectPackage(sPackage.name)}
                            >
                                <Stack
                                    direction={'row'}
                                    alignItems={'center'}
                                    justifyContent={'space-between'}
                                >
                                    <Typography fontSize={'14px'} fontWeight={600} lineHeight={'160%'}>
                                        {
                                            sPackage.name
                                        }
                                    </Typography>
                                    <Stack
                                        direction={'row'}
                                        alignItems={'center'}
                                        gap={'2px'}
                                    >
                                        <Typography fontSize={'14px'} fontWeight={600} lineHeight={'160%'} sx={{ opacity: '0.7' }}>
                                            {
                                                sPackage.price
                                            }
                                        </Typography>
                                        <Typography fontSize={'10px'} fontWeight={400} textTransform={'uppercase'} lineHeight={'120%'} letterSpacing={'0.2px'} sx={{ opacity: '0.7' }}>
                                            {
                                                sPackage.currency
                                            }
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Typography fontSize={'13px'} fontWeight={400} lineHeight={'140%'} letterSpacing={'0.13'} sx={{ opacity: '0.7' }}>
                                    {
                                        sPackage.description
                                    }
                                </Typography>
                            </Stack>
                        )
                    })
                }
            </Stack>
            <ZuButton
                sx={{
                    backgroundColor: '#373b36',
                    color: '#D7FFC4',
                    width: '100%',
                    '&:disabled': {
                        opacity: '0.5',
                        color: '#D7FFC4',
                        backgroundColor: '#373b36',
                        border: '1px solid rgba(215, 255, 196, 0.20)'
                    }
                }}
                startIcon={<RightArrowCircleIcon color="#D7FFC4" />}
                disabled={!selectedPackage}
                onClick={handleRegisterAsSponsor}
            >
                Register As Sponsor
            </ZuButton>
        </Stack>
    )
}