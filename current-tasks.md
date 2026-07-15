# Current Tasks

## 現在のフェーズ

* **現場適応フォームのキーボード下部余白の局所修正（2026-07-15、未コミット）**：Android実機不具合＝現場適応モードの入力画面（`WorkplaceSceneForm`）でキーボード表示中に下側入力欄が隠れ下まで十分スクロールできない（特に `/workplace/stuck` の後半フィールド）。修正は**共通コンポーネント `src/components/WorkplaceSceneForm.tsx` の1か所のみ**：`Keyboard` の `keyboardDidShow`/`keyboardDidHide` を購読して `keyboardHeight` を保持（アンマウント時に両subscription `remove()`）、`contentContainerStyle` を配列化し表示中だけ `paddingBottom: 40 + keyboardHeight`（非表示時は40のまま・二重加算しない）、`keyboardDismissMode="on-drag"` 追加。`KeyboardAvoidingView` 置換・`app.json` 変更・固定大余白・画面別重複実装はしない。入力項目・保存内容・タグ・private/Git候補外・ルートは無変更。tsc合格・`expo export`（web）成功・`git diff --check`問題なし。**Web回帰**＝ヘッドレスChrome（専用ポート8114・他スレッド無停止）で現場適応5画面**21項目すべて合格・console.error/pageerror/unhandledrejection 0**（Webは `keyboardHeight` 常に0＝下部余白40のまま・表示変化なし）。**Android実機／エミュレータは本セッションで利用できず、キーボード回避の必須確認1〜10は未確認**（イベントはネイティブのみ発火。最終Android実機確認へ残す）。**commit・push・versionCode更新・EASビルドは未実施**。記録：`30` §8.9・`11` §16・`docs/worklog/current.md`・`current-tasks.md`
* **Phase 15最終APK（versionCode 7）Android実機確認（2026-07-15、文書のみ・commit/push対象）**：最終APK（versionCode 7・対象コミット `78aeba8`・build ID `e0352c88-4440-4117-a446-568c9e4cf96e`・profile `preview`・APK URL https://expo.dev/artifacts/eas/MjW6FN4_bMx_9nUf2F7xzwPxne3gSAm12CJ3TgXwqU0.apk 期限2026-07-28）をユーザーがAndroid実機で確認。**確認済み（発表可能）＝通常の文字サイズでは実機利用に支障なし**。**既知課題（合格にしない）＝最大フォントサイズで画面が縦に引き伸ばされ一部画面の下側が見切れる（発表支障なし・発表後の改善課題として保留）**。**延期＝TalkBackは発表後へ**。**未確認＝コピー成功経路（「コピーしました」表示・クリップボード内容一致）／GitHub実通信（完成扱いにしない）**。**Gate 6・Gate 7は完全合格・完了扱いにしない**（TalkBack未確認＋最大フォント見切れ）。通常文字サイズでの発表可能性とアクセシビリティ未完了課題は分けて記載。今回は**文書のみ**（実装・UI・app.json・versionCode・eas.json・package.json・DB・依存・ルート無変更、EAS再ビルド・APK再作成なし、最大フォント修正・TalkBack代行確認なし）。記録先：`30` §12.1（APK確認3）・§15（Gate 6/7）・`28` §16・`10` §20・`11` §16・`docs/worklog/current.md`・`current-tasks.md`
* **Phase 15 Web全体回帰（2026-07-15、未コミット）**：最終統合実装バッチのcommit前に、前回未確認・結果未明示だった機能経路をまとめて補完。他スレッド無干渉（専用ポート8114・使い捨てブラウザ内DB・puppeteerはリポジトリ外scratchpad隔離・8081/8082無停止・repo無汚染）。読み込み/保存失敗は確認用ハーネスがReact fiber経由でlive DBの `getFirstAsync`／`runAsync` をテスト中だけ一時差し替えて再現（本番コード・DBは恒久変更なし）。**79項目すべて合格・不合格0・console.error 0・console.warn 0・pageerror 0・unhandledrejection 0**。新規確認＝記録確認の一覧/作成/詳細/編集反映/絞り込み（一致・filtered-empty・リセット）/アーカイブ確認→バッジ→解除/not-found/**詳細の読み込み失敗＋再試行**/**編集の読み込み失敗＋再試行（空フォーム非表示・戻る維持）**、さくっとメモの**保存失敗（alert・入力維持・ボタン再活性）→再保存成功**/not-found/**削除（confirm→ホーム）**、現場適応の入口→5画面導線/**終業前メモの保存失敗→再保存成功→保存済みで `aria-disabled=true`**/コピー専用画面は保存ボタン非存在＋コピー失敗表示→既定復帰＋**コピー直後の画面移動でunhandledrejectionなし**、ホーム2×2/プロンプト集chip/設定（未設定表示・トークン行崩れなし）、**Web戻る12画面×（直アクセス＋再読み込み）＝24件fallback正常・Unmatched/空白なし**、**ページズーム1.5で6画面横スクロールなし＋戻る/タイトル非重なり**。**環境制約により未確認＝コピー成功経路のみ**（ヘッドレスの `clipboard.writeText` 拒否。失敗表示・二重操作防止・タイマー復帰・エラーなしは確認済み。通常ブラウザ/実機で要確認）。**未確認＝Android実機・TalkBack・文字サイズ最大（Gate 6/7）・GitHub実通信（対象外）**。不具合0のため**実装コード変更なし**（記録確認に削除UIは無くアーカイブのみ＝仕様どおり）。tsc合格・`expo export`（web）成功・`git diff --check`問題なし。**commit・push・versionCode変更・EAS/APKビルドは未実施**。文書のみ更新：`30` §8.8・`28` §16・`10` §20・`11` §16・`current-tasks.md`・`docs/worklog/current.md`
* **Phase 15最終統合実装バッチ（2026-07-15、未コミット）**：残っていた実装項目を1バッチで実装。(1) **記録確認詳細/編集の読み込み状態**（`app/notes/[id]/index.tsx`・`app/notes/[id]/edit.tsx`）＝さくっとメモ（バッチ6B-2）と同じ loading／load-error＋再試行（reloadKey）／not-found（「メモが見つかりません」）／loaded を区別。詳細はuseFocusEffect＋activeフラグ、編集はuseEffect＋activeフラグ。**読み込み例外でローディング固着しない**・load-errorとnot-foundを別表示・編集はnot-foundで空フォームを出さない（loaded時のみ `NoteForm` 描画）・各状態で動的Web戻る（`Stack.Screen headerLeft`＝`/notes/${id}` fallback）維持。アーカイブ/書き出し後の再取得は非致命 `reloadNote`（catch内包）。既存のアーカイブ/書き出し/本文コピー/プロンプトコピー/編集導線は無変更 (2) **現場適応の保存中二重実行防止**（`src/components/WorkplaceSceneForm.tsx`）＝`savingRef`＋`saveState='saving'` で `await onSave` 中はボタンdisabled・二重実行しない。保存成功/失敗の既存表示維持・失敗後は再保存可・失敗タイマーはrefで保持しアンマウント解除。**コピー専用4画面（onSave未指定）へ保存処理は追加しない**。ルート・保存内容・タグ・private・Git候補外は不変 (3) **コピー二重実行防止＋結果タイマーのクリーンアップ**＝共通hook `src/hooks/useCopyFeedback.ts`（新規）を新設し、`app/memo/[id]/index.tsx`・`app/notes/[id]/index.tsx`・`NoteForm.tsx`・`WorkplaceSceneForm.tsx` へ適用。copying中は再実行無視＋ボタンdisabled／`accessibilityState.disabled`・タイマーID保持で古いタイマー解除・アンマウント時解除・アンマウント後setStateなし。成功/失敗の文字表示・時間（本文2000/2500ms・現場適応2000/2000ms・プロンプトは失敗時のみダイアログ）は従来維持。**プロンプト集（copyingId）は無変更** (4) **FormFooterBar下部Safe Area**（`src/components/FormFooterBar.tsx`）＝`useSafeAreaInsets()` で**通常フッターのみ** `paddingBottom=12+insets.bottom`。iOSのInputAccessoryViewへは加算せず、Webは `insets.bottom=0` で従来表示。`InputAccessoryView`/`InteractionManager`/フォーカスは不変 (5) **A11Y属性・44相当タッチ領域・selected/disabled**＝保存/キャンセル/編集/削除/アーカイブ/書き出し/コピー/整理/GitHubアップロード/トークン削除/再試行へ role・label・state（disabled/busy）・結果ボタンへliveRegion・見出しへheader。chipへ `accessibilityState.selected`。主要ボタンへ `minHeight:44`、chip/小ボタンは外観を変えず `hitSlop` で44相当（過度に大きくしない）。変更ファイル：上記＋`CategorySelector.tsx`・`app/memo/create.tsx`・`app/memo/[id]/edit.tsx`・`app/settings.tsx`。tsc合格・`git diff --check`問題なし・`npx expo export --platform web` 成功（796モジュール・バンドルエラー0件）。**対話的Web確認（ヘッドレスChrome、専用ポート8114・使い捨てブラウザ内DB・puppeteerはリポジトリ外scratchpad隔離＝他スレッド無停止）実施＝89項目中85合格・コンソールエラー0件**（6幅×12ルートの横スクロールなし72件／さくっとメモ作成→保存→詳細→編集→更新反映・不正IDで「見つかりません」／記録確認NoteForm作成→保存→詳細・アーカイブ確認ダイアログ→バッジ／現場適応の保存連続クリック→「保存しました」＋`aria-disabled=true`＝二重実行なし／コピー連続クリック非クラッシュ／stuckは保存ボタン非存在）。**失敗4件はヘッドレスChromeの `clipboard.writeText` 拒否による環境制約**（コピー成功パス再現不可＝バッチ5と同じ既知事象。アプリは失敗パス「コピーできませんでした」を正しく表示し約2.5秒後に既定ラベルへ戻る＝`useCopyFeedback` の失敗分岐・タイマー解除が機能。コード欠陥ではない）。VISUAL（文字拡大）はコードレビュー＝本バッチはAppHeader/戻るボタン/ホーム2×2/フィルター/プロンプトchip/現場適応ラベルのレイアウトを変更しておらず新たな崩れは持ち込んでいない。**コピー成功パスの文字表示・クリップボード内容一致は通常ブラウザ/実機で要確認。STATE-03/04・A11Y・VISUAL全体完了扱いにしない。Android実機・TalkBack・文字サイズ最大は未確認。Gate 6・Gate 7未完了**。**commit・push・versionCode変更・EAS/APKビルドは未実施**。変更ファイル：`app/notes/[id]/index.tsx`・`app/notes/[id]/edit.tsx`・`app/memo/[id]/index.tsx`・`app/memo/create.tsx`・`app/memo/[id]/edit.tsx`・`app/settings.tsx`・`src/components/WorkplaceSceneForm.tsx`・`src/components/NoteForm.tsx`・`src/components/CategorySelector.tsx`・`src/components/FormFooterBar.tsx`・`src/hooks/useCopyFeedback.ts`（新規）＋文書（`30` §8.7・`28` §16・`11` §16・`10` §20・`current-tasks.md`・`docs/worklog/current.md`）
* **Phase 15 バッチ6B-2：さくっとメモの読み込み・保存状態処理（2026-07-15、未コミット）**：さくっとメモ3画面（`app/memo/create.tsx`・`app/memo/[id]/index.tsx`・`app/memo/[id]/edit.tsx`）の状態処理を実装。(1) 作成・編集の**保存失敗の無反応を解消**：`handleSave` の catch で `showMessage('保存できませんでした', error instanceof Error ? error.message : String(error))`（notes系と同形式）＋`setSaving(false)`＋saving中は再実行しない。保存本体（`createMemo`/`updateMemo`）・成功時遷移（作成→`router.replace('/memo/${id}')`、編集→`router.back()`）は無変更。**保存失敗時も入力本文・カテゴリを維持**し再保存可能 (2) 詳細・編集の**読み込み失敗と該当なしを分離**：`getMemoById` の例外を握りつぶさず、loading／load-error（`ListStateView status="error"`＋再試行＝reloadKey）／not-found（取得成功・null＝`ListStateView status="empty" emptyMessage="メモが見つかりません"`）／loaded を区別。詳細はuseFocusEffect＋activeフラグ、編集はuseEffect＋activeフラグでアンマウント後のstate更新を防止。**編集の該当なしで空フォームを表示しない**（notFound）。**編集の動的Web戻るボタン（`Stack.Screen headerLeft`）を全状態（loading/error/not-found/フォーム）で維持** (3) 詳細のGitHubアップロード後再取得を `reloadMemo`（catch内包・失敗しても未処理rejectionを出さず画面全体を落とさない）に整理。`memoRepository`・`memoService`・保存/取得本体・`ListStateView` 本体・`dialog.ts`・ルート・DBは無変更。tsc合格・`git diff --check`問題なし・ヘッドレスChrome：正常系＋該当なし＋6幅**44項目**＋`getMemoById`/`runAsync` の実例外注入**29項目**すべて合格・コンソールエラー0件（注入由来除く）。例外はテスト時に live DBの1メソッドを一時差し替えて再現（本番コードに失敗分岐なし。`30` §8.6.2）。STATE-01/02は今回さくっとメモ詳細/編集へ部分適用、STATE-03はさくっとメモ保存失敗通知へ部分適用（**STATE-03/04全体は未完了**）。コピー中状態・現場適応二重保存・Safe Area bottom・アクセシビリティ横断・記録確認/プロンプト集は非対象。**Android実機・TalkBack・文字サイズ最大は未確認。Gate 6は未完了**。**commit・push・versionCode変更・EASビルドは未実施**。変更ファイル：`app/memo/create.tsx`・`app/memo/[id]/index.tsx`・`app/memo/[id]/edit.tsx`＋文書（`10` §20 STATE-01〜03・`28` §16 UX-13・`30` §8.6.2・§8.5.3・`11` §16・`current-tasks.md`・`docs/worklog/current.md`）
* **Phase 15 バッチ6B-1：確認ダイアログのWeb対応（2026-07-15、未コミット）**：確認ダイアログの2実装（`src/utils/dialog.ts` の `confirmDialog`＝Web対応／`src/components/ConfirmDialog.tsx` の `showConfirmDialog`＝`Alert.alert` 直接）を整理。**さくっとメモ詳細（`app/memo/[id]/index.tsx`）の削除確認**が `showConfirmDialog` 経由でWeb機能不全だったのを解消。(1) `dialog.ts` を確認ダイアログの正本にし `cancelLabel` を追加（Web=`window.confirm`／Android・iOS=`Alert.alert` で `style='cancel'`/`'destructive'`・確認押下時のみ`onConfirm`） (2) `ConfirmDialog.tsx` は `showConfirmDialog` のAPI・引数を維持したまま `confirmDialog` へ委譲する薄い互換ラッパーへ（ファイル削除・名称変更・大規模リファクタなし。memo削除の呼び出し側は無変更でWeb対応） (3) 設定画面（`app/settings.tsx`）のGitHubトークン削除の複数ボタン`Alert.alert`を `confirmDialog` へ統一（単一ボタンの保存成功/失敗Alertは維持）。**WebのGitHubトークン保存対応・SecureStore・`githubTokenStore.ts`・トークン入力/設定保存仕様は無変更**（WebはgetToken/saveToken/deleteToken無効＝トークン削除ボタン自体が非表示のため、Web実害は主にメモ削除側）。制約：`window.confirm` はボタン文言を変更できず `confirmLabel`/`cancelLabel` はWebでは反映されない（title・messageのみ。コード・`29` §12に明記）。tsc合格・`git diff --check`問題なし・ヘッドレスChrome（実データ・`window.confirm`捕捉）**16項目すべて合格・コンソールエラー0件**（`30` §8.6.1。削除の確認/キャンセル両経路・`window.confirm`にtitle+本文・設定画面の通常表示と削除ボタン非表示）。**Android/iOSのAlert経路はコード確認のみ＝実機・TalkBackは最終APK**。読み込み例外・保存/コピー状態・Safe Area bottom・a11y横断は本バッチ非対象（後続）。**Android実機・TalkBack・文字サイズ最大は未確認。STATE/A11Y/HEADER-02全体は未完了扱いのまま**。**commit・push・versionCode変更・EASビルドは未実施**。変更ファイル：`src/utils/dialog.ts`・`src/components/ConfirmDialog.tsx`・`app/settings.tsx`＋文書（`11` §16・`29` §12・`30` §8.6.1・§10・`current-tasks.md`・`docs/worklog/current.md`）
* **Phase 15 バッチ6A補足：詳細・編集4画面のWeb戻るボタン（2026-07-14、未コミット）**：横断調査（バッチ6A）で「履歴経由が主で影響限定的」と評価した `/memo/[id]`・`/memo/[id]/edit`・`/notes/[id]`・`/notes/[id]/edit` を再確認したところ、当初8画面と同じネイティブStackヘッダーのマスク画像戻るボタンで、**履歴あり遷移でも視認性不安定・直アクセス時は戻るボタン未描画（行き止まり）を再現**（実データ作成→ホーム→詳細→編集の履歴経路＋実在IDの直アクセスで確認）＝**判定A**。既に8画面を修正した方針との整合から4画面も修正し、`NativeHeaderBackButton` 対象は**計12画面**。fallback：詳細＝静的（memo/[id]→ホーム、notes/[id]→`/notes`。`_layout.tsx` の `headerLeft`）／編集＝対応する詳細への動的ID（memo/[id]/edit→`/memo/${id}`、notes/[id]/edit→`/notes/${id}`。各画面内 `<Stack.Screen options>`＋`useLocalSearchParams`）。タイトル（メモ詳細／メモ編集）は不変・既存8画面は無変更。tsc合格・`git diff --check`問題なし・ヘッドレスChrome6幅（360〜1024）＋実データ**53項目すべて合格・コンソールエラー0件**（`30` §8.5.3。編集fallbackに正しいID・二重ヘッダーなし・390幅スクリーンショット目視）。**メモ詳細・編集の読み込み例外時にローディングが終わらない可能性は本補足では変更せず後続STATEバッチ対象**（loadMemo・getMemoById・loading/error・保存/コピー/削除/アーカイブは無変更）。**Android実機・TalkBack・文字サイズ最大・HEADER-02全体は未確認のまま完了扱いにしない**。**commit・push・versionCode変更・EASビルドは未実施**。変更ファイル：`app/_layout.tsx`・`app/memo/[id]/edit.tsx`・`app/notes/[id]/edit.tsx`＋文書（`30` §8.5.3・§12.1・`11` §16・`10` §20 HEADER-02・`current-tasks.md`・`docs/worklog/current.md`）
* **Phase 15 画面文言・Webヘッダー修正バッチ（2026-07-14、未コミット）**：ユーザーのブラウザ確認で見つかった画面表示名とWeb戻るボタン表示を修正した独立小バッチ。(1) ホーム主要カード名を さくっとメモ／現場適応／記録確認／プロンプト集 へ（役割説明・表示順・遷移先・2×2・外観は不変）。ホームの軽量メモ表示を「最近のさくっとメモ」「さくっとメモがありません」＋補助文・FAB label「さくっとメモを作成」へ（内部概念・`/memo`・`memos`・`Memo`型・コメントは不変） (2) 記録一覧（`/notes`）のAppHeaderタイトルと `_layout` の document title を「メモ管理」→「記録確認」へ（他遷移先タイトルは不変） (3) 現場適応の場面表示ラベルを「詰まり記録」→「行き詰まり記録」へ（`app/workplace/index.tsx` カード名・区分説明・`_layout` の `workplace/stuck` タイトル・`workplace/stuck` intro。内部 `stuck`・ルート・DBタグ・保存仕様は不変） (4) **Web戻るボタン不可視の修正**：原因はネイティブStackヘッダーのマスク画像戻るボタンで、直アクセス時は未描画。新規 `src/components/NativeHeaderBackButton.tsx`（テキスト「← 戻る」・履歴あれば `back()`／直アクセスは fallback へ `router.replace`）を `headerLeft` として設定。当初3画面＝`/memo/create`（fallbackホーム）・`/notes/create`（`/notes`）・`/settings`（ホーム）。**同日追加：同じ問題が確認された現場適応5入力画面（`/workplace/start`・`/stuck`・`/question`・`/report`・`/end`。fallbackはいずれも `/workplace`）にも適用し `headerLeft` 対象は計8画面**。クエリ付き `/workplace/start?fromRestart=1` のクエリ・初期入力・引き継ぎ・保存/コピー処理は無変更。共通 `screenOptions`・画面内AppHeaderは無変更。この時点では対象外＝`/memo/[id]`・`/memo/[id]/edit`・`/notes/[id]`・`/notes/[id]/edit`（→**その後バッチ6A補足で修正＝計12画面。上記**）。tsc合格・`git diff --check`問題なし・ヘッドレスChrome確認＝当初3画面バッチ62項目（`30` §8.5.1）＋現場適応5画面**133項目すべて合格・コンソールエラー0件**（`30` §8.5.2。5画面の履歴あり/直アクセス/hover/Tabフォーカス/6幅の重なり・切れ・二重ヘッダーなし・fallback、390幅スクリーンショット目視）。**Android実機・TalkBack・文字サイズ最大・HEADER-02全体は未確認のまま完了扱いにしない**（`11` §16）。**commit・push・EASビルド・APK作成・生成スクリプト実行は未実施**。変更ファイル：`app/index.tsx`・`app/notes/index.tsx`・`app/workplace/index.tsx`・`app/workplace/stuck.tsx`・`app/_layout.tsx`（現場適応5画面の `headerLeft` 追加を含む）・`src/components/NativeHeaderBackButton.tsx`（新規）＋文書（`28` §7・§11.1・`30` §8.5.1・§8.5.2・§12.1・`11` §16・`10` §20 HEADER-02・`current-tasks.md`・`docs/worklog/current.md`）
* **Phase 15：UI・UX品質改善（2026-07-13、文書整備段階＝完了・未コミット）**：DOC-02（`28-ui-ux-quality-improvement.md` 作成）／DOC-03（`29-ui-design-system.md` 作成）／DOC-04（`30-ui-validation-checklist.md` 作成）／DOC-05（既存仕様書10ファイルへの反映）／DOC-06（管理ファイル更新）／DOC-07（最終文書監査：AUDIT-01〜18全項目合格）まで**すべて完了。Gate 1（仕様書整備）は完了**（2026-07-13）。タスク全体は `10-tasks.md` §20、監査記録は `docs/worklog/current.md`
* **Phase 15実機基準確認完了（2026-07-13）**：versionCode 4 APKのAndroid実機基準確認7項目（ホーム2×2表示／`/notes` 上部余白／Safe Area／戻る操作／ステータスバーとの重なり／横方向の表示崩れ／既存機能への影響）を**すべて問題なし＝合格**として `30` §12.2 に記録。AppHeader実装の着手条件（`29` §5.4）は解消。追加所見：FlowDockメモ作成画面の保存・キャンセルボタンが画面下端に近い（単独修正せず、Phase 15全体仕上げ時にSafe Area・キーボード挙動・他入力画面との統一を含めて確認。`30` §12.2・`11` §16に記録）
* **Phase 15文書基準点コミット（2026-07-13、コミット済み faaaa94・未push）**：Phase 15文書一式（28・29・30新規＋既存仕様書10ファイル反映＋管理ファイル＋実機基準確認記録）を「docs: finalize phase 15 ui ux specification」としてコミット。実装差分は含まない
* **Phase 15バッチ1実装完了（2026-07-14、未コミット）**：`src/theme/index.ts`（トークン5種）＋共通コンポーネント4種（AppHeader実用状態／FilterChip・ListStateView・StatusMessageは表示基盤のみ・未適用）＋主要4画面（ホーム・メモ管理一覧・現場適応入口・プロンプト集）へAppHeader適用。Safe Area（insets.top）・Web直アクセス戻るフォールバック（履歴なし→ホーム）・ネイティブヘッダー二重表示なしを確認。tsc合格・ヘッドレスブラウザ70項目中68件合格・コンソールエラー0件（残り2件は既知の残課題＝Webタブタイトルが「FlowDock」のままの既存挙動。app.json name由来で今回の退行ではなくUX-04・app.json変更時期の未確定事項に帰属。今回は修正しない）。**実装差分はレビュー用に未コミットのまま**
* **Phase 15バッチ1コミット・push・APK 5回目ビルド完了（2026-07-14）**：バッチ1を `e0bb2bd`、versionCode 4→5を `038173e` でコミットし、文書基準点 `faaaa94` とあわせて3コミットをpush（HEAD=origin/main=038173e）。EAS preview APKビルド成功（build ID：a102e935-1c5c-433b-9556-dd8eb4bfb85b、versionCode 5・SDK 54・gitCommitHash=038173e。APK：https://expo.dev/artifacts/eas/KeFQ3K80dM3Kwpjm9E0vnY8Q4-eubdx4Rifu8edBvy8.apk 期限2026-07-28）。ユーザーの実機確認＝**APK確認1：大きな問題なし**（起動・主要4画面・AppHeader・戻る操作・既存機能に致命的問題なし。2026-07-14に `30` §12.1へ正式記録。UX-01〜16の完了判定は変更せず、最終判定は後続レビュー）
* **DETAIL-01完了（2026-07-14、コミット済み a6b8b20・未push）**：実機確認の追加所見を受け、軽量メモ詳細（`/memo/[id]`）とメモ管理詳細（`/notes/[id]`）へ「本文をコピー」導線を追加。既存 `copyToClipboard` 経由・プロンプトコピーと文言/状態変数を区別・空本文はコピーせず「本文がありません」表示。DB・保存処理・ルート・依存関係・app.json無変更。tsc合格・Webで機能確認済み（26項目中25合格。残り1件はWindowsクリップボード往復のCRLF正規化による比較差＝内容は一致・不具合扱いしない）・コンソールエラー0件・Android実機確認は今回省略
* **APK確認1の保留所見（2026-07-14記録）**：Web表示で戻るボタンが透明または背景同化して見える所見あり（機能は動作しブロッカーではない。HEADER-02／VISUAL／A11Y確認時に視認性・文字色・背景色・hover/pressed状態を確認。`11` §16・`30` §12.1に記録）
* **Phase 15バッチ2前ホームIA判断確定（2026-07-14、文書のみ）**：ユーザー確定のIA判断を正本へ記録。ホーム＝MindHub全体の入口へ再構成（バッチ1適用後の現ホームは暫定状態でバッチ2完了まで完成扱いにしない）／主要カード4件＝すぐメモする（/memo/create）・仕事を整理する（/workplace）・記録を整理する（/notes）・AIの型を使う（/prompts）（この表示順基本・短い役割説明付き）／現場適応モードはホームカード上のみ「仕事を整理する」（正式名称は不変）／最近の軽量メモ＝memosのみ・初期最大3件・ホーム内展開（「すべて表示」→「3件に戻す」等。別ルート追加なし・notes統合なし）／設定は主要カードから外し補助導線（AppHeader右かホーム内補助かはバッチ2実装調査後）／プロンプト集の状況別分類はPROMPT-01前まで保留（バッチ2は既存 /prompts への遷移のみ）／既存FABは維持（カードとの役割重複は実機確認後に評価）／バッチ2はホーム再構成のみ（メモ管理改修はバッチ3）。記録先：`28` §7・§11・§17、`11` §16、`10` §20。実装コード・DB・依存関係・app.jsonは無変更
* **Phase 15バッチ2実装完了（2026-07-14、コミット済み・未push）**：HOME-01〜05を実装。`app/index.tsx` のみ変更し、ホームをMindHub全体の入口へ再構成（旧「メモ一覧」ヘッダー＋4ボタンを廃止）。主要機能カード4件（すぐメモする→/memo/create／仕事を整理する→/workplace／記録を整理する→/notes／AIの型を使う→/prompts）を2×2表示・短い役割説明付き（優先順位は表示順で表現。実装当初の上段左アクセントは誤認回避のため同日削除＝下記）。設定はAppHeader右側の小ボタン（共有AppHeader本体は無変更＝既存rightプロップ利用）。「最近の軽量メモ」＝既存getAllMemosのまま初期3件・「すべて表示」でホーム内展開・「3件に戻す」で復帰（3件以下は切替非表示・別ルート追加なし）。状態表示はListStateView適用（loading/empty/error区別）。FAB維持（下余白96でカバーなし）。tsc合格・6幅（360〜1024）Web確認176項目合格・コンソールエラー0件（記録：`30` §8.1）。**Android実機確認は未実施**（APK確認2で行う）
* **バッチ2修正：ホームカード左アクセント削除（2026-07-14、コミット済み・未push）**：上段2枚のbrand 3px左アクセントが左右バランスを崩し選択状態・特別なステータスに誤認されるため削除し、主要カード4枚を同じ外観に統一（優先順位は表示順のみで表現）。変更は `app/index.tsx` の該当箇所のみ（カード名・説明・配置・遷移・最近の軽量メモ・設定導線・FABは無変更）。tsc合格・360/390/768/1024幅でカード外観統一・2×2・横スクロールなしをWeb確認（36項目合格・コンソールエラー0件）
* **Phase 15 APK確認2完了（2026-07-14）**：バッチ2（ホーム再構成＋左アクセント削除）とversionCode 5→6（6a59f83）のpush後にビルドしたEAS preview APK（build ID：52eb1e4d-d91d-4ccf-a220-aeaa29b43671、versionCode 6・対象コミット6a59f83。ビルドURL：https://expo.dev/accounts/ykjob/projects/flowdock/builds/52eb1e4d-d91d-4ccf-a220-aeaa29b43671）をユーザーがAndroid実機で確認し、**すべて問題なし**。確認内容：主要カード4件・設定・FABの遷移／「すべて表示」「3件に戻す」／軽量メモ詳細・メモ管理詳細の「本文をコピー」（DETAIL-01）／再起動後の既存メモ表示／2×2表示・4枚同外観（左アクセント残留なし）・左右バランス・設定の補助導線・Safe Areaを含む実機表示。これにより**バッチ2（HOME-01〜05）とDETAIL-01は実装・Web・Android確認済みの正式完了**（正本記録：`30` §12.1・§8.1・§14。追跡表：`28` §16。タスク：`10` §20。保留整理：`11` §16）。TalkBack・文字サイズ最大等のGate 6最終項目は未確認のまま
* **Phase 15バッチ3実装完了（2026-07-14、レビュー反映のうえ同日コミット・push）**：NOTES-01〜04を実装。実装変更は `app/notes/index.tsx` のみ（共通部品・DB・SQL・他画面・設定ファイルは無変更）。(1) フィルター収納＝常時表示（検索・カテゴリチップ）＋折りたたみ（初期閉。プロジェクト・タグ・Git候補のみ・アーカイブ済みも表示・並び順。閉じても条件維持・開閉ボタンに折りたたみ内の絞り込み条件数を表示＝project・tag・gitOnly・includeArchivedのみ。並び順はレビュー反映で件数から除外し要約にのみ表示） (2) チップ役割分離＝ローカルFilterChipを削除し共通FilterChip適用、並び順はneutralな長方形切替ボタン「並び順：更新日順／作成日順」へ分離 (3) 状態区別＝loadError＋reloadKey追加でListStateViewのloading／error（再試行接続）／empty／filtered-empty（keyword・project・type・tag・gitOnlyで判定。includeArchived・sortByは含めない）を区別 (4) 適用中要約＋「表示条件をリセット」＋「メモ一覧 N件」表示（追加クエリなし・notes.length使用。loading／error中は古い件数を表示しない）。tsc合格・`git diff --check` 問題なし・ヘッドレスChrome 6幅（360〜1024）**87項目すべて合格**＋レビュー反映後の回帰確認**13項目すべて合格**・コンソールエラー0件（記録：`30` §8.2）。**取得エラーの実表示は未再現**（コード上で接続確認のみ）。**Android実機確認・versionCode変更・EASビルドは未実施**。保留事項（戻るボタン視認性・FlowDock作成画面の下部余白）は引き続き対象外
* **Phase 15バッチ4実装完了（2026-07-14、未コミット）**：WORK-01〜04を実装。実装変更は `app/workplace/index.tsx` のみ（5場面の入力画面・WorkplaceSceneForm・workplaceService・workplaceTags・DB・保存処理・生成テキスト・ルートは無変更）。(1) 3区分表示＝開始（前回の再開メモ＋作業開始）／作業中（詰まり記録・質問文作成・進捗報告作成）／終了（終業前メモ）。区分見出し＋短い説明・場面順序は従来どおり・共通部品（SectionHeader等）は新設せずローカル描画 (2) 動作種別＝各カードにpillラベル（4場面「コピーのみ」＝brandSoft／終業前メモ「コピーと保存」＝successSoft）。カード基本外観は5枚統一 (3) 再開メモ＝開始区分内・作業開始カード直前に配置し表示順で接続を表現。loadError＋reloadKey追加でListStateView部分適用（loading／error＋再試行／empty「前回の再開メモはありません」）＝catch握りつぶし解消。`/workplace/start?fromRestart=1`・引き継ぎは無変更 (4) AppHeader subtitleで独自価値説明＋不正確だった旧説明文を入口専用の短い守秘注意帯（warningSoft・常時表示）へ置換。tsc合格・ヘッドレスChrome 6幅（360〜1024）**72項目すべて合格・コンソールエラー0件**（5場面遷移／戻る3経路／1日ループ＝`26` §2.5サンプルで終業前保存→入口の再開メモ→この続きから作業開始→引き継ぎ初期入力／守秘＝private・Git候補対象外・workplace/workplace_endタグを/notes詳細で確認。記録：`30` §8.3）。**再開メモ取得エラーの実表示は未再現**（コード上で接続確認のみ）。**Android実機確認・コミット・push・versionCode変更・EASビルドは未実施**（レビュー用の未コミット差分で停止）。STATE-01・02は/workplace入口への部分適用として記録（全体完了扱いにしない）
* **Phase 15バッチ5実装完了（2026-07-14、未コミット。同日、入口名・ID対応を本文が行う処理に合わせて修正）**：PROMPT-01〜03を実装。実装変更は `app/prompts/index.tsx` のみ（`promptHub.ts`・`mobilePrompts.ts`・`chatgptPrompts.ts`・`noteCategories.ts`・`generate_prompt_hub.mjs`・`docs/mobile-view/prompts.html`・共通部品本体・DB・ルート・他画面・app.json等は無変更）。(1) 状況別入口6件＝**問題を整理する／エラー・不具合を整理する／予定・やることを整理する／作業結果をまとめる／引き継ぎを作る／開発作業を依頼・確認する**を、画面側の固定IDマッピング（コンポーネント外の型＋定数 `PROMPT_SITUATIONS`）で追加。入口名・ID対応は入口名からの推測ではなく既存プロンプト本文が実際に行う処理に合わせて定義（当初実装から同日修正。旧「エラーを相談する」→「エラー・不具合を整理する」、旧「仕様・実装を確認する」の design/research は設計メモ・調査メモへの整形のため入口から除外、claude_prompt/claude_work_start を「開発作業を依頼・確認する」へ追加、daily_priority を「予定・やることを整理する」へ移動、wife_schedule/outing_plan/shopping_memo を「予定・やることを整理する」へ追加）。状況別入口＝既存42件から目的に近いものを絞り込む補助フィルター（既存セクション＝所属の通常導線・検索＝通常導線は不変）。全42件を6入口へ無理に割り当てない＝登録外（就活・投資・family_manual/household_rule）は「すべて」・既存セクション・検索から到達。複数入口重複はどちらの目的からも自然なもの（next_one_action/validation_log/worklog_close_summary/worklog）のみ許可。共通FilterChipで単一選択＋「すべて」が解除を兼ねる・flexWrap・横スクロールなし・AI紫不使用でブランド色のみ (2) 状況選択と既存キーワード検索はAND（全42件→状況別ID→キーワード検索→0件セクション除外）。検索対象は名称・ID・セクション名のまま。42件・7セクション・順序・件数見出し・1件展開アコーディオン・badge・note・promptBodyコピーを維持。入口/検索変更でexpandedIdを強制初期化しない。0件は「検索のみ／状況＋検索」を文言で区別＋「絞り込みを解除」で状況＝すべて/検索＝空を同時初期化 (3) 旧copiedId/failedIdのボタン色変更を共通StatusMessage（success「コピーしました」/error「コピー失敗」）へ変更しcardHead直下に表示。copyingIdでコピー中は全コピーボタンdisabled＋「コピー中…」＋accessibilityState/Label・finally解除。自動消去はuseEffect（成功2000ms/失敗2500ms・新結果/消去/アンマウントでクリーンアップ・連続コピーは最後の結果のみ）・結果ラッパーにaccessibilityLiveRegion="polite"。tsc合格・`git diff --check`問題なし・ヘッドレスChrome6幅（360〜1024）**修正後63項目すべて合格・コンソールエラー0件**（`30` §8.4。修正後マッピングの再確認＝design/researchは開発入口に非表示・claude_prompt/claude_work_startは表示・wife_schedule/outing_plan/shopping_memoは予定入口に表示・daily_priorityは問題入口から予定入口へ移動・family_manual/household_ruleは入口未登録だが検索から到達を含む）。**コピー成功パスのクリップボード実内容一致はWeb環境制約で未確認**（ヘッドレス/バックグラウンドChromeで`navigator.clipboard.writeText`がNotAllowedErrorで拒否＝アプリはerrorパスで「コピー失敗」を正しく表示。成功時文言・内容一致はAndroid実機/通常ブラウザで要確認）。STATE-03・04はプロンプト集への部分適用として記録（全体完了扱いにしない）。**Android実機確認・コミット・push・versionCode変更・EAS/APKビルド・生成スクリプト実行は未実施**
* **Phase 15の次に行う1作業**：バッチ4・バッチ5のレビューとコミット判断（ユーザー）。その後、次回APK確認でメモ管理一覧・現場適応入口・プロンプト集状況別入口のAndroid実機確認（プロンプト集はコピー成功時のクリップボード内容一致も実機で確認）
* **Phase 15の未確定事項（代表。正本は `11-open-issues.md` §16）**：ホームの設定導線の具体配置（AppHeader右かホーム内補助か）／プロンプト集の状況別分類（PROMPT-01前判断）／AppHeaderの具体値／アイコン導入／app.json表示名変更／ConfirmDialog二重実装の扱い
* EAS preview APK 4回目ビルド成功（2026-07-13）：モバイルヘッダー修正（e12aed6）＋versionCode 4（6605d43）をcommit/push後にビルド完了。対象コミット6605d43・appBuildVersion=4確認済み。APK：https://expo.dev/accounts/ykjob/projects/flowdock/builds/11b19c5e-853c-4d9f-9971-f6c39e6cf0a4 （期限2026-07-27）。Android実機確認（ステータスバー・ホーム2×2・/notes 2段化要否）はユーザー待ち
* /notes/index ヘッダーのSafe Area対応（2026-07-13、コミット済み e12aed6）：APK 3回目のAndroid実機確認フィードバック対応。`useSafeAreaInsets` で上余白に `insets.top` を加算（ステータスバー被り解消、Webは不変）＋「← 戻る」にhitSlop追加。一度実装したスマホ幅2段化は「窮屈なのはホーム画面の可能性が高い」との指摘で撤回（実機表示を見て要否再判断）。tsc合格・Web両幅で従来どおり1行を確認済み
* ホーム画面ヘッダーのスマホ幅2×2グリッド化（2026-07-13、未コミット・承認済み案を実装）：`app/index.tsx` のみ変更。`width < 480` で「メモ一覧」＋「現場適応/プロンプト集」＋「メモ管理/設定」の2×2グリッド（各ボタン中央寄せ・縦padding拡大）、480以上は従来の1行を完全維持。tsc合格・Web両幅レイアウト実測・コンソールエラー0件。Android実機確認はAPK再ビルド後
* EAS preview APK 3回目ビルド成功（2026-07-13）：メモ管理修正（3e0c7ee）＋versionCode 3（f277c12）をcommit/push後、`eas build -p android --profile preview` でビルド完了。対象コミットf277c12・appBuildVersion=3を確認。APK：https://expo.dev/accounts/ykjob/projects/flowdock/builds/0547c079-4dbf-43c5-8508-1e6bc2ec56ff （アーティファクト期限2026-07-27）。実機インストール・基本動作確認はユーザー待ち
* メモ管理画面の不具合2件修正完了（2026-07-13、未コミット）：(1) `/notes` の画面内ヘッダーに「← 戻る」ボタンを追加（`canGoBack()` なら `back()`、直アクセス時は `replace('/')`。履歴依存を解消）。追加で `notes/index` のみ `headerShown: false` にしてネイティブヘッダーを消し、戻る導線を画面内「← 戻る」1つに統一（他画面のヘッダーは無変更）。(2) Web更新時の `NoModificationAllowedError`（OPFS access handle競合）に対し、`_layout.tsx` の SQLiteProvider に `onError` を追加してWebでは1回だけ自動リロードで回復（sessionStorageフラグで無限リロード防止）。あわせて `/notes` 一覧の `useEffect`＋`useFocusEffect` 二重読み込みを `useFocusEffect` のみに整理。tsc合格・ヘッドレスブラウザで実操作確認済み（戻るボタン両経路・フィルタ再読み込み・リロード連打回復・PC/スマホ幅表示・フラグ残留なし）
* 開発リファレンス 目的2本柱化＋現場理解カード20枚の下書き作成完了（2026-07-12、未コミット）：目的を「柱1＝技術リファレンス（即参照・事故駆動）」「柱2＝現場理解カード（現場での動き方の確認手順・判断基準）」の2本柱に拡張（`24` §1）。現場理解カードG-01〜G-20（6グループ・サブタグ6種・高優先5枚）を `25` §10 に整理し、`/notes` へコピペ登録できる完成本文20枚を `27-development-reference-fieldwork-cards.md` に新規作成。案Aの枠（専用画面・新規ルート・DB変更なし、command＋dev-ref）は不変。面接質問プロンプトは対象外と明記。DB登録はユーザーの手動登録待ち
* 発表用サンプルデータのデモリハーサル完了（2026-07-12、未コミット）：`26` §2のサンプル文を原文どおり8082の実画面へ入力し、5場面＋終業前メモ保存＋翌朝再開導線を確認。全32チェック項目OK・コンソールエラー0件・修正必須の問題なし。`26` §3にデモ運営上の注意（サンプル文は事前用意してコピペ入力）を1行追記
* 現場適応モード 発表用サンプルデータ作成完了（2026-07-12、未コミット）：`docs/memo-app/26-workplace-demo-samples.md` を新規作成。架空シナリオ（新人が架空の在庫管理Webアプリの画面確認タスクを担当する1日）で5場面の入力例・デモ手順・ChatGPT活用例・守秘ルールを整理。ドキュメントのみ・実装コード/DB/ルート構造は無変更
* 現場適応モード5場面のブラウザ確認完了（2026-07-12、ドキュメント記録のみ）：`http://localhost:8082/workplace` 以下で5場面＋入口＋翌朝再開導線を実操作確認。47チェック項目すべてOK・コンソールエラー0件・表示崩れなし・アプリ側の修正不要。8081は現場適応モード追加前から動いていた古い開発サーバーで `/workplace` が Unmatched Route になるため8082で確認
* 名称方針の整理完了（2026-07-12、コミット済み 09bb952・push済み）：MindHub＝アプリ全体名（思考メモ・作業ログ・AI活用・プロンプト集・現場適応モードのハブ）、FlowDock＝初期からある軽量メモ機能（`/memo` 系）の説明名として整理し、`01-decisions-and-scope.md` §1.6 に正本化。`00_START_HERE.md`・`CLAUDE.md` に参照追記。app.json・package.json・ルート名・DB・実装コードは無変更
* 開発リファレンス 案A正式採用＋登録候補整理完了（2026-07-10、未コミット）：案A（専用画面・固定データ画面・新規ルートを作らず `command` カテゴリで運用）を正式方針として確定し docs 反映（24 §6.1 / 04 §1.3 / 11 §15 / 10 §17）。参照用タグは `dev-ref` で確定。登録候補31件を `docs/memo-app/25-development-reference-candidates.md` に整理し、高優先度7件（R-01/R-02/R-03/R-04/R-09/R-14/R-15）を先行登録候補として明記。DB登録・コード変更なし。DB登録可否はユーザー判断待ち
* 開発リファレンス（現場適応モードとは別機能）の仕様書新規作成＋既存仕様への参照追記完了（2026-07-10、コミット済み b2092b9）：`docs/memo-app/24-development-reference.md` を新規作成。作業中に手が止まったとき手順・コマンド・最小コード例をすぐ確認する補助参照集として整理。初期は既存notesの `command` カテゴリ／タグ運用で扱い専用DB・専用画面は作らない。実装コード変更なし
* 現場適応モード（Phase 14）の仕様書新規作成＋既存仕様への参照追記完了（2026-07-09）
* 現場適応モード（Phase 14）MVP実装完了（2026-07-09、コミット済み 37aa1e8・push済み）：入口＋場面選択＋作業開始/詰まり記録/終業前メモ＋翌朝再開導線＋再開時の引き継ぎ初期入力。守秘既定強制・schema無変更・既存導線無変更 → ブラウザ確認済み
* 現場適応モード（Phase 14）次点2場面追加（2026-07-10、コミット済み 09d34fd）：質問文作成・進捗報告作成を追加し5場面をそろえた。どちらも `WorkplaceSceneForm` 再利用でコピーのみ・保存なし（`onSave` 未指定）。schema無変更・notes保存処理追加なし・既存導線無変更 → ブラウザ確認済み（2026-07-12、5場面47項目すべてOK）
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

