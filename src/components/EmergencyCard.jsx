import React, { useRef } from 'react'

export default function EmergencyCard({ userName, goal, violations }){
  const canvasRef = useRef(null)

  function makeCard(){
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = 800
    canvas.height = 450
    ctx.fillStyle = '#0F0F12'
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle = '#8B5CF6'
    ctx.font = '36px sans-serif'
    ctx.fillText('LOCK-IN & ROAST', 40, 70)
    ctx.fillStyle = '#fff'
    ctx.font = '28px sans-serif'
    ctx.fillText(`${userName} — ${goal}`, 40, 140)
    ctx.font = '22px sans-serif'
    ctx.fillStyle = '#22C55E'
    ctx.fillText(`Discipline Score: ${Math.max(0,100 - violations*10)}`, 40, 200)
    ctx.fillStyle = '#EF4444'
    ctx.fillText(`Roasts: ${violations}`, 40, 240)
  }

  function download(){
    makeCard()
    const url = canvasRef.current.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'focus_card.png'
    a.click()
  }

  return (
    <div style={{marginTop:12}}>
      <canvas ref={canvasRef} style={{width:'100%',borderRadius:12,display:'block',marginBottom:8}} />
      <div className="row">
        <button className="primary" onClick={download}>Make My Card</button>
        <button className="ghost" onClick={()=>{navigator.clipboard && navigator.clipboard.writeText(`I'm focusing on ${goal} — Discipline score ${Math.max(0,100 - violations*10)}`)}}>Copy Story Text</button>
      </div>
    </div>
  )
}
