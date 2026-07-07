# タスクリスト

## 1. タスク状態

タスクは以下の状態で管理する。

* 未着手
* 進行中
* 完了
* 保留
* 確認待ち
* 後回し

## 2. Phase 0：仕様書・管理ファイル整備

* [x] 既存MindHub_App構成確認
* [x] CLAUDE.md確認（存在せず、新規作成）
* [x] CLAUDE.md作成または更新
* [x] 00_START_HERE.md作成
* [x] current-tasks.md作成
* [x] docs/worklog/current.md作成
* [x] docs/memo-app/00-overview.md作成
* [x] docs/memo-app/01-decisions-and-scope.md作成
* [x] docs/memo-app/02-features.md作成
* [x] docs/memo-app/03-data-model.md作成
* [x] docs/memo-app/04-categories-and-tags.md作成
* [x] docs/memo-app/05-markdown-templates.md作成
* [x] docs/memo-app/06-chatgpt-prompt-copy.md作成
* [x] docs/memo-app/07-export-and-git-rules.md作成
* [x] docs/memo-app/08-ui-flow.md作成
* [x] docs/memo-app/09-roadmap.md作成
* [x] docs/memo-app/10-tasks.md作成
* [x] docs/memo-app/11-open-issues.md作成

## 3. Phase 1：SQLite保存・基本CRUD

* [x] SQLite導入方法確認（既存expo-sqliteを利用）
* [x] notesテーブル設計確認
* [x] notesテーブル作成（schema v2マイグレーション）
* [x] メモ作成画面作成（/notes/create）
* [x] メモ保存処理実装
* [x] メモ一覧表示（/notes）
* [x] メモ詳細表示（/notes/[id]）
* [x] メモ編集処理（/notes/[id]/edit）
* [x] archived_atによるアーカイブ処理
* [ ] 基本動作確認（ブラウザでの手動確認は未実施。確認待ち）

## 4. Phase 2：分類機能

* [x] カテゴリ選択実装
* [x] プロジェクト自由入力実装
* [x] 過去プロジェクト候補表示
* [x] タグ入力実装
* [x] 過去タグ候補表示
* [x] Git候補フラグ実装
* [x] visibility実装
* [x] カテゴリごとのGit候補初期値実装

## 5. Phase 3：Markdownプレビュー

* [x] Markdownプレビューライブラリ確認（自作軽量レンダラーを採用。理由は11-open-issues.md参照）
* [x] Markdown表示実装
* [x] 編集とプレビュー切り替え
* [x] コードブロック表示確認
* [ ] ChatGPT整理結果の表示確認（実データでの確認待ち）

## 6. Phase 4：ChatGPT整理プロンプトコピー

* [x] プロンプトテンプレート定義（全10カテゴリ）
* [x] カテゴリ別プロンプト取得処理
* [x] クリップボードコピー処理
* [x] コピー完了メッセージ
* [x] 初期5カテゴリ対応（＋残り5カテゴリも対応済み）
* [ ] 動作確認（ブラウザでの手動確認は未実施。確認待ち）

## 7. Phase 5：検索・絞り込み

* [x] キーワード検索
* [x] プロジェクト絞り込み
* [x] カテゴリ絞り込み
* [x] タグ絞り込み
* [x] Git候補のみ表示
* [x] アーカイブ除外（表示切り替え）
* [x] 並び替え（更新日順・作成日順）

## 8. Phase 6：Markdown書き出し

* [x] 出力先ルール実装（docs/notes/{project}/{date}_{type}_{slug}.md）
* [x] slug生成処理
* [x] メモ単体書き出し（ブラウザダウンロード方式。制約は11-open-issues.md参照）
* [x] 保存先フォルダ指定方法確認（Web制約により推奨パス表示＋手動配置運用）
* [x] export_path保存
* [x] exported_at保存
* [x] 書き出し後の確認表示

## 9. Phase 7：Git候補一括書き出しスクリプト

