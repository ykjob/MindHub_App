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
* [x] Androidエミュレータ自動確認の調査・導入案の記録（2026-07-07完了：19-android-emulator-testing.md。Maestro＋adb推奨、CIは後回し）
* [x] Maestroフロー雛形の作成（2026-07-07完了：.maestro/README.md、flows/01_create_and_persist.yaml、flows/02_prompt_copy.yaml。未実行の雛形）
* [ ] Maestro/エミュレータの実行環境準備（WSL2・AVD）とフロー実動確認（未着手。時期は未定）
* [ ] 主要要素へのtestID付与によるフロー堅牢化（将来。UI安定後）
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

## 16. Phase 14：現場適応モード（追加仕様）

仕様書整理（今回分）。

* [x] 仕様書4ファイル作成（20〜23）
* [ ] 既存仕様書への参照追記（01 / 03 / 04 / 07 / 08 / 09 / 11 / 17、00_START_HERE.md、CLAUDE.md）

MVP実装（2026-07-09 実装。未コミット）。

* [x] 現場適応モード入口の追加（既存ホームヘッダーへ「現場適応」ボタン追加のみ。`app/index.tsx`。既存導線は無変更）
* [x] 新規ルート `app/workplace/*` の追加（index＝場面選択＋翌朝再開表示 / start / stuck / end）。`_layout.tsx` にStack.Screen登録
* [x] 作業開始・詰まり記録・終業前メモ（MVP優先3場面）の入力/出力画面（共通部品 `src/components/WorkplaceSceneForm.tsx`）
* [x] 翌朝の再開導線（直近の終業前メモを1件表示→「この続きから作業開始」で作業開始へ）
* [x] 再開時の引き継ぎ（2026-07-09追加）：「この続きから作業開始」で作業開始フォームに直近終業前メモの内容を初期入力（明日最初にやること→今日の作業、未完了・補足→先に確認すること）。通常の作業開始導線は空欄。作業開始は従来どおり保存しない
* [x] 場面タグ実装（`workplace_start` / `workplace_stuck` / `workplace_end` ＋ 共通タグ `workplace`。`src/features/workplace/workplaceTags.ts`）
* [x] 直近終業前メモ取得の専用関数 `getLatestNoteByTag`（タグ境界厳密一致・LIKEワイルドカードエスケープ・`archived_at IS NULL`・`updated_at DESC, id DESC`・1件。`noteRepository.ts` に追加）
* [x] 守秘既定の強制（終業前メモ保存は `visibility=private` / `is_git_candidate=false` 固定。`getGitCandidateDefault` 不使用。type=thought。`workplaceService.ts`）
* [x] 守秘注意文の常時表示（各入力/出力画面。`WORKPLACE_PRIVACY_NOTICE`）
* [x] 保存は終業前メモのみ（作業開始・詰まり記録はコピーのみ）
* [x] 質問文作成・進捗報告作成（次点。2026-07-10実装。`app/workplace/question.tsx` / `report.tsx`、`WorkplaceSceneForm` 再利用・コピーのみ・保存なし。`buildQuestionText` / `buildReportText` 追加。場面定数 `workplace_question` / `workplace_report` は定義のみ。守秘注意＋AI/チャット/メール貼付前の一般化注意を intro に明記）
* [ ] 現場プロファイル（単一現場。今回対象外）
* [x] ブラウザでの動作確認（2026-07-12 完了）：5場面（start / stuck / question / report / end）＋入口＋翌朝再開導線をヘッドレスブラウザで実操作確認。47チェック項目すべてOK・コンソールエラー0件・表示崩れなし・アプリ側の修正不要。確認URLは `http://localhost:8082/workplace` 以下（8081は現場適応モード追加前から動いていた古い開発サーバーで `/workplace` が Unmatched Route になるため、8082で新規起動して確認）
* [x] 発表用サンプルデータの作成（2026-07-12 完了）：`26-workplace-demo-samples.md` を新規作成。架空シナリオ（新人が架空の在庫管理Webアプリの画面確認タスクを担当する1日）で5場面の入力例・デモ手順・ChatGPT活用例・守秘ルールを整理。ドキュメントのみ・実装コード/DB/ルート構造は無変更
* [x] 発表用サンプルデータのデモリハーサル（2026-07-12 完了）：`26` §2のサンプル文を原文どおり8082の実画面へ入力し、5場面の整理→出力→コピー、終業前メモ保存→入口の「前回の再開メモ」表示→「この続きから作業開始」の引き継ぎまで確認。全32チェック項目OK・コンソールエラー0件・修正必須の問題なし。§3にデモ運営上の注意（サンプル文は事前用意してコピペ入力）を1行追記

