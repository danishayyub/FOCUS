import React, { useEffect, useState, useRef } from 'react'

function formatSeconds(s){
  const mm = Math.floor(s/60).toString().padStart(2,'0')
  const ss = Math.floor(s%60).toString().padStart(2,'0')
  return `${mm}:${ss}`
}

export default function Timer({ duration=25, userName, goal, onViolation, playFanfare }){
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(duration*60)
  const [violations, setViolations] = useState(0)
  const intervalRef = useRef(null)

  useEffect(()=>{
    setSeconds(duration*60)
  },[duration])

  useEffect(()=>{
    if (running){
      window._focusSessionActive = true
      intervalRef.current = setInterval(()=>{
        setSeconds(s=>{
          if (s<=1){
            clearInterval(intervalRef.current)
            window._focusSessionActive = false
            setRunning(false)
            try{ if (playFanfare) playFanfare() }catch(e){}
            return 0
          }
          return s-1
        })
      }, 1000)
    } else {
      window._focusSessionActive = false
      clearInterval(intervalRef.current)
    }
    return ()=> clearInterval(intervalRef.current)
  },[running])

  function triggerViolation(){
    setViolations(v=>v+1)
    onViolation && onViolation()
  }

  const pct = Math.max(0, Math.min(100, Math.round(((duration*60 - seconds)/(duration*60))*100 || 0)))

  return (
    <div className="card glass timer">
      <h2>{goal}</h2>
      <div className="ring-wrap">
        <svg viewBox="0 0 100 100" className="ring">
          <circle cx="50" cy="50" r="45" className="bg" />
          <circle cx="50" cy="50" r="45" className="fg" style={{strokeDasharray:283, strokeDashoffset:283 - (pct/100)*283}} />
          <text x="50" y="52" textAnchor="middle" className="ring-text">{formatSeconds(seconds)}</text>
        </svg>
      </div>

      <div className="timer-controls">
        {!running && <button className="primary" onClick={()=>setRunning(true)}>Start</button>}
        {running && <button onClick={()=>setRunning(false)}>Pause</button>}
        <button onClick={()=>{setSeconds(duration*60); setRunning(false)}}>Reset</button>
        <div style={{marginTop:8}}>
          <span>Slip-ups: <strong>{violations}</strong></span>
        </div>
      </div>

      <div className="try-blockers">
        <h4>Blocked apps (test)</h4>
        {['Instagram','TikTok','YouTube','Twitter','Reddit','Netflix'].map(b=> (
          <div key={b} className="row">
            <button onClick={triggerViolation} className="ghost">Try to Open {b}</button>
          </div>
        ))}
      </div>

    </div>
  )
}