* [x] スクリプト方針確認
* [x] Git候補メモ取得
* [x] dry-run対応
* [x] project指定
* [x] type指定
* [x] 一括Markdown出力
* [x] 対象ファイル一覧表示
* [ ] Web版DBファイルへのアクセス手段確立（未確定事項。11-open-issues.md参照）

## 10. Phase 8：カテゴリ・テンプレートDB管理（2026-07-06 追加仕様）

旧Phase 8（ダッシュボード化）は将来候補へ移動した（本ファイル末尾および `15-future-and-rejected-policies.md` 参照）。

仕様書整理（今回完了分）。

* [x] 追加仕様書4ファイル作成（12〜15）
* [x] 既存仕様書への参照・要約追記（01 / 03 / 05 / 06 / 07 / 09 / 10 / 11、00_START_HERE.md）
* [x] 将来候補・不採用方針整理（15-future-and-rejected-policies.md）
* [x] mobile-inbox運用整理（14-mobile-prompt-hub-and-inbox.md）

実装タスク（未着手。実装タイミングは確認待ち）。

* [ ] note_categoriesテーブル設計
* [ ] note_templatesテーブル設計
* [ ] 既存10カテゴリseed方針整理（seedデータ作成）
* [ ] schema_versionマイグレーション設計
* [ ] DB優先・コード固定定義fallback実装
* [ ] 既存コード固定定義（noteCategories.ts / chatgptPrompts.ts）からの移行方法確定
* [x] familyカテゴリ・visibility=family値の追加（2026-07-07完了：コード定義へ先行追加。noteTypes.ts / noteCategories.ts / chatgptPrompts.ts。DBマイグレーション不要。Phase 8実装時はこの定義をseed元にする）
* [x] 公開GitHub Pages出力可否判定の先行実装（2026-07-07完了：mobileViewPolicy.ts。Phase 10で使用予定）

## 11. Phase 9：テンプレート管理画面

* [ ] カテゴリ管理画面設計
* [ ] テンプレート管理画面設計
* [ ] 複数テンプレート設計（カテゴリごとのデフォルト指定含む）
* [ ] 初期状態に戻す仕様（カテゴリ単位・テンプレート単位・全体）
* [ ] Codex / Claude Code依頼プロンプトテンプレートの初期候補整備

## 12. Phase 10：スマホ閲覧用HTML/JSONエクスポート

* [ ] スマホ閲覧用HTML/JSON設計（docs/mobile-view/ index.html / notes-data.json）
* [ ] notes-data.jsonの形式設計
* [ ] スマホ閲覧対象条件設計（安全条件・公開許可カテゴリ。familyカテゴリは除外、公開判定はカテゴリ＋visibility併用。13-mobile-view-export.md 3.3）
* [ ] 出力対象確認画面設計
* [ ] スマホ閲覧HTMLの検索・絞り込み設計
* [ ] 簡易Markdown表示設計
* [ ] コピーボタン設計（本文・コマンド・ChatGPT用・Gemini用・Googleタスク用）
* [ ] 手動push運用手順の整理

## 13. Phase 11：スマホ用プロンプト集HTML

生成方式は決定済み（2026-07-06、14-mobile-prompt-hub-and-inbox.md §1.6）：短期はコード固定プロンプト定義（chatgptPrompts.ts）からdocs配下へ生成し、note_templates実装後に出力元をDBへ切り替える。Phase 8〜9への依存がなくなったため先行着手できる。

