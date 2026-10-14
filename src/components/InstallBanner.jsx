import React, { useEffect, useState } from 'react'

export default function InstallBanner(){
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(()=>{
    function onBefore(e){
      e.preventDefault()
      setDeferredPrompt(e)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', onBefore)
    return ()=>window.removeEventListener('beforeinstallprompt', onBefore)
  },[])

  async function install(){
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const res = await deferredPrompt.userChoice
    setVisible(false)
    setDeferredPrompt(null)
  }

  if (!visible) return null
  return (
    <div className="install-banner glass">
      <div>
        <strong>Add LOCK-IN &amp; ROAST</strong>
        <p>Install for distraction-free home screen access and savage roasts.</p>
      </div>
      <div>
        <button className="primary" onClick={install}>Install App</button>
      </div>
    </div>
  )
}
