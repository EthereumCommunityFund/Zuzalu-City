'use client';
import React, { useEffect, useRef, Fragment, FC } from 'react';
import { OutputData } from '@editorjs/editorjs';
import { tools } from './tools';
import { Box, BoxProps } from '@mui/material';
import EditorJS from '@editorjs/editorjs';

import './editor.css';

// import dynamic from 'next/dynamic';
// const EditorJS = dynamic(() => import('@editorjs/editorjs'), { ssr: false })

interface TextEditorPropTypes extends BoxProps {
  value?: OutputData;
  placeholder?: string;
  editor: any;
  setEditorInst?: (editor: any) => void;
  holder: string;
}

const TextEditor: FC<TextEditorPropTypes> = ({
  value,
  editor,
  setEditorInst = (editor: any) => {},
  holder = 'editorjs',
  children,
  ...props
}: TextEditorPropTypes) => {
  const ref: any = useRef();

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        tools,
        data: value,
      });

      ref.current = editor;
      setEditorInst(editor);
    }

    return () => {
      if (ref.current && (ref.current as any).destroy) {
        (ref.current as any).destroy();
      }
    };
  }, []);

  useEffect(() => {
    editor?.render(value);
  }, [value]);

  return (
    <Fragment>
      {children ? children : <Box id={holder} {...props}></Box>}
    </Fragment>
  );
};

export default TextEditor;