今回の非対象（境界固定どおり）：schema変更なし、既存 `/notes` `/memo` `/prompts` `/settings` 無変更、公開出力・GitHub Pages・配布用HTML・家族用表示への接続なし。

## 17. 開発リファレンス（現場適応モードとは別機能）

仕様書整理（2026-07-10 今回分）。

* [x] 開発リファレンス仕様書の新規作成（`24-development-reference.md`。目的・現場適応モードとの関係・対象/非対象・登録基準・初期実装方針・将来候補）
* [x] 既存仕様書への参照追記（04 / 09 / 10 / 11 / 20 / 21）
* [x] 現場適応モードとは別機能であり補助参照として扱う旨の明記（20 / 21 / 24）
* [x] 初期は既存notesの `command` カテゴリまたはタグ運用で扱い、専用DB・専用画面は後回しである旨の明記（04 §1.3 / 09 / 24 §6）
* [x] 案A（専用画面を作らず `command` カテゴリで運用）を正式方針として確定・docs反映（2026-07-10。24 §6.1 / 04 §1.3 / 11 §15）
* [x] 参照用タグを `dev-ref` に確定（2026-07-10。04 §1.3 / 11 §15 / 24 §6）
* [x] 登録候補一覧の整理（2026-07-10。`25-development-reference-candidates.md` に31件、高優先度7件を先行登録候補として明記）

目的2本柱化・現場理解カード追加（2026-07-12 今回分。ドキュメントのみ）。

* [x] 目的を2本柱（柱1＝技術リファレンス、柱2＝現場理解カード）に拡張（`24` §1・§3・§4・§5・§6.2）
* [x] 現場理解カードG-01〜G-20の候補一覧・Rカードとの関係・優先度・サブタグ6種を整理（`25` §10）
* [x] 登録用コピペ本文20枚（1枚15〜25行、汎用内容のみ・守秘確認済み）を作成（`27-development-reference-fieldwork-cards.md` 新規）
* [x] 面接質問プロンプトは対象外と明記（`25` §7）
* [x] 関連仕様の更新（04 §1.3 / 11 §15）

運用（実装なし）。

* [ ] 現場理解カード高優先5枚（G-02/G-06/G-08/G-10/G-19）を `27` から `/notes` へコピペ登録（ユーザーの手動登録。`25` §10.5）
* [ ] 現場理解カード残り15枚の登録
* [ ] 高優先度7件（R-01/R-02/R-03/R-04/R-09/R-14/R-15）を `command` カテゴリ＋タグ `dev-ref` で先行登録（`25` §3。DB登録はユーザー判断待ち）
* [ ] 残りのR候補を登録基準（`24` §5.1）に沿って1件ずつ登録する運用
* [ ] R側に `dev-ref` サブ観点タグを併記するかの判断（G側は6種確定済み。`11` §15 / `25` §10.3）

将来候補（実運用で必要性が確認できてから。`24` §7）。

* [ ] 開発リファレンス専用の一覧・検索画面
* [ ] 専用テーブル・専用データ構造（schema_version 方式。`03`）
* [ ] 現場適応モードの詰まり記録・質問文作成からのリファレンス横断参照導線

今回の非対象：アプリ本体の実装変更、DBスキーマ変更、専用画面作成、AI自動抽出、用語・関数・ライブラリの大量seed作成、現場適応モードのUI変更、既存notes機能の破壊的変更、コミット・push。

## 18. 名称方針の整理（2026-07-12）

仕様書整理（ドキュメントのみ）。

* [x] 名称方針の決定・仕様書追記（`01-decisions-and-scope.md` §1.6 新設。MindHub＝アプリ全体名、FlowDock＝初期からある軽量メモ機能の説明名、`/memo`＝FlowDock由来の既存軽量メモ機能、`/notes`＝メモ管理機能、`/workplace`＝現場適応モード）
* [x] `00_START_HERE.md` §1 と `CLAUDE.md` プロジェクト概要へ名称方針の参照を追記

今回の非対象：app.json・package.json・ルート名・DB・実装コードの名称変更（表示名等を実際に MindHub へ変更する時期は未確定。`01` §1.6）、コミット・push。

## 19. メモ管理画面の不具合修正（2026-07-13）

`/notes` の不具合2件のバグ修正（実装コード変更あり・schema無変更・未コミット）。