### Phase 15 UI・UX品質改善の文書整備（第1〜4B段階）（2026-07-13、未コミット）

* `docs/memo-app/28-ui-ux-quality-improvement.md` を新規作成（画面別改善・情報設計・UX-01〜UX-16の正本）
* `docs/memo-app/29-ui-design-system.md` を新規作成（デザイントークン・ヘッダー方式・共通コンポーネント・状態表示・アクセシビリティ基準の正本）
* `docs/memo-app/30-ui-validation-checklist.md` を新規作成（検証手順・判定・Gate 1〜7・証跡記録の正本）
* Phase 15を既存の正式仕様書10ファイルへ反映（`01` / `08` / `09` / `10` / `11` / `14` / `16` / `21`、`CLAUDE.md`、`00_START_HERE.md`）。古いホーム方針（入口ボタン追加のみ）とUI踏襲規則（#2563EB基調をそのまま踏襲）は置換注記つきで現行方針へ更新
* 28・29・30の正本分担を確定（重複正本なし）
* 共通UI設計判断DS-01〜DS-10を確定（AppHeader案A・theme1ファイル・既存色の役割化＋AI色 `#7C3AED`・スケール定義・初期部品4個・表示のみ共通化・実用a11y基準・アイコン保留・一括置換禁止）
* UX-01〜UX-16を追跡可能な状態にした（`28` §16・`30` §14の追跡表。判定はすべて未確認から開始）
* Gate 1〜Gate 7の検証構造を定義（`30` §15）
* versionCode 4 APKの基準確認項目を**未確認**として記録（`30` §12.2。推測判定なし）
* 実装コード・DB・依存関係・app.json・eas.json・28〜30作成後の再編集はなし。commit・push・git addは未実施

