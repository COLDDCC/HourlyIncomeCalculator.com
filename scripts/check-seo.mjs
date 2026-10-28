import { existsSync, readFileSync } from 'node:fs';
import { SALARIES, salarySlug, HOURLY_RATES } from '../src/lib/salary-pages.js';
const paths=['/us-federal-take-home-pay-calculator/','/average-hourly-wage-by-country/','/zh/average-hourly-wage-by-country/','/zh/','/ja/','/de/','/fr/','/es/','/','/salary-to-hourly-calculator/',...HOURLY_RATES.map(rate=>`/${rate}-an-hour-is-how-much-a-year/`),...SALARIES.map(salary=>`/${salarySlug(salary)}/`)];
const sitemap=readFileSync('dist/sitemap.xml','utf8');
let failures=0;
const check=(ok,label,path)=>{if(!ok){console.error('SEO check failed:',label,path);failures++;}};
for(const path of paths){
 const file='dist'+path+'index.html';
 const canonical='https://hourlyincomecalculator.com'+path;
 if(!existsSync(file)){console.error('Missing built page:',file);failures++;continue;}
 const html=readFileSync(file,'utf8');
 check(html.includes('<title>')&&html.includes('name="description"'),'metadata',path);
 check(html.includes(canonical),'canonical',path);
 check(sitemap.includes(canonical),'sitemap entry',path);
 if(['/','/zh/','/ja/','/de/','/fr/','/es/'].includes(path)){
  check((html.match(/<h1[ >]/g)||[]).length===1,'single H1',path);
  check(html.indexOf('id="monthly"')<html.indexOf('id="cash-visual"'),'pay breakdown first',path);
  check(html.indexOf('class="research-link"')<html.indexOf('id="guide"'),'research link first',path);
 }
 if(path.includes('-a-year-is-how-much-an-hour/')){
  const salary=Number(path.split('-')[0].slice(1));
  const label='$'+salary.toLocaleString('en-US')+' a year';
  const hourly='$'+(salary/2080).toFixed(2);
  check(html.includes(label)&&html.includes(hourly),'salary target',path);
  check((html.match(/<h1[ >]/g)||[]).length===1,'single H1',path);
 }
 if(path.includes('-an-hour-is-how-much-a-year/')){
  const rate=Number(path.split('-')[0].slice(1));
  const title=(html.match(/<title>(.*?)<\/title>/)||[])[1]||'';
  const desc=(html.match(/<meta name="description" content="([^"]*)"/)||[])[1]||'';
  check(title.startsWith('How Much Is $')&&title.includes('an Hour Annually?'),'annually title',path);
  check(html.includes('$'+rate+' an hour ('+rate+' dollars an hour)'),'hourly synonyms',path);
  check((html.match(/<h1[ >]/g)||[]).length===1,'single H1',path);
  check(html.includes('annually after taxes?'),'after taxes H2',path);
  check(html.includes('annually with overtime?'),'overtime H2',path);
  check(!html.includes('We do not show a generic tax estimate'),'old disclaimer removed',path);
  check(html.includes('bls.gov'),'BLS source',path);
  check(html.includes('/us-federal-take-home-pay-calculator/?rate='),'tax deep link',path);
  check(desc.length>=120&&desc.length<=160,'description 120-160 chars: '+desc.length,path);
 }
}
if(failures){console.error(failures+' SEO check(s) failed');process.exit(1);}
console.log('SEO checks passed for '+paths.length+' pages.');
