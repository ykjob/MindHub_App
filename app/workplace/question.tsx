import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import WorkplaceSceneForm from '../../src/components/WorkplaceSceneForm';
import {
  buildQuestionText,
  saveQuestionNote,
} from '../../src/features/workplace/workplaceService';
import {
  getQuestionFormHandoff,
  clearQuestionFormHandoff,
} from '../../src/features/workplace/workplaceHandoff';
import { setSharePayload } from '../../src/features/share/shareHandoff';

export default function WorkplaceQuestionScreen() {
  const db = useSQLiteContext();

  // 質問タイミング確認からの引き継ぎ。useState初期化関数では純粋に get するだけ（副作用なし＝Strict Mode安全）。
  // 初回commit後に useEffect で1回だけ clear する（無ければ従来どおり空フォーム）。
  const [handoff] = useState(() => getQuestionFormHandoff());
  useEffect(() => {
    clearQuestionFormHandoff();
  }, []);

  const initialValues = handoff
    ? {
        ask: handoff.ask,
        background: handoff.background,
        checked: handoff.checked,
        tried: handoff.tried,
        decision: handoff.decision,
        urgency: handoff.urgency,
      }
    : undefined;

  return (
    <WorkplaceSceneForm
      intro="質問する前に、相手が答えやすい形に整理します。出力はコピーしてチャットやメールに貼れます。AI・チャット・メールに貼る前に、顧客名・会社名・個人名・内部URL・システム名・社内マニュアル本文・職場固有の判断基準は一般化してから使ってください。"
      banner={
        handoff
          ? '詰まり記録から内容を引き継ぎました。必要に応じて編集してください。'
          : undefined
      }
      initialValues={initialValues}
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
      onSave={(text) => saveQuestionNote(db, text).then(() => undefined)}
      saveLabel="記録として保存"
      saveHint="保存するとprivate・Git候補外で記録されます。"
      // Phase 16C-3：完成質問文を共通共有確認画面へ渡す。守秘3チェック・コピー・OS共有は
      // 共有確認画面側で行う。この画面の既存コピー・保存は変更しない（33 §7.3・判断B）。
      outputAction={{
        label: 'ChatGPTなどへ共有',
        accessibilityLabel: 'ChatGPTなどへ共有',
        onPress: ({ output }) => {
          setSharePayload({
            kind: 'workplace_question',
            originLabel: '現場適応・質問',
            baseText: output,
          });
          router.push('/share/confirm');
        },
      }}
      // 質問文作成後の完了導線（Phase 16B）。中間画面（質問タイミング・詰まり等）を閉じて戻すため
      // dismissTo を使う（back/push/replaceだと中間履歴や重複入口が残り得る）。自動遷移はしない。
      completionActions={{
        primary: {
          label: 'ホームへ戻る',
          accessibilityLabel: 'ホームへ戻る',
          onPress: () => router.dismissTo('/'),
        },
        secondary: {
          label: '現場適応へ戻る',
          accessibilityLabel: '現場適応へ戻る',
          onPress: () => router.dismissTo('/workplace'),
        },
      }}
    />
  );
}