* [x] スマホ用プロンプト集HTML設計（2026-07-06実装：出力先 docs/mobile-view/prompts.html、生成は npm run generate:prompt-hub）
* [x] コード固定プロンプト定義（chatgptPrompts.ts）からのHTML生成実装（短期方針。scripts/generate_prompt_hub.mjs）
* [x] 初期10プロンプト本文作成（2026-07-06完了：不足5本＝時間帯別タスク化・Googleタスク整形・カレンダー整形・優先順位整理・Codexレビュー依頼を含む追加31本を src/features/notes/mobilePrompts.ts に作成。計41本収録、7セクション構成。14 §1.2・§1.7参照）
* [ ] 今回見送り3本（Claude Code報告確認・リポジトリ状況整理・検証結果レビュー）の追加要否判断
* [x] アプリ内プロンプト一覧画面の追加（2026-07-07完了：app/prompts。promptHub.tsでchatgptPrompts＋mobilePromptsを統合し42件・7セクションをRN画面で表示・検索・コピー。APK上でHTMLを探さず直接プロンプトを使える。実機確認はEAS再ビルド後）
* [ ] note_templates実装後の出力元DB切り替え（将来。Phase 8〜9完了後。generate_prompt_hub.mjsのloadPromptEntries()とpromptHub.tsのgetPromptGroups()の差し替えのみで対応可能な構造にしてある）

## 14. Phase 12：Android APK版ビルド（2026-07-06 端末別運用方針）

仕様書整理（今回完了分）。

* [x] 端末別運用方針の仕様書作成（16-platform-and-distribution.md）
* [x] 既存仕様書への反映（01 / 09 / 10 / 11 / 13 / 15、00_START_HERE.md、CLAUDE.md）
* [x] 配布・共有方針（自分用・家族用・配布用の三区分）の仕様書作成（17-distribution-and-sharing.md）
* [x] 配布・共有方針の既存仕様書への反映（01 / 09 / 11 / 13 / 15 / 16、00_START_HERE.md、CLAUDE.md）

実装タスク（着手タイミングは確認待ち）。

* [x] ビルド方式確定（2026-07-06決定：EASクラウドビルド。profile: preview / internal distribution / APK形式。ローカルビルドは後回し）
* [x] 対象SDKバージョン確定（2026-07-06決定：SDK 54を正式採用候補のまま進める。SDK 56固有機能が必要になった時に再検討）
* [x] check-expo-sdk54ブランチのmainマージ（2026-07-06完了。push済み）
* [x] eas.json作成（2026-07-07完了：preview / production とも internal distribution / APK形式）
* [x] app.json整備（2026-07-07完了：android.package=com.ykjob.flowdock仮置き、versionCode=1）
* [x] APK初版の機能範囲・確認チェックリスト整理（2026-07-07完了：16 §2.5。現行機能のみ、既知の制約つき）
* [x] JSONインポートの仕様確定（2026-07-07完了：18-json-import-export.md。実装は未着手）
* [x] EASアカウント準備・初回APKビルド（2026-07-07：初回EAS APKビルド成功→Android端末インストール成功）
* [~] Android実機インストール・確認チェックリスト実施（16 §2.5）（2026-07-07 初版確認：起動・保存・再起動後保持・familyカテゴリ/visibility表示・FlowDock作成編集は成功。検索/絞り込み/Markdownプレビュー/オフライン保存/prompts.htmlコピーは未確認）
* [ ] クリップボード修正（9338a07）・アプリ内プロンプト一覧画面のAPK実機再確認（EAS再ビルド後）
* [ ] JSONインポート実装（PC側エクスポート＋Android側インポート。18参照。実装時期は未定）
* [ ] テンプレート管理の動作確認（Phase 8〜9実装後）

家族用iPhone閲覧はPhase 10（スマホ閲覧用HTML/JSON）で対応するため、Phase 12にiOS向けタスクはない。

## 15. 将来候補（旧Phase 8ダッシュボード含む）

将来候補・不採用の詳細は `15-future-and-rejected-policies.md` を参照。

* [ ] 最近更新したメモ表示（旧Phase 8）
* [ ] プロジェクト別最新メモ表示（旧Phase 8）
* [ ] Git候補一覧（旧Phase 8）
* [ ] 未整理メモ一覧（旧Phase 8）
* [ ] 次回再開メモ一覧（旧Phase 8）
* [ ] 配布用リポジトリ整備（作成タイミングは確認待ち。11-open-issues.md 13章）
* [ ] 配布用データエクスポート機能（将来候補。17-distribution-and-sharing.md）