* [x] 戻るボタン消失の修正：`app/notes/index.tsx` の画面内ヘッダーに「← 戻る」ボタンを追加。`router.canGoBack()` なら `back()`、履歴がない（Web更新・直アクセス）場合は `replace('/')`
* [x] Web更新時の `NoModificationAllowedError` 対応：`app/_layout.tsx` の SQLiteProvider に `onError` を追加。OPFS access handle 競合（旧workerのhandle解放前に新workerが取得）のときだけ sessionStorage フラグ付きで1回だけ自動リロードして回復。onInit 成功時にフラグ解除
* [x] `/notes` 一覧の `useFocusEffect`＋`useEffect` 二重 `load()` を `useFocusEffect` のみに整理
* [x] ブラウザ実操作確認（2026-07-13 ヘッドレスChromeで実施：戻るボタン両経路・フィルタ再読み込み・リロード連打回復・PC/スマホ幅表示・フラグ残留なし・コンソールエラー0件）
* [x] 戻る導線の統一：`notes/index` のみ `headerShown: false` でネイティブヘッダーを非表示にし、画面内「← 戻る」を全環境で唯一の戻る導線に（2026-07-13。他画面のネイティブヘッダーは無変更。ヘッドレスChromeでPC/スマホ幅・遷移/直アクセス/更新後・他画面ヘッダー残存を確認済み）
* [x] Android実機フィードバック対応（2026-07-13、未コミット）：画面内ヘッダーに `useSafeAreaInsets` で上余白追加（ステータスバー被り解消）、「← 戻る」に hitSlop 追加。スマホ幅2段化は一度実装後、対象画面の認識違い（窮屈なのはホーム画面）のため撤回。tsc・Web両幅確認済み
* [ ] Android実機での再確認（ステータスバー非被り・戻るボタンのタップ。APK再ビルド後）。/notes ヘッダー2段化の要否はこの実機表示を見て判断
* [x] ホーム画面 `app/index.tsx` ヘッダーのレスポンシブ化（2026-07-13、未コミット）：`width < 480` でタイトル＋4ボタン2×2グリッド（中央寄せ・縦padding拡大）、480以上は従来1行維持。tsc・Web両幅確認済み。Android実機確認はAPK再ビルド後

今回の非対象：expo-sqlite本体へのパッチ、別タブ同時オープン時の専用エラーUI、他の `/notes` 系画面へのボタン追加、コミット・push。

## 20. Phase 15：UI・UX品質改善（2026-07-13 追加）

仕様正本：`28`（画面別改善）・`29`（共通UI基盤）・`30`（検証）。タスクIDは28〜30で使用する体系（DOC / IA / UI / HOME / HEADER / NOTES / WORK / PROMPT / STATE / A11Y / VISUAL / TEST / REVIEW）に従う。1タスク1目的・全画面一括置換禁止（`29` §10）。

### DOC（文書整備）

* [x] DOC-01 現状監査：既存仕様・実装・管理ファイルの矛盾確認と文書更新計画の作成（2026-07-13完了。実装コード未変更）
* [x] DOC-02 `28-ui-ux-quality-improvement.md` 作成（2026-07-13完了）
* [x] DOC-03 `29-ui-design-system.md` 作成（2026-07-13完了。設計判断DS-01〜DS-10承認済み）
* [x] DOC-04 `30-ui-validation-checklist.md` 作成（2026-07-13完了）
* [x] DOC-05 既存仕様書への反映（2026-07-13完了：01 / 08 / 09 / 10 / 11 / 14 / 16 / 21、CLAUDE.md、00_START_HERE.md）
* [x] DOC-06 管理ファイル更新（2026-07-13完了：current-tasks.md・docs/worklog/current.md。既存のAPK 4回目記録は無変更で保持）
* [x] DOC-07 文書監査・Gate 1判定（2026-07-13完了：AUDIT-01〜18の18項目を監査し全項目合格。参照切れ0件・正本重複なし・UX-01〜16追跡可能・DS-01〜10反映済み・古い方針は置換注記済み・versionCode 4は未確認のまま維持。軽微3件は `docs/worklog/current.md` の監査記録参照）
* **Gate 1（仕様書整備）：完了（2026-07-13）**。versionCode 4 APKの実機基準確認は2026-07-13に完了（7項目とも問題なし。`30` §12.2）。文書基準点コミット：faaaa94（docs: finalize phase 15 ui ux specification、未push）

### IA（情報設計。実装前判断）

2026-07-14：バッチ2前のホームIA判断がユーザー確定（記録：`28` §7.1〜7.2・§11・§17、`11` §16）。次工程は**バッチ2＝ホーム再構成のみ**（HOME-01〜05。メモ管理一覧の改修はバッチ3）。プロンプト集の状況別分類はPROMPT-01着手前まで保留。

