import type { Memo } from './memoTypes';

export function generateMarkdown(memo: Memo): string {
  const frontMatter = [
    '---',
    `createdAt: ${memo.created_at}`,
    `updatedAt: ${memo.updated_at}`,
    `category: ${memo.category}`,
    `source: FlowDock`,
    '---',
  ].join('\n');

  return `${frontMatter}\n\n${memo.body}`;
}
