# FlowDock アーキテクチャ解説

最終更新：2026-06-26

---

## 1. 全体アーキテクチャ

FlowDockはExpo（React Native）製スマホアプリです。データはすべて端末内に保存し、任意のタイミングでGitHubへ手動アップロードします。

```
┌───────────────────────────────────────────────────┐
│                 FlowDockアプリ                    │
│                                                   │
│  ┌──────────────┐    ┌──────────────────────────┐ │
│  │  app/ 画面   │───▶│  src/ ロジック層          │ │
│  │ (Expo Router) │    │  features / db / utils   │ │
│  └──────────────┘    └──────────┬───────────────┘ │
│                                 │                 │
│       ┌─────────────────────────┤                 │
│       ▼                         ▼                 │
│  ┌─────────┐            ┌──────────────┐          │
│  │ SQLite  │            │ SecureStore  │          │
│  │(メモ/設定│            │(GitHubToken) │          │
│  └─────────┘            └──────────────┘          │
└───────────────────────────────────────────────────┘
                       │ GitHub API (手動)
                       ▼
            ┌──────────────────────┐
            │  FlowDock_Notes リポ │
            │  notes/inbox/        │
            │  notes/dev/  etc.    │
            └──────────────────────┘
```

---

## 2. ディレクトリ構成と各ファイルの役割

```
MindHub_App/
├── app/                       ← Expo Router ルーティングルート
│   ├── _layout.tsx            ← Root Layout（SQLiteProvider・Stack設定）
│   ├── index.tsx              ← メモ一覧画面
│   ├── settings.tsx           ← 設定画面
│   └── memo/
│       ├── create.tsx         ← メモ作成画面
│       └── [id]/
│           ├── index.tsx      ← メモ詳細画面
│           └── edit.tsx       ← メモ編集画面
│
├── src/                       ← アプリロジック（ルーティング非依存）
│   ├── db/
│   │   ├── schema.ts          ← DDL SQL文字列定数・テーブル定義
│   │   ├── migrations.ts      ← スキーマバージョン管理・初期テーブル作成
│   │   └── database.ts        ← DB名・runMigrationsの再エクスポート
│   │
│   ├── features/
│   │   ├── memos/
│   │   │   ├── memoTypes.ts       ← Memo型・GithubStatus型・GoogleExportStatus型
│   │   │   ├── memoCategories.ts  ← カテゴリ定義・ラベル・フォルダ対応
│   │   │   ├── memoRepository.ts  ← SQLite CRUD操作（全クエリをここに集約）
│   │   │   ├── memoService.ts     ← ビジネスロジック（github_status連動など）
│   │   │   └── memoMarkdown.ts    ← Markdownファイル生成（front matter付き）
│   │   │
│   │   ├── github/
│   │   │   ├── githubTypes.ts         ← GitHubSettings・GitHubUploadResult型
│   │   │   ├── githubTokenStore.ts    ← SecureStoreラッパー（token保存/取得/削除）
│   │   │   ├── githubSettings.ts      ← SQLiteへのGitHub設定R/W
│   │   │   ├── githubApi.ts           ← GitHub REST APIクライアント（fetch使用）
│   │   │   ├── githubPath.ts          ← ファイルパス・連番生成
│   │   │   └── githubUploadService.ts ← アップロード処理全体のオーケストレーション
│   │   │
│   │   ├── ai/
│   │   │   ├── aiOutputTypes.ts       ← AIOutput型（MVP後用）
│   │   │   └── aiOutputRepository.ts  ← スタブ（MVP後に実装）
│   │   │
│   │   └── settings/
│   │       └── settingsRepository.ts  ← key-value SQLite操作
│   │
│   ├── components/
│   │   ├── CategorySelector.tsx  ← カテゴリ選択チップUI
│   │   ├── SyncStatusBadge.tsx   ← GitHub状態バッジ（色分け表示）
│   │   └── ConfirmDialog.tsx     ← 削除確認ダイアログ（Alert.alert使用）
│   │
│   └── utils/
│       ├── date.ts  ← JST ISO文字列生成・日付フォーマット・YYYY-MM-DD取得
│       └── id.ts    ← UUID生成（crypto.randomUUID）
│
└── docs/                      ← 開発管理ドキュメント
    ├── flowdock_mvp_design.md  ← MVP仕様書（判断の基準）
    ├── development_status.md   ← 開発進捗・MVP完了条件達成状況
    ├── roadmap.md              ← MVP/MVP後/将来機能
    ├── task_board.md           ← 現在・次・後回しタスク
    ├── implementation_log.md   ← 作業履歴
    ├── claude_workflow.md      ← Claude Code作業ルール
    └── architecture.md         ← 本ファイル（構成・流れの解説）
```

