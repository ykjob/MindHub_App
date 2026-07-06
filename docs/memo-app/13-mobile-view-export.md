# スマホ閲覧用HTML/JSONエクスポート仕様

追加日：2026-07-06

## 1. 目的

PCで入力・編集・保存したnotesを、スマホからも閲覧専用で見られるようにする。

SQLiteそのものをスマホと共有するのではなく、PC側で閲覧用HTML/JSONを出力する。

これにより、従来の「スマホ確認はGitHubアプリで代用する」方針を置き換える。

2026-07-06追記：端末別運用方針（`16-platform-and-distribution.md`）により、この閲覧ページの主な利用者は家族（iPhone、Safari等で閲覧）とする。家族は編集・管理をしない想定のため、iPhone向けアプリ配布・EAS iOSビルドは行わず、この閲覧専用ページで代替する。自分（Android）はAndroid APK版アプリを使う。

## 2. 出力先案

```text
docs/mobile-view/
  index.html
  notes-data.json
```

## 3. スマホ閲覧対象の安全条件

スマホ閲覧対象は、安全側に限定する。

基本条件。

```text
archived_at IS NULL
かつ
is_git_candidate = true
かつ
visibility = git_candidate
```

さらに、公開許可カテゴリに含まれるものだけを対象にする。

### 3.1 公開許可カテゴリ（初期）

```text
worklog
research
command
design
error_note
template
claude_prompt
```

### 3.2 除外カテゴリ（初期）

```text
thought
chatgpt_log
jobsearch
family
```

### 3.3 familyカテゴリとvisibilityの扱い（2026-07-06追加）

家庭内情報用に `family` カテゴリを追加する（`04-categories-and-tags.md`、`17-distribution-and-sharing.md` 4.2参照）。

* 家庭内の決まり事・マニュアルは公開GitHub Pagesに出さないため、familyカテゴリは初期の除外カテゴリに含める
* 公開可否はカテゴリだけで判定せず、visibilityを併用する。category = family でも、visibility = private または visibility = family のものは公開GitHub Pagesには出さない
* 家族向けの非公開な閲覧手段（非公開配置先、ローカルHTML共有、PDF、JSONインポート、private向けPWA等）は別途検討する（`11-open-issues.md` 13章）
* 2026-07-07実装済み：本節の判定ロジックを `src/features/notes/mobileViewPolicy.ts`（judgeMobileViewExport。除外理由つき）として先行実装した。Phase 10のエクスポート実装時にこれを使う

## 4. 出力前確認画面

HTML/JSONを生成する前に、出力対象確認画面を表示する。

確認画面に表示する項目。

* タイトル
* プロジェクト
* カテゴリ
* タグ
* visibility
* Git候補
* 更新日時
* 出力対象かどうか
* 除外理由

目的。

* private / internalメモの混入防止
* 個人情報入りメモの誤公開防止
* 公開OKメモだけを確認してから出力する

## 5. スマホ閲覧ページの機能

### 5.1 基本方針

スマホ閲覧ページは、編集機能を持たない。

スマホ側では以下に限定する。

* 閲覧
* 検索
* 絞り込み
* コピー

### 5.2 初期機能

* 最近更新したメモ表示
* キーワード検索
* プロジェクト絞り込み
* カテゴリ絞り込み
* タグ絞り込み
* 更新日順表示
* 簡易Markdown表示
* 本文コピー
* プロンプトコピー
* コマンドコピー

### 5.3 簡易Markdown表示

スマホ閲覧用HTMLでは、本格的なMarkdownエディタは不要。

最低限、以下が読みやすく表示できればよい。

* 見出し
* 箇条書き
* 番号付きリスト
* コードブロック
* 区切り線
* 強調
* リンク

### 5.4 コピーボタン

スマホ閲覧ページには、以下のコピーボタンを用意する。

* 本文コピー
* コマンドだけコピー
* ChatGPT用プロンプトコピー
* Geminiへ渡す用テキストコピー
* Googleタスク用整形テキストコピー

## 6. GitHub Pages / 自分のWebページ閲覧方針

### 6.1 初期方針

初期はGitHub Pagesでの閲覧を想定する。

ただし、将来的には自分のWebページにも配置できる構造にする。

### 6.2 公開前提

初期のスマホ閲覧ページは、公開されても困らない内容だけを扱う。

そのため、private / internalメモは出さない。

就活が終わった後、必要であればプライベート寄りの情報を扱える閲覧方法を検討する（`15-future-and-rejected-policies.md` 参照）。

2026-07-06決定：家族間の決まり事・家庭内マニュアルなどの家庭内情報は、公開GitHub Pagesには置かない。公開GitHub Pagesに出してよいのは、公開されても困らない内容だけに限定する（本節の前提を維持する）。家庭内情報の共有手段は、非公開配置先・ローカルHTML共有・PDF・JSONインポート・将来のprivate向けPWAなどを別途検討する（`17-distribution-and-sharing.md` 4.1、`11-open-issues.md` 13章）。

## 7. 手動push運用

### 7.1 方針

アプリ内GitHub自動pushは採用しない。

理由。

* GitHubトークン管理が必要
* 誤アップロードのリスクがある
* privateメモ混入時の被害が大きい
* 初期実装としては複雑すぎる

### 7.2 初期運用フロー

```text
MindHub_Appでスマホ閲覧用HTML/JSONを生成
↓
出力対象を確認
↓
docs/mobile-view/ に配置
↓
手動でgit add / commit / push
```

### 7.3 将来候補

必要になったら、ワンコマンド更新スクリプトを検討する。

例。

```text
スマホ閲覧HTML生成
git add docs/mobile-view
git commit
git push
```

ただし、アプリ内から直接pushする機能は採用しない。

## 8. 関連仕様書

* Markdown書き出し・Git候補ルール：`07-export-and-git-rules.md`
* データモデル：`03-data-model.md`
* スマホ用プロンプト集HTML・mobile-inbox：`14-mobile-prompt-hub-and-inbox.md`
* 将来候補・不採用方針：`15-future-and-rejected-policies.md`
