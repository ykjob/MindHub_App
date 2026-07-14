// Phase 15 共通UI基盤のデザイントークン（正本：docs/memo-app/29-ui-design-system.md §3・§4）。
// トークン以外の処理（関数・コンポーネント・Platform分岐）をこのファイルに入れない。
// 既存画面は一括置換せず、各画面の改修タスクの中でトークン参照へ移行する（29 §10）。

/** 色（29 §3.1）。役割名で管理し、色だけで状態・意味を伝えない（ラベル文字・形状・枠を併用する） */
export const colors = {
  /** ブランド・主要操作（主要ボタン・リンク・選択状態・FAB） */
  brand: '#2563EB',
  /** ブランド薄背景（引き継ぎ案内・情報バナーの背景） */
  brandSoft: '#EFF6FF',
  /** ブランド薄背景内の濃い文字 */
  brandStrongText: '#1D4ED8',
  /** ブランド枠（青系バナー・強調カードの枠線） */
  brandBorder: '#BFDBFE',
  /** 通常背景（画面の最下層） */
  background: '#F9FAFB',
  /** カード背景（カード・入力欄・ヘッダー） */
  surface: '#FFFFFF',
  /** 主要文字（タイトル・本文・入力値） */
  textPrimary: '#111827',
  /** 補助文字（説明文・メタ情報） */
  textSecondary: '#6B7280',
  /** 弱い補助文字（日付・placeholder・非活性文字に限定。重要情報には使わない） */
  textFaint: '#9CA3AF',
  /** 境界線（区切り線・カード枠・入力枠） */
  border: '#E5E7EB',
  /** 成功（保存・完了。白文字は太字14以上で使う） */
  success: '#059669',
  /** 成功薄背景（成功バッジ・完了表示の背景） */
  successSoft: '#ECFDF5',
  /** 注意帯内の文字 */
  warningText: '#92400E',
  /** 注意バッジの文字 */
  warningBadgeText: '#B45309',
  /** 注意薄背景（帯） */
  warningSoft: '#FEF3C7',
  /** 注意薄背景（バッジ） */
  warningBadgeSoft: '#FFFBEB',
  /** エラー・破壊的操作 */
  danger: '#DC2626',
  /** エラー薄背景 */
  dangerSoft: '#FEF2F2',
  /** AI・プロンプト識別（使用範囲は未確定＝29 §12。一般のボタン・状態表示に使わない） */
  ai: '#7C3AED',
  /** AI・プロンプト薄背景 */
  aiSoft: '#F5F3FF',
  /** 非活性背景 */
  disabledBackground: '#D1D5DB',
  /** 非活性文字 */
  disabledText: '#9CA3AF',
} as const;

/** 余白5段階（29 §3.2）。部品内部の微調整に限り局所値を認める */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

/** 文字サイズ6段階（29 §3.3）。FABの「＋」等の特殊表示のみ例外 */
export const typography = {
  pageTitle: 20,
  sectionTitle: 16,
  cardTitle: 15,
  body: 14,
  caption: 12,
  badge: 11,
} as const;

/** 角丸3段階（29 §3.4）。FABの円形は例外として維持 */
export const radius = {
  sm: 8,
  md: 12,
  pill: 999,
} as const;

/** 最小タッチ領域（29 §3.5）。padding・hitSlopでの確保を認める */
export const touchTarget = {
  min: 44,
} as const;
