// Work in integer cents so bill and coin totals match the displayed amount.
export const USD_DENOMINATIONS = [
  [10000, '$100', '100-front'], [5000, '$50', '50-front'],
  [2000, '$20', '20-front'], [1000, '$10', '10-front'],
  [500, '$5', '5-front'], [200, '$2', '2-front'], [100, '$1', '1-front'],
  [25, '25¢', 'quarter'], [10, '10¢', 'dime'], [5, '5¢', 'nickel'], [1, '1¢', 'penny'],
];
export const CURRENCIES = {
 HKD:{factor:100,symbol:'HK,symbol:'CN¥',notes:[100,50,20,10,5,1],coins:[.5,.1]},
 USD:{factor:100,symbol:'$',notes:[100,50,20,10,5,2,1],coins:[.25,.1,.05,.01]},
 GBP:{factor:100,symbol:'£',notes:[50,20,10,5],coins:[2,1,.5,.2,.1,.05,.02,.01]},
 EUR:{factor:100,symbol:'€',notes:[200,100,50,20,10,5],coins:[2,1,.5,.2,.1,.05,.02,.01]},
 JPY:{factor:1,symbol:'¥',notes:[10000,5000,2000,1000],coins:[500,100,50,10,5,1]},
 AUD:{factor:100,symbol:'A$',notes:[100,50,20,10,5],coins:[2,1,.5,.2,.1,.05]},
 CAD:{factor:100,symbol:'C$',notes:[100,50,20,10,5],coins:[2,1,.5,.25,.1,.05]},
 CHF:{factor:100,symbol:'CHF ',notes:[1000,200,100,50,20,10],coins:[5,2,1,.5,.2,.1,.05]},
};
export function currencyConfig(code='USD'){return CURRENCIES[code]||CURRENCIES.USD;}
export function denominations(code='USD'){
 const config=currencyConfig(code);
 if(code==='USD')return USD_DENOMINATIONS.map(([cents,label,asset])=>({cents,label,asset,src:'/images/usd-'+asset+'.webp',coin:cents<100,currency:code}));
 return [...config.notes,...config.coins].map(value=>({cents:Math.round(value*config.factor),label:config.symbol+value,asset:code.toLowerCase()+'-'+value,src:'/images/currencies/'+code.toLowerCase()+'-'+value+'.webp',coin:config.coins.includes(value),currency:code}));
}
function fromCounts(counts,code){
 const list=denominations(code).flatMap(denom=>{const count=counts.get(denom.cents)||0;return count?[{...denom,count}]:[];});
 const remainder=counts.get(0)||0;
 if(remainder)list.push({cents:remainder,label:currencyConfig(code).symbol+(remainder/currencyConfig(code).factor).toFixed(2),asset:code+'-balance-'+remainder,src:null,coin:true,balance:true,count:1,currency:code});
 return list;
}
export function splitCash(amount,code='USD'){
 if(!Number.isFinite(amount)||amount<0)return [];
 const factor=currencyConfig(code).factor;
 let remaining=Math.round((amount+Number.EPSILON)*factor);
 if(!Number.isSafeInteger(remaining))return [];
 const counts=new Map();
 for(const denom of denominations(code)){counts.set(denom.cents,Math.floor(remaining/denom.cents));remaining%=denom.cents;}
 if(remaining)counts.set(0,remaining);
 return fromCounts(counts,code);
}
export function makeChange(groups){
 const index=groups.findIndex(group=>group.cents>1&&!group.balance&&denominations(group.currency).some(d=>d.cents<group.cents));
 if(index<0)return groups;
 const piece=groups[index],code=piece.currency||'USD';
 const counts=new Map(groups.map(group=>[group.balance?0:group.cents,group.balance?group.cents*group.count:group.count]));
 counts.set(piece.cents,piece.count-1);
 let remaining=piece.cents;
 for(const denom of denominations(code)){if(denom.cents>=piece.cents)continue;const count=Math.floor(remaining/denom.cents);counts.set(denom.cents,(counts.get(denom.cents)||0)+count);remaining%=denom.cents;}
 if(remaining)counts.set(0,(counts.get(0)||0)+remaining);
 return fromCounts(counts,code);
}

// Keep large annual incomes responsive: a labelled bundle represents many notes.
export function cashPieces(groups, limit = 36) {
  const slots = Math.max(1, Math.floor(limit / Math.max(groups.length, 1)));
  return groups.flatMap(group => {
    const length = Math.min(group.count, slots);
    return Array.from({length}, (_, index) => ({...group,
      count: index === length - 1 ? group.count - index : 1,
      key: (group.currency||'USD') + '-' + group.asset + '-' + index,
    }));
  });
}
,notes:[1000,500,100,50,20,10],coins:[10,5,2,1,.5,.2,.1]},
 MOP:{factor:100,symbol:'MOP,symbol:'CN¥',notes:[100,50,20,10,5,1],coins:[.5,.1]},
 USD:{factor:100,symbol:'$',notes:[100,50,20,10,5,2,1],coins:[.25,.1,.05,.01]},
 GBP:{factor:100,symbol:'£',notes:[50,20,10,5],coins:[2,1,.5,.2,.1,.05,.02,.01]},
 EUR:{factor:100,symbol:'€',notes:[200,100,50,20,10,5],coins:[2,1,.5,.2,.1,.05,.02,.01]},
 JPY:{factor:1,symbol:'¥',notes:[10000,5000,2000,1000],coins:[500,100,50,10,5,1]},
 AUD:{factor:100,symbol:'A$',notes:[100,50,20,10,5],coins:[2,1,.5,.2,.1,.05]},
 CAD:{factor:100,symbol:'C$',notes:[100,50,20,10,5],coins:[2,1,.5,.25,.1,.05]},
 CHF:{factor:100,symbol:'CHF ',notes:[1000,200,100,50,20,10],coins:[5,2,1,.5,.2,.1,.05]},
};
export function currencyConfig(code='USD'){return CURRENCIES[code]||CURRENCIES.USD;}
export function denominations(code='USD'){
 const config=currencyConfig(code);
 if(code==='USD')return USD_DENOMINATIONS.map(([cents,label,asset])=>({cents,label,asset,src:'/images/usd-'+asset+'.webp',coin:cents<100,currency:code}));
 return [...config.notes,...config.coins].map(value=>({cents:Math.round(value*config.factor),label:config.symbol+value,asset:code.toLowerCase()+'-'+value,src:'/images/currencies/'+code.toLowerCase()+'-'+value+'.webp',coin:config.coins.includes(value),currency:code}));
}
function fromCounts(counts,code){
 const list=denominations(code).flatMap(denom=>{const count=counts.get(denom.cents)||0;return count?[{...denom,count}]:[];});
 const remainder=counts.get(0)||0;
 if(remainder)list.push({cents:remainder,label:currencyConfig(code).symbol+(remainder/currencyConfig(code).factor).toFixed(2),asset:code+'-balance-'+remainder,src:null,coin:true,balance:true,count:1,currency:code});
 return list;
}
export function splitCash(amount,code='USD'){
 if(!Number.isFinite(amount)||amount<0)return [];
 const factor=currencyConfig(code).factor;
 let remaining=Math.round((amount+Number.EPSILON)*factor);
 if(!Number.isSafeInteger(remaining))return [];
 const counts=new Map();
 for(const denom of denominations(code)){counts.set(denom.cents,Math.floor(remaining/denom.cents));remaining%=denom.cents;}
 if(remaining)counts.set(0,remaining);
 return fromCounts(counts,code);
}
export function makeChange(groups){
 const index=groups.findIndex(group=>group.cents>1&&!group.balance&&denominations(group.currency).some(d=>d.cents<group.cents));
 if(index<0)return groups;
 const piece=groups[index],code=piece.currency||'USD';
 const counts=new Map(groups.map(group=>[group.balance?0:group.cents,group.balance?group.cents*group.count:group.count]));
 counts.set(piece.cents,piece.count-1);
 let remaining=piece.cents;
 for(const denom of denominations(code)){if(denom.cents>=piece.cents)continue;const count=Math.floor(remaining/denom.cents);counts.set(denom.cents,(counts.get(denom.cents)||0)+count);remaining%=denom.cents;}
 if(remaining)counts.set(0,(counts.get(0)||0)+remaining);
 return fromCounts(counts,code);
}

