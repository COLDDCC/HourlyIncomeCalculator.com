import { snapshotCashTable, paintCashTable } from './cash-card.js';
import { translator, languagePath, LANGUAGES } from './i18n.js';
import { currencyConfig } from './cash.js';
import { MARKETS, languageCurrency } from './market.js';
const lang=document.body.dataset.language||'en',t=translator(lang);
import { createCashView } from './cash-view.js';
const $=s=>document.querySelector(s);const hourly=$('#hourly'),hours=$('#hours'),weeks=$('#weeks'),currency=$('#currency');const symbols={CNY:'¥',USD:'$',GBP:'£',EUR:'€',JPY:'¥',AUD:'A$',CAD:'C$',CHF:'CHF'};const buttons=[...document.querySelectorAll('[data-rate]')];
const cashView=createCashView({lang});
function update(){let rate=Math.max(0,Math.min(100000000,Number(hourly.value)||0)),h=Math.max(0,Math.min(168,Number(hours.value)||0)),w=Math.max(0,Math.min(52,Number(weeks.value)||0)),a=rate*h*w,c=currency.value;const money=n=>new Intl.NumberFormat(lang,{style:'currency',currency:c,maximumFractionDigits:c==='JPY'?0:2}).format(n);$('#annual').textContent=money(a);$('#monthly').textContent=money(a/12);$('#biweekly').textContent=money(rate*h*2);$('#weekly').textContent=money(rate*h);$('#daily').textContent=money(rate*8);$('#symbol').textContent=symbols[c];$('#hourly').step=c==='JPY'?'1':'.01';{const amounts={hourly:rate,daily:rate*8,weekly:rate*h,monthly:a/12,annual:a};cashView.update(amounts[$('#cash-period').value]??rate*8,c);}const rates=MARKETS[c].presets;buttons.forEach((b,index)=>{b.dataset.rate=String(rates[index]);b.textContent=symbols[c]+b.dataset.rate;b.classList.toggle('selected',Number(b.dataset.rate)===rate)})}buttons.forEach(b=>b.addEventListener('click',()=>{hourly.value=b.dataset.rate;update()}));[hourly,hours,weeks,$('#cash-period')].forEach(e=>e.addEventListener('input',update));update();

