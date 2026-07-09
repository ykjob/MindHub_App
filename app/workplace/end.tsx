import React from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import WorkplaceSceneForm from '../../src/components/WorkplaceSceneForm';
import {
  buildEndText,
  saveEndNote,
} from '../../src/features/workplace/workplaceService';

export default function WorkplaceEndScreen() {
  const db = useSQLiteContext();

  return (
    <WorkplaceSceneForm
      intro="終業前に今日を振り返り、明日そのまま再開できるメモを残します。保存すると翌日この現場適応モードの上部に表示されます。"
      fields={[
        { key: 'doneToday', label: '今日やったこと', placeholder: '完了した作業・進んだところ' },
        { key: 'todo', label: '未完了', placeholder: '途中のもの・残っているもの' },
        { key: 'firstTomorrow', label: '明日最初にやること', placeholder: '翌朝いちばんに着手すること' },
        { key: 'note', label: '再開のための補足', placeholder: '思い出すためのメモ・注意点', optional: true },
      ]}
      buildText={(v) =>
        buildEndText({
          doneToday: v.doneToday,
          todo: v.todo,
          firstTomorrow: v.firstTomorrow,
          note: v.note,
        })
      }
      onSave={(text) => saveEndNote(db, text).then(() => undefined)}
      saveLabel="再開メモとして保存"
    />
  );
}
