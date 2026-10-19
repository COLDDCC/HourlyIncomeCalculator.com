import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {wages,sources,hourlyEquivalent,calculatorLink} from '../src/data/wage-rankings.js';
test('ranked dataset, downloaded snapshot and calculator inputs preserve source totals',()=>{
 const snapshot=JSON.parse(fs.readFileSync('public/data/hourly-wage-by-country-2025.json','utf8'));
 assert.equal(wages.length,9);assert.equal(new Set(wages.map(r=>r.iso)).size,9);assert.equal(snapshot.china.rank,null);
 for(const [i,row] of wages.entries()){
  assert.equal(row.year,2025);assert(row.status.includes('estimate'));if(i)assert(wages[i-1].ppp>row.ppp);
  const saved=snapshot.rows[i];assert.equal(saved.annual_gross_local,row.annual);assert.equal(saved.annual_gross_usd_ppp,row.ppp);
  assert(Math.abs(saved.hourly_equivalent_usd_ppp*2080-row.ppp)<.002);
  const url=new URL(calculatorLink(row),'https://hourlyincomecalculator.com');assert.equal(url.searchParams.get('currency'),row.currency);
  assert(Math.abs(Number(url.searchParams.get('rate'))*2080-row.annual)<.002);
  assert(Math.abs(hourlyEquivalent(row.annual,35)*35*52-row.annual)<1e-8);
 }
 assert.equal(Number(hourlyEquivalent(71590).toFixed(2)),34.42);assert.equal(Number(hourlyEquivalent(129441).toFixed(2)),62.23);
 assert.equal(sources.length,10);
});
test('both research pages are static, sourced, crawlable and have matching structured data',()=>{
 for(const prefix of ['','/zh']){
  const path=prefix+'/average-hourly-wage-by-country/';const html=fs.readFileSync('dist'+path+'index.html','utf8');
  assert.equal((html.match(/<h1>/g)||[]).length,1);assert(html.includes('rel="canonical" href="https://hourlyincomecalculator.com'+path+'"'));
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  const graph=schema['@graph'];assert(graph.some(n=>n['@type']==='Article'));assert(graph.some(n=>n['@type']==='Dataset'));
  assert.equal(graph.find(n=>n['@type']==='FAQPage').mainEntity.length,6);
  for(const s of sources){assert(html.includes('id="source-'+s.id+'"'));assert(html.includes(s.url.replaceAll('&','&amp;')));}
  for(const r of wages)assert(html.includes('id="country-'+r.iso+'"'));
  assert.equal((html.match(/data-annual=/g)||[]).length,9);
  assert(html.includes('/data/hourly-wage-by-country-2025.csv'));assert(html.includes('hreflang="zh-Hans"'));
  const calculator=fs.readFileSync('dist'+(prefix||'')+'/index.html','utf8');assert(calculator.includes('href="'+path+'"'));
 }
});