// Keep large annual incomes responsive: a labelled bundle represents many notes.
export function cashPieces(groups, limit = 36) {
  const slots = Math.max(1, Math.floor(limit / Math.max(groups.length, 1)));
  return groups.flatMap(group => {
    const length = Math.min(group.count, slots);
    return Array.from({length}, (_, index) => ({...group,
      count: index === length - 1 ? group.count - index : 1,
      key: (group.currency||'USD') + '-' + group.asset + '-' + index,
    }));
  });
}
,notes:[1000,500,100,50,20,10],coins:[10,5,2,1,.5,.2,.1]},
 CNY:{factor:100,symbol:'CN¥',notes:[100,50,20,10,5,1],coins:[.5,.1]},
 USD:{factor:100,symbol:'$',notes:[100,50,20,10,5,2,1],coins:[.25,.1,.05,.01]},
 GBP:{factor:100,symbol:'£',notes:[50,20,10,5],coins:[2,1,.5,.2,.1,.05,.02,.01]},
 EUR:{factor:100,symbol:'€',notes:[200,100,50,20,10,5],coins:[2,1,.5,.2,.1,.05,.02,.01]},
 JPY:{factor:1,symbol:'¥',notes:[10000,5000,2000,1000],coins:[500,100,50,10,5,1]},
 AUD:{factor:100,symbol:'A$',notes:[100,50,20,10,5],coins:[2,1,.5,.2,.1,.05]},
 CAD:{factor:100,symbol:'C$',notes:[100,50,20,10,5],coins:[2,1,.5,.25,.1,.05]},
 CHF:{factor:100,symbol:'CHF ',notes:[1000,200,100,50,20,10],coins:[5,2,1,.5,.2,.1,.05]},
};
export function currencyConfig(code='USD'){return CURRENCIES[code]||CURRENCIES.USD;}
export function denominations(code='USD'){
 const config=currencyConfig(code);
 if(code==='USD')return USD_DENOMINATIONS.map(([cents,label,asset])=>({cents,label,asset,src:'/images/usd-'+asset+'.webp',coin:cents<100,currency:code}));
 return [...config.notes,...config.coins].map(value=>({cents:Math.round(value*config.factor),label:config.symbol+value,asset:code.toLowerCase()+'-'+value,src:'/images/currencies/'+code.toLowerCase()+'-'+value+'.webp',coin:config.coins.includes(value),currency:code}));
}
function fromCounts(counts,code){
 const list=denominations(code).flatMap(denom=>{const count=counts.get(denom.cents)||0;return count?[{...denom,count}]:[];});
 const remainder=counts.get(0)||0;
 if(remainder)list.push({cents:remainder,label:currencyConfig(code).symbol+(remainder/currencyConfig(code).factor).toFixed(2),asset:code+'-balance-'+remainder,src:null,coin:true,balance:true,count:1,currency:code});
 return list;
}
export function splitCash(amount,code='USD'){
 if(!Number.isFinite(amount)||amount<0)return [];
 const factor=currencyConfig(code).factor;
 let remaining=Math.round((amount+Number.EPSILON)*factor);
 if(!Number.isSafeInteger(remaining))return [];
 const counts=new Map();
 for(const denom of denominations(code)){counts.set(denom.cents,Math.floor(remaining/denom.cents));remaining%=denom.cents;}
 if(remaining)counts.set(0,remaining);
 return fromCounts(counts,code);
}
export function makeChange(groups){
 const index=groups.findIndex(group=>group.cents>1&&!group.balance&&denominations(group.currency).some(d=>d.cents<group.cents));
 if(index<0)return groups;
 const piece=groups[index],code=piece.currency||'USD';
 const counts=new Map(groups.map(group=>[group.balance?0:group.cents,group.balance?group.cents*group.count:group.count]));
 counts.set(piece.cents,piece.count-1);
 let remaining=piece.cents;
 for(const denom of denominations(code)){if(denom.cents>=piece.cents)continue;const count=Math.floor(remaining/denom.cents);counts.set(denom.cents,(counts.get(denom.cents)||0)+count);remaining%=denom.cents;}
 if(remaining)counts.set(0,(counts.get(0)||0)+remaining);
 return fromCounts(counts,code);
}

// Keep large annual incomes responsive: a labelled bundle represents many notes.
export function cashPieces(groups, limit = 36) {
  const slots = Math.max(1, Math.floor(limit / Math.max(groups.length, 1)));
  return groups.flatMap(group => {
    const length = Math.min(group.count, slots);
    return Array.from({length}, (_, index) => ({...group,
      count: index === length - 1 ? group.count - index : 1,
      key: (group.currency||'USD') + '-' + group.asset + '-' + index,
    }));
  });
}
