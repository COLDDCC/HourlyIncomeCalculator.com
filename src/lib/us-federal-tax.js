// Simplified 2026 US federal income tax estimate, not payroll withholding advice.
// Source: IRS Revenue Procedure 2025-32 (2025-45 IRB).
export const FEDERAL_2026 = {
 single:{deduction:16100,brackets:[[12400,.10],[50400,.12],[105700,.22],[201775,.24],[256225,.32],[640600,.35],[Infinity,.37]]},
 married_joint:{deduction:32200,brackets:[[24800,.10],[100800,.12],[211400,.22],[403550,.24],[512450,.32],[768700,.35],[Infinity,.37]]},
 head_household:{deduction:24150,brackets:[[17700,.10],[67450,.12],[105700,.22],[201750,.24],[256200,.32],[640600,.35],[Infinity,.37]]},
 married_separate:{deduction:16100,brackets:[[12400,.10],[50400,.12],[105700,.22],[201775,.24],[256225,.32],[384350,.35],[Infinity,.37]]}
};
export function estimateFederalTax(gross,status='single'){
 const config=FEDERAL_2026[status];if(!config||!Number.isFinite(gross)||gross<0)throw Error('Invalid tax input');
 const taxable=Math.max(0,gross-config.deduction);let previous=0,tax=0;
 for(const [limit,rate] of config.brackets){const portion=Math.max(0,Math.min(taxable,limit)-previous);tax+=portion*rate;previous=limit;if(taxable<=limit)break;}
 return {gross,taxable,federalTax:tax,afterFederal:gross-tax};
}
