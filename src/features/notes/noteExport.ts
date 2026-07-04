import { Platform } from 'react-native';
import type { Note } from './noteTypes';
import { parseTags } from './noteTypes';

const MAX_SLUG_LENGTH = 50;
const MAX_PROJECT_LENGTH = 80;

export function slugify(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[\s　]+/g, '-')
    .replace(/[\\/:*?"<>|#%&{}$!'@+`=,.;()\[\]]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, MAX_SLUG_LENGTH);
  return slug || 'untitled';
}

export function sanitizeProjectSegment(project: string): string {
  const safe = project
    .trim()
    .replace(/[\s　]+/g, '-')
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\.+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, MAX_PROJECT_LENGTH);
  return safe || 'general';
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

function yamlStringArray(values: string[]): string {
  return `[${values.map(yamlString).join(', ')}]`;
}

export interface ExportInfo {
  dir: string;
  filename: string;
  path: string;
}

export function buildExportInfo(note: Note): ExportInfo {
  const project = sanitizeProjectSegment(note.project);
  const date = note.created_at.slice(0, 10);
  const dir = `docs/notes/${project}`;
  const filename = `${date}_${note.type}_${slugify(note.title)}.md`;
  return { dir, filename, path: `${dir}/${filename}` };
}

export function buildNoteMarkdown(note: Note): string {
  const tags = parseTags(note.tags);
  const project = sanitizeProjectSegment(note.project);
  const frontMatter = [
    '---',
    `title: ${yamlString(note.title || 'untitled')}`,
    `project: ${yamlString(project)}`,
    `type: ${yamlString(note.type)}`,
    `tags: ${yamlStringArray(tags)}`,
    `createdAt: ${yamlString(note.created_at)}`,
    `updatedAt: ${yamlString(note.updated_at)}`,
    `source: ${yamlString('MindHub_App')}`,
    '---',
  ].join('\n');

  return `${frontMatter}\n\n${note.body}\n`;
}

// Webではセキュリティ制約により任意フォルダへ直接書き込めないため、
// ブラウザのダウンロードとして保存する（docs/memo-app/11-open-issues.md 参照）。
export function downloadMarkdownFile(filename: string, content: string): boolean {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return false;
  }
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
  return true;
}