---

## 3. 画面遷移フロー

```
起動
 │
 ▼
app/_layout.tsx
 └─ SQLiteProvider（DB初期化・migrations実行）
 └─ Stack Navigator起動
      │
      ▼
app/index.tsx ─────────────────────── メモ一覧
 │  ├─ ＋ボタン ──────────────────▶  app/memo/create.tsx
 │  ├─ メモタップ ────────────────▶  app/memo/[id]/index.tsx
 │  └─ 設定ボタン ────────────────▶  app/settings.tsx
 │
 ▼
app/memo/[id]/index.tsx ──────────── メモ詳細
 │  ├─ 編集ボタン ────────────────▶  app/memo/[id]/edit.tsx
 │  ├─ アップロードボタン ─────────▶  githubUploadService（非同期）
 │  └─ 削除ボタン ────────────────▶  ConfirmDialog → 一覧へ戻る
 │
 ▼
app/memo/[id]/edit.tsx ────────────── メモ編集
 └─ 保存 ──────────────────────────▶  前の画面（詳細）へ戻る
```

---

## 4. データフロー：メモ作成

```
ユーザー入力（app/memo/create.tsx）
        │
        │ body, category
        ▼
memoService.createMemo(db, input)
        │
        │ generateId() → UUID
        │ nowISOString() → JST ISO文字列
        │ github_status: 'not_uploaded'
        │ google_task_status: 'not_exported'
        ▼
memoRepository.insertMemo(db, memo)
        │
        ▼
SQLite: memos テーブルへINSERT
        │
        ▼
router.replace('/memo/[id]')  → 詳細画面へ遷移
```

---

## 5. データフロー：メモ編集

```
ユーザー入力（app/memo/[id]/edit.tsx）
        │
        │ 画面読み込み時: getMemoById(db, id)
        │
        │ 保存時: body, category
        ▼
memoService.updateMemo(db, input, currentGithubStatus)
        │
        │ github_status の変換ルール：
        │   uploaded          → modified_after_upload  ← 変更後は「更新あり」
        │   not_uploaded      → not_uploaded（変えない）
        │   modified_after_upload → modified_after_upload（変えない）
        │   failed            → failed（変えない、再アップロード可能）
        ▼
memoRepository.updateMemoBodyAndCategory(db, id, ...)
        │
        ▼
SQLite: memos テーブルへUPDATE
```

---

## 6. データフロー：GitHubアップロード

```
ボタン押下（app/memo/[id]/index.tsx）
        │
        ▼
githubUploadService.uploadMemo(db, memoId)
        │
        ├─ getMemoById(db, memoId)        ← メモ取得
        ├─ getGitHubSettings(db)          ← SQLiteからowner/repo/branch取得
        ├─ getToken()                     ← SecureStoreからtoken取得
        │
        │ ↑ いずれかがnullなら即エラー（フォールバックなし）
        │
        ├─ getCategoryFolder(category)    ← カテゴリ → フォルダパス
        ├─ resolveUploadPath(...)
        │    └─ memo.github_path がある → そのまま使用（更新）
        │    └─ ない → GitHub APIでフォルダ内ファイル一覧取得 → 連番採番
        │
        ├─ generateMarkdown(memo)         ← front matter付きMarkdown生成
        │
        ├─ memo.github_sha がある場合:
        │    └─ githubApi.updateFile(...)  ← PUT /contents/{path} + sha
        │
        └─ ない場合:
             └─ githubApi.createFile(...)  ← PUT /contents/{path}（新規）
        │
        │ 成功時:
        ├─ setGitHubUploaded(db, id, { path, sha, uploadedAt })
        │    └─ github_status = 'uploaded'
        │
        │ 失敗時:
        └─ setGitHubFailed(db, id, errorMessage)
             └─ github_status = 'failed'
             └─ github_error_message = エラー内容
             └─ メモ本文は削除しない
```

