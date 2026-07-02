import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import type {
  NoteInput,
  NoteType,
  NoteSource,
  NoteVisibility,
} from '../features/notes/noteTypes';
import {
  NOTE_CATEGORIES,
  NOTE_SOURCES,
  NOTE_VISIBILITIES,
  SUGGESTED_PROJECTS,
  getGitCandidateDefault,
} from '../features/notes/noteCategories';
import {
  getDistinctProjects,
  getDistinctTags,
} from '../features/notes/noteRepository';
import { buildChatGptPrompt } from '../features/notes/chatgptPrompts';
import { copyToClipboard } from '../utils/clipboard';
import { showMessage } from '../utils/dialog';
import MarkdownPreview from './MarkdownPreview';

interface Props {
  initial?: Partial<NoteInput>;
  saving: boolean;
  saveLabel?: string;
  onSave: (input: NoteInput) => void;
  onCancel: () => void;
}

export default function NoteForm({
  initial,
  saving,
  saveLabel = '保存',
  onSave,
  onCancel,
}: Props) {
  const db = useSQLiteContext();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [body, setBody] = useState(initial?.body ?? '');
  const [project, setProject] = useState(initial?.project ?? '');
  const [type, setType] = useState<NoteType>(initial?.type ?? 'thought');
  const [tags, setTags] = useState(initial?.tags ?? '');
  const [source, setSource] = useState<NoteSource>(initial?.source ?? 'manual');
  const [visibility, setVisibility] = useState<NoteVisibility>(
    initial?.visibility ?? 'private'
  );
  const [isGitCandidate, setIsGitCandidate] = useState(
    initial?.isGitCandidate ?? getGitCandidateDefault(initial?.type ?? 'thought')
  );
  const [gitFlagTouched, setGitFlagTouched] = useState(
    initial?.isGitCandidate !== undefined
  );
  const [showPreview, setShowPreview] = useState(false);
  const [projectSuggestions, setProjectSuggestions] = useState<string[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([getDistinctProjects(db), getDistinctTags(db)])
      .then(([projects, allTags]) => {
        if (!active) return;
        const merged = Array.from(new Set([...projects, ...SUGGESTED_PROJECTS]));
        setProjectSuggestions(merged);
        setTagSuggestions(allTags);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [db]);

  function handleTypeChange(next: NoteType) {
    setType(next);
    // Git候補フラグを手動変更していない間はカテゴリ初期値に追従する
    if (!gitFlagTouched) {
      setIsGitCandidate(getGitCandidateDefault(next));
    }
  }

  function handleGitFlagChange(value: boolean) {
    setGitFlagTouched(true);
    setIsGitCandidate(value);
  }

  function appendTag(tag: string) {
    const current = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    if (current.includes(tag)) return;
    setTags([...current, tag].join(','));
  }

  async function handleCopyPrompt() {
    const ok = await copyToClipboard(buildChatGptPrompt(type));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      showMessage('コピーできませんでした', 'この環境ではクリップボードを使用できません。');
    }
  }

  function handleSave() {
    onSave({ title, body, project, type, tags, source, visibility, isGitCandidate });
  }

  const canSave = title.trim().length > 0 || body.trim().length > 0;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.label}>タイトル</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="タイトル"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>カテゴリ</Text>
        <View style={styles.chipWrap}>
          {NOTE_CATEGORIES.map((cat) => (
            <Chip
              key={cat.type}
              label={cat.label}
              selected={type === cat.type}
              onPress={() => handleTypeChange(cat.type)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.promptBtn} onPress={handleCopyPrompt}>
          <Text style={styles.promptBtnText}>
            {copied ? 'コピーしました ✓' : 'ChatGPT整理プロンプトをコピー'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>プロジェクト</Text>
        <TextInput
          style={styles.input}
          value={project}
          onChangeText={setProject}
          placeholder="例：memo_app（空ならgeneral扱い）"
          placeholderTextColor="#9CA3AF"
        />
        <View style={styles.chipWrap}>
          {projectSuggestions.map((p) => (
            <Chip
              key={p}
              label={p}
              selected={project === p}
              onPress={() => setProject(p)}
              small
            />
          ))}
        </View>

        <Text style={styles.label}>タグ（カンマ区切り）</Text>
        <TextInput
          style={styles.input}
          value={tags}
          onChangeText={setTags}
          placeholder="例：sqlite,expo,調査"
          placeholderTextColor="#9CA3AF"
        />
        {tagSuggestions.length > 0 ? (
          <View style={styles.chipWrap}>
            {tagSuggestions.map((t) => (
              <Chip key={t} label={t} selected={false} onPress={() => appendTag(t)} small />
            ))}
          </View>
        ) : null}

        <View style={styles.bodyHeader}>
          <Text style={styles.label}>本文（Markdown）</Text>
          <TouchableOpacity
            style={styles.previewToggle}
            onPress={() => setShowPreview(!showPreview)}
          >
            <Text style={styles.previewToggleText}>
              {showPreview ? '編集に戻る' : 'プレビュー'}
            </Text>
          </TouchableOpacity>
        </View>
        {showPreview ? (
          <View style={styles.previewBox}>
            <MarkdownPreview markdown={body || '（本文なし）'} />
          </View>
        ) : (
          <TextInput
            style={styles.bodyInput}
            value={body}
            onChangeText={setBody}
            placeholder="Markdown本文を入力..."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
          />
        )}

        <Text style={styles.label}>source（作成元）</Text>
        <View style={styles.chipWrap}>
          {NOTE_SOURCES.map((s) => (
            <Chip
              key={s.value}
              label={s.label}
              selected={source === s.value}
              onPress={() => setSource(s.value)}
              small
            />
          ))}
        </View>

        <Text style={styles.label}>visibility（保存方針）</Text>
        <View style={styles.chipWrap}>
          {NOTE_VISIBILITIES.map((v) => (
            <Chip
              key={v.value}
              label={v.label}
              selected={visibility === v.value}
              onPress={() => setVisibility(v.value)}
              small
            />
          ))}
        </View>
        <Text style={styles.hint}>
          {NOTE_VISIBILITIES.find((v) => v.value === visibility)?.description}
        </Text>

        <View style={styles.switchRow}>
          <Text style={styles.label}>Git候補にする</Text>
          <Switch value={isGitCandidate} onValueChange={handleGitFlagChange} />
        </View>
        <Text style={styles.hint}>
          個人情報を含むメモはGit候補にしないでください。
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>キャンセル</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!canSave || saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.saveText}>{saveLabel}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
  small = false,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  small?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        small && styles.chipSmall,
        selected && styles.chipSelected,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.chipText,
          small && styles.chipTextSmall,
          selected && styles.chipTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 8, paddingBottom: 32 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginTop: 8 },
  hint: { fontSize: 12, color: '#9CA3AF' },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipSmall: { paddingHorizontal: 10, paddingVertical: 4 },
  chipSelected: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  chipText: { fontSize: 13, color: '#374151' },
  chipTextSmall: { fontSize: 12 },
  chipTextSelected: { color: '#FFFFFF', fontWeight: '600' },
  promptBtn: {
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
  },
  promptBtnText: { fontSize: 13, fontWeight: '600', color: '#2563EB' },
  bodyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  previewToggle: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  previewToggleText: { fontSize: 12, color: '#374151' },
  bodyInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#111827',
    lineHeight: 24,
    minHeight: 240,
    backgroundColor: '#FFFFFF',
  },
  previewBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    minHeight: 240,
    backgroundColor: '#F9FAFB',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  cancelText: { fontSize: 14, color: '#374151' },
  saveBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    minWidth: 80,
    alignItems: 'center',
  },
  saveBtnDisabled: { backgroundColor: '#93C5FD' },
  saveText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
});
