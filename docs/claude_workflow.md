# Claude Code 作業ルール（FlowDock）

このファイルはClaude Codeが今後作業するときに守るべきルールをまとめたものです。

---

## 作業開始前に必ず読むファイル

1. `docs/flowdock_mvp_design.md`（仕様の基準）
2. `docs/development_status.md`（現在の達成状況）
3. `docs/task_board.md`（現在・次のタスク）

状況に応じて以下も参照する：

- `docs/roadmap.md`（MVP後の方向を確認したいとき）
- `docs/implementation_log.md`（過去の判断経緯を確認したいとき）

---

## 作業後に必ず更新するファイル

| ファイル | 更新タイミング |
|---------|--------------|
| `docs/development_status.md` | 実装後。MVP完了条件の達成状況を更新する |
| `docs/task_board.md` | タスクが完了・追加・ブロックされたとき |
| `docs/implementation_log.md` | 作業セッションの終わりに追記する |

---

## 仕様変更・仮決定の扱い

### 設計書と異なる判断をした場合

- **黙って進めない**
- `docs/implementation_log.md` に理由とともに記録する
- `docs/development_status.md` の「仕様変更・仮決定ログ」に記録する
- ユーザーに報告する

### 大きな仕様変更が必要な場合

- 勝手に確定しない
- 「仮決定」として記録し、ユーザーに判断を仰ぐ
- 例：「設計書ではXとあるが、実装上Yの方が適切です。仮決定としてYで進めますが確認をお願いします」

---

## セキュリティルール

- GitHub tokenを設計書・ソースコード・docsファイルに書かない
- GitHub tokenはSecureStoreのみに保存する
- SQLiteにGitHub tokenを保存しない
- 環境変数ファイル（.env）にGitHub tokenを書かない
- .gitignoreに .env を含めておく（初期設定済み）

---

## コーディングルール

- 画面ファイル（Screens）にSQLite処理を直接書かない
- 画面ファイル（Screens）にGitHub API処理を直接書かない
- ロジックはfeaturesディレクトリのRepositoryやServiceに分離する
- TypeScriptを使う（anyは原則禁止）
- コメントは「なぜそうするか」が非自明な場合のみ書く

---

## MVPスコープの守り方

以下はMVPで実装しない。追加提案もしない。

- AI整理処理（テーブル作成のみOK）
- Googleタスク出力（カラム確保のみOK）
- Googleカレンダー出力（カラム確保のみOK）
- Markdownプレビュー
- 自動同期
- 複数端末同期
- 通知
- 設計書生成
- プロンプト生成

---

## タスク完了の定義

以下をすべて満たしてから「完了」とする：

1. 対象ファイルの実装が終わっている
2. MVP完了条件のうち関連する項目を確認した
3. `docs/development_status.md` を更新した
4. `docs/task_board.md` のタスクをチェックした
5. `docs/implementation_log.md` に追記した

---

## ブランチ運用

- mainは安定版として扱う
- 大きな機能追加ではfeatureブランチを使う
- featureブランチ例：
  - feature/expo-setup
  - feature/sqlite-memos
  - feature/github-upload
  - feature/github-settings

---

## ユーザーへの報告形式

各作業セッション終了時は以下を報告する：

1. 今回やったこと
2. 変更したファイル
3. MVP完了条件の達成状況（更新があれば）
4. 残っている課題・ブロッカー
5. 次にやるべきこと

---

## よくある確認チェックリスト

GitHubアップロード実装時：

- [ ] SHA を使って既存ファイルを更新しているか
- [ ] 失敗時にメモ本文を消していないか
- [ ] 失敗時に github_error_message を保存しているか
- [ ] SecureStore からトークンを取得しているか
- [ ] SQLite から直接トークンを読んでいないか

メモ編集実装時：

- [ ] updated_at を更新しているか
- [ ] github_status が uploaded なら modified_after_upload にしているか
- [ ] github_status が not_uploaded なら変えていないか

削除実装時：

- [ ] 物理削除ではなく論理削除（deleted_at）になっているか
- [ ] 一覧取得で deleted_at IS NULL を条件にしているか