* [x] IA-01 ホームの役割確定（2026-07-14完了）：ホーム＝MindHub全体の主要機能へ進む入口（`28` §7.1）。最近のメモの取得元＝memosのみで確定（セクション名「最近の軽量メモ」・初期最大3件・ホーム内展開・別ルート追加なし。`28` §7.2・`11` §16）
* [x] IA-02 機能名称の画面表示確定（2026-07-14、ホームで必要な範囲を確定）：主要カード名＝すぐメモする／仕事を整理する／記録を整理する／AIの型を使う（この表示順基本・短い役割説明付き）。現場適応モードはホームカード上のみ「仕事を整理する」で正式名称は不変（`28` §7.2・§11）。クイックメモ表記のホーム以外の画面文言への適用は該当タスクで確認、app.json変更は別判断のまま
* [ ] IA-03 主要機能の優先順位：`28` §6.2で定義済み（ホーム実装時に見た目へ反映）
* [ ] IA-04 軽量ホームと旧ダッシュボード構想の分離：`28` §12で定義済み（実装時に逸脱がないか確認）

### UI（共通UI基盤）

* [x] UI-01 デザイントークン `src/theme/index.ts` 作成（`29` §3〜§4。作成時点では既存画面を書き換えない）。依存：DOC-07（2026-07-14完了・未コミット。バッチ1）
* [x] UI-02 初期共通コンポーネント作成（AppHeader / FilterChip / ListStateView / StatusMessage。`29` §6）。依存：UI-01。AppHeaderはversionCode 4基準確認（`30` §12.2）完了後（2026-07-14完了・未コミット。バッチ1。AppHeaderは実用状態、FilterChip・ListStateView・StatusMessageは表示基盤のみで既存画面へは未適用）
* [ ] UI-03 色の意味の固定（`29` §3.1の運用確認。意味のない場所への使用がないこと）

### HOME（ホーム改善）

* [x] HOME-01 MindHub入口への再構成（`28` §7.1〜7.3）。依存：UI-01・UI-02・IA-01・IA-02、versionCode 4基準確認（2026-07-14完了＝バッチ2。`app/index.tsx` のみ変更。旧「メモ一覧」ヘッダー＋4ボタンを主要機能カード4件＋「最近の軽量メモ」へ再構成。取得処理は既存 `getAllMemos` のまま・FAB維持・コンテンツ最大幅720で中央寄せ。カードはホーム専用のためローカル定義＝`29` §6.5の追加基準に従い共通化しない。2026-07-14 APK確認2＝versionCode 6のAndroid実機確認で遷移・表示とも問題なし＝**実装・Web・Android確認済みの正式完了**）
* [x] HOME-02 主要機能カードの優先順位表現（`28` §6.2。カード名・順序は`28` §7.2で確定済み）。依存：HOME-01（2026-07-14完了＝バッチ2。優先順位は**表示順のみ**（上段＝最重要：すぐメモする・仕事を整理する）で表現し、4カードは同じ外観に統一。当初の上段左アクセント（brand色3px）は「左右バランスが崩れて見え、選択状態・特別なステータスに誤認される」ため同日削除。2026-07-14 APK確認2のAndroid実機でも4枚同外観・左アクセント残留なし・左右バランス問題なし＝正式完了。表現の十分性はGate 7再評価で最終判定）
* [x] HOME-03 最近の軽量メモ（memosのみ）初期最大3件＋ホーム内展開（「すべて表示」／「3件に戻す」等。別ルート追加なし。`28` §7.2）。依存：HOME-01・IA-01（2026-07-14完了＝バッチ2。既存memos配列の表示件数のみ切替（slice）。4件作成→初期3件→展開→全件→3件に戻すをWebで実操作確認。3件以下では切替操作を非表示。2026-07-14 APK確認2のAndroid実機でも初期3件・展開・復帰とも正常＝正式完了）
* [x] HOME-04 設定の補助位置への移動（2026-07-14完了＝バッチ2。AppHeader右側へ「設定」小ボタンを配置。共有AppHeader本体は無変更＝既存 `right` propへ呼び出し側から注入。幅360でタイトル・補助文と衝突なし。2026-07-14 APK確認2のAndroid実機でも主要カードと異なる補助導線として表示・遷移正常＝正式完了）。依存：HOME-01
* [x] HOME-05 スマホ幅確認（360〜1024の6幅。`30` §5）。依存：HOME-01〜04（2026-07-14 Webで6幅（360/390/412/480/768/1024）確認済み・横スクロールなし・コンソールエラー0件。Android実機は2026-07-14 APK確認2＝versionCode 6でSafe Areaを含む実機表示・2×2維持を確認し問題なし＝正式完了）

### HEADER（ヘッダー統一）

