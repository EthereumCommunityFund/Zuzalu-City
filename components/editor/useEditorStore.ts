import { OutputData } from '@editorjs/editorjs';
import { useState } from 'react';

export const decodeOutputData = (string: string): OutputData => {
  try {
    return JSON.parse(string.replaceAll('\\"', '"')) as OutputData;
  } catch (e) {
    console.error('Failed to parse output data', e);
    return { time: 0, blocks: [] };
  }
};

export const encodeOutputData = (data: OutputData) => {
  if (!data) return JSON.stringify({});
  // FIXME: This is a temporary solution to fix the issue with the double quotes
  return JSON.stringify(data).replaceAll('"', '\\"');
};

export const getOutputDataLength = (blocks: OutputData['blocks'] = []) => {
  return blocks
    .filter((block) => block.data && 'text' in block.data)
    .reduce((sum, current) => sum + current.data.text.length, 0);
};

export const useEditorStore = () => {
  const [value, setValue] = useState<OutputData>();
  const [length, setLength] = useState<number>(0);

  return {
    value,
    getValueString: () => encodeOutputData(value!),
    setValue: (value: OutputData | string) => {
      const data = typeof value === 'string' ? decodeOutputData(value) : value;
      setValue(data);
      setLength(getOutputDataLength(data.blocks));
    },
    length,
    setLength,
  };
};
