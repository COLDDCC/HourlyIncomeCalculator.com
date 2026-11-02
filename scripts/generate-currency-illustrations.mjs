// Generates original, clearly non-genuine banknote and coin illustrations.
// They show only denomination, a dominant colour and a generic motif, never the
// issuer's protected artwork, portraits or security features. See SOURCES.md.
// Usage: node scripts/generate-currency-illustrations.mjs
import { writeFileSync } from 'node:fs';

const OUT = 'public/images/currencies/';
const f = n => Number(n.toFixed(1));

// Generic motif per currency, drawn in a 100x100 box centred on the seal.
const MOTIFS = {
  // Five-petal blossom
  twd: c => Array.from({ length: 5 }, (_, i) => {
    const a = (i * 72 - 90) * Math.PI / 180, x = f(50 + Math.cos(a) * 17), y = f(50 + Math.sin(a) * 17);
    return `<circle cx="${x}" cy="${y}" r="13" fill="none" stroke="${c}" stroke-width="1.6"/>`;
  }).join('') + `<circle cx="50" cy="50" r="6" fill="${c}" opacity=".55"/>`,
  // Stepped pyramid under a sun
  mxn: c => `<path d="M14 82h72M22 82v-12h56v12M30 70v-12h40v12M38 58v-12h24v12M44 46v-8h12v8" fill="none" stroke="${c}" stroke-width="1.7"/>` +
    `<circle cx="50" cy="24" r="8" fill="none" stroke="${c}" stroke-width="1.6"/>` +
    Array.from({ length: 12 }, (_, i) => { const a = i * 30 * Math.PI / 180; return `<path d="M${f(50 + Math.cos(a) * 11)} ${f(24 + Math.sin(a) * 11)}L${f(50 + Math.cos(a) * 15)} ${f(24 + Math.sin(a) * 15)}" stroke="${c}" stroke-width="1.2"/>`; }).join(''),
  // Five-star constellation
  brl: c => [[50, 18, 7], [50, 80, 8], [24, 48, 6.5], [76, 46, 6.5], [62, 60, 4]].map(([x, y, r]) => {
    const pts = Array.from({ length: 10 }, (_, i) => { const a = (i * 36 - 90) * Math.PI / 180, rr = i % 2 ? r * .45 : r; return `${f(x + Math.cos(a) * rr)},${f(y + Math.sin(a) * rr)}`; }).join(' ');
    return `<polygon points="${pts}" fill="${c}" opacity=".8"/>`;
  }).join('') + `<path d="M50 18L50 80M24 48L76 46" stroke="${c}" stroke-width=".6" opacity=".45"/>`,
};

const SERIES = {
  twd: { name: 'NEW TAIWAN DOLLARS', local: '臺灣', notes: { 2000: ['#c9b6e4', '#5b3f8c'], 1000: ['#b9cdea', '#2f5597'], 500: ['#efc9a4', '#9a5422'], 200: ['#bfe0bf', '#2f7a3f'], 100: ['#f2b8b8', '#a3323a'] } },
  mxn: { name: 'PESOS MEXICANOS', local: 'México', notes: { 1000: ['#d6bfe6', '#6a3d8f'], 500: ['#b8d3ec', '#285e93'], 200: ['#c4e2bf', '#357a33'], 100: ['#f2b9b0', '#a73a2c'], 50: ['#f0bfd9', '#a33a78'], 20: ['#bfe3d8', '#2b7a68'] } },
  brl: { name: 'REAIS', local: 'Brasil', notes: { 200: ['#d9cfc2', '#6b5a45'], 100: ['#b8d0ec', '#2d5a92'], 50: ['#f0cfa8', '#a3612a'], 20: ['#f4e3a1', '#9c7b12'], 10: ['#f0b9b4', '#a1393a'], 5: ['#d3bfe4', '#6a4590'], 2: ['#b9d9ef', '#2f6f9a'] } },
};

