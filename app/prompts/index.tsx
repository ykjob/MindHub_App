import React, { useMemo, useState } from 'react';
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

interface Section {
  key: string;
  title: string;
  data: PromptEntry[];
}

export default function PromptHubScreen() {
  const groups = useMemo(() => getPromptGroups(), []);
  const [keyword, setKeyword] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [failedId, setFailedId] = useState<string | null>(null);

  const sections: Section[] = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return groups
      .map((g) => ({
        key: g.key,
        title: g.label,
        data: kw
          ? g.entries.filter((e) =>
              `${e.name} ${e.id} ${g.label}`.toLowerCase().includes(kw)
            )
          : g.entries,
      }))
      .filter((s) => s.data.length > 0);
  }, [groups, keyword]);

  const totalCount = groups.reduce((sum, g) => sum + g.entries.length, 0);
  const shownCount = sections.reduce((sum, s) => sum + s.data.length, 0);

  async function handleCopy(entry: PromptEntry) {
    const ok = await copyToClipboard(entry.promptBody);
    if (ok) {
      setCopiedId(entry.id);
      setFailedId(null);
      setTimeout(() => setCopiedId((cur) => (cur === entry.id ? null : cur)), 2000);
    } else {
      setFailedId(entry.id);
      setCopiedId(null);
      setTimeout(() => setFailedId((cur) => (cur === entry.id ? null : cur)), 2500);
    }
  }

  return (
    <View style={styles.container}>
      <AppHeader title="プロンプト集" showBack />
      <View style={styles.searchArea}>
        <Text style={styles.lead}>
          コピーして ChatGPT / Gemini / Claude Code / Codex に貼り付けて使ってください。
        </Text>
        <TextInput
          style={styles.searchInput}
          value={keyword}
          onChangeText={setKeyword}
          placeholder="プロンプト名・分類で絞り込み"
          placeholderTextColor="#9CA3AF"
        />
        <Text style={styles.count}>
          {keyword.trim() ? `表示中 ${shownCount} / ${totalCount}件` : `全${totalCount}件`}
        </Text>
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
            <Text style={styles.emptyText}>該当するプロンプトがありません</Text>
          </View>
        }
        renderItem={({ item }) => {
          const expanded = expandedId === item.id;
          const copied = copiedId === item.id;
          const failed = failedId === item.id;
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
                  style={[
                    styles.copyBtn,
                    copied && styles.copyBtnDone,
                    failed && styles.copyBtnFailed,
                  ]}
                  onPress={() => handleCopy(item)}
                >
                  <Text style={styles.copyBtnText}>
                    {copied ? 'コピーしました' : failed ? 'コピー失敗' : 'コピー'}
                  </Text>
                </TouchableOpacity>
              </View>

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
  searchInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  count: { fontSize: 12, color: '#9CA3AF', textAlign: 'right' },
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
  copyBtnDone: { backgroundColor: '#16A34A' },
  copyBtnFailed: { backgroundColor: '#DC2626' },
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
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#9CA3AF' },
});