* [x] HEADER-01 対象4画面のAppHeader適用（ホーム・メモ管理一覧・現場適応入口・プロンプト集。`29` §5.1）。依存：UI-02（2026-07-14完了・未コミット。バッチ1。ホームは既存の4ボタングリッド・一覧を維持したままAppHeader追加のみ＝本格再構成はHOME-01）
* [ ] HEADER-02 統一項目の確認（Safe Area・タイトル・戻るフォールバック・右側操作・タッチ領域・二重表示なし。`30` §7）。依存：HEADER-01（Web確認は2026-07-14実施済み＝1280px/390px・直アクセス・戻る両経路・二重表示なし・コンソールエラー0件。Android実機はversionCode 5 APK確認1で**大きな問題なし**まで記録＝`30` §12.1。TalkBack・最終判定は後続レビューで行うため未完了のまま。保留所見：Webで戻るボタンが見えない件は、原因がネイティブStackヘッダーのマスク画像戻るボタンと特定し、テキスト「← 戻る」headerLeftで**Web修正済み**＝当初3画面（memo/create・notes/create・settings）＋同日追加の現場適応5入力画面（workplace/start・stuck・question・report・end。fallback=`/workplace`）の計8画面（2026-07-14「画面文言・Webヘッダー修正」バッチ。`30` §8.5.1・§8.5.2・`11` §16）。さらにバッチ6A補足で詳細・編集4画面（memo/[id]・memo/[id]/edit・notes/[id]・notes/[id]/edit。編集は対応する詳細への動的fallback）も同問題を再現・修正し**計12画面**（`30` §8.5.3）。Android実機・TalkBackは未確認のためHEADER-02全体は未完了のまま）

### NOTES（メモ管理改善）

* [x] NOTES-01 フィルター収納（常時表示＝検索・カテゴリ・絞り込みボタン・有効中条件。`28` §8.1）。依存：UI-02（2026-07-14完了＝バッチ3。`app/notes/index.tsx` のみ変更。常時表示＝検索・カテゴリチップ・「詳細な絞り込み」開閉行・適用中要約。折りたたみ内（初期閉）＝プロジェクト・タグ・Git候補のみ・アーカイブ済みも表示・並び順。閉じても条件は維持され、開閉ボタンへ折りたたみ内の絞り込み条件数（project・tag・gitOnly・includeArchived）を表示（常時表示の検索・カテゴリと、フィルターではない並び順は数えない。並び順の変更は適用中要約にのみ表示＝レビュー反映2026-07-14）。条件があるときは「適用中：…」要約と「表示条件をリセット」を表示。`getNotes` 等のSQL・検索仕様・debounceなしは無変更）
* [x] NOTES-02 チップの役割分離（絞り込み／オン・オフ／並び順の区別。`28` §8.2・`29` §6.2）。依存：UI-02（2026-07-14完了＝バッチ3。画面内ローカルFilterChipを削除し、共通 `src/components/FilterChip.tsx` をカテゴリ・プロジェクト・タグ・Git候補のみ・アーカイブ済みも表示へ適用＝共通部品本体は無変更。並び順はチップにせず、折りたたみ内のneutralな長方形切替ボタン「並び順：更新日順／作成日順」へ分離（pill・ブランド塗りなし・minHeight 44・role/label/hint付与）。開閉・リセット・新規作成はチップにしない。CategorySelectorは無変更）
* [x] NOTES-03 一覧状態の区別（loading / empty / filtered-empty / error。`28` §8.3）。依存：UI-02（2026-07-14完了＝バッチ3。loadError＋reloadKeyを追加し、共通ListStateViewでloading／error（再試行ボタン接続）／empty（条件なし0件）／filtered-empty（keyword・project・type・tag・gitOnlyのいずれか有効で0件。includeArchivedは対象を広げる条件・sortByは表示順のみのため判定へ含めない）を区別。従来はcatch握りつぶしでemptyと同一表示だった。**実エラー表示は未再現**＝catch→loadError→status="error"→onRetryの接続をコード上で確認）
* [x] NOTES-04 スマホ幅の情報密度確認（`28` §8.4。/notesヘッダー2段化要否は実機確認後判断）（2026-07-14 Webで6幅（360/390/412/480/768/1024）確認＝横スクロールなし・詳細フィルター初期閉で一覧カードが初期表示範囲に見える・768以上はコンテンツ最大幅720中央寄せ・コンソールエラー0件。**Android実機は未確認**＝次回APK確認で行う。/notesヘッダー2段化は不要のまま）

### WORK（現場適応入口改善）

