export function parseImageToMarkdown(blocks: any) {
  return `![${blocks.caption}](${blocks.url} "${blocks.caption}")`.concat('\n');
}
