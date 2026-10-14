import React, { useEffect, useState, useRef } from 'react'
import InstallBanner from './components/InstallBanner'
import Timer from './components/Timer'
import RoastOverlay from './components/RoastOverlay'
import ProofScanner from './components/ProofScanner'
import EmergencyCard from './components/EmergencyCard'

export default function App() {
  const [userName, setUserName] = useState('Abe');
  const [goal, setGoal] = useState('Focus Session');
  const [category, setCategory] = useState('Study');
  const [duration, setDuration] = useState(25);
  const [violations, setViolations] = useState(0);
  const [roastVisible, setRoastVisible] = useState(false);
  const [roastMode, setRoastMode] = useState('ducky');
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const lastHiddenRef = useRef(null);

  useEffect(() => {
    if (Notification && Notification.permission === 'default') {
      Notification.requestPermission().then((p) => setNotificationPermission(p))
    }

    function onVisibilityChange() {
      if (!document) return;
      if (document.visibilityState === 'hidden') {
        lastHiddenRef.current = Date.now();
      } else if (document.visibilityState === 'visible') {
        // when user returns
        const leftAt = lastHiddenRef.current;
        if (leftAt && window._focusSessionActive) {
          // treated as a violation
          setViolations((v) => v + 1);
          playSiren();
          showNotification(`${userName}! ${goal} pending hai, Instagram pe reels dekhne kyu chala gaya?!`)
          setTimeout(() => setRoastVisible(true), 600)
        }
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [goal, userName])

  function showNotification(text) {
    try {
      if (Notification.permission === 'granted') {
        new Notification('LOCK-IN & ROAST', { body: text, silent: false, badge: '/icons/icon-192.svg' })
      }
    } catch (e) { console.warn(e) }
  }

  function playSiren() {
    try {
      const a = new Audio('https://actions.googleusercontent.com/sounds/v1/alarms/alarm_clock.ogg')
      a.loop = true
      a.volume = 0.8
      a.play().catch(()=>{})
      // stop after 3s
      setTimeout(()=>{a.pause(); a.currentTime=0}, 3000)
    } catch (e) {}
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
          />

          <div className="card glass stats">
            <h3>Session Stats</h3>
            <p>Violations: <strong>{violations}</strong></p>
          </div>

          <InstallBanner />

        </section>
      </main>

      {roastVisible && (
        <RoastOverlay mode={roastMode} userName={userName} goal={goal} onClose={() => setRoastVisible(false)} />
      )}

      <footer className="footer">
        <small>Made with neon rage. PWA-ready. Press "Try to Open" on blocked apps to test roasts.</small>
      </footer>
    </div>
  )
}
