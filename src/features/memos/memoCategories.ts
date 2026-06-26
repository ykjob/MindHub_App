export type CategoryKey =
  | 'inbox'
  | 'daily'
  | 'study'
  | 'dev'
  | 'job'
  | 'ideas';

export interface Category {
  key: CategoryKey;
  label: string;
  folder: string;
}

export const CATEGORIES: Category[] = [
  { key: 'inbox', label: 'インデックス', folder: 'notes/inbox' },
  { key: 'daily', label: '日常', folder: 'notes/daily' },
  { key: 'study', label: '学習', folder: 'notes/study' },
  { key: 'dev', label: '開発', folder: 'notes/dev' },
  { key: 'job', label: '就活', folder: 'notes/job' },
  { key: 'ideas', label: 'アイデア', folder: 'notes/ideas' },
];

export const DEFAULT_CATEGORY: CategoryKey = 'inbox';

export function getCategoryByKey(key: string): Category {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[0];
}

export function getCategoryLabel(key: string): string {
  return getCategoryByKey(key).label;
}

export function getCategoryFolder(key: string): string {
  return getCategoryByKey(key).folder;
}