---

## 7. Markdown生成仕様

GitHubへ送信する前に、`memoMarkdown.ts`でMarkdown文字列を生成します。

```
入力: Memo オブジェクト

出力:
---
createdAt: 2026-06-26T12:00:00+09:00
updatedAt: 2026-06-26T12:10:00+09:00
category: dev
source: FlowDock
---

本文がここに入る。
改行も
そのまま保持される。
```

**本文中に`---`があっても問題ない理由：**  
front matterは最初の`---`から次の`---`まで、と解析されます。  
`generateMarkdown()`は文字列結合のみで生成するため、本文中の`---`は
front matterとして解釈されません（front matterの閉じタグは1つ目の後続`---`のみ）。

---

## 8. SQLiteテーブル構成

### memosテーブル（中心テーブル）

| カラム | 型 | デフォルト | 説明 |
|--------|-----|----------|------|
| id | TEXT PK | - | UUID（crypto.randomUUID） |
| body | TEXT | - | メモ本文（端末内はプレーンテキスト） |
| category | TEXT | inbox | カテゴリキー（inbox/daily/study/dev/job/ideas） |
| created_at | TEXT | - | 作成日時（JST ISO文字列） |
| updated_at | TEXT | - | 更新日時（JST ISO文字列） |
| deleted_at | TEXT | NULL | 論理削除日時（NULLなら存在） |
| github_status | TEXT | not_uploaded | GitHub同期状態（4状態） |
| github_path | TEXT | NULL | GitHub上のファイルパス |
| github_sha | TEXT | NULL | GitHub上のファイルSHA（更新時に必要） |
| github_uploaded_at | TEXT | NULL | 最後にアップロードした日時 |
| github_error_message | TEXT | NULL | アップロード失敗時のエラー内容 |
| google_task_status | TEXT | not_exported | Googleタスク出力状態（将来用） |
| google_calendar_status | TEXT | not_exported | Googleカレンダー出力状態（将来用） |
| created_ai_output_count | INTEGER | 0 | AI出力生成回数（将来用） |

### settingsテーブル（key-value）

| カラム | 型 | 説明 |
|--------|-----|------|
| key | TEXT PK | 設定キー |
| value | TEXT | 設定値 |

保存するキー：`github_owner` / `github_repo` / `github_branch` / `schema_version`

### ai_outputsテーブル（MVP後用・テーブルのみ作成）

| カラム | 型 | 説明 |
|--------|-----|------|
| id | TEXT PK | UUID |
| memo_id | TEXT FK | 対象メモID |
| output_type | TEXT | summary/task_schedule/prompt/spec/review |
| content_json | TEXT | AI出力結果（JSON文字列） |
| created_at | TEXT | 作成日時 |
| updated_at | TEXT | 更新日時 |

---

## 9. GitHubステータス遷移図

```
     [メモ作成]
          │
          ▼
   not_uploaded
          │
          │ アップロード成功
          ▼
      uploaded ◀─────────────────┐
          │                      │ 再アップロード成功
          │ メモ編集              │
          ▼                      │
modified_after_upload            │
          │                      │
          │ アップロード          │
          ▼                      │
       （試みる）─────────────────┘
          │
          │ アップロード失敗（いずれの状態からも）
          ▼
       failed
          │
          │ 再アップロード成功
          └────────────────────▶ uploaded
```

---

## 10. セキュリティ設計

| 情報 | 保存場所 | 理由 |
|------|---------|------|
| GitHub token | SecureStore（暗号化） | 秘密情報のため |
| GitHub owner/repo/branch | SQLite（平文） | 秘密情報ではない |
| メモ本文 | SQLite（平文） | 端末内での利便性優先 |
| GitHub API通信 | HTTPS only | fetch()のデフォルト |

**SecureStoreの特性：**
- iOS：Keychain（ハードウェア暗号化）
- Android：Keystore（ハードウェア暗号化）
- Expo Goでも動作可能（実機推奨）