### メモ管理画面の不具合2件修正（2026-07-13、未コミット）

* 問題1（戻るボタン消失）：`app/notes/index.tsx` の画面内ヘッダー左に「← 戻る」ボタンを追加。`router.canGoBack()` で戻れるなら `router.back()`、Webの更新・直アクセスで履歴がない場合は `router.replace('/')` でホームへ。さらに戻るボタン2重表示の解消として `_layout.tsx` の `notes/index` のみ `headerShown: false` を設定し、画面内「← 戻る」を全環境で唯一の戻る導線に統一（`/notes/create`・`/notes/[id]` 等のネイティブヘッダーは従来どおり）
* 問題2（Web更新時の NoModificationAllowedError）：原因は expo-sqlite Web実装のOPFS access handle 競合（リロード時に旧worker のhandle解放より先に新workerが取得を試みる）。worker は初期化失敗後にページ内リトライで回復できない構造のため、`app/_layout.tsx` の SQLiteProvider に `onError` を追加し、Webでこのエラーの場合のみ sessionStorage フラグ付きで1回だけ自動リロード。成功時（onInit）にフラグ解除。2回連続失敗（別タブで開いている等）は再リロードせずエラー表示
* 副次修正：`/notes` 一覧の `useFocusEffect`＋`useEffect` の二重 `load()` を `useFocusEffect` のみに整理（初回・フォーカス復帰・フィルタ変更をすべてカバー。競合の原因ではないが冗長のため）
* 検証：`npx tsc --noEmit` 合格。ヘッドレスブラウザ実操作確認済み（2026-07-13、8083で確認：直アクセス/通常遷移の戻るボタン両経路・フィルタ変更での再読み込みサイクル・リロード6連打回復・sessionStorageフラグ残留なし・PC 1280px/スマホ390px幅で表示崩れなし・コンソールエラー0件）。コミット・pushは未実施

