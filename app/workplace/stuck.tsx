import React from 'react';
import WorkplaceSceneForm from '../../src/components/WorkplaceSceneForm';
import { buildStuckText } from '../../src/features/workplace/workplaceService';

export default function WorkplaceStuckScreen() {
  return (
    <WorkplaceSceneForm
      intro="詰まったときに、状況・試したこと・確認したいことを言語化します。抱え込まず、この出力を質問の下書きにも使えます（保存はしません）。"
      fields={[
        { key: 'situation', label: '状況', placeholder: '何をしていて、どう詰まったか' },
        { key: 'tried', label: '試したこと', placeholder: '自分で試した対処' },
        { key: 'wantToConfirm', label: '確認したいこと', placeholder: '聞きたい・確かめたいこと' },
        { key: 'error', label: 'エラー内容', placeholder: 'エラーメッセージなど（一般化して記載）', optional: true },
      ]}
      buildText={(v) =>
        buildStuckText({
          situation: v.situation,
          tried: v.tried,
          wantToConfirm: v.wantToConfirm,
          error: v.error,
        })
      }
    />
  );
}
