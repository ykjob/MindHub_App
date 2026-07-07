# 19. Androidエミュレータ自動確認（調査結果と導入案）

最終更新：2026-07-07

## 1. 目的

Android APKの修正ごとに毎回スマホで手動確認するのは手間が大きい。Androidエミュレータ上で、最低限の日常利用シナリオ（メモ作成・保存・再起動後保持・プロンプトコピー）を自動確認できる土台を用意し、回帰確認コストを下げる。

本ファイルは調査結果と導入案の記録。実際のエミュレータ実行・CI化はまだ行っていない。Maestroフロー雛形は `.maestro/` に置く（未実行・雛形段階）。

## 2. 現状の前提

* EAS `preview` / `production` プロファイルはとも **APK・internal distribution**（`eas.json`）。開発サーバー不要の単体APKをエミュレータへ入れて確認できる
* `android.package`（appId）は **`com.ykjob.mindhub`**（`app.json`）。adb / Maestroでアプリを指定する識別子
* コピー成功の可視シグナルがある：成功時に「コピーしました」を画面表示（`app/prompts/index.tsx` は緑ボタン、`NoteForm` は「コピーしました ✓」）
* メモはexpo-sqliteで端末内サンドボックスに保存されるため、force-stop→再起動で永続化を検証できる
* **現状 `testID` / `accessibilityLabel` は未整備（コード全体で0件）**。そのためMaestroは「見える日本語テキスト」（保存・キャンセル・コピー・カテゴリ名・visibility名など）で操作・検証する形になる

## 3. adbでできること

adb（Android SDK Platform-Tools）は主に「土台・配管」部分を担う。

* エミュレータ起動・APKインストール：`adb install -r app.apk`
* アプリ起動 / 強制終了 / 再起動：`adb shell am start` / `adb shell am force-stop com.ykjob.mindhub`（再起動・永続化確認に有効）
* スクリーンショット取得：`adb exec-out screencap`（目視・記録用）
* 画面階層ダンプ：`adb shell uiautomator dump`（テキストが出ているかの粗い確認）
* 座標タップ・テキスト入力：`adb shell input tap x y` / `adb shell input text`

## 4. adb単独では厳しいこと

* 座標タップは解像度・レイアウト変化で壊れる（チップ選択・カード展開のような要素依存の操作に不向き）
* 「特定の文言が表示されたら次へ進む」という条件待ち・アサーションの記述が非常に煩雑
* 14ステップの連続シナリオを読みやすく保守するのが困難

結論：adbは「エミュレータ起動・APK投入・再起動・スクショ」までの配管と、ごく初期の起動スモーク（クラッシュせず立ち上がるか）には十分。要素操作＋検証を伴う本体シナリオはadb単独では割に合わない。

## 5. Maestroでできること

本プロジェクトのシナリオは、リリースAPKに対するブラックボックスE2Eであり、Maestroの得意領域。

* YAMLでフロー記述。`launchApp` / `stopApp` / `tapOn` / `inputText` / `assertVisible` / `scroll` / `extendedWaitUntil` など
* **可視テキストで操作**できるため、testID未整備の現状でも日本語ラベルでそのまま書ける
* 再起動テスト：`stopApp` → `launchApp`（clearStateを付けない）で永続化を検証できる。フロー冒頭で1回だけ `launchApp: clearState: true` すればクリーンな初期状態から開始できる
* コピー確認：Maestroは**Androidクリップボードの中身を直接読む機能を持たない**ため、コピー後に画面へ出る**「コピーしました」を `assertVisible` で確認**する。これは `copyToClipboard()` の成功パスが通ったことの実質的な証明になる

## 6. Detox / Appium / Maestro の比較

| ツール | 特徴 | 本プロジェクトでの評価 |
|--------|------|----------------------|
| Detox | dev-client / インストルメンテーション前提。グレーボックス | EASで作った**実リリースAPKの検証**には不向き。設定が重い。非推奨 |
| Appium | 高機能・多言語。WebDriverベース | 導入・保守コストが最も重い。個人開発の日常スモークには過剰 |
| Maestro | YAMLフロー・可視テキスト操作・リリースAPK検証向き | 導入が最軽量で要件に最も合う。**推奨** |

## 7. Windows環境での導入方針

