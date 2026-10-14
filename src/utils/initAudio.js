// minor safety: wrap audio unlocking calls to avoid crash in older browsers
export function initAudio(){
  try{
    import('./utils/sounds').then(m=>m.initAudio()).catch(()=>{})
  }catch(e){}
}
