import React from 'react';
import { router } from 'expo-router';
import WorkplaceSceneForm from '../../src/components/WorkplaceSceneForm';
import { buildReportText } from '../../src/features/workplace/workplaceService';
import { setSharePayload } from '../../src/features/share/shareHandoff';

export default function WorkplaceReportScreen() {
  return (
    <WorkplaceSceneForm
      intro="進捗報告を、結論から短く分かりやすい形に整理します。出力はコピーしてチャットや日報に貼れます（この画面では保存しません）。AI・チャット・メールに貼る前に、顧客名・会社名・個人名・内部URL・システム名・社内マニュアル本文・職場固有の判断基準は一般化してから使ってください。"
      fields={[
        { key: 'state', label: '現在の状態', placeholder: '結論として今どういう状態か' },
        { key: 'doneToday', label: '今日やったこと', placeholder: '取り組んだ作業' },
        { key: 'completed', label: '完了したこと', placeholder: '終わったもの' },
        { key: 'remaining', label: '残っていること', placeholder: '途中・未着手のもの' },
        { key: 'blocker', label: '詰まっていること', placeholder: '止まっている点・困りごと', optional: true },
        { key: 'next', label: '次にやること', placeholder: '次に着手する作業' },
        { key: 'consult', label: '相談・確認したいこと', placeholder: '相談・確認したい点', optional: true },
      ]}
      buildText={(v) =>
        buildReportText({
          state: v.state,
          doneToday: v.doneToday,
          completed: v.completed,
          remaining: v.remaining,
          blocker: v.blocker,
          next: v.next,
          consult: v.consult,
        })
      }
      saveHint="この画面ではコピーのみです。保存する場合は「ChatGPTなどへ共有」から共有確認画面で行えます（private・Git候補外）。"
      // Phase 16C-3：完成報告文を共通共有確認画面へ渡す。守秘3チェック・コピー・OS共有・
      // 任意保存（saveReportNote）は共有確認画面側で行う。この画面の既存コピーは変更しない
      // （保存ボタンもこの画面には追加しない。33 §7.4・判断B）。
      outputAction={{
        label: 'ChatGPTなどへ共有',
        accessibilityLabel: 'ChatGPTなどへ共有',
        onPress: ({ output }) => {
          setSharePayload({
            kind: 'workplace_report',
            originLabel: '現場適応・報告',
            baseText: output,
          });
          router.push('/share/confirm');
        },
      }}
    />
  );
}