function note(code, value) {
  const s = SERIES[code], [light, dark] = s.notes[value], id = `${code}${value}`.replace('.', '_');
  const rings = Array.from({ length: 30 }, (_, i) => `<ellipse cx="298" cy="109" rx="${f(20 + i * 2.45)}" ry="${f(12 + i * 1.55)}" transform="rotate(${i * 16} 298 109)" fill="none" stroke="${i % 3 ? dark : '#fff'}" stroke-width=".46" opacity=".33"/>`).join('');
  const guilloche = Array.from({ length: 9 }, (_, i) => `<path d="M${100 + i * 3} 25 Q${195 + i * 3} ${8 + i * 4} ${f(340 - i * 1.4)} ${35 + i * 5} T430 ${30 + i * 5}" stroke="#fff" stroke-width=".55" opacity=".32" fill="none"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 215" role="img" aria-label="${code.toUpperCase()} ${value} illustrative banknote"><defs><linearGradient id="p${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${light}"/><stop offset=".52" stop-color="#fffaf0"/><stop offset="1" stop-color="${dark}"/></linearGradient><pattern id="m${id}" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M0 0L9 9M9 0L0 9" stroke="${dark}" stroke-width=".35" opacity=".29"/></pattern><radialGradient id="s${id}"><stop stop-color="#fffef6"/><stop offset="1" stop-color="${light}"/></radialGradient></defs>` +
    `<rect x="1" y="1" width="458" height="213" rx="9" fill="url(#p${id})" stroke="${dark}" stroke-width="2"/><rect x="3" y="3" width="454" height="209" rx="7" fill="url(#m${id})"/><rect x="12" y="12" width="436" height="191" rx="5" fill="none" stroke="#fff" stroke-width="2.2" opacity=".88"/><rect x="17" y="17" width="426" height="181" rx="4" fill="none" stroke="${dark}" stroke-width="1.1" opacity=".7"/>${guilloche}` +
    `<line x1="160" y1="30" x2="160" y2="185" stroke="${dark}" stroke-width=".7" opacity=".35"/><circle cx="298" cy="109" r="68" fill="url(#s${id})" stroke="${dark}" stroke-width="1.4" opacity=".95"/>${rings}<g transform="translate(248 59)">${MOTIFS[code](dark)}</g>` +
    `<text x="28" y="43" font-family="Arial,Helvetica,sans-serif" font-size="11" font-weight="700" letter-spacing="1.4" fill="#2b2b2b">${s.name}</text>` +
    `<text x="26" y="${value >= 1000 ? 112 : 116}" font-family="Arial,Helvetica,sans-serif" font-size="${value >= 1000 ? 46 : 56}" font-weight="800" fill="#2b2b2b">${value}</text>` +
    `<text x="28" y="145" font-family="'Noto Sans TC','Noto Sans',Arial,sans-serif" font-size="20" font-weight="700" fill="#2b2b2b">${s.local}</text>` +
    `<text x="438" y="44" text-anchor="end" font-family="Arial,Helvetica,sans-serif" font-size="20" font-weight="800" fill="${dark}">${value}</text>` +
    `<text x="28" y="181" font-family="Arial,Helvetica,sans-serif" font-size="8.5" letter-spacing="1.6" fill="#555">ILLUSTRATIVE SERIES</text><text x="436" y="190" text-anchor="end" font-family="Arial,Helvetica,sans-serif" font-size="6.5" letter-spacing=".8" fill="#555">NOT LEGAL TENDER</text></svg>\n`;
}

const METALS = {
  gold: ['#fff1b7', '#cda950', '#8b6c30'],
  silver: ['#ffffff', '#c9ced3', '#6f777f'],
  copper: ['#ffd9b8', '#c07a45', '#7a4322'],
};
// [metal, optional ring metal for bimetallic coins]
const COINS = {
  twd: { 50: ['gold'], 10: ['silver'], 5: ['silver'], 1: ['gold'] },
  mxn: { 10: ['silver', 'gold'], 5: ['gold', 'silver'], 2: ['gold', 'silver'], 1: ['gold', 'silver'], 0.5: ['silver'] },
  brl: { 1: ['silver', 'gold'], 0.5: ['silver'], 0.25: ['gold'], 0.1: ['gold'], 0.05: ['copper'] },
};

function coin(code, value) {
  const [core, ring] = COINS[code][value], id = `${code}${value}`.replace('.', '_'), m = METALS[core], r = ring && METALS[ring];
  const edge = Array.from({ length: 72 }, (_, i) => { const a = i * 5 * Math.PI / 180; return `<path d="M${f(100 + Math.cos(a) * 84)} ${f(100 + Math.sin(a) * 84)}L${f(100 + Math.cos(a) * 91)} ${f(100 + Math.sin(a) * 91)}" stroke="${(r || m)[2]}" stroke-width=".8"/>`; }).join('');
  const grad = (n, c) => `<radialGradient id="${n}${id}" cx=".3" cy=".25" r=".9"><stop stop-color="${c[0]}"/><stop offset=".55" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></radialGradient>`;
  const body = r
    ? `<circle cx="100" cy="100" r="97" fill="${r[2]}"/><circle cx="100" cy="100" r="92" fill="url(#r${id})" stroke="${r[0]}" stroke-width="3"/>${edge}<circle cx="100" cy="100" r="60" fill="url(#c${id})" stroke="${m[2]}" stroke-width="2"/>`
    : `<circle cx="100" cy="100" r="97" fill="${m[2]}"/><circle cx="100" cy="100" r="92" fill="url(#c${id})" stroke="${m[0]}" stroke-width="3"/>${edge}`;
  const label = String(value), size = label.length > 3 ? 30 : label.length > 2 ? 36 : 44;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="${code.toUpperCase()} ${value} illustrative coin"><defs>${grad('c', m)}${r ? grad('r', r) : ''}</defs>${body}` +
    `<g transform="translate(70 40) scale(.6)" opacity=".7">${MOTIFS[code](m[2])}</g>` +
    `<rect x="${100 - size * label.length * .33 - 10}" y="${118 - size * .8}" width="${size * label.length * .66 + 20}" height="${size * 1.05}" rx="8" fill="${m[0]}" opacity=".55"/>` +
    `<text x="100" y="118" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="${size}" font-weight="800" fill="${m[2]}">${label}</text>` +
    `<text x="100" y="${r ? 150 : 158}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="11" font-weight="700" letter-spacing="1.5" fill="${m[2]}">${code.toUpperCase()}</text></svg>\n`;
}

for (const code of Object.keys(SERIES)) {
  for (const value of Object.keys(SERIES[code].notes)) writeFileSync(`${OUT}${code}-${value}.svg`, note(code, Number(value)));
  for (const value of Object.keys(COINS[code])) writeFileSync(`${OUT}${code}-${value}.svg`, coin(code, Number(value)));
}
console.log('Generated TWD, MXN and BRL illustrations.');
