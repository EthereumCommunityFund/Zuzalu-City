'use client';
import styled from '@emotion/styled';
import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import EditorJS, { BlockMutationEvent, OutputData } from '@editorjs/editorjs';
import { tools } from './tools';
import { getOutputDataLength } from './useEditorStore';
import { Global, css } from '@emotion/react';
import { shallowDiff } from './shallowDiff';

const SuperEditor: React.FC<{
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

  const [editorValue, setEditorValue] = useState<OutputData | undefined>(value);
  const wrapperRef = createRef<HTMLDivElement>();
  const editorRef = useRef<EditorJS>();

  const loadEditor = useCallback(async (container: HTMLElement) => {
    const editor = (editorRef.current = new EditorJS({
      holder: container,
      placeholder,
      tools,
      data: editorValue,
      minHeight: minHeight - (24 + 38),
      onChange: async (api, event: BlockMutationEvent) => {
        if (event.type !== 'block-changed') {
          const content = await api.saver.save();
          setEditorValue(content);
          onChange?.(content);
          return;
        }
        const content = await api.saver.save();
        const contentLen = getOutputDataLength(content.blocks);

        if (contentLen <= maxLength) {
          // if content length is less than maxLength
          // then save the content
          setEditorValue(content);
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
          text: currentText.substring(0, currentText.length - overflowLength),
        });

        api.caret.setToBlock(workingBlockIndex, 'end');
      },
    }));

    editor.isReady.then(() => {
      container.classList.add('editor-ready');
      // observer .codex-editor__redactor height change
      const editorEl = container.querySelector<HTMLDivElement>(
        '.codex-editor__redactor',
      );

      if (editorEl) {
        const observer = new ResizeObserver(() => {
          const height = editorEl.clientHeight;
          const paddingBottom = window.getComputedStyle(editorEl).paddingBottom;

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
    });
  }, []);

  useEffect(() => {
    if (wrapperRef.current && !editorRef.current) {
      loadEditor(wrapperRef.current)
        .then(() => {
          // console.log('editor loaded');
        })
        .catch((err) => {
          console.error(err);
        });
    }
    return () => {
      editorRef.current?.destroy?.();
    };
  }, []);

  useEffect(() => {
    if (shallowDiff(editorValue, value)) {
      if (editorRef.current) {
        if (typeof value === 'undefined') {
          editorRef.current.clear();
          setEditorValue(value);
        } else if (value && editorRef.current.render) {
          editorRef.current.render(value).catch((err) => {
            console.error(err);
          });
          setEditorValue(value);
        }
      }
    }
  }, [value, editorRef.current?.render]);

  return (
    <Wrapper ref={wrapperRef} minHeight={minHeight}>
      <Global styles={globalStyles} />
    </Wrapper>
  );
};

const globalStyles = css`
  .ce-inline-toolbar {
    color: black;
  }

  .ce-paragraph[data-placeholder]:empty:before {
    color: #929292;
  }

  .ce-block__content > * {
    &::selection {
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
`;

export default SuperEditor;

const Wrapper = styled('div')<{ minHeight?: number }>`
  padding: 12px;
  background-color: #ffffff0d;
  border-radius: 10px;
  color: white;
  min-height: ${({ minHeight }) => minHeight}px;
}
`;