* [x] WORK-01 一日の流れ3区分表示（開始／作業中／終了。`28` §9.1）。依存：UI-02（2026-07-14完了＝バッチ4。`app/workplace/index.tsx` のみ変更。「今日の場面」5枚縦並びを、開始（前回の再開メモ＋作業開始）／作業中（詰まり記録・質問文作成・進捗報告作成）／終了（終業前メモ）の3区分へ再構成。区分見出し（accessibilityRole="header"）＋短い区分説明付き。場面の順序は従来どおり。SectionHeader等の共通部品は新設せず画面内ローカル描画＝`29` §6.5の追加基準どおり）
* [x] WORK-02 動作種別表示（コピーのみ／コピーと保存。`28` §9.2）。依存：WORK-01（2026-07-14完了＝バッチ4。各場面カードの場面名右側にpill形状の小ラベルを表示：作業開始・詰まり記録・質問文作成・進捗報告作成＝「コピーのみ」（brandSoft）／終業前メモ＝「コピーと保存」（successSoft）。カードの基本外観は5枚で統一（左アクセントなし・終業前メモを過度に強調しない）。accessibilityLabelにも種別を含める。実動作との整合を確認済み＝保存導線はendのみ）
* [x] WORK-03 前回メモと作業開始の接続の見せ方改善（`28` §9.3。既存挙動は不変）。依存：WORK-01（2026-07-14完了＝バッチ4。再開メモを「開始」区分内・作業開始カードの直前に配置し、前日の終業前メモ→「この続きから作業開始」→今日の作業開始フォームの関係を表示順と区分説明で表現（装飾線・矢印は追加しない）。既存遷移 `/workplace/start?fromRestart=1`・ボタン文言・引き継ぎ初期入力は無変更。取得処理にloadError＋reloadKeyを追加し、catch握りつぶしを解消して共通ListStateViewを部分適用（loading／error＋再試行／empty「前回の再開メモはありません」＋保存誘導）。STATE-01・02の全体完了扱いにはしない）
* [x] WORK-04 独自価値の説明文（`28` §9.4。守秘注意文は維持）（2026-07-14完了＝バッチ4。AppHeaderへsubtitle「仕事の5場面を整理し、質問・報告・翌日の再開につなげます。」を追加。旧説明文「毎日の場面ごとに整理してコピー・保存できます。現場固有の情報は保存しません…」は動作として不正確（4場面は保存しない・終業前メモは保存される）なため削除し、入口専用の短い守秘注意帯（warningSoft背景・warningText文字・常時表示・左アクセントなし）「実名・顧客名・認証情報・社内URL・業務コードの全文は入力しないでください。内容は一般化した個人用の覚書に留めます。」へ置換。各入力画面のWORKPLACE_PRIVACY_NOTICEは無変更）

### PROMPT（プロンプト集改善）

* [x] PROMPT-01 状況別入口の追加（分類は実装前確定。`28` §10.1・`11` §16）。依存：UI-02（2026-07-14完了＝バッチ5、同日に名称・ID対応を修正版へ更新。`app/prompts/index.tsx` のみ変更。6入口＝**問題を整理する／エラー・不具合を整理する／予定・やることを整理する／作業結果をまとめる／引き継ぎを作る／開発作業を依頼・確認する**。入口名・ID対応は入口名からの推測ではなく既存プロンプト本文が実際に行う処理に合わせて定義（旧「エラーを相談する」→「エラー・不具合を整理する」、旧「仕様・実装を確認する」の `design`/`research` は設計メモ・調査メモへの整形のため入口から除外、`claude_prompt`・`claude_work_start` を「開発作業を依頼・確認する」へ追加、`daily_priority` は「問題を整理する」から「予定・やることを整理する」へ移動、`wife_schedule`／`outing_plan`／`shopping_memo` を「予定・やることを整理する」へ追加）。画面側の固定IDマッピング（`PROMPT_SITUATIONS`：コンポーネント外の型＋定数）で対応させ、`mobilePrompts.ts`・`chatgptPrompts.ts`・`noteCategories.ts`・`PromptEntry`の型・生成スクリプトは無変更。状況別入口＝既存42件から目的に近いものを絞り込む補助フィルター（既存セクション＝所属の通常導線・検索＝通常導線は不変）。同一IDの複数入口重複はどちらの目的からも自然なもののみ許可（next_one_action／validation_log／worklog_close_summary／worklog）。全42件を6入口へ無理に割り当てない＝登録外プロンプト（就活・投資、生活家庭の family_manual／household_rule）は「すべて」・既存セクション・キーワード検索から到達可能。生活・家庭共有も目的に一致する wife_schedule／outing_plan／shopping_memo は個別対応。共通FilterChipで単一選択＋「すべて」が解除を兼ねる・flexWrap折り返し・横スクロールなし・AI紫色不使用でブランド色のみ）
* [x] PROMPT-02 既存検索・一覧・コピーの維持確認（`28` §10.2）。依存：PROMPT-01（2026-07-14完了＝バッチ5。42件・7セクション・セクション順・セクション内順・件数見出し・1件展開アコーディオン・本文表示・badge・note・コピー対象promptBodyを維持。状況選択と既存キーワード検索はAND（全42件→状況別ID→キーワード検索→0件セクション除外）。検索対象は従来どおりname／id／セクション名のみ＝本文・note・badgeは検索対象に追加しない。入口・検索変更時にexpandedIdを強制初期化しない）
* [x] PROMPT-03 コピー結果表示のStatusMessage共通化（`28` §10.3）。依存：UI-02（2026-07-14完了＝バッチ5。旧copiedId／failedIdのボタン色変更を、共通StatusMessage（kind=success「コピーしました」／error「コピー失敗」）をカードのcardHead直下に表示する方式へ変更。copyingId＋copyResult管理・コピー中は全コピーボタンdisabled＋「コピー中…」＋accessibilityState.disabled＋プロンプト名入りaccessibilityLabel・finallyでcopyingId解除。自動消去はuseEffectで成功2000ms／失敗2500ms・新結果/消去/アンマウントでクリーンアップ・連続コピーは最後の結果のみ表示（旧タイマーが新結果を消さない）。結果表示ラッパーにaccessibilityLiveRegion="polite"。StatusMessage.tsx本体・ListStateView.tsx本体は無変更。STATE-03・04全体の完了扱いにはしない＝下記）

