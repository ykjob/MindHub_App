import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SectionList,
  StyleSheet,
} from 'react-native';
import { getPromptGroups, type PromptEntry } from '../../src/features/notes/promptHub';
import { copyToClipboard } from '../../src/utils/clipboard';
import AppHeader from '../../src/components/AppHeader';
import FilterChip from '../../src/components/FilterChip';
import StatusMessage from '../../src/components/StatusMessage';

interface Section {
  key: string;
  title: string;
  data: PromptEntry[];
}

// 状況別入口（PROMPT-01）。状況別入口＝既存42件から目的に近いものを絞り込む補助フィルターで、
// 既存セクション（42件すべてを体系別に確認する通常導線）・検索（名称/ID/セクション名から探す通常
// 導線）を置き換えるものではない。既存42件の本文・ID・名称・件数・所属セクション・生成処理は変更
// しない（14 §1.8・28 §10.1）。分類は画面側の固定IDマッピングで持ち、mobilePrompts.ts等のデータ側や
// PromptEntryの型は拡張しない。全42件を6入口へ無理に割り当てず、登録されていないプロンプト（就活・
// 投資・family_manual/household_rule等）は「すべて」・既存セクション・キーワード検索から利用できる。
// 入口名とIDは、入口名からの推測ではなく既存プロンプト本文が実際に行う処理に合わせて定義する。
type PromptSituationKey =
  | 'problem'
  | 'error'
  | 'plan'
  | 'summary'
  | 'handoff'
  | 'devwork';

interface PromptSituation {
  key: PromptSituationKey;
  label: string;
  // 対応する既存プロンプトのID（同じIDを複数入口に含めてよい）
  promptIds: readonly string[];
}

const PROMPT_SITUATIONS: readonly PromptSituation[] = [
  {
    // 詰まり・考えすぎ・まとまっていない思考を整理し、次に行うことを決める
    key: 'problem',
    label: '問題を整理する',
    promptIds: [
      'stuck_reason',
      'brain_dump_to_action',
      'stop_overthinking',
      'next_one_action',
      'thought',
    ],
  },
  {
    // エラー・不具合・失敗した検証結果を、記録・報告・再確認に使える形へ整理する
    key: 'error',
    label: 'エラー・不具合を整理する',
    promptIds: ['error_note', 'bug_report', 'validation_log'],
  },
  {
    // 予定・優先順位・次の行動・家庭内の予定や買い物を、実行しやすい形へ整理する
    key: 'plan',
    label: '予定・やることを整理する',
    promptIds: [
      'time_slot_tasks',
      'google_tasks',
      'google_calendar',
      'daily_priority',
      'one_day_plan',
      'next_one_action',
      'wife_schedule',
      'outing_plan',
      'shopping_memo',
    ],
  },
  {
    // 作業内容・検証結果・変更内容・残課題を、後から確認できる記録へまとめる
    key: 'summary',
    label: '作業結果をまとめる',
    promptIds: [
      'worklog_close_summary',
      'release_note_draft',
      'pead_result_summary',
      'worklog',
      'validation_log',
    ],
  },
  {
    // 次のチャット・次回作業・別の担当やAIへ引き継げる形にまとめる
    key: 'handoff',
    label: '引き継ぎを作る',
    promptIds: ['chat_handoff_summary', 'worklog_close_summary', 'chatgpt_log', 'worklog'],
  },
  {
    // Claude Codeへの依頼・実装前確認・実装後レビュー・仕様書反映・確認手順作成を行う
    key: 'devwork',
    label: '開発作業を依頼・確認する',
    promptIds: [
      'claude_prompt',
      'claude_work_start',
      'implementation_review_request',
      'codex_review',
      'spec_update_request',
      'device_checklist',
    ],
  },
];

interface CopyResult {
  id: string;
  kind: 'success' | 'error';
}

