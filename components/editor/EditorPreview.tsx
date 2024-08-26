'use client';
import styled from '@emotion/styled';
import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { tools } from './tools';
import { Global, css } from '@emotion/react';
import { decodeOutputData } from './useEditorStore';
import { shallowDiff } from './shallowDiff';

const EditorPreview: React.FC<{
  value: OutputData | string;
  collapsed?: boolean;
  /**
   * if true, the editor will be collapsed when height > collapseHeight * 1.5
   */
  collapsable?: boolean;
  collapseHeight?: number;
  /**
   * if scrollHeight is set, the editor will be scrollable
   */
  scrollHeight?: number;
  onCollapse?: (collapsed: boolean) => void;
}> = (props) => {
  const {
    value,
    collapseHeight = 200,
    collapsable = true,
    scrollHeight,
  } = props;

  const [previewData, setPreviewData] = useState<OutputData | undefined>(
    decodeOutputData(value),
  );

  const [collapsed, setCollapsed] = useState(props.collapsed);

  useEffect(() => {
    setCollapsed(props.collapsed);
  }, [props.collapsed]);

  const wrapperRef = createRef<HTMLDivElement>();
  const editorRef = useRef<EditorJS>();

  const loadEditor = useCallback(async (container: HTMLElement) => {
    editorRef.current = new EditorJS({
      holder: container,
      tools,
      data: previewData,
      readOnly: true,
      minHeight: 0,
      onReady() {
        container.classList.add('editor-ready');
        if (collapsable) {
          // eslint-disable-next-line no-inner-declarations
          function calculateHeight() {
            const editorEl = container.querySelector<HTMLDivElement>(
              '.codex-editor__redactor',
            );
            if (editorEl) {
              const editorHeight = editorEl.getBoundingClientRect().height;
              if (editorHeight > collapseHeight! * 1.5) {
                setCollapsed(true);
                props.onCollapse?.(true);
              }
            } else {
              console.log(333333, editorEl);
              window.requestAnimationFrame(() => {
                calculateHeight();
              });
            }
          }

          calculateHeight();
        }
      },
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
    if (shallowDiff(value, previewData)) {
      const data = decodeOutputData(value);
      setPreviewData(data);
      if (editorRef.current) {
        if (!data) {
          editorRef.current.clear();
        } else {
          editorRef.current.render?.(data).catch((err) => {
            console.error(err);
          });
        }
      }
    }
  }, [value]);

  return (
    <Wrapper
      ref={wrapperRef}
      scrollHeight={scrollHeight}
      style={{ height: collapsed ? collapseHeight : 'auto' }}
    >
      <Global styles={globalStyles} />
    </Wrapper>
  );
};

export default EditorPreview;

const globalStyles = css`
  .codex-editor * {
    max-width: unset !important;
  }

  .ce-block__content > * {
    &::selection {
      background-color: rgba(255, 255, 255, 0.5);
    }
  }

  .ce-block--selected .ce-block__content {
    background-color: unset;
  }
`;

const Wrapper = styled('div')<{
  scrollHeight?: number;
}>`
  color: white;
  font-size: 16px;
  line-height: 1.6;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  ${(props) =>
    props.scrollHeight
      ? `    
    max-height: ${props.scrollHeight}px;
    overflow-y: auto;
  `
      : ''}
`;
