import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Landing from './components/Landing'
import Player from './components/Player'
import OverlayEditor from './components/OverlayEditor'

export default function App() {
  const [streamUrl, setStreamUrl] = useState('')
  const [showApp, setShowApp] = useState(false)

  return (
    <div className="min-h-screen text-white">
      {!showApp ? (
        <Landing onStart={(url)=>{ setStreamUrl(url); setShowApp(true) }} />
      ) : (
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="p-6 max-w-7xl mx-auto grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 glass p-4">
            <Player url={streamUrl} />
          </div>
          <div className="md:col-span-2 glass p-4">
            <OverlayEditor videoSelector="#video-player" />
          </div>
        </motion.div>
      )}
    </div>
  )
}
