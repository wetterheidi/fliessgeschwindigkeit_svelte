if(!self.define){let e,s={};const i=(i,c)=>(i=new URL(i+".js",c).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(c,n)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let a={};const t=e=>i(e,r),f={module:{uri:r},exports:a,require:t};s[r]=Promise.all(c.map((e=>f[e]||t(e)))).then((e=>(n(...e),a)))}}define(["./workbox-d486fa3d"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"AllgemeinesTrapez_Ausschnitt.png",revision:"b66c8c07fb10f2f7a2ad7e3ba6a28c41"},{url:"assets/index-104c9cdd.css",revision:"630ccec3b5f6927e7bd8e0cec6e68f18"},{url:"assets/index-1a07f331.js",revision:"14b8fa412fc727cb9df42d707c806c27"},{url:"Benutzerdefiniert.png",revision:"17c23e2f9f326e0159af1cd5a68f0944"},{url:"build/bundle.css",revision:"181c8cced57a435ed70c2f18ffbcd905"},{url:"build/bundle.js",revision:"8c52316d80a98116c4668f78aeded82f"},{url:"favicon.png",revision:"c64beab291de80970aa4887a5a1c9135"},{url:"GeoInfoSim.png",revision:"7d7336f032b72abd5bf579f74581be2c"},{url:"GleichschenkligesTrapez_Ausschnitt.png",revision:"e931749ab254c27cbafd90d4eb422c11"},{url:"global.css",revision:"aa29fced170313097f42cc3ad78a1479"},{url:"icons/AllgemeinesTrapez_Ausschnitt.png",revision:"b66c8c07fb10f2f7a2ad7e3ba6a28c41"},{url:"icons/Benutzerdefiniert.png",revision:"17c23e2f9f326e0159af1cd5a68f0944"},{url:"icons/GeoInfoSim.png",revision:"7d7336f032b72abd5bf579f74581be2c"},{url:"icons/GleichschenkligesTrapez_Ausschnitt.png",revision:"e931749ab254c27cbafd90d4eb422c11"},{url:"icons/Rechteck_Ausschnitt.png",revision:"243ed2e807bb1a6b0c0fc39854b73a16"},{url:"icons/Rohrsegement_Ausschnitt.png",revision:"66547644ddb592538518fafd698a628f"},{url:"index.html",revision:"c7fa0d231e9b00af217c3e728da26b98"},{url:"Rechteck_Ausschnitt.png",revision:"243ed2e807bb1a6b0c0fc39854b73a16"},{url:"Rohrsegement_Ausschnitt.png",revision:"66547644ddb592538518fafd698a628f"}],{}),e.registerRoute((({request:e})=>"document"===e.destination),new e.NetworkFirst({cacheName:"documents",plugins:[new e.ExpirationPlugin({maxEntries:10})]}),"GET"),e.registerRoute((({request:e})=>"image"===e.destination),new e.CacheFirst({cacheName:"images",plugins:[new e.ExpirationPlugin({maxEntries:50})]}),"GET"),e.registerRoute((({request:e})=>"script"===e.destination||"style"===e.destination),new e.StaleWhileRevalidate({cacheName:"static-resources",plugins:[]}),"GET")}));
//# sourceMappingURL=sw.js.map
