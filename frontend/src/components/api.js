const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export async function listOverlays(){
  const res = await fetch(`${BASE}/api/overlays`)
  return res.json()
}
export async function createOverlay(body){
  const res = await fetch(`${BASE}/api/overlays`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
  return res.json()
}
export async function updateOverlay(id, body){
  const res = await fetch(`${BASE}/api/overlays/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
  return res.json()
}
export async function deleteOverlay(id){
  const res = await fetch(`${BASE}/api/overlays/${id}`, { method:'DELETE' })
  return res.json()
}
