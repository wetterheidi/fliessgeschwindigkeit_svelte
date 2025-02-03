self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('fliessgeschwindigkeit-cache').then((cache) => {
        return cache.addAll([
          '/fliessgeschwindigkeit_svelte/',
          '/fliessgeschwindigkeit_svelte/index.html',
          '/fliessgeschwindigkeit_svelte/GeoInfoSim.png',
          '/fliessgeschwindigkeit_svelte/Rechteck_Ausschnitt.png',
          '/fliessgeschwindigkeit_svelte/GleichschenkligesTrapez_Ausschnitt.png',
          '/fliessgeschwindigkeit_svelte/AllgemeinesTrapez_Ausschnitt.png',
          '/fliessgeschwindigkeit_svelte/Rohrsegement_Ausschnitt.png',
          '/fliessgeschwindigkeit_svelte/Benutzerdefiniert.png'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });