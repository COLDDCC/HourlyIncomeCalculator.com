import {readFileSync} from 'node:fs';
const reports=process.argv.slice(2);
if(reports.length!==2)throw new Error('Expected desktop and mobile Lighthouse reports');
for(const path of reports){
 const result=JSON.parse(readFileSync(path,'utf8'));
 const name=path.includes('mobile')?'375px mobile':'desktop';
 const scores=result.categories;
 const seo=Math.round((scores.seo?.score??0)*100),performance=Math.round((scores.performance?.score??0)*100),a11y=Math.round((scores.accessibility?.score??0)*100);
 const viewport=result.configSettings?.screenEmulation;
 console.log(name+': SEO '+seo+', performance '+performance+', accessibility '+a11y+', viewport '+(viewport?.width??'default'));
 if(seo<90)throw new Error(name+' Lighthouse SEO < 90');
 const failures=Object.values(result.audits).filter(a=>a.score===0 && ['document-title','meta-description','canonical','viewport','robots-txt','is-crawlable','font-size','tap-targets'].includes(a.id));
 if(failures.length)throw new Error(name+' Lighthouse audit failures: '+failures.map(a=>a.id).join(', '));
}
