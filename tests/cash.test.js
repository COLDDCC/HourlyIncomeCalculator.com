import test from 'node:test';
import assert from 'node:assert/strict';
import {splitCash,makeChange,cashPieces} from '../src/lib/cash.js';
import {createCashView} from '../src/lib/cash-view.js';
const sum=groups=>groups.reduce((total,g)=>total+g.cents*g.count,0);
test('cash and repeated change preserve every cent, including rounding',()=>{
 for(const amount of [0,.01,.99,1.005,8,18.37,146.96,240,62400,999999999.99]){
  let groups=splitCash(amount);const cents=Math.round((amount+Number.EPSILON)*100);
  assert.equal(sum(groups),cents);
  for(let i=0;i<50;i++){groups=makeChange(groups);assert.equal(sum(groups),cents);const pieces=cashPieces(groups);assert(pieces.length<=36);assert.equal(sum(pieces),cents);}
 }
 assert.deepEqual(makeChange(splitCash(.01)),splitCash(.01));
});
class Element{
 constructor(){this.children=[];this.dataset={};this.style={setProperty(k,v){this[k]=v}};this.listeners={};this.attrs={};this.clientWidth=340;this.clientHeight=190;const classes=new Set();this.classList={add:x=>classes.add(x),remove:x=>classes.delete(x),toggle:(x,on)=>on?classes.add(x):classes.delete(x)};}
 get offsetWidth(){return parseFloat(this.style.width)||40}
 get offsetHeight(){return this.dataset.coin==='true'?this.offsetWidth:this.offsetWidth*3/7}
 addEventListener(name,fn){this.listeners[name]=fn}
 fire(name,event={}){this.listeners[name]?.({preventDefault(){},...event})}
 setAttribute(k,v){this.attrs[k]=v}
 setPointerCapture(){}
 append(node){node.parent=this;this.children.push(node)}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this)}
}
test('cash table updates, makes change, arranges, drags within bounds and clears',()=>{
 const els=new Map(),get=id=>{if(!els.has(id))els.set(id,new Element());return els.get(id)};
 globalThis.document={querySelector:get,createElement:()=>new Element()};
 const view=createCashView();view.update(240);const board=get('#cash-table');
 assert.equal(get('#cash-total').textContent,'$240.00');assert.equal(board.children.length,4);
 get('#cash-change').fire('click');assert.equal(board.children.length,5);assert.equal(get('#cash-total').textContent,'$240.00');
 get('#cash-arrange').fire('click');assert.equal(get('#cash-arrange').attrs['aria-pressed'],'true');
 get('#cash-spread').fire('click');assert.equal(get('#cash-spread').attrs['aria-pressed'],'true');
 const note=board.children[0];note.fire('pointerdown',{button:0,pointerId:1,clientX:20,clientY:20});note.fire('pointermove',{pointerId:1,clientX:9999,clientY:9999});
 assert(Number(note.dataset.x)>=0);assert(Number(note.dataset.x)<=board.clientWidth-note.offsetWidth);assert(Number(note.dataset.y)<=board.clientHeight-note.offsetHeight);
 note.fire('pointercancel');note.fire('keydown',{key:'ArrowLeft'});
 board.fire('dblclick');assert.equal(get('#cash-arrange').attrs['aria-pressed'],'true');
 view.update(18.37);assert(board.children.some(n=>n.dataset.coin==='true'));
 view.update(62400);assert(board.children.length<=36);assert(board.children.some(n=>Number(n.dataset.count)>1));
 view.update(0);assert.equal(board.children.length,0);assert.equal(get('#cash-change').disabled,true);assert.equal(get('#cash-total').textContent,'$0.00');
 delete globalThis.document;
});
