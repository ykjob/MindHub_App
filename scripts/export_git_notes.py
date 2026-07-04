#!/usr/bin/env python3
"""Git候補メモ一括Markdown書き出しスクリプト（Phase 7 土台）。

MindHub_AppのSQLiteデータベース（notesテーブル）からメモを読み取り、
docs/notes/{project}/{date}_{type}_{slug}.md 形式で書き出す。

注意：
    Web版アプリのDBはブラウザ内ストレージ（OPFS）にあり、このスクリプトから
    直接アクセスできない。DBファイルを取り出す手段が確立するまでは、
    --db でSQLiteファイルのパスを明示指定して使う。
    詳細は docs/memo-app/11-open-issues.md を参照。

使用例：
    python scripts/export_git_notes.py --db path/to/flowdock.db --dry-run
    python scripts/export_git_notes.py --db path/to/flowdock.db --include-private-notes --dry-run
    python scripts/export_git_notes.py --db path/to/flowdock.db --project memo_app
    python scripts/export_git_notes.py --db path/to/flowdock.db --type command
"""

import argparse
import json
import re
import sqlite3
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

MAX_SLUG_LENGTH = 50
MAX_PROJECT_LENGTH = 80
FORBIDDEN_CHARS = re.compile(r"[\\/:*?\"<>|#%&{}$!'@+`=,.;()\[\]]")
PATH_UNSAFE_CHARS = re.compile(r"[\\/:*?\"<>|]+")
JST = timezone(timedelta(hours=9))


def slugify(title: str) -> str:
    slug = title.strip().lower()
    slug = re.sub(r"[\s　]+", "-", slug)
    slug = FORBIDDEN_CHARS.sub("", slug)
    slug = re.sub(r"-+", "-", slug).strip("-")
    slug = slug[:MAX_SLUG_LENGTH]
    return slug or "untitled"


def sanitize_project_segment(project: str) -> str:
    safe = project.strip()
    safe = re.sub(r"[\s　]+", "-", safe)
    safe = PATH_UNSAFE_CHARS.sub("-", safe)
    safe = re.sub(r"\.+", "-", safe)
    safe = re.sub(r"-+", "-", safe).strip("-")
    safe = safe[:MAX_PROJECT_LENGTH]
    return safe or "general"


def yaml_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def yaml_string_array(values: list[str]) -> str:
    return "[" + ", ".join(yaml_string(value) for value in values) + "]"


def build_export_path(note: sqlite3.Row) -> str:
    project = sanitize_project_segment(note["project"] or "")
    date = (note["created_at"] or "")[:10]
    return f"docs/notes/{project}/{date}_{note['type']}_{slugify(note['title'])}.md"


def build_markdown(note: sqlite3.Row) -> str:
    tags = [t.strip() for t in (note["tags"] or "").split(",") if t.strip()]
    front_matter = "\n".join(
        [
            "---",
            f"title: {yaml_string(note['title'] or 'untitled')}",
            f"project: {yaml_string(sanitize_project_segment(note['project'] or ''))}",
            f"type: {yaml_string(note['type'])}",
            f"tags: {yaml_string_array(tags)}",
            f"createdAt: {yaml_string(note['created_at'])}",
            f"updatedAt: {yaml_string(note['updated_at'])}",
            f"source: {yaml_string('MindHub_App')}",
            "---",
        ]
    )
    return f"{front_matter}\n\n{note['body']}\n"


def fetch_notes(db_path: Path, include_private_notes: bool, project: str | None, type_: str | None):
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conditions = ["archived_at IS NULL"]
    params: list[str] = []
    if not include_private_notes:
        conditions.append("is_git_candidate = 1")
    if project:
        conditions.append("project = ?")
        params.append(project)
    if type_:
        conditions.append("type = ?")
        params.append(type_)
    sql = f"SELECT * FROM notes WHERE {' AND '.join(conditions)} ORDER BY created_at"
    rows = conn.execute(sql, params).fetchall()
    conn.close()
    return rows


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Git候補メモのみをMarkdownとして一括書き出す"
    )
    parser.add_argument("--db", required=True, help="SQLite DBファイルのパス")
    parser.add_argument("--out", default=".", help="出力先ルート（既定：カレントディレクトリ）")
    parser.add_argument("--dry-run", action="store_true", help="書き出さず対象一覧のみ表示")
    parser.add_argument(
        "--include-private-notes",
        action="store_true",
        help=(
            "危険: Git候補ではない個人メモも対象に含める。"
            "通常は指定しないでください。"
        ),
    )
    parser.add_argument("--project", help="プロジェクト名で絞り込む")
    parser.add_argument("--type", dest="type_", metavar="TYPE", help="カテゴリ（type）で絞り込む")
    parser.add_argument(
        "--mark-exported", action="store_true", help="書き出し後にexport情報をDBへ記録する"
    )
    args = parser.parse_args()

    db_path = Path(args.db)
    if not db_path.exists():
        print(f"エラー：DBファイルが見つかりません：{db_path}", file=sys.stderr)
        return 1

    notes = fetch_notes(db_path, args.include_private_notes, args.project, args.type_)
    if not notes:
        print("対象メモはありません。")
        return 0

    out_root = Path(args.out)
    print(f"対象：{len(notes)}件")
    for note in notes:
        rel_path = build_export_path(note)
        marker = "[dry-run] " if args.dry_run else ""
        git_flag = "git" if note["is_git_candidate"] else "---"
        print(f"{marker}({git_flag}) {rel_path}")
        if args.dry_run:
            continue
        target = out_root / rel_path
        docs_notes_root = (out_root / "docs" / "notes").resolve()
        resolved_target = target.resolve()
        if docs_notes_root not in [resolved_target, *resolved_target.parents]:
            print(f"エラー：出力先がdocs/notes外です：{rel_path}", file=sys.stderr)
            return 1
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(build_markdown(note), encoding="utf-8")
        if args.mark_exported:
            conn = sqlite3.connect(db_path)
            conn.execute(
                "UPDATE notes SET export_dir = ?, export_filename = ?, "
                "export_path = ?, exported_at = ? WHERE id = ?",
                (
                    str(target.parent),
                    target.name,
                    rel_path,
                    datetime.now(JST).isoformat(),
                    note["id"],
                ),
            )
            conn.commit()
            conn.close()

    if not args.dry_run:
        print("書き出しが完了しました。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