### 開発リファレンス 目的2本柱化＋現場理解カード20枚の下書き作成（2026-07-12、未コミット）

* 目的を2本柱に拡張（`24-development-reference.md` §1改定）：柱1＝技術リファレンス（作業中の即参照。事故駆動でR-01〜R-31を1件ずつ）、柱2＝現場理解カード（実際の開発現場でどう動くかの確認手順・判断基準。行動基準のため初期セット登録を許容）。§3対象・§4対象外・§5登録基準（5.1/5.2に分割）・§6も整合するよう修正
* 現場理解カードG-01〜G-20を `25-development-reference-candidates.md` §10 に整理：6グループ（onboarding／ask-report／troubleshoot／git-db／security／closing＝サブタグ6種で確定）、Rカードとの関係（G＝汎用手順の親・R＝本プロジェクトの個別実例の子。統合せず相互リンク）、高優先5枚（G-02タスク受領時／G-06質問前整理／G-08報告内容／G-10エラー切り分け／G-19終業前再開情報）
* `docs/memo-app/27-development-reference-fieldwork-cards.md` を新規作成：20枚すべてのコピペ用登録ブロック（タイトル／カテゴリcommand／タグ `dev-ref,サブタグ`／本文）。本文は1枚15〜25行の「いつ見るか・確認すること・判断基準・MindHub_Appでの実例・関連」構成で、ポートフォリオ上「仕事に対する姿勢」を説明できる実務手順として記述
* 守秘確認：20枚とも汎用内容のみ（実在企業・現場固有情報・機密なし。G-17/G-18も本文は汎用判断基準に限定）。Git候補はcommand初期値どおりtrue
* 面接質問プロンプトは今回の対象外と `25` §7 に明記
* 関連更新：`04` §1.3（2本柱とも command＋dev-ref 運用のまま・サブタグ6種）、`11` §15（決定済み事項の追記・残る未確定の整理）、`10` §17
* 実装コード・DB・ルート・専用画面は無変更（ドキュメントのみ）。DB登録・コミット・pushは未実施

### 発表用サンプルデータのデモリハーサル（2026-07-12、未コミット）

* `26-workplace-demo-samples.md` §2のサンプル文を原文どおり `http://localhost:8082/workplace` の実画面へ入力し、発表と同じ流れをリハーサル確認。全32チェック項目OK・コンソールエラー0件・**修正必須の問題なし**
* 確認範囲：5場面の入力→整理→出力→コピー（クリップボード実内容も確認）、終業前メモ保存→入口の「前回の再開メモ」表示→「この続きから作業開始」の引き継ぎ初期入力。翌朝再開デモとして文章が自然につながることを確認
* 表示崩れなし・守秘面問題なし（固有名なし）。質問文作成の「急ぎ度」の文体は自然なため変更しない判断
* 反映：`26` §3に「サンプル文は事前にテキストファイルへ用意し、デモ中はコピペ入力する」旨を1行追記
* コミット・pushは未実施

### 現場適応モード 発表用サンプルデータの作成（2026-07-12、未コミット）

* `docs/memo-app/26-workplace-demo-samples.md` を新規作成（ドキュメントのみ）
* 架空シナリオ：未経験に近い新人が、架空の社内向け「在庫管理Webアプリ」の会員登録画面の入力チェック確認を担当する1日。5場面が朝→詰まり→質問→報告→終業前の流れでつながる
* 5場面の入力例は画面ラベルと一致させ、そのまま入力してデモできる形にした。各場面に「デモでの見せ方」「ChatGPTに貼るとどう役立つか」を併記
* 発表用デモの推奨手順（前日に終業前メモを保存→入口の再開メモから始めて引き継ぎで締める）と短時間版（詰まり記録→質問文作成のみ）も記載
* 実在の会社名・職場名・個人名・顧客名・秘密情報は不使用（守秘ルールを§4に明記）
* 実装コード・DB・app.json・package.json・ルート構造は無変更。コミット・pushは未実施

