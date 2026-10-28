// Annual salaries with dedicated "X a year is how much an hour" pages.
export const SALARIES = [30000, 40000, 50000, 60000, 65000, 70000, 80000, 100000];
export const salarySlug = salary => `${salary}-a-year-is-how-much-an-hour`;

export const HOURLY_RATES=[...Array.from({length:21},(_,i)=>15+i),40,45,50,60,75,100];
export const FEATURED_RATES=[15,20,25,30,35,40,50,75,100];
export const rateSlug=rate=>`${rate}-an-hour-is-how-much-a-year`;
// BLS OEWS May 2025, all occupations; released May 15, 2026.
export const US_MEDIAN_HOURLY={value:24.51,period:'May 2025',url:'https://www.bls.gov/news.release/ocwage.htm'};
