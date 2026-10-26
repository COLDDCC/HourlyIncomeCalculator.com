// Editable examples, not minimum wages or exchange-rate conversions.
export const MARKETS = {
  USD: { rate: 30, presets: [15,20,25,30,50] },
  CNY: { rate: 30, presets: [20,30,40,50,100] },
  JPY: { rate: 1500, presets: [1200,1500,1800,2000,3000] },
  EUR: { rate: 20, presets: [15,20,25,30,50] },
  GBP: { rate: 15, presets: [12,15,20,25,40] },
  AUD: { rate: 30, presets: [25,30,35,40,50] },
  CAD: { rate: 25, presets: [18,20,25,30,40] },
  CHF: { rate: 30, presets: [25,30,35,40,50] },
  HKD: { rate: 80, presets: [45,60,80,100,150] },
  MOP: { rate: 80, presets: [45,60,80,100,150] },
};
export const languageCurrency = lang => ({en:'USD',zh:'CNY','zh-Hant':'HKD',ja:'JPY',de:'EUR',fr:'EUR',es:'EUR'})[lang] || 'USD';
