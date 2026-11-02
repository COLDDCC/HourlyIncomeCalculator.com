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
  TWD: { rate: 200, presets: [190,200,250,300,500] },
  MXN: { rate: 50, presets: [40,50,75,100,150] },
  BRL: { rate: 15, presets: [10,15,20,30,50] },
};
export const languageCurrency = lang => ({en:'USD',zh:'CNY','zh-Hant':'HKD',ja:'JPY',de:'EUR',fr:'EUR',es:'EUR',pt:'BRL'})[lang] || 'USD';
// Currencies with no minor unit in everyday cash and display.
export const ZERO_DECIMAL = ['JPY','TWD'];
// Pick a local currency from the browser locale, but only when it matches the page language
// (e.g. zh-TW on /zh-Hant/ → TWD, es-MX on /es/ → MXN, pt-PT on /pt/ → EUR).
const REGION_CURRENCY = {
  'zh-Hant':{TW:'TWD',HK:'HKD',MO:'MOP'},
  es:{MX:'MXN',ES:'EUR',US:'USD'},
  pt:{BR:'BRL',PT:'EUR'},
  fr:{CA:'CAD',CH:'CHF',FR:'EUR',BE:'EUR'},
  de:{CH:'CHF',DE:'EUR',AT:'EUR'},
  en:{US:'USD',GB:'GBP',AU:'AUD',CA:'CAD'},
};
export function regionalCurrency(lang, locales = []) {
  const map = REGION_CURRENCY[lang]; if (!map) return null;
  const base = lang.split('-')[0];
  for (const locale of locales) {
    const parts = String(locale).split(/[-_]/); if (parts[0].toLowerCase() !== base) continue;
    if (lang === 'zh-Hant' && /^(hans|cn|sg)$/i.test(parts[1] || '')) continue;
    const region = parts.slice(1).find(p => /^[A-Za-z]{2}$/.test(p));
    if (region && map[region.toUpperCase()]) return map[region.toUpperCase()];
  }
  return null;
}
