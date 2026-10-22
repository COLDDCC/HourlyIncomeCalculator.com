import test from 'node:test';import assert from 'node:assert/strict';import {estimateFederalTax,estimateEmployeeFica,estimateWeeklyOvertime} from '../src/lib/us-federal-tax.js';
test('2026 single filer 41600 gross',()=>{const r=estimateFederalTax(41600);assert.equal(r.taxable,25500);assert.equal(r.federalTax,2812);assert.equal(r.afterFederal,38788)});
test('below deduction has no federal income tax',()=>assert.equal(estimateFederalTax(10000).federalTax,0));
test('married joint first bracket',()=>assert.equal(estimateFederalTax(50000,'married_joint').federalTax,1780));
test('invalid inputs rejected',()=>assert.throws(()=>estimateFederalTax(-1)));

test('2026 employee FICA for 41600 wages',()=>{const f=estimateEmployeeFica(41600);assert.equal(f.socialSecurity,2579.2);assert.equal(f.medicare,603.2);assert.equal(f.additionalMedicare,0)});
test('2026 Social Security wage cap',()=>assert.equal(estimateEmployeeFica(200000).socialSecurity,11439));
test('additional Medicare filing thresholds',()=>assert.equal(estimateEmployeeFica(260000,'married_joint').additionalMedicare,90));
test('overtime 45 hours at 20 dollars',()=>{const x=estimateWeeklyOvertime(20,45);assert.equal(x.weeklyGross,950);assert.equal(x.overtimePay,150)});
