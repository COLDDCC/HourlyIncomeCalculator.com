import { existsSync, readFileSync } from 'node:fs';
import { SALARIES, salarySlug } from '../src/lib/salary-pages.js';
const rates=[15,20,25,30,35,40,50,75,100];
const paths=['/us-federal-take-home-pay-calculator/', '/average-hourly-wage-by-country/', '/zh/average-hourly-wage-by-country/', '/zh/', '/ja/', '/de/', '/fr/', '/es/', '/', '/salary-to-hourly-calculator/',...rates.map(rate=>`/${rate}-an-hour-is-how-much-a-year/`),...SALARIES.map(salary=>`/${salarySlug(salary)}/`)];
const sitemap=readFileSync('dist/sitemap.xml','utf8');
let failures=0;
for(const path of paths){
 const file='dist'+path+'index.html';
 const canonical='https://hourlyincomecalculator.com'+path;
 if(!existsSync(file)){console.error('Missing built page:',file);failures++;continue;}
 const html=readFileSync(file,'utf8');
 if(!html.includes('<title>')||!html.includes('name="description"')){console.error('Missing SEO metadata:',path);failures++;}
 if(!html.includes(canonical)){console.error('Missing canonical:',path);failures++;}
 if(!sitemap.includes(canonical)){console.error('Missing sitemap entry:',path);failures++;}
 if(['/', '/zh/', '/ja/', '/de/', '/fr/', '/es/'].includes(path)){
  if((html.match(/<h1[ >]/g)||[]).length!==1){console.error('Expected one main heading:',path);failures++;}
  if(html.indexOf('id="monthly"')>html.indexOf('id="cash-visual"')){console.error('Pay breakdown should precede cash artwork:',path);failures++;}
  if(html.indexOf('class="research-link"')>html.indexOf('id="guide"')){console.error('Wage research link should precede instructions:',path);failures++;}
 }
 if(path.includes('-a-year-is-how-much-an-hour/')){
  const salary=Number(path.split('-')[0].slice(1));
  const label='$'+salary.toLocaleString('en-US')+' a year';
  const hourly='$'+(salary/2080).toFixed(2);
  if(!html.includes(label)||!html.includes(hourly)){console.error('Missing targeted salary or hourly rate:',path);failures++;}
  if((html.match(/<h1[ >]/g)||[]).length!==1){console.error('Expected one main heading:',path);failures++;}
 }
 if(path.includes('-an-hour-is-how-much-a-year/')){
  const rate=Number(path.split('-')[0].slice(1));
  if(!html.includes('$'+rate+' an hour')){console.error('Missing targeted wage:',path);failures++;}
 }
}
if(failures){console.error(failures+' SEO check(s) failed');process.exit(1);}
console.log('SEO checks passed for '+paths.length+' pages.');
