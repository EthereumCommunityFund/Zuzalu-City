import { Autocomplete, Box, Chip, OutlinedInput, Popper, Stack, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { ZuAutoCompleteProps } from "@/types";

export default function ZuAutoCompleteInput({ optionVals, val, setVal }: ZuAutoCompleteProps) {

    const valHtml = val.map((option: any, index: number) => {
        // This is to handle new options added by the user (allowed by freeSolo prop).
        const label = option.label;
        return (
            <Chip
                key={index}
                label={label}
                deleteIcon={<HighlightOffIcon />}
                onDelete={() => {
                    setVal(val.filter((entry: any) => entry.value !== option.value));
                }}
            />
        );
    });
    return (
        <Stack>
            <Autocomplete
                multiple
                id="tags-standard"
                freeSolo
                filterSelectedOptions
                options={optionVals}
                onChange={(e, newValue) => {
                    setVal(newValue)
                }}
                getOptionLabel={(option: any) => option.label}
                renderTags={() => null}
                value={val}
                componentsProps={{
                    paper: {
                        sx: {
                            backgroundColor: '#373737',
                            marginTop: '10px'
                        }
                    }
                }}
                renderInput={params => (
                    <TextField
                        {...params}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                    />
                )}
                renderOption={(props, option, { selected }) => {
                    return (
                        <li {...props} style={{backgroundColor: 'transparent'}}>
                            <Box display={'flex'} flexDirection={'row'}>
                                <Box display={'flex'} ml={3} flexDirection={'column'}>
                                    <Typography color={'text.primary'}>
                                        {option.label}
                                    </Typography>
                                </Box>
                            </Box>
                        </li>
                    );
                }}
            />
            <Stack
                direction={'row'}
                width={'100%'}
                flexWrap={'wrap'}
                gap='10px'
            >
                {
                    valHtml
                }
            </Stack>

        </Stack>
    )
}