// Shareable URL parameters let friends open the calculator with the same settings.
const params=new URLSearchParams(location.search);
currency.value=languageCurrency(lang);
hourly.value=String(MARKETS[currency.value].rate);
if(['hourly','daily','weekly','monthly','annual'].includes(params.get('period')))$('#cash-period').value=params.get('period');
const validCurrency=['CNY','USD','GBP','EUR','JPY','AUD','CAD','CHF'];
const parseParam=(key,max)=>{const value=params.get(key);if(value===null)return null;const n=Number(value);return Number.isFinite(n)&&n>=0&&n<=max?n:null};
const presetRate=parseParam('rate',100000000),presetHours=parseParam('hours',168),presetWeeks=parseParam('weeks',52);
if(presetRate!==null)hourly.value=String(presetRate);
if(presetHours!==null)hours.value=String(presetHours);
if(presetWeeks!==null)weeks.value=String(presetWeeks);
if(validCurrency.includes(params.get('currency'))){currency.value=params.get('currency');if(presetRate===null)hourly.value=String(MARKETS[currency.value].rate);}
update();
const currencyRates=new Map();
let previousCurrency=currency.value;
currency.addEventListener('input',()=>{currencyRates.set(previousCurrency,hourly.value);hourly.value=currencyRates.get(currency.value)??String(MARKETS[currency.value].rate);previousCurrency=currency.value;update();});
const shareUrl=()=>{const url=new URL(location.href);url.search='';url.searchParams.set('rate',hourly.value||'0');url.searchParams.set('hours',hours.value||'0');url.searchParams.set('weeks',weeks.value||'0');url.searchParams.set('currency',currency.value);url.searchParams.set('period',$('#cash-period').value);url.hash='calculator';return url.toString()};
const shareText=()=>t('shareText',{rate:new Intl.NumberFormat(lang,{style:'currency',currency:currency.value}).format(Number(hourly.value)||0),annual:$('#annual').textContent});
const feedback=message=>{$('#share-feedback').textContent=message};
$('#share-result').addEventListener('click',async()=>{const url=shareUrl();try{if(navigator.share){await navigator.share({title:t('title'),text:shareText(),url});feedback(t('shared'))}else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(shareText()+' '+url);feedback(t('copied'))}else{window.prompt(t('copy'),url);feedback(t('copied'))}}catch(e){if(e.name!=='AbortError')feedback(t('shareError'))}});
// Social share uses the current calculator inputs, not a static homepage link.
const shareToggle=$('#share-result');
const socialOptions=$('#social-share-options');
shareToggle.addEventListener('click',()=>{const expanded=shareToggle.getAttribute('aria-expanded')==='true';shareToggle.setAttribute('aria-expanded',String(!expanded));socialOptions.hidden=expanded});
const socialTargets={
facebook:url=>'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url),
reddit:url=>'https://www.reddit.com/submit?url='+encodeURIComponent(url)+'&title='+encodeURIComponent(shareText()),
x:url=>'https://twitter.com/intent/tweet?text='+encodeURIComponent(shareText())+'&url='+encodeURIComponent(url),
whatsapp:url=>'https://api.whatsapp.com/send?text='+encodeURIComponent(shareText()+' '+url)
};
socialOptions.addEventListener('click',async event=>{
const button=event.target.closest('[data-social]');if(!button)return;
const platform=button.dataset.social,url=shareUrl();
if(platform==='instagram'){
try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(shareText()+' '+url);feedback(t('copied'))}else{window.prompt(t('copy'),shareText()+' '+url)}}catch{window.prompt(t('copy'),shareText()+' '+url)}
window.open('https://www.instagram.com/','_blank','noopener,noreferrer');return;
}
const target=socialTargets[platform]?.(url);if(target)window.open(target,'_blank','noopener,noreferrer');
});
const drawCard=async()=>{
const snapshot=snapshotCashTable($('#cash-table'));
const period=$('#cash-period').value,cashTotal=$('#cash-total').textContent;
const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=1500;const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas not supported');const c=currency.value;const rate=Math.max(0,Math.min(100000000,Number(hourly.value)||0)),h=Math.max(0,Math.min(168,Number(hours.value)||0)),w=Math.max(0,Math.min(52,Number(weeks.value)||0)),a=rate*h*w;
const money=n=>new Intl.NumberFormat(lang,{style:'currency',currency:c,maximumFractionDigits:c==='JPY'?0:2}).format(n);
const rect=(x,y,width,height,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,width,height)};
const round=(x,y,width,height,r,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,width,height,r);ctx.fill()};
const txt=(value,x,y,size,color='#30270d',weight=700,align='left',maxWidth=align==='right'?x-96:1104-x)=>{ctx.fillStyle=color;ctx.font=weight+' '+size+'px system-ui, sans-serif';while(ctx.measureText(value).width>maxWidth&&size>10){size-=1;ctx.font=weight+' '+size+'px system-ui, sans-serif'}ctx.textAlign=align;ctx.fillText(value,x,y)};
const gold=ctx.createLinearGradient(0,0,1200,1500);gold.addColorStop(0,'#ffe977');gold.addColorStop(.45,'#f9d23c');gold.addColorStop(1,'#edb914');rect(0,0,1200,1500,gold);
round(48,48,1104,1404,40,'#ffffff');
const logo=new Image();logo.src='/gold-coin.svg';await logo.decode();ctx.drawImage(logo,96,83,48,48);txt('hourlyincome.',156,120,34,'#805500',800);txt(c,1104,125,25,'#604714',700,'right');
txt(t(period),96,207,30,'#604714',700);txt(cashTotal,96,306,86,'#30270d',800);
txt(money(rate)+' '+t('perHour'),96,362,29,'#604714',600);
const tableGold=ctx.createLinearGradient(80,405,1120,990);tableGold.addColorStop(0,'#fff3a1');tableGold.addColorStop(1,'#f2c32a');round(80,405,1040,585,28,tableGold);
await paintCashTable(ctx,snapshot,{x:100,y:425,width:1000,height:545});
const cells=[[t('annualLabel'),money(a)],[t('monthlyLabel'),money(a/12)],[t('weeklyLabel'),money(rate*h)],[t('dailyLabel'),money(rate*8)]];
cells.forEach(([label,value],i)=>{const x=96+(i%2)*530,y=1057+Math.floor(i/2)*118;txt(label,x,y,22,'#604714',600);txt(value,x,y+51,40,'#30270d',800,'left',478)});
rect(96,1275,1008,2,'#edcf68');txt(h+' '+t('hours')+' · '+w+' '+t('weeks'),96,1322,23,'#604714',500);
txt(t('grossHint'),96,1367,20,'#604714',500);txt('hourlyincomecalculator.com',96,1415,24,'#805500',700);
return canvas};
$('#save-image').addEventListener('click',async()=>{const button=$('#save-image'),exportCurrency=currency.value;button.disabled=true;try{if(document.fonts?.ready)await document.fonts.ready;const canvas=await drawCard();canvas.toBlob(blob=>{if(!blob){feedback(t('imageError'));return}const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='hourly-income-'+exportCurrency.toLowerCase()+'.png';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);feedback(t('saved'));},'image/png')}catch(e){feedback(t('imageError'))}finally{button.disabled=false}});


$('#language').addEventListener('change',()=>{const code=$('#language').value;if(!LANGUAGES[code])return;const url=new URL(shareUrl());url.pathname=languagePath(code);const targetCurrency=languageCurrency(code);url.searchParams.set('currency',targetCurrency);url.searchParams.set('rate',targetCurrency===currency.value?hourly.value:(currencyRates.get(targetCurrency)??String(MARKETS[targetCurrency].rate)));location.assign(url.toString());});
