import fs from 'node:fs';
import {wages,sources,checked,hourlyEquivalent} from '../src/data/wage-rankings.js';
const rows=wages.map((r,i)=>({rank_within_selection:i+1,country:r.en,iso:r.iso,currency:r.currency,data_year:r.year,annual_gross_local:r.annual,annual_gross_usd_ppp:r.ppp,hours_per_week:40,paid_weeks:52,annual_hours:2080,hourly_equivalent_local:Number(hourlyEquivalent(r.annual).toFixed(6)),hourly_equivalent_usd_ppp:Number(hourlyEquivalent(r.ppp).toFixed(6)),status:r.status,source_url:sources[0].url,checked_date:checked}));
const data={title:'2025 average-worker annual wages: hourly equivalents',checked_date:checked,publication:'OECD Taxing Wages 2026',definition:'Derived standardized gross hourly equivalents, not observed hourly wages; PPP dollars are not market-exchange-rate USD.',scope:'Nine selected countries; not a world ranking. China excluded from comparable OECD ranking.',method:'Annual wage / (40 hours per week * 52 paid weeks)',china:{year:2025,private_units_annual_cny:71590,non_private_units_annual_cny:129441,source:sources.find(s=>s.id==='nbs').url,rank:null},rows,sources};
fs.mkdirSync('public/data',{recursive:true});
fs.writeFileSync('public/data/hourly-wage-by-country-2025.json',JSON.stringify(data,null,2)+'\n');
const keys=Object.keys(rows[0]),escape=v=>'"'+String(v).replaceAll('"','""')+'"';
fs.writeFileSync('public/data/hourly-wage-by-country-2025.csv',keys.join(',')+'\n'+rows.map(r=>keys.map(k=>escape(r[k])).join(',')).join('\n')+'\n');
