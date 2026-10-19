// Source snapshot checked 2026-10-18. Never substitute calculator example rates for these data.
export const checked = '2026-10-18';
export const sources = [
 {id:'oecd',name:'OECD, Taxing Wages 2026 — Overview, Tables 1.3 and 1.7',url:'https://www.oecd.org/en/publications/taxing-wages-2026_3a5169ef-en/full-report/overview_d93131c3.html',note:'2025 estimated gross annual average-worker wages; local currency and USD purchasing-power parity (PPP).'},
 {id:'method',name:'OECD, Taxing Wages 2026 — Methodology and limitations',url:'https://www.oecd.org/en/publications/taxing-wages-2026_3a5169ef-en/full-report/methodology-and-limitations_f25b8cbc.html',note:'Population, industry coverage and country-specific differences.'},
 {id:'ilo',name:'ILOSTAT — Wages and working time: concepts and definitions',url:'https://ilostat.ilo.org/methods/concepts-and-definitions/description-wages-and-working-time-statistics/',note:'Gross earnings, hours and comparability.'},
 {id:'bls',name:'US Bureau of Labor Statistics, Occupational Employment and Wages, May 2025, Table 1',url:'https://www.bls.gov/news.release/pdf/ocwage.pdf',note:'All occupations: mean USD 33.54/hour; median USD 24.51/hour.'},
 {id:'ons',name:'UK Office for National Statistics, Employee earnings in the UK: 2025',url:'https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/bulletins/annualsurveyofhoursandearnings/2025',note:'April 2025 full-time median hourly earnings excluding overtime: GBP 19.67.'},
 {id:'abs',name:'Australian Bureau of Statistics, Employee earnings, August 2025',url:'https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/employee-earnings/aug-2025',note:'Median hourly earnings in main job: AUD 42.90.'},
 {id:'mhlw',name:'Japan Ministry of Health, Labour and Welfare, Basic Survey on Wage Structure 2025, Table 11',url:'https://www.mhlw.go.jp/toukei/itiran/roudou/chingin/kouzou/z2025/dl/14.pdf',note:'Short-time workers: mean scheduled hourly wage JPY 1,518. Not an all-worker mean or minimum wage.'},
 {id:'nbs',name:'National Bureau of Statistics of China, 2025 urban-unit annual average wages',url:'https://www.stats.gov.cn/sj/zxfb/202605/t20260515_1963707.html',note:'Urban private units CNY 71,590/year; urban non-private units CNY 129,441/year. Excludes self-employed and freelancers.'},
 {id:'fso',name:'Swiss Federal Statistical Office, Swiss Earnings Structure Survey 2024',url:'https://www.geo.admin.ch/en/newnsb/CzozNgBTCJOrNyvwsItyp',note:'Full-time standardized median monthly gross wage: CHF 7,024. Reference year 2024.'},
 {id:'ppp',name:'OECD — Purchasing Power Parities',url:'https://www.oecd.org/en/data/datasets/purchasing-power-parities.html',note:'Price-level-adjusted comparisons; PPP dollars are not foreign-exchange dollars.'},
];
export const wages = [
 {iso:'CH',en:'Switzerland',zh:'瑞士',currency:'CHF',annual:100715,ppp:106532,lang:'en'},
 {iso:'DE',en:'Germany',zh:'德国',currency:'EUR',annual:66700,ppp:93985,lang:'de'},
 {iso:'GB',en:'United Kingdom',zh:'英国',currency:'GBP',annual:55983,ppp:82329,lang:'en'},
 {iso:'CA',en:'Canada',zh:'加拿大',currency:'CAD',annual:92401,ppp:81745,lang:'en'},
 {iso:'AU',en:'Australia',zh:'澳大利亚',currency:'AUD',annual:108674,ppp:78815,lang:'en'},
 {iso:'US',en:'United States',zh:'美国',currency:'USD',annual:73520,ppp:73520,lang:'en'},
 {iso:'FR',en:'France',zh:'法国',currency:'EUR',annual:45964,ppp:67273,lang:'fr'},
 {iso:'JP',en:'Japan',zh:'日本',currency:'JPY',annual:5703038,ppp:59729,lang:'ja'},
 {iso:'ES',en:'Spain',zh:'西班牙',currency:'EUR',annual:32678,ppp:57517,lang:'es'},
].map(row=>({...row,year:2025,status:'OECD Secretariat estimate',source:'oecd'}));
export const hourlyEquivalent=(annual,hours=40,weeks=52)=>annual/(hours*weeks);
export const calculatorLink=row=>`${row.lang==='en'?'/':'/'+row.lang+'/'}?currency=${row.currency}&rate=${hourlyEquivalent(row.annual).toFixed(6)}&hours=40&weeks=52#calculator`;
export const countryNotes = {
 en:[
 ['Switzerland','A high ranking is not a household budget. For a job offer, compare the offered CHF salary with local rent, insurance and your own household costs. The FSO’s CHF 7,024 monthly median for 2024 is a different measure from the OECD mean used above.','fso'],
 ['Germany, France and Spain','All three pay in euros, but sharing a currency does not mean sharing a wage distribution. Compare occupations and cities within each country before using a national benchmark to negotiate a salary.','oecd'],
 ['United Kingdom','The ONS reports £19.67 as the April 2025 full-time median hourly wage, excluding overtime. That answers a different question from dividing an OECD average annual wage by an assumed schedule.','ons'],
 ['Canada','Use CAD for your offer and your budget. A nominal comparison between a Canadian dollar amount and a US dollar amount has no meaningful ranking until a common unit and conversion method are specified.','oecd'],
 ['Australia','ABS reports A$42.90 median hourly earnings in the main job in August 2025. Use this direct hourly statistic when that employee population fits your question, rather than treating the annual-wage equivalent as an observed hourly rate.','abs'],
 ['United States','BLS May 2025 all-occupation hourly wages were $33.54 on average and $24.51 at the median. The gap is a practical reason to ask whether a salary comparison uses the mean or the midpoint of the wage distribution.','bls'],
 ['Japan','MHLW reports ¥1,518 mean hourly pay for short-time workers in 2025. This is neither a legal minimum nor the mean for all Japanese workers. A calculator example of ¥1,500/hour is an editable scenario, not an official national wage.','mhlw'],
 ],
 zh:[
 ['瑞士','排行榜不能代替家庭预算。比较工作机会时，还要用瑞郎核对当地房租、保险与家庭开支。瑞士统计局公布的2024年全职标准化月薪中位数为7,024瑞郎，与上表采用的OECD平均工资不是同一指标。','fso'],
 ['德国、法国与西班牙','三国同用欧元，工资分布却不相同。判断报价是否合理，应继续查同一国家、城市和职业的数据，而不是把“欧元区工资”当作一个统一数值。','oecd'],
 ['英国','英国统计局公布的2025年4月全职雇员时薪中位数为19.67英镑，不含加班。它回答的是工资分布的中间位置，与把OECD平均年薪除以假定工时回答的问题不同。','ons'],
 ['加拿大','工作报价与生活预算都应先用加元核对。加元数字与美元数字不能直接比较大小；跨国比较必须先说明统一单位与换算方法。','oecd'],
 ['澳大利亚','澳大利亚统计局公布的2025年8月主要工作时薪中位数为42.90澳元。若研究对象与该调查一致，应优先使用这项直接时薪指标，而不是将年薪折算值当作观测时薪。','abs'],
 ['美国','美国劳工统计局2025年5月全职业平均时薪为33.54美元，中位数为24.51美元。两者的差距说明：判断自己的工资水平前，必须先问清“平均”指的是均值还是中位数。','bls'],
 ['日本','厚生劳动省公布的2025年短时间劳动者平均时薪为1,518日元。它不是最低工资，也不是全体劳动者的平均值。计算器中的1,500日元仅为可编辑示例，不应当被引用为官方统计。','mhlw'],
 ]
};
