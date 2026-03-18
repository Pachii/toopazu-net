export type CommissionLocale = 'jp' | 'en';

interface CommissionRate {
  label: string;
  amount: string;
  suffix?: string;
}

interface CommissionStep {
  title: string;
  description: string;
}

interface CommissionHighlight {
  icon: 'video' | 'refresh';
  html: string;
}

interface CommissionGuideline {
  step: string;
  title: string;
  bodyHtml: string;
}

interface CommissionEquipmentGroup {
  title: string;
  items: { label: string; value: string }[];
}

interface CommissionLocaleContent {
  headerTitle: string;
  headerSubtitle: string;
  introHtml: string;
  ratesSectionTitle?: string;
  basicRatesTitle: string;
  basicRates: CommissionRate[];
  collabRatesTitle: string;
  collabRates: CommissionRate[];
  masteringRatesTitle: string;
  masteringRates: CommissionRate[];
  masteringRatesNote?: string;
  pricingNote?: string;
  workDetailsTitle: string;
  equipmentButtonLabel: string;
  processSteps: CommissionStep[];
  highlights: CommissionHighlight[];
  highlightNote: string;
  deliveryTitle: string;
  deliveryHtml: string;
  rushTitle: string;
  rushOptions: CommissionRate[];
  rushNote: string;
  paymentTitle: string;
  paymentHtml: string;
  messageHtml: string;
  guidelinesTitle: string;
  guidelines: CommissionGuideline[];
  warningsTitle: string;
  warnings: string[];
  templateIntroHtml: string;
  templateTitle: string;
  templateCode: string;
  footerText: string;
  contactLabel: string;
  equipmentTitle: string;
  equipmentGroups: CommissionEquipmentGroup[];
}

const tipIcon = `
<svg
  viewBox="0 0 24 24"
  width="18"
  height="18"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="tip-icon"
  aria-hidden="true"
>
  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"></path>
  <path d="M9 18h6"></path>
  <path d="M10 22h4"></path>
</svg>
`;

const japaneseTipBox = `
<span class="tips-box">
  ${tipIcon}
  <span><strong>【POINT】</strong> メインを <code>m1</code> と <code>m2</code>、ハモリを <code>h1_1</code> と <code>h1_2</code> のように分けていただくと、ブレス位置や重なりの処理がしやすくなります。</span>
</span>
`;

const englishTipBox = `
<span class="tips-box">
  ${tipIcon}
  <span><strong>[TIP]</strong> Recording each vocal part in 2 separate tracks (e.g. main vocals as <code>m1</code> / <code>m2</code> and harmonies as <code>h1_1</code> / <code>h1_2</code>) can help you (and me) handle breaths and overlapping parts much more cleanly.</span>
</span>
`;

export const commissionLocales: CommissionLocale[] = ['jp', 'en'];

