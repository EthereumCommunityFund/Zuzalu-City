import * as React from 'react';
import { useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import { Profile } from '@/types';
import { Box, Chip, ListItemText, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import Checkbox from '@mui/material/Checkbox';

interface IProps {
  users: Profile[];
  onChange: (value: Profile[]) => void;
  initialUsers?: Profile[];
}

export default function SelectSearchUser({
  onChange,
  users,
  initialUsers = [],
}: IProps) {
  const [value, setValue] = React.useState<Profile[]>(initialUsers || []);

  const handleChange = useCallback(
    (newValue: Profile[]) => {
      const updatedValue = Array.from(new Set([...initialUsers, ...newValue]));
      setValue(updatedValue);
      onChange(updatedValue);
    },
    [onChange, initialUsers],
  );

  return (
    <>
      <Autocomplete
        multiple
        value={value}
        onChange={(event, newValue) => handleChange(newValue)}
        filterOptions={(options, params) => {
          const { inputValue } = params;

          return options.filter((option) => {
            const { author, username } = option;
            if (username.toLowerCase().includes(inputValue.toLowerCase()))
              return true;
            const regex = /0x.+/g;
            const matches = author?.id.match(regex);
            if (matches) {
              const address = matches[0];
              if (address.toLowerCase().includes(inputValue.toLowerCase()))
                return true;
            }
            return false;
          });
        }}
        options={users}
        getOptionLabel={(option) => {
          return option.username;
        }}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props as any;
          return (
            <li key={option.id} {...optionProps}>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <Stack direction={'row'} alignItems="center" spacing="10px">
                  <Image
                    src={option.avatar || '/user/avatar_icon.png'}
                    width={26}
                    height={26}
                    alt="avatar"
                  />
                  <ListItemText primary={option.username} />
                </Stack>
                <Checkbox
                  checked={
                    value.findIndex((item) => item.id === option.id) > -1
                  }
                />
              </Box>
            </li>
          );
        }}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              placeholder="Search a person"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <SearchIcon
                      sx={{
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                    />
                  </>
                ),
              }}
            />
          );
        }}
      />
      <Box display="flex" flexDirection="row" gap="10px" flexWrap="wrap">
        {value.map((i, index) => {
          const isInitialUser = initialUsers.some((user) => user.id === i.id);
          return (
            <Chip
              label={
                <Stack direction="row" alignItems="center" spacing="10px">
                  <Image
                    src={i.avatar || '/user/avatar_icon.png'}
                    width={26}
                    height={26}
                    alt="avatar"
                  />
                  <Typography variant="bodyMB" sx={{ lineHeight: 1.6 }}>
                    {i.username}
                  </Typography>
                </Stack>
              }
              sx={{
                borderRadius: '10px',
                padding: '6px 0',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
              onDelete={
                isInitialUser
                  ? undefined
                  : () => {
                      const newArray = value.filter((item) => item.id !== i.id);
                      setValue(newArray);
                      onChange(newArray);
                    }
              }
              key={`Selected_Speaker${index}`}
            />
          );
        })}
      </Box>
    </>
  );
}
