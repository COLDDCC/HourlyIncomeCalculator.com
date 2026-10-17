import test from 'node:test';
import assert from 'node:assert/strict';
import {createCashSound} from '../src/lib/cash-sound.js';
test('sound is opt-in, throttles drag friction, and mutes scheduled audio',async()=>{
 let created=0,starts=0,context;
 const parameter=()=>({value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}});
 const node=()=>({connect(){},disconnect(){},gain:parameter(),frequency:parameter(),Q:parameter(),start(){starts++},stop(){}});
 class Audio {constructor(){created++;context=this;this.sampleRate=8000;this.currentTime=0;this.state='suspended';this.destination={};this.gains=[];}createGain(){const gain=node();this.gains.push(gain);return gain}createBuffer(_,length){return {getChannelData:()=>new Float32Array(length)}}createBufferSource(){return node()}createBiquadFilter(){return node()}createOscillator(){return node()}async resume(){this.state='running'}}
 globalThis.AudioContext=Audio;
 const sound=createCashSound();sound.play('paper');assert.equal(created,0);assert.equal(starts,0);
 assert.equal(await sound.setEnabled(true),true);sound.play('paper');assert.equal(starts,1);
 sound.play('drag');sound.play('drag');assert.equal(starts,2);context.currentTime=.11;sound.play('drag');assert.equal(starts,3);
 sound.play('shuffle');assert.equal(starts,6);sound.play('coin');assert.equal(starts,7);
 await sound.setEnabled(false);assert.equal(context.gains[0].gain.value,0);sound.play('paper');assert.equal(starts,7);
 delete globalThis.AudioContext;
});
test('unsupported browsers leave sound disabled without throwing',async()=>{
 const sound=createCashSound();assert.equal(await sound.setEnabled(true),false);assert.doesNotThrow(()=>sound.play('shuffle'));
});