export const commissionContent: Record<CommissionLocale, CommissionLocaleContent> = {
  jp: {
    headerTitle: 'MIX依頼',
    headerSubtitle: '歌ってみたMIXのご依頼について',
    introHtml:
      '現在は自身の制作を中心に活動しているため、<br>ご依頼は少数のみお受けしております。<br><br>そのため、料金は相場よりやや高めに設定しております。<br>ご理解いただける方はお気軽にご相談ください。',
    basicRatesTitle: '【基本料金】',
    basicRates: [
      { label: 'フルコーラス', amount: '¥20,000' },
      { label: 'ワンコーラス', amount: '¥10,000' },
    ],
    collabRatesTitle: '【コラボ・合唱料金】',
    collabRates: [
      { label: 'フルコーラス', amount: '¥12,000', suffix: ' × 人数' },
      { label: 'ワンコーラス', amount: '¥6,000', suffix: ' × 人数' },
    ],
    masteringRatesTitle: '【単品メニュー】',
    masteringRates: [
      { label: 'マスタリング（尺問わず）', amount: '¥4,500' },
    ],
    masteringRatesNote: '※単品メニューは納期や内容が異なる場合があります。詳細はご相談ください。',
    workDetailsTitle: '【作業内容】',
    equipmentButtonLabel: '使用機材',
    processSteps: [
      { title: 'ボーカルエディット', description: 'ピッチ・リズム補正 / ノイズ除去' },
      { title: 'ボーカルアライメント', description: 'ハモリ・ダブルのタイミング補正' },
      { title: 'EQ / コンプ処理', description: 'コンプレッサーやEQによる音量・帯域の調整' },
      { title: '空間系・特殊エフェクト', description: 'リバーブ / ディレイ / ラジオボイス など' },
      { title: 'ハモリ作成', description: 'メインボーカルから作成（全編 / 一部のみなどご相談ください）' },
      { title: 'マスタリング', description: '音圧・質感を整えて最終仕上げ' },
    ],
    highlights: [
      { icon: 'video', html: '<strong>エンコード無料対応</strong><span class="highlight-note">（希望者のみ）</span>' },
      { icon: 'refresh', html: 'リテイク・差し替えは<strong>回数制限なし</strong>' },
    ],
    highlightNote: '※内容によっては納期を調整させていただく場合がございます。',
    deliveryTitle: '【納期】',
    deliveryHtml: '通常納期は<strong><span class="mono">2</span>週間前後</strong>です',
    rushTitle: '【お急ぎ対応】',
    rushOptions: [
      { label: '<span class="mono">1</span>週間以内', amount: '+ ¥5,000' },
      { label: '<span class="mono">3</span>日以内', amount: '+ ¥10,000' },
      { label: '<span class="mono">1</span>日以内', amount: '+ ¥20,000' },
    ],
    rushNote: '※すべての素材を受領し、ご依頼確定後から初稿提出までの目安です。',
    paymentTitle: '【お支払い方法】',
    paymentHtml: 'お支払いは<strong>PayPal（商品・サービス）</strong>のみ対応しております',
    messageHtml: 'ご質問・ご相談はお気軽にご連絡ください。',
    guidelinesTitle: '【ご用意いただくもの】',
    guidelines: [
      {
        step: '01',
        title: '書き出し形式',
        bodyHtml:
          '<strong>inst/オケを含むすべてのトラックは、頭出しした状態で書き出してください。</strong>ミックス時にタイミングを正確に合わせるためです。<br />※提出形式は <strong>.wav</strong> を推奨しています。',
      },
      {
        step: '02',
        title: 'トラックの分け方・ファイル名',
        bodyHtml:
          '同時に鳴る箇所は必ず別トラックでご提出ください。メイン、ハモリ、コーラスはそれぞれ分けて書き出しをお願いいたします。<br />' +
          japaneseTipBox,
      },
      {
        step: '03',
        title: 'データの送付方法',
        bodyHtml:
          'ご用意いただいたデータは一つのフォルダにまとめ、アーカイブ形式（<code>.zip</code>, <code>.7z</code>, <code>.rar</code> 等）に圧縮してください。<br />ギガファイル便などのオンラインストレージにアップロードのうえ、ダウンロードURLをお送りください。',
      },
    ],
    warningsTitle: '【注意事項】',
    warnings: [
      '録音データの音質に問題がある場合や、ピッチ・リズムの補正が困難と判断した場合は、ご依頼をお受けできないことがございます。',
      'ハモリパートは<span class="mono">3</span>トラック目以降、1トラックごとに<span class="mono">+ ¥2,000</span>の追加料金となります。※一部分のみのハモリや合いの手は対象外です。',
      'より自然な仕上がりのため、ハモリはご自身で録音いただくことをおすすめしております。ピッチシフト等による擬似ハモリをご希望の場合は、事前にご相談ください。',
    ],
    templateIntroHtml:
      '下記テンプレートをご記入のうえ、録音データとあわせてお送りください。<br />内容を確認後、お見積もりと納期をご案内いたします。',
    templateTitle: '【ご依頼テンプレート】 ※改変せずご使用ください',
    templateCode: `楽曲名：
本家様URL：
お名前（活動名）：

【ご依頼内容】
・フル / ワンコーラス：
・コラボ人数：
・トラック数（目安）：
・キー変更の有無：

【ご要望】
・希望納期：（例：通常 / 1週間以内 など）
・ハモリについて：
・備考：`,
    footerText: 'ご依頼・ご相談はDMにてお待ちしております。',
    contactLabel: 'XでDMを送る',
    equipmentTitle: '使用機材・ソフトウェア',
    equipmentGroups: [
      {
        title: 'ハードウェア',
        items: [
          { label: 'オーディオインターフェイス', value: 'RME Babyface Pro FS' },
          { label: 'モニター環境', value: 'Slate VSX Immersion One' },
        ],
      },
      {
        title: 'ソフトウェア',
        items: [
          { label: 'DTM', value: 'Studio One Pro 7' },
          { label: 'ノイズ処理', value: 'iZotope RX 11 Advanced' },
          { label: 'ピッチ補正', value: 'Melodyne 5 Studio' },
          { label: 'ボーカルアライメント', value: 'Vocalign 6 Pro' },
          { label: 'ミックス・マスタリング', value: 'UAD Native, FabFilter, etc.' },
        ],
      },
    ],
  },
  en: {
    headerTitle: 'Mixing Commissions',
    headerSubtitle: 'Covers and vocal-focused projects',
    introHtml:
      'I mainly focus on my own releases, so I only open a small number of commission slots. Because of that, my rates are set a bit higher than average. Thank you for your understanding!',
    ratesSectionTitle: 'Rates',
    basicRatesTitle: 'Solo Covers',
    basicRates: [
      { label: 'Full Song', amount: '130 USD' },
      { label: 'Half Size*', amount: '65 USD' },
    ],
    collabRatesTitle: 'Group Covers',
    collabRates: [
      { label: 'Full Song', amount: '80 USD', suffix: ' × persons' },
      { label: 'Half Size*', amount: '40 USD', suffix: ' × persons' },
    ],
    masteringRatesTitle: 'À la carte',
    masteringRates: [
      { label: 'Mastering (any length)', amount: '30 USD' },
    ],
    masteringRatesNote: 'These items have different turnaround times and restrictions. Please reach out for details.',
    pricingNote: '* Half size covers everything up through the first chorus.',
    workDetailsTitle: `What's Included`,
    equipmentButtonLabel: 'Equipment',
    processSteps: [
      { title: 'Vocal Editing', description: 'Noise cleanup, gain automation, pitch/timing correction' },
      { title: 'Vocal Alignment', description: 'Precise timing alignment for harmonies and doubles' },
      { title: 'EQ / Compression', description: 'Balancing tone and dynamics with EQ, compression, and other tools' },
      { title: 'Spatial / Special Effects', description: 'Reverb, delay, and other effects (radio, distortion, etc.)' },
      { title: 'Harmony Creation', description: 'Created from the main vocal (by request)' },
      { title: 'Mastering', description: 'Final polish for loudness and overall texture' },
    ],
    highlights: [
      { icon: 'video', html: '<strong>Free video export</strong><span class="highlight-note">(if requested)</span>' },
      { icon: 'refresh', html: '<strong>Unlimited</strong> revisions and retakes' },
    ],
    highlightNote: 'Turnaround time may increase depending on the number of revisions/retakes.',
    deliveryTitle: 'Turnaround Time',
    deliveryHtml: 'The standard turnaround time is around <strong><span class="mono">2</span> weeks</strong>.',
    rushTitle: 'Rush Options',
    rushOptions: [
      { label: 'Within <span class="mono">1</span> week', amount: '+ 30 USD' },
      { label: 'Within <span class="mono">3</span> days', amount: '+ 65 USD' },
      { label: 'Within <span class="mono">1</span> day', amount: '+ 130 USD' },
    ],
    rushNote: 'This is counted from the time all materials are received and the request is confirmed until the delivery of the first draft.',
    paymentTitle: 'Payment',
    paymentHtml: 'Payment is accepted via <strong>PayPal (Goods & Services)</strong> only.',
    messageHtml: '',
    guidelinesTitle: 'What To Send',
    guidelines: [
      {
        step: '01',
        title: 'Export Format',
        bodyHtml:
          '<strong>Please export every track, including the instrumental, with the same starting point.</strong> This makes it possible to align timing accurately during mixing.<br />I strongly recommend submitting files in <strong>.wav</strong> format.',
      },
      {
        step: '02',
        title: 'Track Separation / File Names',
        bodyHtml:
          'Any parts that overlap in playback should be submitted as separate tracks. In other words, please export main vocals, harmonies, and other parts individually.<br />' +
          englishTipBox,
      },
      {
        step: '03',
        title: 'How To Send Files',
        bodyHtml:
          'Please gather all prepared files into one folder and compress it as an archive such as <code>.zip</code>, <code>.7z</code>, or <code>.rar</code>.<br />Upload it to an online file-sharing service such as Google Drive and provide the download URL.',
      },
    ],
    warningsTitle: 'Things To Know',
    warnings: [
      'I accept projects based on whether I can deliver a strong result. Depending on the recording quality or how much pitch/timing correction is needed, I may decline the request.',
      'Harmony parts from the <span class="mono">3</span>rd layer and beyond will incur an additional <span class="mono">15 USD</span> per layer. Small ad-libs or very short harmony parts are not included in this rule.',
      'For the most natural result, I recommend recording harmonies yourself. If you require artificial harmonies, please let me know in your request.',
    ],
    templateIntroHtml:
      'Please fill out the template below and send it with your audio files.<br />Once I have reviewed everything, I will reply with a quote and a turnaround estimate.',
    templateTitle: 'Copy-and-Paste Request Template',
    templateCode: `Song Title:
Original URL:
Name / Activity Name:

[Request Details]
- Full / Short Size:
- Number of collaborators:
- Estimated track count:
- Key change needed:

[Requests]
- Desired turnaround (example: standard / within 1 week):
- Harmony request:
- Notes:`,
    footerText: 'Please DM me for requests or questions!',
    contactLabel: 'Message on X',
    equipmentTitle: 'Equipment & Tools',
    equipmentGroups: [
      {
        title: 'Hardware',
        items: [
          { label: 'Audio Interface', value: 'RME Babyface Pro FS' },
          { label: 'Headphones/Monitors', value: 'Slate VSX Immersion One' },
        ],
      },
      {
        title: 'Software',
        items: [
          { label: 'DAW', value: 'Studio One Pro 7' },
          { label: 'Audio Restoration', value: 'iZotope RX 11 Advanced' },
          { label: 'Pitch Correction', value: 'Melodyne 5 Studio' },
          { label: 'Vocal Alignment', value: 'Vocalign 6 Pro' },
          { label: 'Mixing / Mastering', value: 'UAD Native, FabFilter, etc.' },
        ],
      },
    ],
  },
};
