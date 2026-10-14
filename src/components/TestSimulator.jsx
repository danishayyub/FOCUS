import React from 'react'

export default function TestSimulator({ onTrigger }){
  const apps = [
    {name:'Instagram', color:'#E4405F'},
    {name:'TikTok', color:'#010101'},
    {name:'YouTube', color:'#FF0000'},
    {name:'Twitter', color:'#1DA1F2'},
    {name:'Reddit', color:'#FF4500'},
  ]

  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8}}>
      {apps.map(a=> (
        <button key={a.name} onClick={onTrigger} className="sim-card" style={{background:a.color,color:'#fff',padding:14,borderRadius:12,border:'none'}}>
          Try to open {a.name}
        </button>
      ))}
    </div>
  )
}
