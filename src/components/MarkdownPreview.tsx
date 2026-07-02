import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Platform,
  type TextStyle,
} from 'react-native';

// 外部Markdownライブラリは追加せず、仕様（docs/memo-app/02-features.md）で求める
// 見出し・箇条書き・番号付きリスト・コードブロック・区切り線・強調・リンクに
// 絞った軽量レンダラーとして実装する（採用理由は docs/memo-app/11-open-issues.md）。

const MONO_FONT = Platform.OS === 'ios' ? 'Courier' : 'monospace';

interface Props {
  markdown: string;
}

type Block =
  | { kind: 'heading'; level: number; text: string }
  | { kind: 'code'; lang: string; lines: string[] }
  | { kind: 'bullet'; text: string }
  | { kind: 'ordered'; marker: string; text: string }
  | { kind: 'hr' }
  | { kind: 'paragraph'; text: string }
  | { kind: 'blank' };

function parseBlocks(markdown: string): Block[] {
  const blocks: Block[] = [];
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  let codeLines: string[] | null = null;
  let codeLang = '';

  for (const line of lines) {
    const fence = line.match(/^\s*(`{3,})\s*(\S*)\s*$/);
    if (fence) {
      if (codeLines === null) {
        codeLines = [];
        codeLang = fence[2];
      } else {
        blocks.push({ kind: 'code', lang: codeLang, lines: codeLines });
        codeLines = null;
      }
      continue;
    }
    if (codeLines !== null) {
      codeLines.push(line);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      blocks.push({ kind: 'heading', level: heading[1].length, text: heading[2] });
      continue;
    }
    if (/^\s*([-*_])\s*\1\s*\1[\s\-*_]*$/.test(line)) {
      blocks.push({ kind: 'hr' });
      continue;
    }
    const bullet = line.match(/^\s*[-*+]\s+(.*)$/);
    if (bullet) {
      blocks.push({ kind: 'bullet', text: bullet[1] });
      continue;
    }
    const ordered = line.match(/^\s*(\d+)[.)]\s+(.*)$/);
    if (ordered) {
      blocks.push({ kind: 'ordered', marker: `${ordered[1]}.`, text: ordered[2] });
      continue;
    }
    if (line.trim() === '') {
      blocks.push({ kind: 'blank' });
      continue;
    }
    blocks.push({ kind: 'paragraph', text: line });
  }

  if (codeLines !== null) {
    blocks.push({ kind: 'code', lang: codeLang, lines: codeLines });
  }
  return blocks;
}

// インライン記法：**強調**、`コード`、[リンク](url)
function renderInline(text: string, baseStyle?: TextStyle): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <Text key={key++} style={baseStyle}>
          {text.slice(lastIndex, match.index)}
        </Text>
      );
    }
    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push(
        <Text key={key++} style={[baseStyle, styles.bold]}>
          {token.slice(2, -2)}
        </Text>
      );
    } else if (token.startsWith('`')) {
      nodes.push(
        <Text key={key++} style={[baseStyle, styles.inlineCode]}>
          {token.slice(1, -1)}
        </Text>
      );
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const url = link[2];
        nodes.push(
          <Text
            key={key++}
            style={[baseStyle, styles.link]}
            onPress={() => Linking.openURL(url).catch(() => undefined)}
          >
            {link[1]}
          </Text>
        );
      }
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) {
    nodes.push(
      <Text key={key++} style={baseStyle}>
        {text.slice(lastIndex)}
      </Text>
    );
  }
  return nodes;
}

const HEADING_STYLES: TextStyle[] = [
  { fontSize: 24, fontWeight: '700', marginTop: 12, marginBottom: 6 },
  { fontSize: 20, fontWeight: '700', marginTop: 12, marginBottom: 4 },
  { fontSize: 17, fontWeight: '600', marginTop: 10, marginBottom: 4 },
  { fontSize: 15, fontWeight: '600', marginTop: 8, marginBottom: 2 },
  { fontSize: 14, fontWeight: '600', marginTop: 8, marginBottom: 2 },
  { fontSize: 13, fontWeight: '600', marginTop: 8, marginBottom: 2 },
];

export default function MarkdownPreview({ markdown }: Props) {
  const blocks = parseBlocks(markdown);

  return (
    <View style={styles.container}>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case 'heading':
            return (
              <Text key={i} style={[styles.text, HEADING_STYLES[block.level - 1]]}>
                {renderInline(block.text)}
              </Text>
            );
          case 'code':
            return (
              <View key={i} style={styles.codeBlock}>
                <Text style={styles.codeText}>{block.lines.join('\n')}</Text>
              </View>
            );
          case 'bullet':
            return (
              <View key={i} style={styles.listRow}>
                <Text style={styles.listMarker}>•</Text>
                <Text style={[styles.text, styles.listText]}>
                  {renderInline(block.text)}
                </Text>
              </View>
            );
          case 'ordered':
            return (
              <View key={i} style={styles.listRow}>
                <Text style={styles.listMarker}>{block.marker}</Text>
                <Text style={[styles.text, styles.listText]}>
                  {renderInline(block.text)}
                </Text>
              </View>
            );
          case 'hr':
            return <View key={i} style={styles.hr} />;
          case 'paragraph':
            return (
              <Text key={i} style={styles.text}>
                {renderInline(block.text)}
              </Text>
            );
          case 'blank':
            return <View key={i} style={styles.blank} />;
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 2 },
  text: { fontSize: 15, color: '#111827', lineHeight: 24 },
  bold: { fontWeight: '700' },
  inlineCode: {
    fontFamily: MONO_FONT,
    fontSize: 13,
    backgroundColor: '#F3F4F6',
    color: '#B91C1C',
  },
  link: { color: '#2563EB', textDecorationLine: 'underline' },
  codeBlock: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
  },
  codeText: {
    fontFamily: MONO_FONT,
    fontSize: 13,
    color: '#E5E7EB',
    lineHeight: 20,
  },
  listRow: { flexDirection: 'row', gap: 8, paddingLeft: 8 },
  listMarker: { fontSize: 15, color: '#6B7280', lineHeight: 24, minWidth: 18 },
  listText: { flex: 1 },
  hr: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 10 },
  blank: { height: 8 },
});
