# MindHub

スマホで素早くメモを書き、思考や仕事の整理、AI向けプロンプトの活用につなげる「思考整理ハブ」です。

**[公開Web版を試す](https://ykjob.github.io/MindHub_App/)**

## 試せること

- 「さくっとメモ」で文章を作成・保存・編集
- 記録の検索・分類・Markdown表示
- 作業開始・行き詰まり・質問・報告・終業前の整理
- プロンプト集の閲覧、文章のコピー、対応ブラウザでの共有

まず「さくっとメモ」に架空の文章を入力すると、保存から整理までの流れを確認できます。PCでも画面は最大480pxのスマホ幅で表示します。

## データとWeb版の制限

入力したメモは閲覧者自身のブラウザ内に保存されます。開発者のメモや設定は含まれておらず、Android版との自動同期もありません。ブラウザのデータ消去でメモが失われることがあります。個人情報・勤務先の非公開情報は入力せず、デモ用の架空データでお試しください。

初回は保存機能の準備のため一度自動的に再読み込みします。SQLiteのWeb対応は実験的で、最新のChrome・Edgeなどでの利用を想定しています。GitHubトークン保存・GitHubアップロードはWeb版では非対応です。外部AIとの連携はコピー・OS/ブラウザ共有で行い、AIへ自動送信しません。Googleタスク・カレンダーとの自動連携は実装していません。

## 技術・制作

Expo SDK 54 / React Native / TypeScript / Expo Router / SQLiteを使用しています。個人制作として機能・画面・データ管理の仕様を整理し、生成AI（ChatGPT・Claude Code・Codex）を活用して実装・レビュー・動作確認を進めています。

## 開発・Web公開

```sh
npm ci
npm run web
```

公開用は `npm run build:pages` で生成した `dist/` のみをGitHub ActionsからGitHub Pagesへ配置します。リポジトリの `docs/`、作業規則、ローカルDB、ソースマップは公開サイトへ配布しません。アプリ内の汎用プロンプトは含まれます。

GitHub PagesのSourceは **GitHub Actions** に設定します。公開用のパス設定・スマホ幅・SQLite用Service WorkerはWeb公開ビルドだけに適用し、既存のAndroidパッケージ名・versionCode・EAS APK設定・DB仕様を維持しています。
