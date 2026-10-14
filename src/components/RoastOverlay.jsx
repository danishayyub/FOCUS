import React, { useEffect } from 'react'

const ROASTS = {
  ducky: [
    "Oye! Kitna scroll karega, tera brain jugaad karne ka time tha!",
    "Reels band kar, warna number bhejke mazaak bana dunga!",
    "Bhai nehru ka sapna tod diya, tu toh life ko swipe kar raha hai!"
  ],
  desi: [
    "Beta, mummy puch rahi hai, padhai kar raha hai ya Instagram?",
    "Dil dukhta hai jab tumhara focus swipe ho jata hai...",
    "Thoda mehnat kar, warna kal pachtayega"
  ],
  hr: [
    "We noticed you left your focus. Please return to your objective.",
    "Your productivity metrics are underperforming. Kindly resume work.",
    "Reminder: Deadlines don't respect distractions."
  ]
}

export default function RoastOverlay({ mode='ducky', userName='Abe', goal='Goal', onClose }){
  const pick = ROASTS[mode] || ROASTS.ducky
  const roast = pick[Math.floor(Math.random()*pick.length)]

  useEffect(()=>{
    // tts
    try{
      const s = new SpeechSynthesisUtterance(`${userName}! ${roast}`)
      s.lang = mode === 'desi' ? 'hi-IN' : 'en-US'
      speechSynthesis.cancel()
      speechSynthesis.speak(s)
    }catch(e){}
  },[mode, userName])

  function playRoastAudio(){
    try{
      new Audio('https://actions.googleusercontent.com/sounds/v1/cartoon/wood_plank_flicks.ogg').play().catch(()=>{})
    }catch(e){}
  }

  return (
    <div className="roast-overlay">
      <div className="roast-card glass">
        <h2>Savage Roast</h2>
        <p className="roast-text">{userName}! {roast}</p>
        <div className="roast-actions">
          <button className="primary" onClick={()=>{playRoastAudio();}}>Play Punch</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
