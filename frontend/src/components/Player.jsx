import React, { useEffect, useRef } from 'react'
import Hls from 'hls.js'

export default function Player({ url }){
  const videoRef = useRef(null)

  useEffect(()=>{
    const video = videoRef.current
    if (!video) return
    let hls

    if (url && url.endsWith('.m3u8') && Hls.isSupported()) {
      hls = new Hls()
      hls.loadSource(url)
      hls.attachMedia(video)
    } else {
      video.src = url
    }
    return ()=>{ if(hls){ hls.destroy() } }
  }, [url])

  return (
    <div className="relative">
      <video id="video-player" ref={videoRef} className="w-full aspect-video rounded-xl bg-black" controls playsInline />
    </div>
  )
}
