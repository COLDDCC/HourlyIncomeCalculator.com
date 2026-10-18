import { translator, languagePath, LANGUAGES } from './i18n.js';
import { currencyConfig } from './cash.js';
const lang=document.body.dataset.language||'en',t=translator(lang);
import { createCashView } from './cash-view.js';
const $=s=>document.querySelector(s);const hourly=$('#hourly'),hours=$('#hours'),weeks=$('#weeks'),currency=$('#currency');const symbols={CNY:'¥',USD:'$',GBP:'£',EUR:'€',JPY:'¥',AUD:'A$',CAD:'C$',CHF:'CHF'};const buttons=[...document.querySelectorAll('[data-rate]')];
const cashView=createCashView({lang});
function update(){let rate=Math.max(0,Math.min(100000000,Number(hourly.value)||0)),h=Math.max(0,Math.min(168,Number(hours.value)||0)),w=Math.max(0,Math.min(52,Number(weeks.value)||0)),a=rate*h*w,c=currency.value;const money=n=>new Intl.NumberFormat(lang,{style:'currency',currency:c,maximumFractionDigits:c==='JPY'?0:2}).format(n);$('#annual').textContent=money(a);$('#monthly').textContent=money(a/12);$('#biweekly').textContent=money(rate*h*2);$('#weekly').textContent=money(rate*h);$('#daily').textContent=money(rate*8);$('#symbol').textContent=symbols[c];$('#hourly').step=c==='JPY'?'1':'.01';{const amounts={hourly:rate,daily:rate*8,weekly:rate*h,monthly:a/12,annual:a};cashView.update(amounts[$('#cash-period').value]??rate*8,c);}const rates=c==='JPY'?[1000,1200,1500,2000,3000]:[15,20,25,30,50];buttons.forEach((b,index)=>{b.dataset.rate=String(rates[index]);b.textContent=symbols[c]+b.dataset.rate;b.classList.toggle('selected',Number(b.dataset.rate)===rate)})}buttons.forEach(b=>b.addEventListener('click',()=>{hourly.value=b.dataset.rate;update()}));[hourly,hours,weeks,currency,$('#cash-period')].forEach(e=>e.addEventListener('input',update));update();

