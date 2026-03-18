export const damVisionFeatureKeys = [
  'dam.feature.1',
  'dam.feature.2',
  'dam.feature.3',
  'dam.feature.4',
  'dam.feature.5',
] as const;

export const damVisionLinks = {
  development: 'https://twitter.com/toopazu',
  details: '#dam-features',
  techniquesReference: 'https://note.com/takotako1862/n/nbe0939721aa9',
} as const;

export const damVisionAssets = {
  cardVisual: '/dam-vision-card.png',
  screenshot: '/dam-vision-screenshot.jpeg',
} as const;

export const damVisionHiddenCheckGroups = [
  {
    id: 'top',
    label: {
      en: 'Top group',
      jp: '先頭族',
    },
    note: {
      en: 'Checks that tend to appear near the start of a note.',
      jp: '主にバーの頭で拾われやすい項目です。',
    },
    items: {
      en: [
        'Shakuri',
        'Big Shakuri',
        'Rapid Shakuri',
        'Rapid Shakuri (Strong)',
        'L-type Accent',
        'L-type Accent (Strong)',
        'V-type Accent',
        'V-type Accent (Cut)',
        'V-type Accent (From Below)',
        'Inverse V-type Accent',
        'Kobushi (Start)',
        'Fly Down',
        'Edge Voice',
      ],
      jp: [
        'しゃくり',
        '大しゃくり',
        '早いしゃくり',
        '早いしゃくり（強）',
        'Ｌ字アクセント',
        'Ｌ字アクセント（強）',
        'Ⅴ字アクセント',
        'Ⅴ字アクセント（谷切れ）',
        'Ⅴ字アクセント（下から）',
        '逆Ⅴ字アクセント',
        'こぶし（先頭）',
        'フライダウン',
        'エッジボイス',
      ],
    },
  },
  {
    id: 'mid',
    label: {
      en: 'Mid group',
      jp: '中央族',
    },
    note: {
      en: 'Checks centered around the middle of a held note.',
      jp: '主にバーの途中で拾われる項目です。',
    },
    items: {
      en: [
        'Kobushi',
        'Hammering On',
        'Pulling Off',
        'Slow Down',
        'Vibrato',
        'Deep Vibrato',
        'Long Shallow Vibrato',
        'Long Vibrato',
        'Long Deep Vibrato',
        'Inverse Kobushi',
      ],
      jp: [
        'こぶし（中間）',
        'ハンマリング・オン',
        'プリング・オフ',
        'スロウダウン',
        'ビブラート',
        '深ビブラート',
        '長い浅ビブラート',
        '長いビブラート',
        '長い深ビブラート',
        '逆こぶし',
      ],
    },
  },
  {
    id: 'end',
    label: {
      en: 'End group',
      jp: '末尾族',
    },
    note: {
      en: 'Checks that tend to trigger toward the end of a phrase.',
      jp: '主に語尾まわりで出やすい項目です。',
    },
    items: {
      en: [
        'Fall',
        'Rapid Fall',
        'Hiccup',
        'Hiccup With Fall',
        'Fall Edge',
      ],
      jp: [
        'フォール',
        '早いフォール',
        'ヒーカップ',
        'フォール付きヒーカップ',
        'フォールエッジ',
      ],
    },
  },
  {
    id: 'unknown',
    label: {
      en: 'Unknown / ungrouped',
      jp: 'Unknown / 未整理',
    },
    note: {
      en: 'Effects where behavior is still unclear.',
      jp: '名称は知られていても、挙動がまだ整理しきれていない項目です。',
    },
    items: {
      en: [
        'Portamento Up',
        'Portamento Down',
        'Up Slope',
        'Slider',
        'Flat',
        'Staccatto',
        'U-type',
        'Inverse U-type',
        'He-type',
        'Arch-type',
        'Short Shallow Vibrato',
        'Short Vibrato',
        'Short Deep Vibrato',
        'Shallow Vibrato',
        'Just Hit',
        'No Manner',
      ],
      jp: [
        '上昇ポルタメント',
        '下降ポルタメント',
        'アップスロープ',
        'スライダー',
        '水平',
        'スタッカート',
        'Ｕ形',
        '逆Ｕ形',
        'への字形',
        'アーチ形',
        '短い浅ビブラート',
        '短いビブラート',
        '短い深ビブラート',
        '浅ビブラート',
        'ジャストヒット',
        '歌い回しなし',
      ],
    },
  },
] as const;
