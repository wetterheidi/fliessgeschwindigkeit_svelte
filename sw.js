if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,c)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let a={};const t=e=>i(e,r),f={module:{uri:r},exports:a,require:t};s[r]=Promise.all(n.map((e=>f[e]||t(e)))).then((e=>(c(...e),a)))}}define(["./workbox-d486fa3d"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"AllgemeinesTrapez_Ausschnitt.png",revision:"b66c8c07fb10f2f7a2ad7e3ba6a28c41"},{url:"assets/index-4683da46.js",revision:"d9b56c75cc92935323f78437dc973f8a"},{url:"assets/index-fa08ec71.css",revision:"a9e3aa41db0318622ab7fa2d2d73e928"},{url:"Benutzerdefiniert.png",revision:"17c23e2f9f326e0159af1cd5a68f0944"},{url:"favicon.png",revision:"c64beab291de80970aa4887a5a1c9135"},{url:"GeoInfoSim.png",revision:"7d7336f032b72abd5bf579f74581be2c"},{url:"GleichschenkligesTrapez_Ausschnitt.png",revision:"e931749ab254c27cbafd90d4eb422c11"},{url:"global.css",revision:"aa29fced170313097f42cc3ad78a1479"},{url:"icons/AllgemeinesTrapez_Ausschnitt.png",revision:"b66c8c07fb10f2f7a2ad7e3ba6a28c41"},{url:"icons/Benutzerdefiniert.png",revision:"17c23e2f9f326e0159af1cd5a68f0944"},{url:"icons/GeoInfoSim.png",revision:"7d7336f032b72abd5bf579f74581be2c"},{url:"icons/GleichschenkligesTrapez_Ausschnitt.png",revision:"e931749ab254c27cbafd90d4eb422c11"},{url:"icons/Rechteck_Ausschnitt.png",revision:"243ed2e807bb1a6b0c0fc39854b73a16"},{url:"icons/Rohrsegement_Ausschnitt.png",revision:"66547644ddb592538518fafd698a628f"},{url:"index.html",revision:"65f6b2d33545d143cffdbb202ffa5da8"},{url:"Rechteck_Ausschnitt.png",revision:"243ed2e807bb1a6b0c0fc39854b73a16"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"Rohrsegement_Ausschnitt.png",revision:"66547644ddb592538518fafd698a628f"}],{}),e.registerRoute((({request:e})=>"document"===e.destination),new e.NetworkFirst({cacheName:"documents",plugins:[new e.ExpirationPlugin({maxEntries:10})]}),"GET"),e.registerRoute((({request:e})=>"image"===e.destination),new e.CacheFirst({cacheName:"images",plugins:[new e.ExpirationPlugin({maxEntries:50})]}),"GET"),e.registerRoute((({request:e})=>"script"===e.destination||"style"===e.destination),new e.StaleWhileRevalidate({cacheName:"static-resources",plugins:[]}),"GET")}));
//# sourceMappingURL=sw.js.map
