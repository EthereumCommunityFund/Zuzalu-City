'use client';
import React, { useEffect, useRef, Fragment, FC } from 'react';
import { OutputData } from '@editorjs/editorjs';
import { tools } from './tools';
import { Box, BoxProps } from '@mui/material';
import EditorJS from '@editorjs/editorjs';
import { MDImporter, MDParser } from './markdownParser'

import './editor.css';

// import dynamic from 'next/dynamic';
// const EditorJS = dynamic(() => import('@editorjs/editorjs'), { ssr: false })

interface TextEditorPropTypes extends BoxProps {
  value?: OutputData,
  setData?: (value: OutputData) => void,
  holder: string,
  placeholder?: string,
  readonly?: boolean,
  showMore?: boolean
}

const TextEditor: FC<TextEditorPropTypes> = ({
  value = { blocks: [] },
  setData = (value: OutputData) => { console.log(value) },
  holder = "editorjs",
  children,
  readonly = false,
  placeholder = 'Write an Amazing Blog',
  showMore = false,
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
            console.log('EditorJS Error: ', err)
          }
        },
        onReady: () => {
          applyCustomStyles(showMore);
        }
      })

      ref.current = editor;
    }

    return () => {
      if (ref.current && (ref.current as any).destroy) {
        (ref.current as any).destroy();
      }
    };
  }, []);

  const applyCustomStyles = (isPrimary: boolean) => {
    const editorContent = document.querySelector('.codex-editor__redactor') as HTMLElement;
    if (editorContent) {
      editorContent.style.height = isPrimary ? 'fit-content' : '300px';
    }
  };

  useEffect(() => {
    applyCustomStyles(showMore);
  }, [showMore]);

  return (
    <Fragment>
      {
        children ? children : <Box
          id={holder}
          {
          ...props
          }
        >
        </Box>
      }
    </Fragment>
  )
}

export default TextEditor;