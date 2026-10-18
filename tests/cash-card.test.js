import test from 'node:test';
import assert from 'node:assert/strict';
import {paintCashTable} from '../src/lib/cash-card.js';
const context=()=>{const draws=[];return new Proxy({draws,drawImage(image){draws.push(image);}}, {get:(o,k)=>k in o?o[k]:()=>{}});};
const piece=(image,z=0)=>({image,x:0,y:0,width:100,height:45,angle:3,z,coin:false,band:'×10'});
test('cash export waits for every real banknote image before drawing',async()=>{
 let resolve;const image={naturalWidth:400,decode:()=>new Promise(r=>{resolve=r;})};const ctx=context();
 const pending=paintCashTable(ctx,{width:400,height:190,pieces:[piece(image)]},{x:0,y:0,width:1000,height:545});
 assert.equal(ctx.draws.length,0);resolve();await pending;assert.deepEqual(ctx.draws,[image]);
});
test('cash export reports image failure instead of saving an empty cash picture',async()=>{
 const ctx=context(),image={decode:async()=>{throw Error('missing artwork');}};
 await assert.rejects(paintCashTable(ctx,{width:400,height:190,pieces:[piece(image)]},{x:0,y:0,width:1000,height:545}),/missing artwork/);
 assert.equal(ctx.draws.length,0);
});
