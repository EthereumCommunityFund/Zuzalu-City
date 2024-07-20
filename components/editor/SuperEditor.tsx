'use client';
import styled from '@emotion/styled';
import React, { createRef, useEffect, useRef } from 'react';
import EditorJS, { BlockMutationEvent, OutputData } from '@editorjs/editorjs';
import { tools } from './tools';
import { getOutputDataLength } from './useEditorStore';
import { Global, css } from '@emotion/react';

export const SuperEditor: React.FC<{
  minHeight?: number;
  maxLength?: number;
  value?: OutputData;
  placeholder?: string;
  onChange?: (value: OutputData) => void;
}> = (props) => {
  let {
    minHeight = 270,
    value,
    onChange,
    maxLength = 5000,
    placeholder,
  } = props;

  const wrapperRef = createRef<HTMLDivElement>();
  const editorRef = useRef<EditorJS>();

  useEffect(() => {
    if (wrapperRef.current) {
      // eslint-disable-next-line no-inner-declarations
      async function loadEditor() {
        editorRef.current = new EditorJS({
          holder: wrapperRef.current as HTMLElement,
          placeholder,
          tools,
          data: value,
          minHeight: minHeight - (24 + 38),
          onChange: async (api, event: BlockMutationEvent) => {
            if (event.type !== 'block-changed') {
              const content = await api.saver.save();
              onChange?.(content);
              return;
            }
            const content = await api.saver.save();
            const contentLen = getOutputDataLength(content.blocks);

            if (contentLen <= maxLength) {
              // if content length is less than maxLength
              // then save the content
              onChange?.(content);
              return;
            }
            // if content length is greater than maxLength
            // then remove the overflow text

            const workingBlock = event.detail.target;
            // @ts-ignore
            const workingBlockIndex = event.detail.index;
            const workingBlockSaved = content.blocks.find(
              (block) => block.id === workingBlock.id,
            );

            const overflowLength = contentLen - maxLength;

            const currentText = workingBlockSaved!.data.text;

            // will trigger the onChange event
            await api.blocks.update(workingBlock.id, {
              text: currentText.substring(
                0,
                currentText.length - overflowLength,
              ),
            });

            api.caret.setToBlock(workingBlockIndex, 'end');
          },
          onReady() {
            wrapperRef.current?.classList.add('editor-ready');
            // observer .codex-editor__redactor height change
            const editorEl = wrapperRef.current?.querySelector<HTMLDivElement>(
              '.codex-editor__redactor',
            );

            if (editorEl) {
              const observer = new ResizeObserver(() => {
                const height = editorEl.clientHeight;
                const paddingBottom =
                  window.getComputedStyle(editorEl).paddingBottom;

                const pb = parseInt(paddingBottom, 10);
                const contentHeight = height - pb;
                // padding-bottom provider for the editor click focus
                editorEl.style.setProperty(
                  'padding-bottom',
                  Math.max(0, minHeight - 24 - contentHeight) + 'px',
                );
              });
              observer.observe(editorEl);
            }
          },
        });
      }
      if (wrapperRef.current && !editorRef.current) {
        loadEditor().then(() => {});
      }
    }

    return () => {
      editorRef.current?.destroy?.();
    };
  }, []);

  return (
    <Wrapper ref={wrapperRef} minHeight={Math.max(0, minHeight)}>
      <Global styles={globalStyles} />
    </Wrapper>
  );
};

const globalStyles = css`
  .ce-inline-toolbar {
    color: black;
  }

  .fullWidth .codex-editor * {
    max-width: unset !important;
  }

  .ce-paragraph[data-placeholder]:empty:before {
    color: #929292;
  }

  .ce-block__content > * {
    &::selection {
      background-color: rgba(255, 255, 255, 0.5);
    }
  }

  .editorReadOnly .ce-block--selected .ce-block__content {
    background-color: unset;
  }
`;

const Wrapper = styled('div')<{ minHeight?: number }>`
  padding: 12px;
  background-color: #ffffff0d;
  border-radius: 10px;
  color: white;
  min-height: ${({ minHeight }) => minHeight}px;}
`;
