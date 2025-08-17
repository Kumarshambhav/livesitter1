import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function Landing({ onStart }){
  const [url, setUrl] = useState('')

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-3xl w-full p-8 space-y-8">
        <motion.h1
          initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}
          className="text-4xl md:text-6xl font-black tracking-tight text-center"
        >
          Full‑Stack <span className="text-white/70">RTSP</span> Overlay
        </motion.h1>

        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.1}}
          className="text-center text-white/70">
          Paste an <b>HLS (.m3u8)</b> URL (or MP4). For RTSP sources, convert to HLS with FFmpeg (see README).
        </motion.p>

        <div className="glass p-6 space-y-4">
          <label className="block text-sm text-white/70">Stream URL</label>
          <input value={url} onChange={e=>setUrl(e.target.value)} className="input w-full" placeholder="e.g. /streams/live/index.m3u8 or https://.../index.m3u8" />
          <button onClick={()=>onStart(url)} className="button w-full">Start Livestream</button>
        </div>

        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.2}} className="text-xs text-white/50 text-center">
          Tip: Try an MP4 URL if you don’t have HLS ready.
        </motion.div>
      </div>
    </div>
  )
}