### 現場適応モード5場面のブラウザ確認（2026-07-12、ドキュメント記録のみ）

* `http://localhost:8082/workplace` 以下で、5場面（作業開始・詰まり記録・質問文作成・進捗報告作成・終業前メモ）＋入口＋翌朝再開導線をヘッドレスブラウザで実操作確認。47チェック項目すべてOK・コンソールエラー0件・表示崩れなし・**アプリ側の修正不要**
* 確認内容：各場面の表示・入力欄・整理→出力・コピー（クリップボード実内容も検証）・保存動作の有無（終業前メモのみ保存あり、他4場面はコピーのみ＝仕様どおり）・守秘注意文の全場面表示・終業前メモ保存→「前回の再開メモ」表示→「この続きから作業開始」の引き継ぎ初期入力
* **8082で確認した理由**：8081の開発サーバーは現場適応モードのルート追加前から起動していた古いプロセスで `/workplace` が Unmatched Route になるため、8081には触らず8082で新規起動して確認
* puppeteer-core を一時的にプロジェクト本体へ誤インストールしたが、`git restore` ＋ `npm prune` で復旧し `git status` クリーンを確認済み（最終的にセッション用一時ディレクトリへ隔離）
* 記録先：`docs/worklog/current.md`、`docs/memo-app/10-tasks.md` §16
* コミット・pushは未実施

