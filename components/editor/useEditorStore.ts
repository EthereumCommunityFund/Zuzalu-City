import { OutputData } from '@editorjs/editorjs';
import { useState } from 'react';

export const ParseStringToOutputData = (string: string) => {
  return JSON.parse(string.replaceAll('\\"', '"')) as OutputData;
};

export const getOutputDataLength = (blocks: OutputData['blocks'] = []) => {
  return blocks
    .filter((block) => 'text' in block.data)
    .reduce((prev, current) => prev + current.data.text.length, 0);
};

export const useEditorStore = () => {
  const [value, setValue] = useState<OutputData>();

  const [length, setLength] = useState<number>(0);

  return {
    value,
    getValueString: () => {
      // FIXME: This is a temporary solution to fix the issue with the double quotes
      return JSON.stringify(value).replaceAll('"', '\\"');
    },
    setValue: (value: OutputData | string) => {
      const data =
        typeof value === 'string' ? ParseStringToOutputData(value) : value;

      setValue(data);
      setLength(getOutputDataLength(data.blocks));
    },
    length,
    setLength,
  };
};
