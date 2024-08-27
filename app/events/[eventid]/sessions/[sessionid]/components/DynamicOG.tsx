import { OutputData } from '@editorjs/editorjs';

interface IProps {
  title?: string;
  desc?: OutputData;
  image?: string;
}

function DynamicOG({ title, desc, image }: IProps) {
  if (!title || !desc) return null;

  function extractTextFromEditorJsData(data: OutputData) {
    let text = '';
    data.blocks.forEach((block) => {
      if (block.type === 'paragraph') {
        text += block.data.text;
      }
    });
    return text.trim();
  }

  return (
    <>
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content={extractTextFromEditorJsData(desc)}
      />
      <meta property="og:image" content={image} />
    </>
  );
}

export default DynamicOG;