// Shareable URL parameters let friends open the calculator with the same settings.
const params=new URLSearchParams(location.search);
if(!params.has('currency')){currency.value=({zh:'CNY',ja:'JPY',de:'EUR',fr:'EUR',es:'EUR'})[lang]||'USD';if(lang==='ja'&&!params.has('rate'))hourly.value='1500';}
if(['hourly','daily','weekly','monthly','annual'].includes(params.get('period')))$('#cash-period').value=params.get('period');
const validCurrency=['CNY','USD','GBP','EUR','JPY','AUD','CAD','CHF'];
const parseParam=(key,max)=>{const value=params.get(key);if(value===null)return null;const n=Number(value);return Number.isFinite(n)&&n>=0&&n<=max?n:null};
const presetRate=parseParam('rate',100000000),presetHours=parseParam('hours',168),presetWeeks=parseParam('weeks',52);
if(presetRate!==null)hourly.value=String(presetRate);
if(presetHours!==null)hours.value=String(presetHours);
if(presetWeeks!==null)weeks.value=String(presetWeeks);
if(validCurrency.includes(params.get('currency')))currency.value=params.get('currency');
update();
const shareUrl=()=>{const url=new URL(location.href);url.search='';url.searchParams.set('rate',hourly.value||'0');url.searchParams.set('hours',hours.value||'0');url.searchParams.set('weeks',weeks.value||'0');url.searchParams.set('currency',currency.value);url.searchParams.set('period',$('#cash-period').value);url.hash='calculator';return url.toString()};
const shareText=()=>t('shareText',{rate:new Intl.NumberFormat(lang,{style:'currency',currency:currency.value}).format(Number(hourly.value)||0),annual:$('#annual').textContent});
const feedback=message=>{$('#share-feedback').textContent=message};
$('#share-result').addEventListener('click',async()=>{const url=shareUrl();try{if(navigator.share){await navigator.share({title:t('title'),text:shareText(),url});feedback(t('shared'))}else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(shareText()+' '+url);feedback(t('copied'))}else{window.prompt(t('copy'),url);feedback(t('copied'))}}catch(e){if(e.name!=='AbortError')feedback(t('shareError'))}});
const drawCard=()=>{
const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=1500;const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas not supported');const c=currency.value;const rate=Math.max(0,Math.min(100000000,Number(hourly.value)||0)),h=Math.max(0,Math.min(168,Number(hours.value)||0)),w=Math.max(0,Math.min(52,Number(weeks.value)||0)),a=rate*h*w;
const money=n=>new Intl.NumberFormat(lang,{style:'currency',currency:c,maximumFractionDigits:c==='JPY'?0:2}).format(n);
const rect=(x,y,width,height,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,width,height)};
const round=(x,y,width,height,r,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,width,height,r);ctx.fill()};
const txt=(value,x,y,size,color='#49391c',weight=700,align='left')=>{ctx.fillStyle=color;ctx.font=weight+' '+size+'px system-ui, sans-serif';while(ctx.measureText(value).width>1080-x&&size>10){size-=1;ctx.font=weight+' '+size+'px system-ui, sans-serif'}ctx.textAlign=align;ctx.fillText(value,x,y)};
rect(0,0,1200,1500,'#f5c928');round(56,55,1088,1390,42,'#ffffff');round(56,55,1088,16,8,'#bd8900');txt('hourlyincome.',110,155,47,'#966500',800);txt(t('yourEarnings'),110,245,24,'#978c78',700);txt(t('hero'),110,327,64,'#30291d',800);
round(104,383,992,416,32,'#ffdc4b');txt(t('annualLabel'),150,460,25,'#8d7e61',700);
let size=93;ctx.font='800 '+size+'px system-ui, sans-serif';while(ctx.measureText(money(a)).width>890&&size>45){size-=2;ctx.font='800 '+size+'px system-ui, sans-serif'}txt(money(a),150,590,size,'#bd8900',800);
txt(money(rate)+' '+t('perHour'),150,673,39,'#796c54',600);txt(h+' '+t('hours')+' · '+w+' '+t('weeks'),150,736,27,'#9a907e',500);
const cells=[[t('monthlyLabel'),money(a/12)],[t('biweeklyLabel'),money(rate*h*2)],[t('weeklyLabel'),money(rate*h)],[t('dailyLabel'),money(rate*8)]];
cells.forEach(([label,value],i)=>{const x=112+(i%2)*515,y=900+Math.floor(i/2)*165;txt(label,x,y,23,'#9c968a',700);let font=45;ctx.font='800 '+font+'px system-ui, sans-serif';while(ctx.measureText(value).width>470&&font>25){font-=2;ctx.font='800 '+font+'px system-ui, sans-serif'}txt(value,x,y+68,font,'#5c4824',800)});
rect(110,1255,980,2,'#edeae4');txt(t('grossHint'),110,1323,23,'#918b81',500);txt('hourlyincomecalculator.com',110,1391,29,'#755c2d',700);txt('✦',1040,1391,48,'#ffd700',700);
return canvas};
$('#save-image').addEventListener('click',()=>{try{const canvas=drawCard();canvas.toBlob(blob=>{if(!blob){feedback(t('imageError'));return}const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='hourly-income-'+currency.value.toLowerCase()+'.png';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);feedback(t('saved'));},'image/png')}catch(e){feedback(t('imageError'))}});


$('#language').addEventListener('change',()=>{const code=$('#language').value;if(!LANGUAGES[code])return;const url=new URL(shareUrl());url.pathname=languagePath(code);location.assign(url.toString());});
