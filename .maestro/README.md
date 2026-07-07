# .maestro — Androidエミュレータ用UIテストフロー（雛形）

このディレクトリは、Androidエミュレータ上で最低限の日常利用シナリオを自動確認するための
[Maestro](https://maestro.mobile.dev/) フローを置く場所です。

調査・導入の背景と方針は `docs/memo-app/19-android-emulator-testing.md` を参照してください。

## 目的

Android APKの修正ごとに毎回スマホで手動確認する手間を減らし、エミュレータ上で
メモ作成・保存・再起動後保持・プロンプトコピーの回帰確認を自動化する。

## 前提

* Androidエミュレータが起動していること
* 対象APK（EAS `preview` プロファイルの成果物など）がエミュレータにインストール済みであること
* `appId` は **`com.ykjob.mindhub`**
* Maestroがインストール済みであること（Windowsでは WSL2 経由を推奨。詳細は 19-android-emulator-testing.md §7）

APKの入れ方（例）:

```
eas build:run -p android --profile preview     # 起動中エミュレータへ自動DL＋install
# または .apk を手動DL → adb install -r app.apk
```

## 実行イメージ

```
maestro test .maestro/flows/01_create_and_persist.yaml
maestro test .maestro/flows/02_prompt_copy.yaml
```

ディレクトリ単位でまとめて実行することもできる:

```
maestro test .maestro/flows
```

## フロー一覧

| ファイル | 確認シナリオ |
|---------|------------|
| `flows/01_create_and_persist.yaml` | 起動→メモ管理→新規作成→入力→カテゴリ→visibility→保存→一覧確認→再起動→永続化確認 |
| `flows/02_prompt_copy.yaml` | 起動→プロンプト集→検索→カード展開→コピー→「コピーしました」確認 |

## 注意（重要）

* **これらは雛形であり、実行保証済みではありません。** 実際のエミュレータでの動作確認はこれからです
* フローは画面上の**可視テキスト**（保存・コピー・カテゴリ名・visibility名など）に依存しています。
  アプリの**文言や画面構成が変わったら、フローの修正が必要**です
* `testID` は未整備のため、将来 testID を付与した場合はより堅牢なセレクタへ置き換え可能です
* コピー成功は、クリップボード内容の直接検証ではなく画面表示「コピーしました」で判定しています