### 名称方針の整理（2026-07-12、コミット済み 09bb952・push済み）

* MindHub と FlowDock の呼び分けを整理し、`docs/memo-app/01-decisions-and-scope.md` §1.6「追加決定事項（2026-07-12 名称方針）」として正本化
  * MindHub：アプリ全体名。思考メモ、作業ログ、AI活用、プロンプト集、現場適応モードをまとめるハブ。表向き名称は今後 MindHub に寄せる
  * FlowDock：初期からある軽量メモ機能の説明名。スマホで素早くメモを流し込み、あとで整理につなげる入口。消さずに残す
  * `/memo` 系＝FlowDock由来の既存軽量メモ機能、`/notes` 系＝メモ管理機能、`/workplace` 系＝現場適応モード
* `00_START_HERE.md` §1 と `CLAUDE.md` プロジェクト概要の「アプリ内部名：FlowDock」を「アプリ全体名：MindHub」に改め、名称方針の参照を追記
* app.json（name/slug/scheme）・package.json・ルート名・DB・実装コード（画面タイトル「FlowDock」含む）は変更なし。表示名等を実際に MindHub へ変更する時期は未確定として `01` §1.6 に明記
* `docs/flowdock_mvp_design.md` は FlowDock（既存軽量メモ機能）の仕様基準としてそのまま参照
* コミット・pushは未実施（ドキュメントのみ）

### 開発リファレンス 案A正式採用と登録候補の整理（2026-07-10、未コミット）

* 案A（開発リファレンス専用画面・固定データ画面・`app/reference` などの新規ルートを作らず、既存notesの `command` カテゴリで運用）を正式方針として確定し、docsに反映（`24` §6.1新設 / `04` §1.3 / `11` §15を決定済みへ / `10` §17）
* 参照用タグを `dev-ref` に確定（旧「命名未確定」を `11` §15 / `04` §1.3 / `24` §6 で解消）
* 登録候補31件を `docs/memo-app/25-development-reference-candidates.md` に新規整理。各候補を8観点（タイトル／見るタイミング／MindHub_Appでの具体例／この手順の意味／現場で置き換えるポイント／関連コマンド／関連ファイル／優先度）で記載
* 高優先度7件（R-01 検証2コマンド／R-02 保存無反応の確認順／R-03 ID生成はexpo-crypto／R-04 ネイティブcopyはexpo-clipboard／R-09 schema_version方式／R-14 commit/pushは指示後／R-15 既存機能を壊さない）を「最初にDB登録する候補」として §3 に明記
* 統合案（§6）・登録しない候補（§7）・人間判断事項（§8）も整理
* DB登録・コード変更・コミットは未実施（ドキュメントのみ）。DB登録可否はユーザー判断待ち

### 開発リファレンスの仕様書新規作成と既存仕様への参照追記（2026-07-10、コミット済み b2092b9）

* 現場適応モードとは**別機能**の「開発リファレンス」仕様として `docs/memo-app/24-development-reference.md` を新規作成。目的（暗記でなく作業中に迷ったとき手順・コマンド・最小コード例をすぐ確認し集中を切らさず作業へ戻る）・現場適応モードとの関係（5場面支援が主、リファレンスは詰まったときの補助参照）・対象/非対象・登録基準・初期実装方針・将来候補を記載
* 方針：現場適応モードの中核機能ではない。5場面（作業開始・詰まり記録・質問文作成・進捗報告作成・終業前メモ）で手が止まったとき横から参照する補助導線。初期は専用DB・専用画面を作らず既存notesの `command` カテゴリ／タグ運用で扱う
* 登録基準：実際に手が止まった／2回以上調べた／1分以内に見返したい／コピペか短い確認で作業へ戻れるものに限定。AIが重要と言っただけの用語・未使用の知識・網羅的関数一覧・公式ドキュメント丸写し・現場固有情報・機密は対象外
* 既存仕様書6件へ参照追記：04（§1.3 command カテゴリ／タグ運用）／09（別機能・当面ロードマップ外）／10（§17 タスク）／11（§15 確認待ち）／20（§7.2 非スコープに別機能として明記）／21（§7.1 別機能・補助参照）
* 完了条件どおり：別機能であり補助参照として扱うこと、初期は `command` カテゴリ／タグ運用で専用DB・専用画面は後回しであることを明記
* 実装コード・DBスキーマ・専用画面は変更なし。コミット・pushは未実施（ドキュメントのみ）

### 現場適応モード（Phase 14）次点2場面追加：質問文作成・進捗報告作成（2026-07-10、未コミット）

* `app/workplace/question.tsx`（質問文作成）・`app/workplace/report.tsx`（進捗報告作成）を新規追加。`WorkplaceSceneForm` を `onSave` 未指定で再利用＝**コピーのみ・保存ボタンなし・DB非接続**
* `src/features/workplace/workplaceService.ts` に `buildQuestionText`（結論先頭・丸投げに見えない体裁）／`buildReportText`（結論先・完了/未完了/次の作業を分離・相談は最後）を追加
* `src/features/workplace/workplaceTags.ts` に場面定数 `workplace_question` / `workplace_report` を**定義のみ**追加（今回は未保存。将来保存時も private / isGitCandidate=false 固定の前提は不変）
* `app/workplace/index.tsx` の場面カードに「質問文作成」「進捗報告作成」を追加（作業開始→詰まり記録→質問文作成→進捗報告作成→終業前メモ の並び）。`app/_layout.tsx` にStack.Screen 2件登録
* 守秘：既存注意文に加え、両画面 intro に「AI・チャット・メールに貼る前に、顧客名・会社名・個人名・内部URL・システム名・社内マニュアル本文・職場固有の判断基準は一般化してから使う」旨を明記
* 境界固定どおり：schema変更なし、notes保存処理なし、`createNote`・保存系関数は呼ばない、既存 `/notes` `/memo` `/prompts` `/settings` 無変更、公開出力・GitHub Pages・配布用HTML・家族用表示への接続なし
* 検証：tsc 合格、`expo export`（web）合格、新2画面に保存系コード（onSave/createNote/save）が無いことを確認。ブラウザ実操作はユーザー確認待ち
* コミット・pushは未実施

