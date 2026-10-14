import React, { useEffect, useState, useRef } from 'react'
import InstallBanner from './components/InstallBanner'
import Timer from './components/Timer'
import RoastOverlay from './components/RoastOverlay'
import ProofScanner from './components/ProofScanner'
import EmergencyCard from './components/EmergencyCard'
import TestSimulator from './components/TestSimulator'
import Onboarding from './components/Onboarding'
import * as sounds from './utils/sounds'

export default function App() {
  const [userName, setUserName] = useState('Abe');
  const [goal, setGoal] = useState('Focus Session');
  const [category, setCategory] = useState('Study');
  const [duration, setDuration] = useState(25);
  const [violations, setViolations] = useState(0);
  const [roastVisible, setRoastVisible] = useState(false);
  const [roastMode, setRoastMode] = useState('ducky');
  const [aggressive, setAggressive] = useState(true);
  const [unskippableSeconds, setUnskippableSeconds] = useState(8);
  const [audioUnlocked, setAudioUnlocked] = useState(!!localStorage.getItem('focus_audio_unlocked'))
  const lastHiddenRef = useRef(null);
  const sirenRef = useRef(null);

  useEffect(() => {
    if (Notification && Notification.permission === 'default') {
      Notification.requestPermission().then(() => {})
    }

    function onVisibilityChange() {
      if (!document) return;
      if (document.visibilityState === 'hidden') {
        lastHiddenRef.current = Date.now();
        if (window._focusSessionActive && aggressive) {
          startSiren();
          showPersistentNotification(`${userName}! ${goal} pending hai, Instagram pe reels dekhne kyu chala gaya?!`)
        }
      } else if (document.visibilityState === 'visible') {
        const leftAt = lastHiddenRef.current;
        if (leftAt && window._focusSessionActive && aggressive) {
          setViolations((v) => v + 1);
          startSiren();
          setTimeout(() => setRoastVisible(true), 250);
        }
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [goal, userName, aggressive])

  async function showPersistentNotification(text) {
    try {
      const reg = await navigator.serviceWorker.getRegistration()
      if (reg && reg.showNotification) {
        reg.showNotification('LOCK-IN & ROAST', {
          body: text,
          tag: 'lockin-roast',
          renotify: true,
          requireInteraction: true,
          vibrate: [200, 100, 200],
          badge: '/icons/icon-192.svg'
        })
        return
      }
    } catch (e) {}

    try {
      if (Notification.permission === 'granted') {
        new Notification('LOCK-IN & ROAST', { body: text, silent: false })
      }
    } catch (e) {}
  }

  function startSiren(){
    try{
      if (!audioUnlocked) return
      if (sirenRef.current) return
      const s = sounds.createSiren()
      sirenRef.current = s
      // keep attempting to resume AudioContext in case it is suspended
      const id = setInterval(()=>{
        try{ if (audioUnlocked && typeof sounds.unlockAudio === 'function') { sounds.unlockAudio().catch(()=>{}) } }catch(e){}
      }, 1200)
      sirenRef.current._keepAliveId = id
    }catch(e){}
  }

  function stopSiren(){
    try{
      if (!sirenRef.current) return
      clearInterval(sirenRef.current._keepAliveId)
      sirenRef.current.stop()
      sirenRef.current = null
    }catch(e){}
  }

  function onRoastClose(){
    stopSiren()
    setRoastVisible(false)
  }

  function handleTestTrigger(){
    if (aggressive) {
      if (audioUnlocked) startSiren()
      showPersistentNotification(`${userName}! Testing aggressive interception — return to see roast.`)
    }
    setTimeout(()=>{
      setViolations((v)=>v+1);
      setRoastVisible(true)
    }, 800)
  }

  function handleUnlock(){
    setAudioUnlocked(true)
    try{ localStorage.setItem('focus_audio_unlocked','1') }catch(e){}
  }

  return (
    <div className="app-root">
      <div className="topbar">
        <h1>LOCK-IN &amp; ROAST</h1>
        <div className="modes">
          <label>Mode:</label>
          <select value={roastMode} onChange={(e)=>setRoastMode(e.target.value)}>
            <option value="ducky">Ducky/Carry Savage</option>
            <option value="desi">Desi Abba</option>
            <option value="hr">Sarcastic HR</option>
          </select>
        </div>
      </div>

      <main className="container">
        <section className="left">
          <div className="card glass">
            <h2>Session</h2>
            <div className="form-grid">
              <input value={userName} onChange={(e)=>setUserName(e.target.value)} placeholder="Your name (Abe)" />
              <input value={goal} onChange={(e)=>setGoal(e.target.value)} placeholder="Goal (e.g., Study 2h)" />
              <select value={category} onChange={(e)=>setCategory(e.target.value)}>
                <option>Study</option>
                <option>Coding</option>
                <option>Work</option>
                <option>Content Creation</option>
              </select>

              <div className="duration-row">
                <button onClick={()=>setDuration(1)}>1m</button>
                <button onClick={()=>setDuration(25)}>25m</button>
                <button onClick={()=>setDuration(50)}>50m</button>
                <button onClick={()=>setDuration(90)}>90m</button>
                <input type="number" min="1" value={duration} onChange={(e)=>setDuration(Number(e.target.value))} />
              </div>
            </div>

            <div style={{marginTop:12}}>
              <h3>Blocker</h3>
              <div className="blockers">
                {['Instagram','TikTok','YouTube','Twitter','Reddit','Netflix'].map((b)=> (
                  <label key={b} className="chip"><input type="checkbox" defaultChecked />{b}</label>
                ))}
              </div>
            </div>

          </div>

          <div className="card glass">
            <h2>Proof & Rewards</h2>
            <ProofScanner userName={userName} goal={goal} />
            <EmergencyCard userName={userName} goal={goal} violations={violations} />
          </div>

          <div className="card glass">
            <h2>Test Blocker / Simulator</h2>
            <p>Use the simulator below to experience aggressive interception on mobile browsers.</p>
            <TestSimulator onTrigger={handleTestTrigger} />
            <div style={{marginTop:10}}>
              <label style={{display:'flex',alignItems:'center',gap:8}}><input type="checkbox" checked={aggressive} onChange={(e)=>setAggressive(e.target.checked)} /> Aggressive Interception Mode</label>
            </div>
          </div>
        </section>

        <section className="right">
          <Timer
            duration={duration}
            userName={userName}
            goal={goal}
            onViolation={()=>{
              setViolations((v)=>v+1);
              setRoastVisible(true);
            }}
            playFanfare={sounds.playFanfare}
          />

          <div className="card glass stats">
            <h3>Session Stats</h3>
            <p>Violations: <strong>{violations}</strong></p>
          </div>

          <InstallBanner />

        </section>
      </main>

      {roastVisible && (
        <RoastOverlay mode={roastMode} userName={userName} goal={goal} unskippable seconds={unskippableSeconds} onClose={onRoastClose} playPunch={sounds.playPunch} />
      )}

      {!audioUnlocked && <Onboarding onUnlock={handleUnlock} />}

      <footer className="footer">
        <small>Made with neon rage. PWA-ready. Press "Try to Open" on blocked apps to test roasts.</small>
      </footer>
    </div>
  )
}