| 要素 | 導入コスト | 備考 |
|------|-----------|------|
| Androidエミュレータ | 中〜大 | Android Studio + AVD。x86_64のGoogle APIsイメージ、ハードウェア高速化（WHPX/Hyper-V）が必要。初回セットアップが一番重い |
| adb (platform-tools) | 小 | Android Studio同梱、単体配布もあり |
| Maestro | 中 | Windowsネイティブは不安定なため、**実質 WSL2 経由を推奨**。WSL2上にMaestro + JDKを入れ、Windows側adbサーバーに接続する構成が安定 |
| EAS APK取得 | 小 | projectId設定済み。`eas build:run` かAPK手動DL＋`adb install` |

EAS→エミュレータの流れ：

```
eas build -p android --profile preview        # クラウドでAPK生成（10〜20分）
eas build:run -p android --profile preview    # 起動中エミュレータへ自動DL＋install
# または .apk を手動DL → adb install -r app.apk
```

EASのinternal/APKは複数ABIを含む universal APK のため、x86_64エミュレータで動作する。開発サーバー不要のAPK確認にそのまま使える。

## 8. 推奨構成

**Maestro（可視テキストベース）＋ adb（配管）の組み合わせ。CIには当面載せない。**

* **adb は配管**：エミュレータ起動・APKインストール・force-stop/再起動・スクリーンショット
* **Maestro はUIシナリオ**：14ステップの日常利用シナリオの操作と検証
* **CI化は後回し**：UI・キーボード周りがまだ流動的（16章の許容事項が残る）で、EASビルドが1回10〜20分かかるため、フルCI自動化は時期尚早。まずはローカル手動起動のオンデマンド運用が費用対効果が高い

ファイル配置：

```
.maestro/
  README.md                       # 前提・実行コマンド・雛形である旨
  flows/
    01_create_and_persist.yaml    # シナリオ1〜10
    02_prompt_copy.yaml           # シナリオ11〜14
docs/memo-app/
  19-android-emulator-testing.md  # 本ファイル
```

将来の堅牢化（コード変更を伴うため今回対象外）：主要要素（保存ボタン・カテゴリ/visibilityチップ・検索欄・コピーボタン・プロンプトカード）に `testID` を付与すると、文言変更やレイアウト変化に強くなる。

## 9. 最初に作るべき最小テスト

### 01_create_and_persist.yaml（シナリオ1〜10）

最も価値が高い。起動・作成・入力・カテゴリ・visibility・保存・一覧・再起動・永続化を一気通貫でカバー。冒頭で1回だけ `clearState: true` し、再起動時は `clearState` を付けないことで永続化を検証する。

### 02_prompt_copy.yaml（シナリオ11〜14）

プロンプト集を開く・検索・カード展開・コピー押下・「コピーしました」表示の確認。クリップボード内容の直接検証ではなく、画面の成功表示で判定する。

## 10. すぐやること / 後回しにすること

すぐ（低コスト・高価値）：

* 本調査結果のドキュメント化（本ファイル）
* Maestroフロー雛形2本の用意（`.maestro/flows/`）
* エミュレータ準備後、`eas build:run` → `maestro test .maestro/flows` のローカルオンデマンド実行で手動スマホ確認を置き換える

後回し（UI安定後）：

* `testID` 付与による堅牢化
* CI（Maestro CloudやCI上のエミュレータ）への組み込み

ボトルネックはテストツールではなく、エミュレータ環境の初期構築とEASビルド時間。ここを一度用意すれば以後の回帰確認コストは大きく下がる。

## 11. 既知の制約

* **可視テキスト依存**のため、ボタン文言・カテゴリ名・visibility名などの**文言変更でフローが壊れる**。文言を変えたらフローも直す必要がある
* `testID` 追加は将来対応（今回はアプリ本体コードを変更しない方針）
* **エミュレータ環境構築が初回ボトルネック**（Android Studio / AVD / ハードウェア高速化）
* **EASビルドに時間がかかる**（1回10〜20分）。修正のたびに毎回フルビルドすると回転が遅い
* **クリップボード内容の直接検証はしない**。コピー後に表示される「コピーしました」を確認することで、`copyToClipboard()` の成功パスが通ったことを間接的に検証する
* Maestroフローは現時点で**未実行の雛形**。実際のエミュレータでの動作保証はこれから

## 12. 残る未決事項

* Maestro実行環境（WSL2構成 or Windowsネイティブ）の確定
* エミュレータのAVDイメージ選定（APIレベル・x86_64）
* フローの実行タイミング（手動オンデマンドのままか、将来CI化するか）
* `testID` を付与するかどうか、付与するならどの要素までか
* テスト実行で作成したメモのクリーンアップ方針（毎回 `clearState` で初期化するか、削除フローを足すか）
