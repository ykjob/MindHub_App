import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { DB_NAME, runMigrations } from '../src/db/database';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName={DB_NAME} onInit={runMigrations}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#111827',
          headerTitleStyle: { fontWeight: '600', fontSize: 16 },
          contentStyle: { backgroundColor: '#F9FAFB' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'FlowDock' }} />
        <Stack.Screen name="settings" options={{ title: '設定' }} />
        <Stack.Screen name="memo/create" options={{ title: 'メモ作成' }} />
        <Stack.Screen name="memo/[id]/index" options={{ title: 'メモ詳細' }} />
        <Stack.Screen name="memo/[id]/edit" options={{ title: 'メモ編集' }} />
      </Stack>
    </SQLiteProvider>
  );
}
