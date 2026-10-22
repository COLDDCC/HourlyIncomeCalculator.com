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

/** Employee FICA for a standard W-2 job, tax year 2026.
 * The additional Medicare liability threshold depends on filing status,
 * and is separate from employer withholding threshold.
 */
export function estimateEmployeeFica(gross,status='single'){
 if(!FEDERAL_2026[status]||!Number.isFinite(gross)||gross<0)throw Error('Invalid FICA input');
 const socialSecurity=Math.min(gross,184500)*0.062;
 const medicare=gross*0.0145;
 const threshold=status==='married_joint'?250000:status==='married_separate'?125000:200000;
 const additionalMedicare=Math.max(0,gross-threshold)*0.009;
 return {socialSecurity,medicare,additionalMedicare,total:socialSecurity+medicare+additionalMedicare};
}
/** Simplified 1.5x overtime for a covered, non-exempt hourly worker. */
export function estimateWeeklyOvertime(rate,hours,threshold=40){
 if(!Number.isFinite(rate)||!Number.isFinite(hours)||rate<0||hours<0||hours>168)throw Error('Invalid overtime input');
 const regularHours=Math.min(hours,threshold),overtimeHours=Math.max(0,hours-threshold);
 return {regularHours,overtimeHours,regularPay:rate*regularHours,overtimePay:rate*overtimeHours*1.5,weeklyGross:rate*regularHours+rate*overtimeHours*1.5};
}
