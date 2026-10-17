// Lightweight synthesized paper friction: no audio downloads or autoplay.
export function createCashSound() {
  let context, master, paper, enabled = false, lastDrag = -Infinity;
  function initialize() {
    if (context) return;
    const Audio = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!Audio) throw new Error('Audio unavailable');
    context = new Audio();master = context.createGain();master.gain.value = 0;master.connect(context.destination);
    paper = context.createBuffer(1, Math.ceil(context.sampleRate * .42), context.sampleRate);
    const data = paper.getChannelData(0);
    let previous = 0;
    for (let i=0;i<data.length;i++) { const white=Math.random()*2-1;data[i]=white*.7+previous*.3;previous=white; }
  }
  return {
    async setEnabled(next) {
      enabled=false;
      if (!next) { if(master)master.gain.value=0;return false; }
      try { initialize();await context.resume();enabled=context.state==='running';master.gain.value=enabled ? .38 : 0;return enabled; }
      catch { if(master)master.gain.value=0;return false; }
    },
    play(kind='paper', strength=1) {
      if(!enabled || context?.state!=='running' || globalThis.document?.hidden)return;
      const now=context.currentTime;
      if(kind==='drag' && now-lastDrag<.095)return;
      if(kind==='drag')lastDrag=now;
      try {
        const count=kind==='shuffle'?3:1;
        for(let i=0;i<count;i++) {
          const start=now+i*.065, duration=kind==='drag' ? .095 : kind==='drop' ? .14 : .22;
          const envelope=context.createGain();envelope.connect(master);
          if(kind==='coin') {
            const tone=context.createOscillator();tone.type='sine';tone.frequency.setValueAtTime(2500,start);tone.frequency.exponentialRampToValueAtTime(1600,start+.1);
            envelope.gain.setValueAtTime(.0001,start);envelope.gain.exponentialRampToValueAtTime(.07,start+.003);envelope.gain.exponentialRampToValueAtTime(.0001,start+.12);
            tone.connect(envelope);tone.start(start);tone.stop(start+.13);tone.onended=()=>{tone.disconnect();envelope.disconnect();};
          } else {
            const source=context.createBufferSource(),filter=context.createBiquadFilter();source.buffer=paper;filter.type='bandpass';filter.frequency.value=kind==='drop'?950:1800+Math.random()*700;filter.Q.value=.65;
            source.connect(filter);filter.connect(envelope);
            const level=Math.min(.45,Math.max(.04,strength*.22));
            envelope.gain.setValueAtTime(.0001,start);envelope.gain.exponentialRampToValueAtTime(level,start+.012);envelope.gain.exponentialRampToValueAtTime(level*.2,start+duration*.55);envelope.gain.exponentialRampToValueAtTime(.0001,start+duration);
            source.start(start,Math.random()*.1,duration);source.onended=()=>{source.disconnect();filter.disconnect();envelope.disconnect();};
          }
        }
      } catch { /* Audio support never blocks the calculator or cash interaction. */ }
    }
  };
}
