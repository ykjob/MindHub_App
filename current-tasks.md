# Current Tasks

## 現在のフェーズ

* Phase 0〜7 一括実装完了（実験的一括実装）→ 動作確認・レビュー待ち
* 追加仕様（カテゴリ・テンプレートDB管理／スマホ閲覧用HTML/JSON等）の仕様書統合完了（2026-07-06）→ Phase 8以降の実装は未着手・着手判断待ち
* 端末別運用方針の決定・仕様書反映完了（2026-07-06）：自分用Android APK版（Phase 12）＋家族用iPhone Web閲覧版（Phase 10で対応、アプリ配布なし）。自動同期は対象外
* 配布・共有方針の決定・仕様書反映完了（2026-07-06）：自分用（完全版）・家族用（見せてよい情報のみ）・配布用（別リポジトリ、汎用データのみ）の三区分
* 運用方針の詳細確定・仕様書反映完了（2026-07-06）：EASクラウドビルド採用、SDK 54継続、家族用情報は公開Pagesに出さない、familyカテゴリ追加、配布物はWeb/PWA・JSON・説明書優先、プロンプト集HTMLはコード固定定義から先行生成

## 現在の目的

MindHub_Appのメモ管理機能拡張について、

1. Phase 0〜7実装分のユーザーによる実機（ブラウザ）確認と、commit判断待ち
2. 追加仕様（docs/memo-app/12〜15）の実装着手判断待ち

## 完了したこと

### 配布・実機運用前の土台整備（2026-07-07、未push）

* familyカテゴリ・visibility=family値をコード反映（noteTypes / noteCategories / chatgptPrompts。DBマイグレーション不要。作成・編集画面に自動表示）。公開Pages出力可否判定 mobileViewPolicy.ts を先行実装（Phase 10で使用予定）
* EASビルド準備：eas.json新規（preview / internal / APK）、app.jsonにandroid.package（com.ykjob.flowdock仮置き）とversionCode追加。eas build実行・loginはユーザー操作待ち
* APK初版の機能範囲・確認チェックリストを16 §2.5に整理（現行機能のみ。既知の制約：アプリ内コピーとMarkdown書き出しはWeb専用実装のためAPKでは動かない想定）
* JSONインポート仕様を18-json-import-export.mdとして具体化（形式・schemaVersion・重複ID処理・件数表示・責務分担。実装は未着手）
* prompts.html軽微改善：セクション件数・絞り込み中の表示件数・familyカテゴリカード追加（計42本）
* 検証：tsc / expo export / expo config / 生成HTML構造チェックすべて合格

### プロンプト集への追加31プロンプト実装（2026-07-06、push済み）

* src/features/notes/mobilePrompts.ts 新規作成（データ専用モジュール。アプリ画面からはimportしない）。不足5本＋追加26本の計31本を定義
* prompts.htmlを7セクション・41プロンプト構成に拡張（メモ整理カテゴリ別10／タスク・予定整理4／開発・AI作業8／思考整理・行動化5／就活5／生活・家庭共有5／投資・検証4）
* 生活・家庭共有系5本に「private / family用」バッジ＋公開Pagesに載せない前提の注記を追加。本文に個人情報・家庭内情報は含めていない
* 今回見送り：Claude Code報告確認・リポジトリ状況整理・検証結果レビュー
* 検証：生成成功・構造検証合格・tsc / Web export合格（バンドルにmobilePrompts.tsは含まれずアプリ非影響）。ブラウザ実操作はユーザー確認待ち

### プロンプト集HTML先行生成の実装（2026-07-06、未コミット）

* scripts/generate_prompt_hub.mjs 新規作成。`npm run generate:prompt-hub` で docs/mobile-view/prompts.html を生成（カテゴリ整理プロンプト10個収録）
* データ取得層と描画層を分離し、将来のnote_templates（DB）切替はloadPromptEntries()差し替えのみで対応可能
* 新規ライブラリなし（既存TypeScriptコンパイラAPIを利用）。アプリ本体（app/ / src/）は無変更
* 検証：生成成功・HTML構造検証合格・インラインJS構文合格・tsc / Web export合格。ブラウザとスマホでの実操作確認はユーザー確認待ち
* 14 §1.3の不足5プロンプト（時間帯別タスク化・Googleタスク整形・カレンダー整形・優先順位整理・Codexレビュー依頼）は本文未作成のため後続対応

### 端末別運用方針の決定・仕様書反映（2026-07-06）

