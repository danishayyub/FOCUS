import React, { useState, useRef } from 'react'

export default function ProofScanner({ userName, goal }){
  const [log, setLog] = useState([])
  const [status, setStatus] = useState('idle')
  const fileRef = useRef(null)

  function push(msg){ setLog(l=>[...l, `${new Date().toLocaleTimeString()} - ${msg}`]) }

  function onFile(e){
    const file = e.target.files[0]
    if(!file) return
    // simulate
    setLog([])
    setStatus('scanning')
    push('Uploading proof...')
    setTimeout(()=>{ push('Extracting text from image...') }, 800)
    setTimeout(()=>{ push('Detecting slide content...') }, 1600)
    setTimeout(()=>{ push('Verifying goal...') }, 2600)
    setTimeout(()=>{
      const ok = Math.random() > 0.4
      if(ok){ setStatus('accepted'); push('Proof verified — unlocking!'); new Audio('https://actions.googleusercontent.com/sounds/v1/alarms/beep_short.ogg').play().catch(()=>{}); }
      else { setStatus('rejected'); push('Proof invalid — Hard Rejection Roast engaged.'); }
    }, 3600)
  }

  return (
    <div>
      <div className="dropzone glass">
        <input type="file" ref={fileRef} onChange={onFile} />
        <p>Drop or choose a screenshot / short video to prove you worked.</p>
        <div className="scan-logs">
          {log.map((l,i)=>(<div key={i} className="log">{l}</div>))}
        </div>
        <div className="scan-status">Status: <strong>{status}</strong></div>
      </div>
    </div>
  )
}
