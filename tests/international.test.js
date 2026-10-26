import { MARKETS, languageCurrency } from '../src/lib/market.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CURRENCIES,denominations,splitCash,makeChange,cashPieces} from '../src/lib/cash.js';
import {LANGUAGES,MESSAGES,translator,languagePath} from '../src/lib/i18n.js';
const total=groups=>groups.reduce((sum,g)=>sum+g.cents*g.count,0);
test('all currency assets exist, denominations and repeated exchanges preserve the smallest unit',()=>{
 for(const [code,config] of Object.entries(CURRENCIES)){
  for(const denom of denominations(code)){assert(fs.existsSync('public'+denom.src),denom.src);assert.equal(denom.currency,code);}
  for(const amount of [0,.01,.03,.04,.07,.19,.99,1,1.005,18.37,240,62400,999999.99]){
   let groups=splitCash(amount,code);const expected=Math.round((amount+Number.EPSILON)*config.factor);assert.equal(total(groups),expected,code);
   for(let n=0;n<60;n++){groups=makeChange(groups);assert.equal(total(groups),expected,code+' exchange');const pieces=cashPieces(groups);assert(pieces.length<=36);assert.equal(total(pieces),expected);}
   assert(groups.every(g=>g.currency===code));
  }
 }
 assert(splitCash(.03,'AUD').every(g=>g.balance));assert(splitCash(.03,'CAD').every(g=>g.balance));assert(splitCash(.03,'CHF').every(g=>g.balance));
 assert.equal(total(splitCash(1234.7,'JPY')),1235);
});
test('every language has a complete dictionary and localized static SEO metadata',()=>{
 for(const lang of Object.keys(LANGUAGES)){
  assert.deepEqual(Object.keys(MESSAGES[lang]),Object.keys(MESSAGES.en));assert(Object.values(MESSAGES[lang]).every(Boolean));
  const html=fs.readFileSync('dist'+languagePath(lang)+'index.html','utf8');const t=translator(lang);
  assert(html.includes('<title>'+t('title')+'</title>'));assert(html.includes('lang="'+(lang==='zh'?'zh-Hans':lang)+'"'));assert(html.includes('href="https://hourlyincomecalculator.com'+languagePath(lang)+'"'));
  if(lang==='zh')assert(html.includes('value="CNY" selected'));
  if(lang==='zh-Hant')assert(html.includes('value="HKD" selected'));
  assert(html.includes(t('soundOff')));assert(html.includes(t('change')));assert(!html.includes('id="currency-summary"'));
  assert.equal((html.match(/rel="alternate"/g)||[]).length,8);
 }
});
import vm from 'node:vm';
test('shared calculations remain exact and language changes select matching markets',()=>{
 const source=fs.readFileSync('src/lib/calculator.js','utf8').replace(/^import .*;\n/gm,'');
 for(const lang of Object.keys(LANGUAGES))for(const code of Object.keys(CURRENCIES)){
  const elements=new Map(),get=id=>{if(!elements.has(id))elements.set(id,{value:({'#hourly':'30','#hours':'40','#weeks':'52','#currency':'USD','#cash-period':'daily','#language':lang})[id]||'',textContent:'',listeners:{},addEventListener(type,fn){this.listeners[type]=fn},classList:{toggle(){}}});return elements.get(id)};
  let rendered,assigned;const params='?rate=18.37&hours=32&weeks=48&currency='+code+'&period=weekly';
  const context={MARKETS,languageCurrency,translator,languagePath,LANGUAGES,currencyConfig:code=>CURRENCIES[code],createCashView:()=>({update:(amount,currency)=>{rendered={amount,currency}}}),document:{body:{dataset:{language:lang}},querySelector:get,querySelectorAll:()=>[]},location:{search:params,href:'https://hourlyincomecalculator.com'+languagePath(lang)+params,assign:url=>{assigned=url}},URL,URLSearchParams,Intl,Math,Number,console};
  vm.createContext(context);vm.runInContext(source,context);assert.equal(rendered.currency,code);assert.equal(rendered.amount,18.37*32);
  const target=lang==='zh'?'en':'zh';get('#language').value=target;get('#language').listeners.change();
  const url=new URL(assigned);assert.equal(url.pathname,languagePath(target));assert.equal(url.searchParams.get('currency'),code);assert.equal(url.searchParams.get('rate'),'18.37');assert.equal(url.searchParams.get('period'),'weekly');assert.equal(url.searchParams.get('hours'),'32');
  get('#currency').value='JPY';get('#currency').listeners.input();assert.equal(get('#hourly').value,code==='JPY'?'18.37':'1500');
  get('#hourly').value='1800';get('#currency').value='USD';get('#currency').listeners.input();get('#currency').value='JPY';get('#currency').listeners.input();assert.equal(get('#hourly').value,'1800');
 }
});