* 方針決定：自分（Android）はAndroid APK版をアプリとしてインストールして使う（メモ作成・編集・テンプレート管理・JSONインポート・オフライン利用の確認）。家族（iPhone）は編集・管理をしない想定のため、アプリ配布・EAS iOSビルドは行わず、閲覧専用Webページ（スマホ閲覧用HTML/JSON）で確認してもらう。PC/Android/iPhone間の自動同期は今回の対象外
* docs/memo-app/16-platform-and-distribution.md を新規作成
* 既存ドキュメントへ反映：01（追加決定事項1.3）、09（Phase 12=Android APK版を追加、将来拡張はPhase 13へ）、10（Phase 12タスク追加）、11（12章：ビルド方式・SDKバージョン・JSONインポート仕様等の未確定事項）、13（家族iPhone閲覧が主用途の追記）、15（iPhoneアプリ配布を不採用に追加）、00_START_HERE.md、CLAUDE.md
* 実装は未着手（ドキュメントのみ）。ビルド方式・JSONインポート仕様などは11-open-issues.md 12章で確認待ち

### 運用方針の詳細確定・仕様書反映（2026-07-06）

ユーザー決定7項目をドキュメントへ反映した。

* APKビルド方式：初回はEASクラウドビルド（preview / internal distribution / APK形式）。ローカルビルドは環境整備が重いため後回し（16 §2.3）
* SDKバージョン：SDK 54を正式採用候補のまま進める。SDK 56固有機能が必要になった時に再検討（16 §2.4）
* 家族用ページの公開範囲：家庭内の決まり事・マニュアルは公開GitHub Pagesに置かない。公開Pagesは公開されても困らない内容のみ。家庭内情報の共有手段（非公開配置先・ローカルHTML・PDF・JSONインポート・private向けPWA）は別途検討（17 §4.1、13 §6.2）
* familyカテゴリ追加。公開可否はカテゴリ＋visibility併用で判定し、category=familyでもvisibility=private / familyは公開しない。visibilityにfamily値を追加（04 §1.1、03、13 §3.2〜3.3、17 §4.2）
* 配布用は別リポジトリで決定。汎用テンプレート・汎用知識データ・サンプルデータ・説明書のみ（17 §5）
* 配布物の範囲：Web/PWA・JSON・説明書を優先。配布用APK・ソース公開は将来候補（17 §5.5）
* プロンプト集HTML生成方式：短期はコード固定プロンプト定義（chatgptPrompts.ts）からdocs配下へ生成、note_templates実装後にDBへ切替（14 §1.6）。Phase 11はPhase 8〜9に依存せず先行着手可能になった
* 11-open-issues.md の10・12・13章を決定済み／残る未確定に整理。09 / 10のPhase 11・12を更新

### 配布・共有方針の決定・仕様書反映（2026-07-06）

* 三区分を決定：自分用＝完全版（Android APK版。私的メモ・家族用データ・家庭内の決まり事・個人的知識を含めてよい）／家族用＝Web閲覧のみ（家族間の決まり事・家庭内マニュアル・共有したい情報。自分用データから見せてよい情報だけを出力）／配布用＝別リポジトリ（汎用知識データ・汎用テンプレート・サンプルデータ・説明書のみ。個人情報・家族情報・私的メモは含めない。完全版をそのまま渡さない）
* ディレクトリ分離ではなく別リポジトリ分離を採用（更新の手間より情報混入リスク低減を優先）。配布用データエクスポート機能は将来候補
* docs/memo-app/17-distribution-and-sharing.md を新規作成。01 / 09 / 11 / 13 / 15 / 16、00_START_HERE.md、CLAUDE.mdへ反映
* 未確定事項は11-open-issues.md 13章に記録（家族用情報の配置先と公開範囲の整合、家族向けカテゴリ設計、配布用リポジトリの名称・構成・タイミング、配布物の形）

### スマホ実機の保存不具合修正（2026-07-06、check-expo-sdk54ブランチ・未コミット）

* 保存無反応の根本原因を特定：`generateId()` がWeb専用 `crypto.randomUUID()` を使用し、iPhoneのHermesで例外→空catchで無反応化。expo-crypto導入で修正（既存memo作成の同一不具合も同時に解消）
* NoteFormにkeyboardShouldPersistTaps追加（1タップ目が反応しない問題の修正）
* 実機確認で保存成功を確認。キーボード回避はKAV・JSイベントpadding方式とも実機で効かず、InputAccessoryView方式に変更
* 実機切り分け（notes編集○／notes作成×／FlowDock×）を受け、共通のFormFooterBar（遷移完了後にキーボード直上バーをマウント）を新設し、notes作成・編集＋FlowDockのmemo作成・編集の全4画面に適用。保存ボタンは全画面で左下配置に統一
* 最終実機確認：notes編集○／FlowDock作成・編集○。**メモ管理の新規作成画面とAndroid全画面は未改善だが今回は許容として完了扱い**（2026-07-06、将来の改善候補）
* notes作成・編集画面の保存失敗時にエラー表示を追加
* キーボード回避（再修正後）と「再起動後も残る」の実機確認はユーザー確認待ち

### Expo SDK 54ダウングレード調査（2026-07-06）

