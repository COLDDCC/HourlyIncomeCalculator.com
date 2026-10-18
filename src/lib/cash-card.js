// Snapshot the actual table before asynchronous image decoding or input changes.
export function snapshotCashTable(table, styleOf = node => getComputedStyle(node)) {
  return {width:table.clientWidth,height:table.clientHeight,pieces:[...table.querySelectorAll('.cash-piece')].map(node=>{
    const style=styleOf(node),image=node.querySelector('img');
    // A private image retains the selected currency if the live table changes.
    const asset=image?new Image():null;
    if(asset)asset.src=image.currentSrc||image.src;
    return {image:asset,x:node.offsetLeft,y:node.offsetTop,width:node.offsetWidth,height:node.offsetHeight,
      angle:parseFloat(style.getPropertyValue('--angle'))||0,z:Number(style.zIndex)||0,
      coin:node.classList.contains('is-coin'),band:node.querySelector('.cash-band')?.textContent||'',
      balance:!image?node.textContent:''};
  }).sort((a,b)=>a.z-b.z)};
}
export async function paintCashTable(ctx,snapshot,box) {
  await Promise.all(snapshot.pieces.filter(p=>p.image).map(async p=>{
    await p.image.decode();
    if(!p.image.naturalWidth)throw Error('Cash artwork unavailable');
  }));
  if(!snapshot.width||!snapshot.height)return;
  const scale=Math.min(box.width/snapshot.width,box.height/snapshot.height);
  const left=box.x+(box.width-snapshot.width*scale)/2,top=box.y+(box.height-snapshot.height*scale)/2;
  ctx.save();ctx.beginPath();ctx.rect(box.x,box.y,box.width,box.height);ctx.clip();
  ctx.translate(left,top);ctx.scale(scale,scale);
  for(const p of snapshot.pieces){
    ctx.save();ctx.translate(p.x+p.width/2,p.y+p.height/2);ctx.rotate(p.angle*Math.PI/180);
    ctx.shadowColor='#30270d55';ctx.shadowBlur=4;ctx.shadowOffsetY=4;
    if(p.image)ctx.drawImage(p.image,-p.width/2,-p.height/2,p.width,p.height);
    else {ctx.fillStyle='#fff';ctx.fillRect(-p.width/2,-p.height/2,p.width,p.height);}
    ctx.shadowColor='transparent';ctx.textAlign='center';ctx.textBaseline='middle';
    if(p.band){const width=p.coin?p.width:Math.max(25,p.width*.25),height=p.coin?14:p.height;
      const y=p.coin?p.height/2-10:-p.height/2;
      ctx.fillStyle='#ffdf62ed';ctx.fillRect(-width/2,y,width,height);ctx.fillStyle='#49370c';ctx.font='800 10px system-ui';ctx.fillText(p.band,0,y+height/2,width-2);}
    if(p.balance){ctx.fillStyle='#604714';ctx.font='700 9px system-ui';ctx.fillText(p.balance,0,0,p.width-4);}
    ctx.restore();
  }
  ctx.restore();
}
