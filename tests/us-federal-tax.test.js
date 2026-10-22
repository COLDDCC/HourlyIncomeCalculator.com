import test from 'node:test';import assert from 'node:assert/strict';import {estimateFederalTax} from '../src/lib/us-federal-tax.js';
test('2026 single filer 41600 gross',()=>{const r=estimateFederalTax(41600);assert.equal(r.taxable,25500);assert.equal(r.federalTax,2812);assert.equal(r.afterFederal,38788)});
test('below deduction has no federal income tax',()=>assert.equal(estimateFederalTax(10000).federalTax,0));
test('married joint first bracket',()=>assert.equal(estimateFederalTax(50000,'married_joint').federalTax,1780));
test('invalid inputs rejected',()=>assert.throws(()=>estimateFederalTax(-1)));