### DETAIL（詳細画面の補助改善）

* [x] DETAIL-01 軽量メモ詳細・メモ管理詳細への本文コピー導線追加（2026-07-14完了・コミット a6b8b20。versionCode 5実機確認の追加所見を受けた先行小タスク。`app/memo/[id]/index.tsx`＝`memo.body`のコピー、`app/notes/[id]/index.tsx`＝`note.body`のコピー。既存 `copyToClipboard` 経由・既存プロンプトコピーとは文言と状態変数で区別・空本文はコピーせず「本文がありません」表示。DB・保存処理・ルート・依存関係・app.jsonは無変更。Webで機能確認済み。Android実機は2026-07-14 APK確認2＝versionCode 6で両詳細画面の「本文をコピー」正常を確認＝正式完了）

### STATE（状態表示）

* [ ] STATE-01 一覧系画面へのListStateView適用（`30` §9）。依存：UI-02・NOTES-03（部分適用済み：ホーム＝バッチ2・メモ管理一覧＝バッチ3・現場適応入口の再開メモ表示＝バッチ4・さくっとメモ詳細/編集の読み込み状態＝バッチ6B-2・**記録確認詳細/編集の読み込み状態＝最終統合バッチ（2026-07-15。loading/load-error/not-foundを区別。`30` §8.7）**。プロンプト集の検索結果等が残るため全体は未完了のまま）
* [ ] STATE-02 エラー表示（再試行導線・データ非消失の明示）。依存：STATE-01（部分適用済み：ホーム・メモ管理一覧・現場適応入口・さくっとメモ詳細/編集に接続済み。**記録確認詳細/編集も最終統合バッチでerror＋再試行を接続。Web全体回帰（`30` §8.8）で not-found（「メモが見つかりません」）に加え、`getFirstAsync` 注入による読み込み失敗（例外）表示＋再試行復旧を詳細・編集とも実確認（編集は空フォーム非表示・戻る維持も確認）**。実機確認は未実施のため全体は未完了のまま）
* [ ] STATE-03 操作結果表示（保存・コピーの成功／失敗を文字で）。依存：UI-02（部分適用済み：プロンプト集＝バッチ5・さくっとメモ保存失敗通知＝バッチ6B-2。**最終統合バッチ（2026-07-15）でコピー成功/失敗の文字表示を共通hook `useCopyFeedback` へ集約〔memo詳細本文/notes詳細本文・プロンプト/NoteFormプロンプト/現場適応コピー〕、現場適応の保存成功/失敗表示も維持（`30` §8.7）**。コピー結果のStatusMessage統一までは行わない〔現行の文字表示方式を維持〕ため全体は未完了のまま）
* [ ] STATE-04 二重操作防止（saving / copying 中のdisabled）。依存：STATE-03（部分適用済み：プロンプト集＝バッチ5。**最終統合バッチ（2026-07-15）でコピー中disabled〔`useCopyFeedback` の copying＋`accessibilityState.disabled`〕・現場適応の保存中disabled〔saveState='saving'〕・結果タイマーのクリーンアップ〔古いタイマー解除・アンマウント時解除〕を追加（memo詳細・notes詳細・NoteForm・WorkplaceSceneForm。`30` §8.7）**。ヘッドレスChromeで**現場適応の保存連続クリック→「保存しました」＋保存ボタン `aria-disabled=true`（二重実行なし）**・**コピー連続クリック非クラッシュ**を実確認（`30` §8.7）。コピー成功中disabledの成功パスはヘッドレスのclipboard拒否で未再現のため全体は未完了のまま）

