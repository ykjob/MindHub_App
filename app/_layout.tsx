import { Stack } from 'expo-router';
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { DB_NAME, runMigrations } from '../src/db/database';

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
        <Stack.Screen name="settings" options={{ title: '設定' }} />
        <Stack.Screen name="memo/create" options={{ title: 'メモ作成' }} />
        <Stack.Screen name="memo/[id]/index" options={{ title: 'メモ詳細' }} />
        <Stack.Screen name="memo/[id]/edit" options={{ title: 'メモ編集' }} />
        <Stack.Screen name="notes/index" options={{ title: 'メモ管理', headerShown: false }} />
        <Stack.Screen name="notes/create" options={{ title: 'メモ作成' }} />
        <Stack.Screen name="notes/[id]/index" options={{ title: 'メモ詳細' }} />
        <Stack.Screen name="notes/[id]/edit" options={{ title: 'メモ編集' }} />
        <Stack.Screen name="prompts/index" options={{ title: 'プロンプト集', headerShown: false }} />
        <Stack.Screen name="workplace/index" options={{ title: '現場適応モード', headerShown: false }} />
        <Stack.Screen name="workplace/start" options={{ title: '作業開始' }} />
        <Stack.Screen name="workplace/stuck" options={{ title: '詰まり記録' }} />
        <Stack.Screen name="workplace/question" options={{ title: '質問文作成' }} />
        <Stack.Screen name="workplace/report" options={{ title: '進捗報告作成' }} />
        <Stack.Screen name="workplace/end" options={{ title: '終業前メモ' }} />
      </Stack>
    </SQLiteProvider>
  );
}
