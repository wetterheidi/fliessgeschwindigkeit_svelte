import App from './App.svelte'

const app = new App({
  target: document.getElementById('app')
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('Service Worker registriert:', registration);
    })
    .catch((error) => {
      console.error('Service Worker Fehler:', error);
    });
}

export default app