### A11Y（アクセシビリティ）

* [ ] A11Y-01 主要操作のタッチ領域44相当（`29` §3.5）。部分適用済み：**最終統合バッチ（2026-07-15）で入力/詳細/編集/現場適応/設定の主要ボタンへ `minHeight:44`、chip・小ボタンへ `hitSlop` で44相当（外観は維持。`30` §8.7）**。実機での指タップ確認は未実施のため全体は未完了のまま
* [ ] A11Y-02 accessibility属性の付与（role / label / hint / state。`29` §8）。部分適用済み：プロンプト集＝バッチ5。**最終統合バッチ（2026-07-15）で保存/キャンセル/編集/削除/アーカイブ/書き出し/コピー/整理/GitHubアップロード/トークン削除/再試行へ role・label・state（disabled/busy）、結果ボタンへ `accessibilityLiveRegion`、見出しへ header を付与（`30` §8.7）**。**TalkBack実機読み上げは APK確認3（2026-07-15 versionCode 7）でも実施せず＝発表後へ延期（`30` §12.1）**。全体は未完了のまま
* [ ] A11Y-03 色以外の状態表現の確認（`29` §3.1ルール）。部分適用済み：**最終統合バッチ（2026-07-15）でCategorySelector・NoteFormのchipへ `accessibilityState.selected`、無効操作へ `accessibilityState.disabled` を付与（色だけで選択・無効を伝えない。`30` §8.7）**。全画面横断確認は未完了のまま
* [ ] A11Y-04 文字拡大の確認（`30` §11）。部分：最終統合バッチはレイアウト無変更をコードレビューで確認（`30` §8.7）、Web全体回帰でページズーム1.5の崩れなしを実確認（`30` §8.8）。**ただし APK確認3（2026-07-15 versionCode 7）で、端末の最大フォントサイズにすると画面が縦に引き伸ばされ一部画面で下側が見切れる既知課題を確認（発表支障なし・発表後の改善課題として保留。合格にしない。`30` §12.1・`11` §16）**。全体は未完了のまま

### VISUAL（視覚仕上げ）

* [ ] VISUAL-01 カード階層（主要／通常／補助の区別）
* [ ] VISUAL-02 見出し階層（ページ／セクション／カード／補助文。`29` §3.3）
* [ ] VISUAL-03 アイコンの再判断（`29` §9。依存追加は事前承認必須）
* [ ] VISUAL-04 過剰装飾の抑制確認

### TEST（検証）

* [ ] TEST-01 各タスク終了時の静的確認（tsc / diff --check / status。`30` §16）※各タスクに随時
* [ ] TEST-02 Web回帰（幅別・状態別・直アクセス・再読み込み・Console 0件。`30` §5・Gate 5）
* [ ] TEST-03 Android実機確認（APK確認1＝共通基盤＋ホーム＋4画面後／APK確認2＝全体完成後。`30` §12）。APK確認1＝versionCode 5で2026-07-14実施済み（大きな問題なし）。APK確認2＝versionCode 6で2026-07-14実施済み（バッチ2ホーム再構成＋DETAIL-01の範囲・すべて問題なし。`30` §12.1）。ただしTalkBack・文字サイズ最大・§13回帰網羅などGate 6最終項目は未実施のためタスクとしては未完了のまま
* [ ] TEST-04 既存機能の回帰確認（`30` §13）

### REVIEW（再評価）

* [ ] REVIEW-01 4視点再評価（プロダクト／技術／UI・UX／品質・セキュリティ。Gate 7）
* [ ] REVIEW-02 UX-01〜UX-16の判定確定（`30` §14の表を更新）

### Phase 15実装前の基準確認（ユーザー実施待ち）

* [x] versionCode 4 APKの実機確認（ホーム2×2・/notes上部余白・Safe Area・戻る操作・ステータスバー・横方向表示・既存機能。`30` §12.2。**完了までAppHeader実装・ホーム再構成に着手しない**）（2026-07-13完了・7項目とも問題なし＝`30` §12.2。チェック反映漏れを2026-07-14に修正）

今回の非対象（境界固定）：DB・保存ロジック・既存ルート・守秘既定・GitHub連携・公開/家族/配布区分・依存関係・app.json・eas.json（`28` §14）。
