import { createCashSound } from './cash-sound.js';
import { splitCash, makeChange, cashPieces } from './cash.js';

export function createCashView() {
  const board = document.querySelector('#cash-table');
  const total = document.querySelector('#cash-total');
  const piecesLabel = document.querySelector('#cash-pieces');
  const caption = document.querySelector('#cash-caption');
  const changeButton = document.querySelector('#cash-change');
  const arrangeButton = document.querySelector('#cash-arrange');
  const spreadButton = document.querySelector('#cash-spread');
  const sound = createCashSound();
  const soundButton = document.querySelector('#cash-sound');
  const motionAnimations = new WeakMap();
  const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  function motion(node, kind, index=0) {
    if(reducedMotion() || !node.animate)return;
    motionAnimations.get(node)?.cancel();
    const deal=[{opacity:0,translate:'22px -65px',rotate:'-12deg',scale:.9},{opacity:1,translate:'-2px 5px',rotate:'2deg',scale:1.02,offset:.78},{opacity:1,translate:'0 0',rotate:'0deg',scale:1}];
    const settle=[{translate:'0 -7px',scale:1.05},{translate:'0 3px',scale:.99,offset:.6},{translate:'0 0',scale:1}];
    motionAnimations.set(node,node.animate(kind==='deal'?deal:settle,{duration:kind==='deal'?540:330,delay:Math.min(index,12)*28,easing:'cubic-bezier(.2,.7,.3,1)'}));
  }
  soundButton?.addEventListener('click',async()=>{
    const next=soundButton.getAttribute('aria-pressed')!=='true';soundButton.disabled=true;
    const enabled=await sound.setEnabled(next);soundButton.disabled=false;
    soundButton.setAttribute('aria-pressed',String(enabled));soundButton.textContent=enabled?'Sound on':'Sound off';
    soundButton.title=next&&!enabled?'Sound is unavailable in this browser':'Paper and coin sounds';
    if(enabled)sound.play('shuffle');
  });
  const format = value => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD'}).format(value);
  let groups = [], amountKey = '', arranged = false, layer = 100, nodes = [], activeDrag = null;
  const random = seed => { const n = Math.sin(seed * 78.233 + 12.9898) * 43758.5453; return n - Math.floor(n); };
  const place = (node, x, y, angle) => {
    node.style.left = x + 'px';node.style.top = y + 'px';node.style.setProperty('--angle', angle + 'deg');
    node.dataset.x = String(x);node.dataset.y = String(y);
  };
  function layout() {
    const width = board.clientWidth || 340, height = board.clientHeight || 190;
    const bills = nodes.filter(node => node.dataset.coin !== 'true');
    const coins = nodes.filter(node => node.dataset.coin === 'true');
    nodes.forEach((node,index) => {
      const coin = node.dataset.coin === 'true', itemWidth = coin ? 39 : Math.min(158,width * .44), itemHeight = coin ? 39 : itemWidth * 3/7;
      node.style.width = itemWidth + 'px';
      let x, y, angle;
      if (arranged) {
        const list = coin ? coins : bills, i = list.indexOf(node), offset = Math.min(i, 24);
        x = coin ? width - 65 - (i % 3) * 18 : Math.max(18,(width-itemWidth)/2-22) + offset * 1.6;
        y = coin ? height - 75 + Math.floor(i/3) * 4 : Math.max(20,(height-itemHeight)/2-15) + offset * 1.5;
        angle = coin ? i * 8 : 0;
      } else {
        const cols = nodes.length <= 4 ? 2 : 3, rows = Math.ceil(nodes.length / cols);
        const column = index % cols, row = Math.floor(index / cols);
        x = 14 + (width-itemWidth-28) * (cols === 1 ? .5 : column/(cols-1)) + (random(index+7)-.5)*18;
        y = 15 + (height-itemHeight-30) * (rows <= 1 ? .5 : row/(rows-1)) + (random(index+12)-.5)*12;
        angle = (random(index+2)-.5) * (coin ? 70 : 27);
      }
      place(node,Math.max(12,Math.min(width-itemWidth-12,x)),Math.max(12,Math.min(height-itemHeight-12,y)),angle);
    });
    arrangeButton.setAttribute('aria-pressed',String(arranged));
    spreadButton.setAttribute('aria-pressed',String(!arranged));
  }
  function draggable(node) {
    node.addEventListener('pointerdown',event => {
      if(event.button !== 0 || activeDrag) return;
      activeDrag = {node, id:event.pointerId, clientX:event.clientX, clientY:event.clientY, x:Number(node.dataset.x), y:Number(node.dataset.y)};
      motionAnimations.get(node)?.cancel();node.setPointerCapture(event.pointerId);node.style.zIndex=String(++layer);node.classList.add('is-dragging');sound.play(node.dataset.coin==='true'?'coin':'paper',.65);
    });
    node.addEventListener('pointermove',event => {
      if(!activeDrag || activeDrag.node!==node || activeDrag.id!==event.pointerId)return;
      const x=activeDrag.x+event.clientX-activeDrag.clientX,y=activeDrag.y+event.clientY-activeDrag.clientY;
      if(Math.abs(event.clientX-activeDrag.clientX)+Math.abs(event.clientY-activeDrag.clientY)>3)sound.play('drag',.55);
      place(node,Math.max(0,Math.min(board.clientWidth-node.offsetWidth,x)),Math.max(0,Math.min(board.clientHeight-node.offsetHeight,y)),0);
    });
    const release=()=>{if(activeDrag?.node===node){activeDrag=null;node.classList.remove('is-dragging');motion(node,'drop');sound.play(node.dataset.coin==='true'?'coin':'drop',.7);arranged=false;arrangeButton.setAttribute('aria-pressed','false');spreadButton.setAttribute('aria-pressed','false');}};
    node.addEventListener('pointerup',release);node.addEventListener('pointercancel',release);node.addEventListener('lostpointercapture',release);
    node.addEventListener('keydown',event=>{
      const moves={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]},move=moves[event.key];
      if(!move)return;event.preventDefault();node.style.zIndex=String(++layer);
      place(node,Math.max(0,Math.min(board.clientWidth-node.offsetWidth,Number(node.dataset.x)+move[0])),Math.max(0,Math.min(board.clientHeight-node.offsetHeight,Number(node.dataset.y)+move[1])),0);
    });
  }
  function draw() {
    activeDrag=null;
    const previous = new Map(nodes.map(node=>[node.dataset.key,node]));
    nodes=cashPieces(groups).map((piece,index)=>{
      let node=previous.get(piece.key);
      if(node && Number(node.dataset.count)!==piece.count){node.remove();node=null;}
      if(!node){
        node=document.createElement('button');node.type='button';node.className='cash-piece'+(piece.coin?' is-coin':'')+(piece.count>1?' is-bundle':'');
        node.dataset.key=piece.key;node.dataset.count=String(piece.count);node.dataset.coin=String(piece.coin);
        const img=document.createElement('img');img.src='/images/usd-'+piece.asset+'.webp';img.alt='';img.draggable=false;img.decoding='async';node.append(img);
        if(piece.count>1){const band=document.createElement('span');band.className='cash-band';band.textContent='×'+piece.count.toLocaleString('en-US');node.append(band);}
        node.setAttribute('aria-label',(piece.count>1?piece.count+' × ':'')+piece.label+'; drag or use arrow keys to move');
        node.title=piece.label+(piece.count>1?' × '+piece.count.toLocaleString('en-US'):'');draggable(node);board.append(node);motion(node,'deal',index);
      }
      previous.delete(piece.key);node.style.zIndex=String(index+1);return node;
    });
    previous.forEach(node=>node.remove());
    const notes=groups.filter(g=>!g.coin).reduce((sum,g)=>sum+g.count,0),coins=groups.filter(g=>g.coin).reduce((sum,g)=>sum+g.count,0);
    piecesLabel.textContent=[notes?notes.toLocaleString('en-US')+' note'+(notes===1?'':'s'):'',coins?coins.toLocaleString('en-US')+' coin'+(coins===1?'':'s'):''].filter(Boolean).join(' + ')||'No cash yet';
    board.classList.toggle('is-empty',nodes.length===0);
    caption.textContent=nodes.length?(nodes.some(n=>Number(n.dataset.count)>1)?'Bands show bundle quantities. Total stays exact to the cent.':'Drag your cash · Double-click the table to tidy up'):'Enter a rate to put your earnings on the table.';
    changeButton.disabled=!groups.some(g=>g.cents>1);arrangeButton.disabled=!nodes.length;spreadButton.disabled=!nodes.length;
    layout();sound.play('shuffle',.7);
  }
  const animateLayout=()=>{layout();nodes.forEach((node,index)=>motion(node,'settle',index));sound.play('shuffle');};
  arrangeButton.addEventListener('click',()=>{arranged=true;animateLayout();});
  spreadButton.addEventListener('click',()=>{arranged=false;animateLayout();});
  board.addEventListener('dblclick',event=>{event.preventDefault();arranged=true;animateLayout();});
  changeButton.addEventListener('click',()=>{groups=makeChange(groups);arranged=false;draw();caption.textContent='One piece exchanged for smaller denominations. Same total.';});
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(()=>layout()).observe(board);
  return {update(amount){
    const cents=Number.isFinite(amount)?Math.round((amount+Number.EPSILON)*100):0;
    total.textContent=format(cents/100);
    if(amountKey===String(cents))return;
    amountKey=String(cents);groups=splitCash(cents/100);draw();
  }};
}
