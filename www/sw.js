const C="mywallet-v14";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./","index.html","ar.js","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-192.png","icons/icon-maskable-512.png"])));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
/* stale-while-revalidate: open instantly from cache (works the same offline), refresh the cache in the background.
   (It used to wait for the network first, which stalls on weak connections.) */
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET"||new URL(r.url).origin!==self.location.origin)return;
  e.respondWith(caches.match(r).then(hit=>{
    const net=fetch(r).then(res=>{if(res&&res.ok){const c=res.clone();caches.open(C).then(x=>x.put(r,c))}return res}).catch(()=>hit);
    e.waitUntil(net.catch(()=>{}));
    return hit||net;
  }));
});
