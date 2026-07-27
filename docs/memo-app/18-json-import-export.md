# JSONエクスポート・インポート仕様（PC⇔Android手動移行）

追加日：2026-07-07

## 1. 目的

PC Web版とAndroid APK版はDBが別々（Web=ブラウザ内OPFS、Android=端末内SQLite）のため、メモを手動で移行する手段としてJSONエクスポート・インポートを用意する。

* 主用途1：PC Web版で作成したnotesをAndroid APK版へ移す
* 主用途2：バックアップ（エクスポートJSONをそのまま保管する）
* 自動同期は対象外のまま（`16-platform-and-distribution.md` 4章）。手動のエクスポート→ファイル移動→インポートのみ

### 1.1 上位仕様 `34` との関係（2026-07-27追記）

本ファイルは、notesを対象にした**初期のPC⇔Android手動移行仕様**として残す。`memos` を含む完全バックアップ・復元、既存環境への統合と競合確認、GitHub Markdown取り込み、共有コピーの上位方針は `34-backup-restore-and-external-import.md`（正本）で定める。

* 本ファイルの重複ID処理は、`34` に合わせて改定した（§5・§6）
* 本ファイルのJSON例・notesの全カラムを入れる方針は、`34` と矛盾しない範囲で維持する
* **完全バックアップJSONの最終形式は本ファイルで確定しない**（`memos` を含む形式・`formatVersion` 等の識別は `34` §5 を参照）

## 2. 責務分担

| 側 | 機能 | 内容 |
|---|---|---|
| PC Web版 | JSONエクスポート | notesを全件（または絞り込み結果）JSONにしてブラウザダウンロード |
| Android APK版 | JSONインポート | ファイルを選択→検証→取込→結果表示 |

* エクスポートは既存のMarkdown書き出しと同様、ブラウザダウンロード方式
* インポートはAndroid側が主。PC Web版へのインポートは将来候補（優先しない）

## 3. JSON形式（案）

```json
{
  "format": "mindhub-notes",
  "schemaVersion": 2,
  "exportedAt": "2026-07-07T12:00:00.000Z",
  "noteCount": 2,
  "notes": [
    {
      "id": "...",
      "title": "...",
      "body": "...",
      "project": "...",
      "type": "worklog",
      "tags": "sqlite,expo",
      "source": "manual",
      "visibility": "private",
      "is_git_candidate": 0,
      "export_dir": null,
      "export_filename": null,
      "export_path": null,
      "exported_at": null,
      "created_at": "...",
      "updated_at": "...",
      "archived_at": null
    }
  ]
}
```

方針。

* `format`：ファイル種別の識別子。固定文字列 `mindhub-notes`
* `schemaVersion`：notesテーブルのschema_versionと合わせる（現行2）
* notesの全カラムをそのまま入れる（Markdown本文もそのまま）。アーカイブ済みも含める（バックアップ用途のため）
* 対象はnotesのみ（v1）。FlowDockのmemos、note_categories / note_templates（Phase 8実装後）は将来候補

## 4. インポート時の検証

1. `format` が `mindhub-notes` でなければ中止（エラー表示）
2. `schemaVersion` がアプリ側より新しければ中止（アプリの更新を促す）
3. `schemaVersion` が古い場合は将来のマイグレーション対象（現行はv2のみ受理）
4. 各noteの必須フィールド（id / created_at / updated_at）欠落は、その1件を失敗扱いにして続行

## 5. 重複IDの扱い（2026-07-27 改定。正本は `34` §6.3）

`34-backup-restore-and-external-import.md` の方針に合わせ、`updated_at` だけを根拠に自動上書きしない扱いへ改める。

* **空の環境への復元**（新規インストール後など、対象データが存在しない場合）：元のIDを維持して登録する（新規追加）
* **既存環境への統合**：
  * 同じID・同じ内容 → スキップ
  * 同じID・内容が異なる → **競合**として扱う。`updated_at` だけを根拠に自動上書きしない
  * 内容が新しいことと、残すべき内容であることは同じではないため、明示的な選択なしに既存データを置き換えない
* 競合時の選択（端末側を残す／取り込み側で置き換える／取り込み側を別レコードとして保存する／今回は取り込まない）や一括方針は将来候補とする。危険な一括上書きを必須機能にしない
* 詳細（競合確認画面・IDの扱い・共有コピー時の新ID発行など）は `34` を参照する

## 6. 結果表示

インポート完了時に件数を表示する。

* 追加：n件
* スキップ：n件（同じID・同じ内容）
* 競合：n件（同じID・内容が異なる。自動上書きせず、確認・選択の対象）
* 失敗：n件（形式不正など。可能なら理由も表示）

※旧記述の「更新：n件（`updated_at` で自動上書き）」は §5 改定に伴い廃止し、内容相違は「競合」として扱う。

## 7. 未確定事項（11-open-issues.md 12章と連動）

* Android側のファイル選択方法（expo-document-picker等の依存追加が必要か。導入判断は環境分離の説明とセットで行う）
* インポート画面の場所（設定画面か /notes 配下か）
* PC Web版エクスポートボタンの置き場所（notes一覧のメニューか）
* トランザクション粒度（全件1トランザクションか、1件ずつコミットして失敗行のみスキップか）※実装時に決定
* memos（FlowDock）・テンプレートを対象に含める時期

## 8. 関連仕様書

* 端末別運用・配布方針：`16-platform-and-distribution.md`
* データモデル：`03-data-model.md`
* 配布・共有方針：`17-distribution-and-sharing.md`（配布用データエクスポートとは別機能）
