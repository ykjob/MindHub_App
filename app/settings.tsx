import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { getGitHubSettings, saveGitHubSettings } from '../src/features/github/githubSettings';
import { getToken, saveToken, deleteToken } from '../src/features/github/githubTokenStore';
import { confirmDialog } from '../src/utils/dialog';

export default function SettingsScreen() {
  const db = useSQLiteContext();
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [branch, setBranch] = useState('main');
  const [token, setToken] = useState('');
  const [hasToken, setHasToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const settings = await getGitHubSettings(db);
        if (settings) {
          setOwner(settings.owner);
          setRepo(settings.repo);
          setBranch(settings.branch);
        }
        const savedToken = await getToken();
        setHasToken(!!savedToken);
      } catch {
        // 読み込みに失敗しても画面全体は落とさない（未設定として表示する）
        setHasToken(false);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [db]);

  async function handleSave() {
    if (!owner.trim() || !repo.trim() || !branch.trim()) {
      Alert.alert('入力エラー', 'Owner、Repository、Branchを入力してください');
      return;
    }
    setSaving(true);
    try {
      await saveGitHubSettings(db, {
        owner: owner.trim(),
        repo: repo.trim(),
        branch: branch.trim(),
      });
      if (token.trim()) {
        await saveToken(token.trim());
        setHasToken(true);
        setToken('');
      }
      Alert.alert('保存しました', '設定を保存しました');
    } catch {
      Alert.alert('エラー', '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  function handleDeleteToken() {
    // 複数ボタン確認は共通の confirmDialog に統一（Web=window.confirm／Android・iOS=Alert.alert）。
    // ※WebではGitHubトークン保存が非対応（getToken/saveToken/deleteTokenはWebで無効）のため、
    //   通常のWeb UIではこの削除ボタン自体が表示されない。ここは主にAndroid/iOS経路の整合修正。
    confirmDialog({
      title: 'トークン削除',
      message: 'GitHubトークンを削除しますか？',
      confirmLabel: '削除',
      cancelLabel: 'キャンセル',
      onConfirm: async () => {
        await deleteToken();
        setHasToken(false);
        Alert.alert('削除しました', 'GitHubトークンを削除しました');
      },
    });
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle} accessibilityRole="header">GitHub連携設定</Text>

      <View style={styles.formSection}>
        <Field
          label="Owner（ユーザー名/Org名）"
          value={owner}
          onChangeText={setOwner}
          placeholder="例: your-username"
          autoCapitalize="none"
        />
        <Field
          label="Repository"
          value={repo}
          onChangeText={setRepo}
          placeholder="例: FlowDock_Notes"
          autoCapitalize="none"
        />
        <Field
          label="Branch"
          value={branch}
          onChangeText={setBranch}
          placeholder="main"
          autoCapitalize="none"
        />

        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>GitHub Token</Text>
          {hasToken ? (
            <View style={styles.tokenRow}>
              <View style={styles.tokenMasked}>
                <Text style={styles.tokenMaskedText}>••••••••••••••••</Text>
                <Text style={styles.tokenSetText}>設定済み</Text>
              </View>
              <TouchableOpacity
                style={styles.tokenDeleteBtn}
                onPress={handleDeleteToken}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="GitHubトークンを削除"
              >
                <Text style={styles.tokenDeleteText}>削除</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <TextInput
            style={styles.input}
            value={token}
            onChangeText={setToken}
            placeholder={hasToken ? '新しいトークンで上書き（任意）' : 'ghp_xxxxxxxxxxxxxxxx'}
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.tokenNote}>
            ※ トークンはSecureStoreに暗号化して保存します
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={saving}
        accessibilityRole="button"
        accessibilityLabel="設定を保存"
        accessibilityState={{ disabled: saving, busy: saving }}
      >
        {saving ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.saveBtnText}>設定を保存</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  autoCapitalize = 'sentences',
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16, gap: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  fieldWrapper: { gap: 6 },
  fieldLabel: { fontSize: 13, fontWeight: '500', color: '#374151' },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  tokenRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  tokenMasked: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tokenMaskedText: { fontSize: 16, color: '#059669', letterSpacing: 2 },
  tokenSetText: { fontSize: 12, color: '#059669' },
  tokenDeleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
  },
  tokenDeleteText: { fontSize: 13, color: '#DC2626' },
  tokenNote: { fontSize: 11, color: '#9CA3AF' },
  saveBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  saveBtnDisabled: { backgroundColor: '#93C5FD' },
  saveBtnText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
});
