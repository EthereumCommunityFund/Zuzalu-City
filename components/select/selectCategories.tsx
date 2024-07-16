import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { SPACE_CATEGORIES } from '@/constant';
import { useCallback } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import SelectCheckItem from '@/components/select/selectCheckItem';

const filter = createFilterOptions<FilmOptionType>();

interface IProps {
  onChange: (value: string[]) => void;
}

export default function SelectCategories({ onChange }: IProps) {
  const [value, setValue] = React.useState<FilmOptionType[]>([]);

  const handleChange = useCallback(
    (value: FilmOptionType[]) => {
      setValue(value);
      onChange(value.map((item) => item.value) || []);
    },
    [onChange],
  );

  return (
    <Autocomplete
      multiple
      value={value}
      onChange={(event, newValue) => handleChange(newValue)}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        const isExisting = options.some(
          (option) => inputValue === option.label,
        );
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            value: inputValue,
            label: `Add "${inputValue}"`,
            isAdd: true,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={SPACE_CATEGORIES}
      getOptionLabel={(option) => {
        if ((option as any).isAdd) {
          return option.value;
        }
        return option.label;
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props as any;
        return (
          <li key={key} {...optionProps}>
            <SelectCheckItem
              label={option.label}
              isChecked={
                value.findIndex((item) => item.value === option.value) > -1
              }
              showCheck={!(option as any).isAdd}
            />
          </li>
        );
      }}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <SearchIcon
                    sx={{
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  />
                  <React.Fragment>
                    {params.InputProps.startAdornment}
                  </React.Fragment>
                </>
              ),
            }}
          />
        );
      }}
    />
  );
}

interface FilmOptionType {
  value: string;
  label: string;
  isAdd?: boolean;
}
