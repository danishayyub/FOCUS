import React from 'react'

export default function Onboarding({onUnlock}){
  async function handleUnlock(){
    try{
      // request notification permission
      if (Notification && Notification.permission === 'default'){
        await Notification.requestPermission()
      }
    }catch(e){}

    try{
      const mod = await import('../utils/sounds')
      mod.initAudio()
      await mod.unlockAudio()
      // play a tiny click to show audio is unlocked
      mod.playPunch()
    }catch(e){}

    try{ localStorage.setItem('focus_audio_unlocked','1') }catch(e){}
    onUnlock && onUnlock()
  }

  return (
    <div className="onboard-overlay">
      <div className="onboard-card glass">
        <h2>Quick setup</h2>
        <p>Tap once to unlock audio and notifications so roasts and sirens will play reliably on mobile.</p>
        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button className="primary" onClick={handleUnlock}>Unlock Audio & Notifications</button>
        </div>
        <small style={{display:'block',marginTop:12,opacity:0.8}}>You can change this later in Settings.</small>
      </div>
    </div>
  )
}