### 現場適応モード（Phase 14）MVP実装（2026-07-09、未コミット）

* 新規ルート `app/workplace/*` を追加（既存 `/notes` `/memo` `/prompts` `/settings` は無変更）。`_layout.tsx` にStack.Screen 4件登録
  * `app/workplace/index.tsx`：場面選択＋直近の終業前メモ（再開メモ）を上部表示＋「この続きから作業開始」
  * `app/workplace/start.tsx`（作業開始）・`stuck.tsx`（詰まり記録）・`end.tsx`（終業前メモ）
* 共通部品 `src/components/WorkplaceSceneForm.tsx`：入力→整理→コピー（終業前のみ保存）。守秘注意文を常時表示
* ロジック層 `src/features/workplace/`：
  * `workplaceTags.ts`：場面タグ（`workplace_start` / `workplace_stuck` / `workplace_end`）＋共通タグ `workplace`、守秘既定定数、守秘注意文
  * `workplaceService.ts`：終業前メモ保存（`createNote` 経由で `visibility=private` / `isGitCandidate=false` 固定・type=thought・`getGitCandidateDefault` 不使用）、直近終業前メモ取得、各場面の生成テキスト組み立て
* `src/features/notes/noteRepository.ts` に `getLatestNoteByTag` を**追加のみ**（既存関数無変更）。タグ境界を `,` で厳密一致、LIKEワイルドカード（% _）をエスケープ、`archived_at IS NULL`、`updated_at DESC, id DESC`、1件
* `app/index.tsx` ホームヘッダーに「現場適応」ボタンを1つ追加（既存挙動は無変更）
* 保存対象は翌朝再開に必要な終業前メモのみ。作業開始・詰まり記録はコピーのみ
* 再開時の引き継ぎ（2026-07-09追加）：`/workplace` 上部の「この続きから作業開始」は `?fromRestart=1` を付けて遷移し、start画面が直近終業前メモを取得して作業開始フォームへ初期入力（明日最初にやること→今日の作業、未完了・補足→先に確認すること。構造が取れない本文はそのまま先に確認すること欄へ）。青い引き継ぎ案内文を表示。通常の作業開始導線は空欄。作業開始は保存しない
* 境界固定どおり：schema変更なし、既存導線無変更、公開出力・GitHub Pages・配布用HTML・家族用表示への接続なし
* 次点（質問文作成・進捗報告作成）・現場プロファイル・複数現場切り替えは今回対象外
* 検証：tsc 合格、`expo export`（web）合格（787モジュール・4画面をバンドル）。ブラウザ実操作確認はユーザー待ち
* コミット・pushは未実施

### 現場適応モード仕様書の新規作成と既存仕様への参照追記（2026-07-09、未コミット）

* 未経験者・訓練校生・SES配属直後向けの「現場適応モード」仕様として、`docs/memo-app/20-workplace-adaptation-overview.md`〜`23-workplace-adaptation-security-and-portfolio.md` の4ファイルを新規作成
* 既存仕様書11ファイルへ参照追記を適用（01 / 03 / 04 / 07 / 08 / 09 / 10 / 11 / 17、00_START_HERE.md、CLAUDE.md）
* 命名は `workplace-adaptation` を採用（IT開発現場を指す・`field`はDBフィールドと紛らわしいため）
* 5場面モデル（作業開始／詰まり記録／質問文作成／進捗報告作成／終業前メモ）を正本とし、翌朝の再開導線は5場面と分離した補助導線として整理
* DB方針は既存notes再利用（案A）を第一候補とし破壊的変更なし（案B/Cは比較として保持・将来候補）。DB定義正本は03、schema_version方式
* 現場情報は既定でvisibility=private・Git候補false、公開HTML・配布用・家族用に非混入
* 既存正本との整合性チェックで大きな矛盾なし（DB定義は03に一元化しスキーマ追加なし／画面は08=入口・21=詳細で排他／Phase番号は09・10とも14）
* 未確定事項：出力物の保存可否、入口配置、現場プロファイル構造、タグ命名、複数現場切り替え時期（11 §14）
* レビュー後修正（同日）：Git候補初期値の衝突を解消（現場適応モードはカテゴリ初期値に依らず既定 is_git_candidate=false / visibility=private に守秘優先で上書き。23 §6.1新設、22 §4・04 §1.2・07 §13に反映）。軽微4点（20節参照ミス／「既存の主要導線・既存機能を壊さない」への表現統一／場面タグは例で命名は11管理／22 §6.1の実態修正）も反映。観点3・6を解消
* 守秘・公開配布・スマホ閲覧の境界追記（同日）：職場情報の範囲（職場固有ルール・報告経路・判断基準・システム操作手順・例外対応・社内資料本文も含む。抽象化した個人用チェック項目に留める）を23 §3.1に正本化、20 §5・22 §5は参照。将来スマホ閲覧時も公開Pagesに現場情報を出さず公開配布と分離する未確定事項を11 §14に追加
* コード実装・コミット・pushは未実施（ドキュメントのみ）

### 2回目APKビルド前のversionCode更新（2026-07-07、未push）

* app.json の android.versionCode を 1 → 2 に更新（初回versionCode 1インストール済み端末への上書き更新用）。2回目APKにはクリップボード修正（9338a07）とアプリ内プロンプト一覧画面（e80a5bf）が載る
* `npx expo config` で versionCode: 2 / package: com.ykjob.mindhub を確認。16 §2.5の記述を実態に更新
* EAS build未実行・アプリ本体無変更

### Androidエミュレータ自動確認の調査記録＋Maestro雛形作成（2026-07-07、未push）

* `docs/memo-app/19-android-emulator-testing.md` 新規：調査結果・導入案（adb=配管／Maestro=UIシナリオ／CIは後回し。Detox・Appiumは実リリースAPK検証に重く非推奨。Windowsは WSL2 経由推奨）
* `.maestro/` 新規：README.md＋flows/01_create_and_persist.yaml（作成〜再起動後の永続化）＋flows/02_prompt_copy.yaml（プロンプト検索・展開・コピー）。**未実行の雛形**
* 方針：testID未整備のため可視テキスト操作。コピー成功は「コピーしました」表示で判定。CI化は後回し
* 今回対応せず：Maestro/エミュレータ実行、CI設定、testID追加、アプリ本体コード変更、EAS build、Pages有効化、PWA化、配布用リポジトリ
* 検証：追加はドキュメントと.maestro雛形のみ。アプリ本体無変更。実エミュレータ実行はこれから

### APK初版実機確認の記録＋アプリ内プロンプト一覧画面の追加（2026-07-07、未push）

* APK初版の実機確認結果を記録（起動・保存・再起動後保持・familyカテゴリ/visibility表示・FlowDock作成編集は成功。Androidキーボード隠れは許容。検索/絞り込み/Markdownプレビュー/オフライン保存/prompts.htmlコピーは未確認）。16 §2.5のチェックリストに反映
* クリップボード不具合は `9338a07` で修正済み。既存APKには未反映のため、EAS再ビルド後に実機再確認が必要（16 §2.5に明記）
* アプリ内プロンプト一覧画面 `app/prompts` を新規追加。promptHub.ts（chatgptPrompts＋mobilePrompts統合の共有データ層。42件・7セクション）＋SectionListでセクション別表示・検索・展開・コピー（修正済みcopyToClipboard使用）。ホームヘッダーに「プロンプト集」導線を追加
* 設計判断：mobilePrompts.tsの「アプリからimportしない」方針を今回のAPK内表示要件で上書き（冒頭コメント更新）。prompts.htmlはWebView表示せずRN画面で描画。generate_prompt_hub.mjsは無変更で温存
* 検証：tsc・expo export（web）・generate:prompt-hub（7セクション42プロンプト）すべて合格。APK実機確認はEAS再ビルド後
* 今回対応せず：Markdown書き出しのAPK対応、Androidキーボード追加修正、Phase 8、JSONインポート、Pages有効化、PWA化、配布用リポジトリ、EAS build、push

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