export default function PromptHubScreen() {
  const groups = useMemo(() => getPromptGroups(), []);
  const [keyword, setKeyword] = useState('');
  const [situationKey, setSituationKey] = useState<PromptSituationKey | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  // コピー中のID（二重操作防止）と、直近のコピー結果（StatusMessage表示用）
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [copyResult, setCopyResult] = useState<CopyResult | null>(null);

  const sections: Section[] = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    const situationIds = situationKey
      ? PROMPT_SITUATIONS.find((s) => s.key === situationKey)?.promptIds
      : undefined;
    const situationIdSet = situationIds ? new Set(situationIds) : null;
    // 絞り込み順：全42件 → 状況別ID → キーワード検索 → 0件セクションを除外。
    // 検索対象は従来どおり name / id / セクション名のみ（本文・note・badgeは対象外）。
    return groups
      .map((g) => ({
        key: g.key,
        title: g.label,
        data: g.entries.filter((e) => {
          if (situationIdSet && !situationIdSet.has(e.id)) return false;
          if (kw && !`${e.name} ${e.id} ${g.label}`.toLowerCase().includes(kw)) return false;
          return true;
        }),
      }))
      .filter((s) => s.data.length > 0);
  }, [groups, keyword, situationKey]);

  const totalCount = groups.reduce((sum, g) => sum + g.entries.length, 0);
  const shownCount = sections.reduce((sum, s) => sum + s.data.length, 0);
  const hasKeyword = keyword.trim() !== '';
  const hasSituation = situationKey !== null;
  const hasCondition = hasKeyword || hasSituation;

  // 状況選択・検索語の両方を初期化する（絞り込みを解除）。展開状態は初期化しない（仕様）。
  function clearFilters() {
    setSituationKey(null);
    setKeyword('');
  }

  // コピー結果の自動消去。新しい結果が来ると前のタイマーはクリーンアップで破棄されるため、
  // 旧結果のタイマーが新しい結果を消すことはない。アンマウント時もクリーンアップする。
  useEffect(() => {
    if (!copyResult) return;
    const ms = copyResult.kind === 'success' ? 2000 : 2500;
    const timer = setTimeout(() => {
      setCopyResult((cur) => (cur === copyResult ? null : cur));
    }, ms);
    return () => clearTimeout(timer);
  }, [copyResult]);

  async function handleCopy(entry: PromptEntry) {
    if (copyingId) return; // コピー処理中は二重操作を防止
    setCopyingId(entry.id);
    try {
      const ok = await copyToClipboard(entry.promptBody);
      setCopyResult({ id: entry.id, kind: ok ? 'success' : 'error' });
    } finally {
      setCopyingId(null);
    }
  }

  const emptyMessage = hasSituation && hasKeyword
    ? '選択した目的と検索条件の両方に一致するプロンプトがありません'
    : hasSituation
      ? 'この目的に対応するプロンプトが見つかりません'
      : '検索条件に一致するプロンプトがありません';

  return (
    <View style={styles.container}>
      <AppHeader title="プロンプト集" showBack />
      <View style={styles.searchArea}>
        <Text style={styles.lead}>
          コピーして ChatGPT / Gemini / Claude Code / Codex に貼り付けて使ってください。
        </Text>

        <Text style={styles.situationHeading}>今の目的から探す</Text>
        <View style={styles.chipRow}>
          <FilterChip
            label="すべて"
            selected={situationKey === null}
            onPress={() => setSituationKey(null)}
          />
          {PROMPT_SITUATIONS.map((s) => (
            <FilterChip
              key={s.key}
              label={s.label}
              selected={situationKey === s.key}
              onPress={() => setSituationKey(s.key)}
            />
          ))}
        </View>

        <TextInput
          style={styles.searchInput}
          value={keyword}
          onChangeText={setKeyword}
          placeholder="プロンプト名・分類で絞り込み"
          placeholderTextColor="#9CA3AF"
        />
        <View style={styles.countRow}>
          <Text style={styles.count}>
            {hasCondition ? `表示中 ${shownCount} / ${totalCount}件` : `全${totalCount}件`}
          </Text>
          {hasCondition ? (
            <TouchableOpacity
              onPress={clearFilters}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="絞り込みを解除"
            >
              <Text style={styles.clearBtnText}>絞り込みを解除</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>
            {section.title}（{section.data.length}件）
          </Text>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
            <Text style={styles.emptyHint}>
              「絞り込みを解除」で全{totalCount}件に戻せます
            </Text>
            <TouchableOpacity
              style={styles.emptyClearBtn}
              onPress={clearFilters}
              accessibilityRole="button"
              accessibilityLabel="絞り込みを解除"
            >
              <Text style={styles.emptyClearBtnText}>絞り込みを解除</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => {
          const expanded = expandedId === item.id;
          const isCopying = copyingId === item.id;
          const anyCopying = copyingId !== null;
          const result = copyResult?.id === item.id ? copyResult : null;
          return (
            <View style={styles.card}>
              <View style={styles.cardHead}>
                <View style={styles.cardTitleWrap}>
                  <Text style={styles.cardName}>{item.name}</Text>
                  <Text style={styles.cardId}>{item.id}</Text>
                  {item.badge ? (
                    <Text style={styles.badge}>{item.badge}</Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  style={[styles.copyBtn, anyCopying && styles.copyBtnDisabled]}
                  onPress={() => handleCopy(item)}
                  disabled={anyCopying}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: anyCopying }}
                  accessibilityLabel={`${item.name}をコピー`}
                >
                  <Text style={styles.copyBtnText}>
                    {isCopying ? 'コピー中…' : 'コピー'}
                  </Text>
                </TouchableOpacity>
              </View>

              {result ? (
                <View accessibilityLiveRegion="polite">
                  <StatusMessage
                    kind={result.kind}
                    message={result.kind === 'success' ? 'コピーしました' : 'コピー失敗'}
                  />
                </View>
              ) : null}

              {item.note ? <Text style={styles.note}>{item.note}</Text> : null}

              <TouchableOpacity
                style={styles.toggle}
                onPress={() => setExpandedId(expanded ? null : item.id)}
              >
                <Text style={styles.toggleText}>
                  {expanded ? '▼ プロンプトを隠す' : '▶ プロンプトを表示'}
                </Text>
              </TouchableOpacity>

              {expanded ? (
                <View style={styles.bodyBox}>
                  <Text style={styles.bodyText} selectable>
                    {item.promptBody}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  searchArea: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  lead: { fontSize: 13, color: '#6B7280', lineHeight: 18 },
  situationHeading: { fontSize: 13, fontWeight: '600', color: '#374151', marginTop: 2 },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
    marginTop: 2,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  count: { fontSize: 12, color: '#9CA3AF' },
  clearBtnText: { fontSize: 12, color: '#2563EB', fontWeight: '600' },
  list: { padding: 12, paddingBottom: 32 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
    paddingBottom: 4,
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitleWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  cardName: { fontSize: 15, fontWeight: '600', color: '#111827' },
  cardId: {
    fontSize: 11,
    color: '#6B7280',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    overflow: 'hidden',
  },
  badge: {
    fontSize: 11,
    color: '#B91C1C',
    backgroundColor: '#FEE2E2',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    overflow: 'hidden',
  },
  note: { fontSize: 12, color: '#B45309', lineHeight: 17 },
  copyBtn: {
    flexShrink: 0,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  copyBtnDisabled: { opacity: 0.5 },
  copyBtnText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  toggle: { paddingVertical: 2 },
  toggleText: { fontSize: 13, color: '#2563EB' },
  bodyBox: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
  },
  bodyText: { fontSize: 12, color: '#374151', lineHeight: 19 },
  empty: { padding: 40, alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
  emptyHint: { fontSize: 12, color: '#9CA3AF', textAlign: 'center' },
  emptyClearBtn: {
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2563EB',
    borderRadius: 8,
  },
  emptyClearBtnText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
});
