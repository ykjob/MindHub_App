import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { copyToClipboard } from '../utils/clipboard';
import { WORKPLACE_PRIVACY_NOTICE } from '../features/workplace/workplaceTags';

export interface WorkplaceFieldDef {
  key: string;
  label: string;
  placeholder?: string;
  optional?: boolean;
}

interface Props {
  intro: string;
  fields: WorkplaceFieldDef[];
  buildText: (values: Record<string, string>) => string;
  // 保存が必要な場面のみ渡す（現場適応モードでは終業前メモのみ）。
  onSave?: (text: string) => Promise<void>;
  saveLabel?: string;
  // 初期入力（翌朝再開の引き継ぎなど）。マウント時のみ反映する。
  initialValues?: Record<string, string>;
  // 引き継ぎ元が分かる案内文（あれば入力欄の上に表示）。
  banner?: string;
}

// 現場適応モードの「入力 → 整理 → コピー（任意で保存）」を共通化した画面部品。
export default function WorkplaceSceneForm({
  intro,
  fields,
  buildText,
  onSave,
  saveLabel = '保存する',
  initialValues,
  banner,
}: Props) {
  const [values, setValues] = useState<Record<string, string>>(() => ({
    ...(initialValues ?? {}),
  }));
  const [output, setOutput] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<'idle' | 'done' | 'failed'>('idle');
  const [saveState, setSaveState] = useState<'idle' | 'done' | 'failed'>('idle');

  function setField(key: string, text: string) {
    setValues((prev) => ({ ...prev, [key]: text }));
    setOutput(null);
    setCopyState('idle');
    setSaveState('idle');
  }

  function handleBuild() {
    const filled: Record<string, string> = {};
    for (const f of fields) {
      filled[f.key] = values[f.key] ?? '';
    }
    setOutput(buildText(filled));
    setCopyState('idle');
    setSaveState('idle');
  }

  async function handleCopy() {
    if (!output) return;
    const ok = await copyToClipboard(output);
    setCopyState(ok ? 'done' : 'failed');
    setTimeout(() => setCopyState('idle'), 2000);
  }

  async function handleSave() {
    if (!output || !onSave) return;
    try {
      await onSave(output);
      setSaveState('done');
    } catch {
      setSaveState('failed');
      setTimeout(() => setSaveState('idle'), 2500);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.intro}>{intro}</Text>

      {banner ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{banner}</Text>
        </View>
      ) : null}

      <View style={styles.notice}>
        <Text style={styles.noticeText}>{WORKPLACE_PRIVACY_NOTICE}</Text>
      </View>

      {fields.map((f) => (
        <View key={f.key} style={styles.field}>
          <Text style={styles.label}>
            {f.label}
            {f.optional ? <Text style={styles.optional}>（任意）</Text> : null}
          </Text>
          <TextInput
            style={styles.input}
            value={values[f.key] ?? ''}
            onChangeText={(t) => setField(f.key, t)}
            placeholder={f.placeholder}
            placeholderTextColor="#9CA3AF"
            multiline
          />
        </View>
      ))}

      <TouchableOpacity style={styles.buildBtn} onPress={handleBuild}>
        <Text style={styles.buildBtnText}>整理する</Text>
      </TouchableOpacity>

      {output ? (
        <View style={styles.outputArea}>
          <Text style={styles.outputLabel}>出力</Text>
          <View style={styles.outputBox}>
            <Text style={styles.outputText} selectable>
              {output}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.copyBtn,
                copyState === 'done' && styles.btnDone,
                copyState === 'failed' && styles.btnFailed,
              ]}
              onPress={handleCopy}
            >
              <Text style={styles.actionText}>
                {copyState === 'done'
                  ? 'コピーしました'
                  : copyState === 'failed'
                  ? 'コピー失敗'
                  : 'コピー'}
              </Text>
            </TouchableOpacity>

            {onSave ? (
              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  saveState === 'done' && styles.btnDone,
                  saveState === 'failed' && styles.btnFailed,
                ]}
                onPress={handleSave}
                disabled={saveState === 'done'}
              >
                <Text style={styles.actionText}>
                  {saveState === 'done'
                    ? '保存しました'
                    : saveState === 'failed'
                    ? '保存失敗'
                    : saveLabel}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {onSave ? (
            <Text style={styles.saveHint}>
              保存すると private・Git候補外で記録され、翌日この画面の上部に再開メモとして表示されます。
            </Text>
          ) : (
            <Text style={styles.saveHint}>
              この場面はコピーのみです（保存はしません）。
            </Text>
          )}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  intro: { fontSize: 14, color: '#374151', lineHeight: 20 },
  notice: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 8,
    padding: 10,
  },
  noticeText: { fontSize: 12, color: '#92400E', lineHeight: 18 },
  banner: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    padding: 10,
  },
  bannerText: { fontSize: 12, color: '#1D4ED8', lineHeight: 18 },
  field: { gap: 4 },
  label: { fontSize: 14, fontWeight: '600', color: '#111827' },
  optional: { fontSize: 12, fontWeight: '400', color: '#9CA3AF' },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  buildBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buildBtnText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  outputArea: { gap: 8, marginTop: 4 },
  outputLabel: { fontSize: 14, fontWeight: '600', color: '#111827' },
  outputBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  outputText: { fontSize: 13, color: '#374151', lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 8 },
  copyBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnDone: { backgroundColor: '#16A34A' },
  btnFailed: { backgroundColor: '#DC2626' },
  actionText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  saveHint: { fontSize: 12, color: '#6B7280', lineHeight: 17 },
});
