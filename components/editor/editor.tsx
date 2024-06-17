'use client';
import React, { useEffect, useRef, Fragment, FC } from 'react';
import { OutputData } from '@editorjs/editorjs';
import { tools } from './tools';
import { Box, BoxProps } from '@mui/material';
import EditorJS from '@editorjs/editorjs';
import { MDImporter, MDParser } from './markdownParser';

import './editor.css';

// import dynamic from 'next/dynamic';
// const EditorJS = dynamic(() => import('@editorjs/editorjs'), { ssr: false })

interface TextEditorPropTypes extends BoxProps {
  value?: OutputData;
  setData?: (value: OutputData) => void;
  holder: string;
  placeholder?: string;
  readonly?: boolean;
}

const TextEditor: FC<TextEditorPropTypes> = ({
  value = { blocks: [] },
  setData = (value: OutputData) => {
    console.log(value);
  },
  holder = 'editorjs',
  children,
  readonly = false,
  placeholder = 'Write an Amazing Blog',
  ...props
}: TextEditorPropTypes) => {
  const ref: any = useRef();

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        tools,
        placeholder: placeholder,
        data: value,
        readOnly: readonly,
        async onChange(api, event) {
          try {
            if (!readonly) {
              const data = await api.saver.save();
              setData(data);
            }
          } catch (err) {
            console.log('EditorJS Error: ', err);
          }
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