* iPhone Expo Go 54.0.2対応のためのSDK 56→54ダウングレード影響調査
* 調査用ブランチ `check-expo-sdk54` で expo@~54.0.0 ＋ expo install --fix を実施しコミット済み（mainは無変更、マージ・pushなし）
* 変更は package.json / package-lock.json / tsconfig.json のみ。アプリコードの修正は不要
* SDK 54構成で expo-doctor 18/18・tsc・Webエクスポート（wa-sqlite含む）すべて合格
* 詳細は docs/worklog/current.md 参照。SDK 54採用可否はユーザー判断待ち

### Phase 0〜7（2026-07-03）

* 分割仕様書の配置（docs/memo-app/00〜11）
* CLAUDE.md / 00_START_HERE.md / current-tasks.md / docs/worklog/current.md 整備
* notesテーブル追加（schema v2、既存memosテーブルは無変更）
* メモ作成・一覧・詳細・編集・アーカイブ（/notes 系画面）
* カテゴリ（10種）・プロジェクト・タグ・source・visibility・Git候補フラグ
* Markdownプレビュー（自作軽量レンダラー）
* ChatGPT整理プロンプトコピー（全10カテゴリ）
* 検索・絞り込み・並び替え
* Markdown書き出し（ブラウザダウンロード方式＋export_path/exported_at記録）
* scripts/export_git_notes.py 土台
* Web実行対応（react-native-web導入、metro.config.js）

### 追加仕様の仕様書統合（2026-07-06）

* 追加仕様書4ファイル作成（docs/memo-app/12〜15）
* 既存仕様書への追記（01 / 03 / 05 / 06 / 07 / 09 / 10 / 11、00_START_HERE.md、CLAUDE.md）
* ロードマップ再整理（Phase 8〜11を追加仕様に割り当て、旧Phase 8ダッシュボードは将来候補へ）
* 実装は未着手（仕様書のみ）

## 次にやること

1. `npx expo start --web` でブラウザ動作確認（メモ作成→一覧→詳細→編集→アーカイブ）
2. ChatGPT整理プロンプトコピーとMarkdown書き出しの実動確認
3. 未コミット分のcommitと、check-expo-sdk54ブランチのmainマージ判断（ユーザー判断）
4. 次の実装候補から着手対象を選ぶ（ユーザー判断）
   * Phase 11先行分：コード固定プロンプト定義からのプロンプト集HTML生成（依存なし・すぐ着手可）
   * familyカテゴリ・visibility=family値のコード定義への先行追加（小規模）
   * Phase 12：EASビルド準備（EASアカウント・eas.json・app.json整備。Expoアカウントログインが必要）
   * Phase 8：カテゴリ・テンプレートDB管理（schema v3）

## 未完了事項

* ブラウザでの手動動作確認（起動とバンドルのコンパイルまでは確認済み）
* Web版DBファイルへのPythonスクリプトアクセス手段（Phase 7残タスク。スマホ閲覧用HTML/JSON出力とも共通の課題）
* Phase 8〜11（追加仕様）の実装
* Phase 12（Android APK版ビルド・JSONインポート）の実装

## 確認待ち

決定済み（2026-07-06）：SDK 54継続（正式採用候補）、APKはEASクラウドビルド（preview / internal / APK）、家庭内情報は公開Pagesに出さない、familyカテゴリ追加（visibility併用判定）、配布用は別リポジトリ（Web/PWA・JSON・説明書優先）、プロンプト集HTMLはコード固定定義から先行生成。

残る確認待ち。

* EASアカウント準備（`npx eas-cli login`・`eas build:configure`。ユーザー操作）。※Androidパッケージ名は com.ykjob.mindhub で確定済み（2026-07-07）
* 既存memosデータをnotesへ統合するか（docs/memo-app/11-open-issues.md 参照）
* File System Access APIによるフォルダ指定書き出し対応の要否
* note_categories / note_templates の実装タイミング（11-open-issues.md 9章）
* スマホ閲覧HTMLの生成方式・notes-data.json形式・GitHub Pages配置方法（11-open-issues.md 10章）
* JSONインポートの実装時期とファイル選択の依存導入判断（18-json-import-export.md §7）
* 家庭内情報の共有手段をどれから着手するか、配布用リポジトリの名称・構成・作成タイミング（11-open-issues.md 13章）

## 後回し・将来候補（詳細：docs/memo-app/15-future-and-rejected-policies.md）

* クラウド同期・Supabase同期（PC/Android/iPhone間の自動同期は今回の対象外）
* OpenAI API連携
* ChatGPT共有受け取り
* ダッシュボード化（旧Phase 8）
* ワンコマンド更新スクリプト
* カテゴリ自由追加、テンプレートのエクスポート・インポート
* mobile-inboxのGitHub連携
* 配布用データエクスポート機能（当面は配布用リポジトリの中身を手動選別）

## 不採用（詳細：docs/memo-app/15-future-and-rejected-policies.md）

* アプリ内GitHub自動push
* Codexによる日常的なスマホ入力取り込み
* スマホからSQLite直接共有
* iPhone向けアプリ配布・EAS iOSビルド（家族は閲覧専用Webページで対応。2026-07-06）
