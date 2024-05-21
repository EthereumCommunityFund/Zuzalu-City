'use client';
import React, { useEffect, useRef, Fragment, FC } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { tools } from './tools';
import { Box, BoxProps } from '@mui/material';

interface TextEditorPropTypes extends BoxProps {
  value?: OutputData;
  placeholder?: string;
  setData?: (value: OutputData) => void;
  holder: string;
}

const TextEditor: FC<TextEditorPropTypes> = ({
  value = { blocks: [] },
  setData = (value: OutputData) => {
    console.log(value);
  },
  holder = 'editorjs',
  children,
  placeholder = 'Write your amazing Blog!',
  ...props
}: TextEditorPropTypes) => {
  const ref: any = useRef();

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        tools,
        placeholder,
        data: value,
        async onChange(api, event) {
          const data = await api.saver.save();
          setData(data);
        },
      });

      ref.current = editor;
    }

    return () => {
      if (ref.current && (ref.current as any).destroy) {
        (ref.current as any).destroy();
      }
    };
  }, []);

  return (
    <Fragment>
      {children ? children : <Box id={holder} {...props}></Box>}
    </Fragment>
  );
};

export default TextEditor;
