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
  setEditorInst = (editor: any) => { },
  holder = 'editorjs',
  children,
  ...props
}: TextEditorPropTypes) => {
  const editorRef: any = useRef<EditorJS | null>();

  useEffect(() => {
    const initializeEditor = () => {
      if (editorRef.current) {
        return;
      }

      const editor = new EditorJS({
        holder: holder,
        tools,
        data: value,
        onReady: () => {
          editorRef.current = editor;
          setEditorInst(editor);
        },
      });

      editorRef.current = editor;
    };

    if (document.getElementById(holder)) {
      initializeEditor();
    } else {
      console.error(`Element with ID ${holder} is missing. Ensure the element is present in the DOM.`);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [holder, value, setEditorInst]);

  useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.render(value);
    }
  }, [value]);

  return (
    <Fragment>
      {children ? children : <Box id={holder} {...props}></Box>}
    </Fragment>
  );
};

export default TextEditor;
