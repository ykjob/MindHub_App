# JSONエクスポート・インポート仕様（PC⇔Android手動移行）

追加日：2026-07-07

## 1. 目的

PC Web版とAndroid APK版はDBが別々（Web=ブラウザ内OPFS、Android=端末内SQLite）のため、メモを手動で移行する手段としてJSONエクスポート・インポートを用意する。

* 主用途1：PC Web版で作成したnotesをAndroid APK版へ移す
* 主用途2：バックアップ（エクスポートJSONをそのまま保管する）
* 自動同期は対象外のまま（`16-platform-and-distribution.md` 4章）。手動のエクスポート→ファイル移動→インポートのみ

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

## 5. 重複IDの扱い（案）

* 既定：`updated_at` を比較し、インポート側が新しければ上書き（更新）、既存側が新しければスキップ
* 同一 `updated_at` はスキップ
* 「常に上書き」「常にスキップ」の選択UIは将来候補（v1は既定動作のみ）

## 6. 結果表示

インポート完了時に件数を表示する。

* 追加：n件
* 更新：n件
* スキップ：n件（既存の方が新しい・同一）
* 失敗：n件（形式不正など。可能なら理由も表示）

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
