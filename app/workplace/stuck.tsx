import React from 'react';
import { router } from 'expo-router';
import WorkplaceSceneForm from '../../src/components/WorkplaceSceneForm';
import { buildStuckText } from '../../src/features/workplace/workplaceService';
import { setQuestionTimingHandoff } from '../../src/features/workplace/workplaceHandoff';

export default function WorkplaceStuckScreen() {
  return (
    <WorkplaceSceneForm
      intro="行き詰まったときに、状況・試したこと・確認したいことを言語化します。抱え込まず、この出力を質問の下書きにも使えます（保存はしません）。"
      fields={[
        { key: 'situation', label: '状況', placeholder: '何をしていて、どう行き詰まったか' },
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
      // 出力後に「質問タイミングを確認」へ進む導線（Phase 16B）。詰まりの現在値を一時領域へ渡す。
      outputAction={{
        label: '質問タイミングを確認',
        accessibilityLabel: '質問タイミングを確認する',
        onPress: ({ values }) => {
          setQuestionTimingHandoff({
            situation: values.situation ?? '',
            tried: values.tried ?? '',
            wantToConfirm: values.wantToConfirm ?? '',
            error: values.error ?? '',
          });
          router.push('/workplace/question-timing');
        },
      }}
    />
  );
}