---

## 11. カテゴリとGitHubパス対応

| カテゴリキー | 表示名 | GitHubフォルダ |
|-------------|-------|----------------|
| inbox | インデックス | notes/inbox/ |
| daily | 日常 | notes/daily/ |
| study | 学習 | notes/study/ |
| dev | 開発 | notes/dev/ |
| job | 就活 | notes/job/ |
| ideas | アイデア | notes/ideas/ |

**ファイル名規則：** `YYYY-MM-DD-001.md`（カテゴリ別・日付別に連番）

```
notes/
  dev/
    2026-06-26-001.md  ← 同じ日に最初のdevメモ
    2026-06-26-002.md  ← 同じ日の2番目のdevメモ
  study/
    2026-06-26-001.md  ← studyは別カウント（devと独立）
```

---

## 12. 依存関係グラフ（importの方向）

```
app/ 画面
  └─▶ src/features/*/repository（DB操作）
  └─▶ src/features/*/service（ビジネスロジック）
  └─▶ src/features/github/githubUploadService（アップロード）
  └─▶ src/components/（UI部品）

src/features/memos/memoService
  └─▶ src/features/memos/memoRepository
  └─▶ src/utils/id, date

src/features/github/githubUploadService
  └─▶ src/features/memos/memoRepository（状態更新）
  └─▶ src/features/memos/memoMarkdown（Markdown生成）
  └─▶ src/features/memos/memoCategories（フォルダ決定）
  └─▶ src/features/github/githubSettings（設定取得）
  └─▶ src/features/github/githubTokenStore（token取得）
  └─▶ src/features/github/githubApi（API呼び出し）
  └─▶ src/features/github/githubPath（パス・連番生成）

src/features/github/githubSettings
  └─▶ src/features/settings/settingsRepository

src/db/migrations（DBセットアップ）
  └─▶ src/db/schema（DDL定義）
```

---

## 13. Expo Router ルーティング

Expo Routerはファイルシステムベースのルーティングです。  
`app/`配下のファイル名がそのままURLパスになります。

| ファイル | URLパス | 画面 |
|---------|---------|------|
| `app/index.tsx` | `/` | メモ一覧 |
| `app/settings.tsx` | `/settings` | 設定 |
| `app/memo/create.tsx` | `/memo/create` | メモ作成 |
| `app/memo/[id]/index.tsx` | `/memo/[id]` | メモ詳細 |
| `app/memo/[id]/edit.tsx` | `/memo/[id]/edit` | メモ編集 |

**動的パラメータの取得（詳細・編集画面）：**

```typescript
import { useLocalSearchParams } from 'expo-router';
const { id } = useLocalSearchParams<{ id: string }>();
```

**画面遷移の記述例：**

```typescript
import { router } from 'expo-router';

router.push('/memo/create');           // スタックに積む
router.push(`/memo/${memo.id}`);       // 詳細へ
router.push(`/memo/${id}/edit`);       // 編集へ
router.replace(`/memo/${memo.id}`);    // 履歴を置き換える（作成後に使用）
router.back();                         // 前の画面へ
router.replace('/');                   // 一覧へ戻る（削除後に使用）
```

---

## 14. データ保護とオフライン動作

FlowDockはオフライン優先です。

- **メモ作成/編集/削除：** インターネット不要。SQLiteに即保存。
- **GitHubアップロード：** インターネット必要。失敗してもメモは消えない。
- **再起動後：** SQLiteから読み込むため、データは保持される。
- **GitHubに依存しない：** アップロードはあくまで補助機能。本体はSQLite。

---

## 15. 将来拡張のための設計考慮

| 将来機能 | 現時点の考慮 |
|---------|------------|
| AI整理 | `ai_outputs`テーブル作成済み。`aiOutputRepository.ts`スタブ準備済み |
| Googleタスク出力 | `google_task_status`カラム確保済み |
| Googleカレンダー出力 | `google_calendar_status`カラム確保済み |
| スキーマ拡張 | `schema_version`でマイグレーション管理 |
| AIアウトプット種別 | `output_type`カラムでsummary/task_schedule/prompt/spec/reviewを区別 |
