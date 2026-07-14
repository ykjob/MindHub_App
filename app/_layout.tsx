import { Stack } from 'expo-router';
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { DB_NAME, runMigrations } from '../src/db/database';
import NativeHeaderBackButton from '../src/components/NativeHeaderBackButton';

const OPFS_RELOAD_FLAG = 'mindhub-opfs-retry';

// Web(OPFS)ではリロード直後、旧ページのworkerがaccess handleを解放する前に
// 新ページがDBを開くとロック競合で失敗し、workerは同一ページ内では回復できない。
// そのため1回だけページを再読み込みして回復させる（2回目も失敗したら別タブ等が原因）。
function handleDatabaseError(error: Error): void {
  if (
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    /Access Handle|NoModificationAllowedError/i.test(String(error?.message)) &&
    !window.sessionStorage.getItem(OPFS_RELOAD_FLAG)
  ) {
    window.sessionStorage.setItem(OPFS_RELOAD_FLAG, '1');
    window.location.reload();
    return;
  }
  throw error;
}

async function initDatabase(db: SQLiteDatabase): Promise<void> {
  await runMigrations(db);
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.sessionStorage.removeItem(OPFS_RELOAD_FLAG);
  }
}

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName={DB_NAME} onInit={initDatabase} onError={handleDatabaseError}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#111827',
          headerTitleStyle: { fontWeight: '600', fontSize: 16 },
          contentStyle: { backgroundColor: '#F9FAFB' },
        }}
      >
        {/* 主要4画面（index / notes/index / prompts/index / workplace/index）は画面内AppHeaderへ統一（29 §5.1）。
            title はWebのdocument title用に残す */}
        <Stack.Screen name="index" options={{ title: 'MindHub', headerShown: false }} />
        {/* memo/create・notes/create・settings は、Web既定のマスク画像戻るボタンが視認できず／直アクセス時に
            描画されない問題への最小対応として、テキスト「← 戻る」のheaderLeftを対象画面だけに設定（履歴なしは
            fallbackへ）。共通screenOptionsや他画面のネイティブ戻るは変更しない（30 §12.1所見への対応） */}
        <Stack.Screen
          name="settings"
          options={{ title: '設定', headerLeft: () => <NativeHeaderBackButton fallback="/" /> }}
        />
        <Stack.Screen
          name="memo/create"
          options={{ title: 'メモ作成', headerLeft: () => <NativeHeaderBackButton fallback="/" /> }}
        />
        {/* 詳細画面もネイティブStackヘッダーのマスク画像戻るが視認できず／直アクセス時に描画されない
            ため、テキスト「← 戻る」のheaderLeftを設定。詳細のfallbackは静的（memo→ホーム、notes→/notes）。
            編集画面は対応する詳細へ戻す動的fallbackが必要なため、各画面内でStack.Screenを設定する（30 §8.5.3・11 §16） */}
        <Stack.Screen
          name="memo/[id]/index"
          options={{ title: 'メモ詳細', headerLeft: () => <NativeHeaderBackButton fallback="/" /> }}
        />
        <Stack.Screen name="memo/[id]/edit" options={{ title: 'メモ編集' }} />
        <Stack.Screen name="notes/index" options={{ title: '記録確認', headerShown: false }} />
        <Stack.Screen
          name="notes/create"
          options={{ title: 'メモ作成', headerLeft: () => <NativeHeaderBackButton fallback="/notes" /> }}
        />
        <Stack.Screen
          name="notes/[id]/index"
          options={{ title: 'メモ詳細', headerLeft: () => <NativeHeaderBackButton fallback="/notes" /> }}
        />
        <Stack.Screen name="notes/[id]/edit" options={{ title: 'メモ編集' }} />
        <Stack.Screen name="prompts/index" options={{ title: 'プロンプト集', headerShown: false }} />
        <Stack.Screen name="workplace/index" options={{ title: '現場適応モード', headerShown: false }} />
        {/* 現場適応の5入力画面も、Web既定のマスク画像戻るボタンが視認できず／直アクセス時に描画されない
            ため、テキスト「← 戻る」のheaderLeftを設定（履歴なしは /workplace へ）。ルート・クエリ
            （?fromRestart=1 等）・初期入力・保存/コピー処理は無変更（30 §8.5.1・11 §16） */}
        <Stack.Screen
          name="workplace/start"
          options={{ title: '作業開始', headerLeft: () => <NativeHeaderBackButton fallback="/workplace" /> }}
        />
        <Stack.Screen
          name="workplace/stuck"
          options={{ title: '行き詰まり記録', headerLeft: () => <NativeHeaderBackButton fallback="/workplace" /> }}
        />
        <Stack.Screen
          name="workplace/question"
          options={{ title: '質問文作成', headerLeft: () => <NativeHeaderBackButton fallback="/workplace" /> }}
        />
        <Stack.Screen
          name="workplace/report"
          options={{ title: '進捗報告作成', headerLeft: () => <NativeHeaderBackButton fallback="/workplace" /> }}
        />
        <Stack.Screen
          name="workplace/end"
          options={{ title: '終業前メモ', headerLeft: () => <NativeHeaderBackButton fallback="/workplace" /> }}
        />
      </Stack>
    </SQLiteProvider>
  );
}
