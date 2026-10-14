// Small WebAudio-based sound utilities to avoid external audio files.
let audioCtx = null

function ensureCtx(){
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

export function initAudio(){
  ensureCtx()
}

export async function unlockAudio(){
  ensureCtx()
  if (audioCtx.state === 'suspended') {
    try { await audioCtx.resume() } catch(e){}
  }
}

export function createSiren(){
  const ctx = ensureCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(700, ctx.currentTime)
  gain.gain.setValueAtTime(0, ctx.currentTime)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()

  // Ramp gain up quickly
  gain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.05)

  let toggle = false
  const iv = setInterval(() => {
    toggle = !toggle
    const target = toggle ? 1200 : 500
    try{ osc.frequency.linearRampToValueAtTime(target, ctx.currentTime + 0.25) }catch(e){}
  }, 350)

  return {
    stop(){
      clearInterval(iv)
      try{ gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.05) }catch(e){}
      setTimeout(()=>{try{ osc.stop() }catch(e){}}, 120)
    }
  }
}

export function playPunch(){
  const ctx = ensureCtx()
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'square'
  o.frequency.setValueAtTime(120, ctx.currentTime)
  g.gain.setValueAtTime(0, ctx.currentTime)
  o.connect(g); g.connect(ctx.destination)
  o.start()
  g.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.01)
  o.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.12)
  g.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.35)
  setTimeout(()=>{try{o.stop()}catch(e){}}, 400)
}

export function playFanfare(){
  const ctx = ensureCtx()
  const now = ctx.currentTime
  const notes = [600,760,950]
  notes.forEach((f,i)=>{
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(f, now + i*0.12)
    g.gain.setValueAtTime(0, now + i*0.12)
    o.connect(g); g.connect(ctx.destination)
    o.start(now + i*0.12)
    g.gain.linearRampToValueAtTime(0.6, now + i*0.12 + 0.02)
    g.gain.linearRampToValueAtTime(0.0001, now + i*0.12 + 0.28)
    setTimeout(()=>{try{o.stop()}catch(e){}}, (i*120)+420)
  })
}
