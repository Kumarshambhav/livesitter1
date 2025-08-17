import React, { useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'
import * as api from './api'

export default function OverlayEditor({ videoSelector }){
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name:'New Text', type:'text', content:'Hello overlay', style:{ color:'#ffffff', fontSize:24, opacity:1, bg:'rgba(0,0,0,0.35)' }, position:{x:40,y:40}, size:{w:260,h:64}, zIndex:1 })

  const load = async ()=>{
    const data = await api.listOverlays()
    setItems(data)
  }
  useEffect(()=>{ load() }, [])

  const create = async ()=>{
    const created = await api.createOverlay(form)
    setItems([...items, created])
  }
  const updateItem = async (id, patch)=>{
    const updated = await api.updateOverlay(id, patch)
    setItems(items.map(i => i._id===id ? updated : i))
  }
  const remove = async (id)=>{
    await api.deleteOverlay(id)
    setItems(items.filter(i=>i._id!==id))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Overlays</h2>

      <div className="grid grid-cols-2 gap-2">
        <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <select className="input" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>
        <input className="input col-span-2" placeholder={form.type==='text'?'Text content':'Image URL'} value={form.content} onChange={e=>setForm({...form, content:e.target.value})} />
        <button onClick={create} className="button col-span-2">Add Overlay</button>
      </div>

      <div className="relative border border-white/10 rounded-xl overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" />
        <div className="relative bg-black/30 aspect-video">
          {items.map(item => (
            <Rnd key={item._id}
              size={{ width: item.size?.w ?? 200, height: item.size?.h ?? 80 }}
              position={{ x: item.position?.x ?? 40, y: item.position?.y ?? 40 }}
              onDragStop={(e,d)=> updateItem(item._id, { position:{ x:d.x, y:d.y } })}
              onResizeStop={(e, dir, ref, delta, pos)=> updateItem(item._id, { size:{ w: ref.offsetWidth, h: ref.offsetHeight }, position: pos })}
              bounds="parent"
              style={{ zIndex: item.zIndex }}
              className="border border-white/20 rounded-lg overflow-hidden"
            >
              {item.type === 'text' ? (
                <div style={{ color: item.style?.color, fontSize: item.style?.fontSize, opacity: item.style?.opacity, background: item.style?.bg }} className="w-full h-full flex items-center justify-center px-3">
                  {item.content}
                </div>
              ) : (
                <img src={item.content} alt={item.name} className="w-full h-full object-contain bg-black/30" />
              )}
              <div className="absolute -top-8 left-0 flex gap-1">
                <button onClick={()=>updateItem(item._id, { zIndex: (item.zIndex||1)+1 })} className="button text-xs">Up</button>
                <button onClick={()=>updateItem(item._id, { zIndex: Math.max(1,(item.zIndex||1)-1) })} className="button text-xs">Down</button>
                <button onClick={()=>remove(item._id)} className="button text-xs">Delete</button>
              </div>
            </Rnd>
          ))}
        </div>
      </div>
    </div>
  )
}
