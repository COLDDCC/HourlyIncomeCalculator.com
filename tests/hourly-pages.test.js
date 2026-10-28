import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateFederalTax, estimateEmployeeFica, estimateWeeklyOvertime } from '../src/lib/us-federal-tax.js';
import { HOURLY_RATES, FEATURED_RATES } from '../src/lib/salary-pages.js';
const net=(rate,status)=>{const gross=rate*2080;return gross-estimateFederalTax(gross,status).federalTax-estimateEmployeeFica(gross,status).total};
test('2026 hourly take-home figures',()=>{assert.equal(net(30,'single').toFixed(2),'52318.40');assert.equal(net(30,'married_joint').toFixed(2),'54498.40');assert.equal(net(20,'single').toFixed(2),'35605.60');});
test('overtime income',()=>{assert.equal(estimateWeeklyOvertime(30,50).weeklyGross*52,85800);assert.equal(estimateWeeklyOvertime(20,50).weeklyGross*52,57200);});
test('hourly rate ranges',()=>{assert.equal(HOURLY_RATES.length,27);assert.deepEqual(FEATURED_RATES,[15,20,25,30,35,40,50,75,100]);});
