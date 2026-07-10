import React from 'react';
import WorkplaceSceneForm from '../../src/components/WorkplaceSceneForm';
import { buildQuestionText } from '../../src/features/workplace/workplaceService';

export default function WorkplaceQuestionScreen() {
  return (
    <WorkplaceSceneForm
      intro="質問する前に、相手が答えやすい形に整理します。出力はコピーしてチャットやメールに貼れます（保存はしません）。AI・チャット・メールに貼る前に、顧客名・会社名・個人名・内部URL・システム名・社内マニュアル本文・職場固有の判断基準は一般化してから使ってください。"
      fields={[
        { key: 'ask', label: '聞きたいこと', placeholder: '結論として一番聞きたいこと' },
        { key: 'background', label: '背景', placeholder: 'どういう作業・状況での質問か' },
        { key: 'checked', label: '自分で確認したこと', placeholder: '調べた・読んだこと' },
        { key: 'tried', label: '試したこと', placeholder: '実際に試した対処' },
        { key: 'decision', label: '相手に判断してほしいこと', placeholder: '判断・選択してほしい点' },
        { key: 'urgency', label: '急ぎ度', placeholder: '急ぎ / 今日中 / 今週中 など', optional: true },
      ]}
      buildText={(v) =>
        buildQuestionText({
          ask: v.ask,
          background: v.background,
          checked: v.checked,
          tried: v.tried,
          decision: v.decision,
          urgency: v.urgency,
        })
      }
    />
  );
}
