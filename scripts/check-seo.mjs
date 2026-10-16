import { existsSync, readFileSync } from 'node:fs';
const rates=[15,20,25,30,35,40,50];
const paths=['/', '/salary-to-hourly-calculator/',...rates.map(rate=>`/${rate}-an-hour-is-how-much-a-year/`)];
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
 if(path.includes('-an-hour-is-how-much-a-year/')){
  const rate=Number(path.split('-')[0].slice(1));
  if(!html.includes('$'+rate+' an hour')){console.error('Missing targeted wage:',path);failures++;}
 }
}
if(failures){console.error(failures+' SEO check(s) failed');process.exit(1);}
console.log('SEO checks passed for '+paths.length+' pages.');
