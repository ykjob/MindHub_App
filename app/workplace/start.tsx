import React, { useCallback, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import WorkplaceSceneForm from '../../src/components/WorkplaceSceneForm';
import {
  buildStartText,
  buildStartPrefillFromEndNote,
  getLatestEndNote,
} from '../../src/features/workplace/workplaceService';

export default function WorkplaceStartScreen() {
  const db = useSQLiteContext();
  const { fromRestart } = useLocalSearchParams<{ fromRestart?: string }>();
  const restart = fromRestart === '1';

  // 通常導線は即表示。翌朝再開導線のときだけ直近終業前メモの取得を待つ。
  const [ready, setReady] = useState(!restart);
  const [initialValues, setInitialValues] = useState<Record<string, string>>({});
  const [carried, setCarried] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!restart) return;
      let active = true;
      setReady(false);
      getLatestEndNote(db)
        .then((note) => {
          if (!active) return;
          if (note) {
            const pf = buildStartPrefillFromEndNote(note.body);
            setInitialValues({ today: pf.today, checkFirst: pf.checkFirst });
            setCarried(
              pf.today.trim().length > 0 || pf.checkFirst.trim().length > 0
            );
          }
          setReady(true);
        })
        .catch(() => {
          if (active) setReady(true);
        });
      return () => {
        active = false;
      };
    }, [db, restart])
  );

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#2563EB" />
      </View>
    );
  }

  return (
    <WorkplaceSceneForm
      intro="作業を始める前に、今日やること・完了条件・触ってよい範囲・先に確認することを整理します。出力はコピーして使えます（保存はしません）。"
      banner={
        carried
          ? '前回の再開メモから引き継ぎました。内容を確認・修正してから使ってください。'
          : undefined
      }
      initialValues={initialValues}
      fields={[
        { key: 'today', label: '今日の作業', placeholder: '今日取り組むこと' },
        { key: 'doneCondition', label: '完了条件', placeholder: 'どこまでやれば完了か' },
        { key: 'scope', label: '触る範囲', placeholder: '触ってよいファイル・機能' },
        { key: 'checkFirst', label: '先に確認すること', placeholder: '着手前に聞く・調べること', optional: true },
      ]}
      buildText={(v) =>
        buildStartText({
          today: v.today,
          doneCondition: v.doneCondition,
          scope: v.scope,
          checkFirst: v.checkFirst,
        })
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});
