var $t=Object.defineProperty;var el=(l,t,e)=>t in l?$t(l,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[t]=e;var ut=(l,t,e)=>(el(l,typeof t!="symbol"?t+"":t,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const f of s)if(f.type==="childList")for(const c of f.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function e(s){const f={};return s.integrity&&(f.integrity=s.integrity),s.referrerPolicy&&(f.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?f.credentials="include":s.crossOrigin==="anonymous"?f.credentials="omit":f.credentials="same-origin",f}function r(s){if(s.ep)return;s.ep=!0;const f=e(s);fetch(s.href,f)}})();function fe(){}function Jt(l){return l()}function Ft(){return Object.create(null)}function Fe(l){l.forEach(Jt)}function Xt(l){return typeof l=="function"}function tl(l,t){return l!=l?t==t:l!==t||l&&typeof l=="object"||typeof l=="function"}let st;function Lt(l,t){return l===t?!0:(st||(st=document.createElement("a")),st.href=t,l===st.href)}function ll(l){return Object.keys(l).length===0}function n(l,t){l.appendChild(t)}function O(l,t,e){l.insertBefore(t,e||null)}function H(l){l.parentNode&&l.parentNode.removeChild(l)}function at(l,t){for(let e=0;e<l.length;e+=1)l[e]&&l[e].d(t)}function a(l){return document.createElement(l)}function R(l){return document.createTextNode(l)}function b(){return R(" ")}function U(l,t,e,r){return l.addEventListener(t,e,r),()=>l.removeEventListener(t,e,r)}function i(l,t,e){e==null?l.removeAttribute(t):l.getAttribute(t)!==e&&l.setAttribute(t,e)}function sl(l){let t;return{p(...e){t=e,t.forEach(r=>l.push(r))},r(){t.forEach(e=>l.splice(l.indexOf(e),1))}}}function L(l){return l===""?null:+l}function nl(l){return Array.from(l.childNodes)}function se(l,t){t=""+t,l.data!==t&&(l.data=t)}function E(l,t){l.value=t??""}function Me(l,t,e){for(let r=0;r<l.options.length;r+=1){const s=l.options[r];if(s.__value===t){s.selected=!0;return}}(!e||t!==void 0)&&(l.selectedIndex=-1)}function ht(l){const t=l.querySelector(":checked");return t&&t.__value}let qe;function He(l){qe=l}function il(){if(!qe)throw new Error("Function called outside component initialization");return qe}function rl(l){il().$$.on_mount.push(l)}const Se=[],At=[];let ye=[];const Ct=[],ol=Promise.resolve();let pt=!1;function fl(){pt||(pt=!0,ol.then(Yt))}function ze(l){ye.push(l)}const dt=new Set;let Ee=0;function Yt(){if(Ee!==0)return;const l=qe;do{try{for(;Ee<Se.length;){const t=Se[Ee];Ee++,He(t),cl(t.$$)}}catch(t){throw Se.length=0,Ee=0,t}for(He(null),Se.length=0,Ee=0;At.length;)At.pop()();for(let t=0;t<ye.length;t+=1){const e=ye[t];dt.has(e)||(dt.add(e),e())}ye.length=0}while(Se.length);for(;Ct.length;)Ct.pop()();pt=!1,dt.clear(),He(l)}function cl(l){if(l.fragment!==null){l.update(),Fe(l.before_update);const t=l.dirty;l.dirty=[-1],l.fragment&&l.fragment.p(l.ctx,t),l.after_update.forEach(ze)}}function ul(l){const t=[],e=[];ye.forEach(r=>l.indexOf(r)===-1?t.push(r):e.push(r)),e.forEach(r=>r()),ye=t}const al=new Set;function hl(l,t){l&&l.i&&(al.delete(l),l.i(t))}function Be(l){return(l==null?void 0:l.length)!==void 0?l:Array.from(l)}function dl(l,t,e){const{fragment:r,after_update:s}=l.$$;r&&r.m(t,e),ze(()=>{const f=l.$$.on_mount.map(Jt).filter(Xt);l.$$.on_destroy?l.$$.on_destroy.push(...f):Fe(f),l.$$.on_mount=[]}),s.forEach(ze)}function pl(l,t){const e=l.$$;e.fragment!==null&&(ul(e.after_update),Fe(e.on_destroy),e.fragment&&e.fragment.d(t),e.on_destroy=e.fragment=null,e.ctx=[])}function gl(l,t){l.$$.dirty[0]===-1&&(Se.push(l),fl(),l.$$.dirty.fill(0)),l.$$.dirty[t/31|0]|=1<<t%31}function bl(l,t,e,r,s,f,c=null,h=[-1]){const d=qe;He(l);const u=l.$$={fragment:null,ctx:[],props:f,update:fe,not_equal:s,bound:Ft(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(d?d.$$.context:[])),callbacks:Ft(),dirty:h,skip_bound:!1,root:t.target||d.$$.root};c&&c(u.root);let g=!1;if(u.ctx=e?e(l,t.props||{},(k,o,...m)=>{const w=m.length?m[0]:o;return u.ctx&&s(u.ctx[k],u.ctx[k]=w)&&(!u.skip_bound&&u.bound[k]&&u.bound[k](w),g&&gl(l,k)),o}):[],u.update(),g=!0,Fe(u.before_update),u.fragment=r?r(u.ctx):!1,t.target){if(t.hydrate){const k=nl(t.target);u.fragment&&u.fragment.l(k),k.forEach(H)}else u.fragment&&u.fragment.c();t.intro&&hl(l.$$.fragment),dl(l,t.target,t.anchor),Yt()}He(d)}class _l{constructor(){ut(this,"$$");ut(this,"$$set")}$destroy(){pl(this,1),this.$destroy=fe}$on(t,e){if(!Xt(e))return fe;const r=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return r.push(e),()=>{const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}$set(t){this.$$set&&!ll(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const ml="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(ml);class Te{static fliessgeschwindigkeit(t,e,r,s){try{const f=t/r,c=s*Math.pow(f,2/3)*Math.sqrt(e/100),h=c*t;return{vMittel:c,volMenge:h}}catch(f){throw console.error(f.message),f}}static rechteck(t,e,r,s){const f=t*e,c=t+2*e,{vMittel:h,volMenge:d}=this.fliessgeschwindigkeit(f,r,c,s);return{querschnittsflaeche:f,benetzterUmfang:c,vMittel:h,volMenge:d}}static gleichschenkligesTrapez(t,e,r,s,f){const c=(t+e)*r/2,h=e+2*((r**2+Math.abs(t-e)/2)**2)**(1/2),{vMittel:d,volMenge:u}=this.fliessgeschwindigkeit(c,s,h,f);return{querschnittsflaeche:c,benetzterUmfang:h,vMittel:d,volMenge:u}}static allgemeinesTrapez(t,e,r,s,f,c){const h=(t+e)*s/2,d=Math.sqrt((t-e-r)**2+s**2),u=Math.sqrt(r**2+s**2),g=e+d+u,{vMittel:k,volMenge:o}=this.fliessgeschwindigkeit(h,f,g,c);return{querschnittsflaeche:h,benetzterUmfang:g,vMittel:k,volMenge:o}}static rohrsegment(t,e,r,s){const f=e/2+t**2/(8*e),c=2*Math.asin(t/(2*f)),h=.5*f**2*(c-Math.sin(c)),d=c*f,{vMittel:u,volMenge:g}=this.fliessgeschwindigkeit(h,r,d,s);return{querschnittsflaeche:h,benetzterUmfang:d,vMittel:u,volMenge:g}}static benutzerdefiniert(t,e,r,s){const f=r,c=s,{vMittel:h,volMenge:d}=this.fliessgeschwindigkeit(f,t,c,e);return{querschnittsflaeche:f,benetzterUmfang:c,vMittel:h,volMenge:d}}static gefaelleRechnen(t,e){if(t===0||e===0)return 0;{const r=t/e*100;return parseFloat(r.toFixed(2))}}}function Ht(l,t,e){const r=l.slice();return r[52]=t[e],r}function qt(l,t,e){const r=l.slice();return r[55]=t[e],r}function xt(l,t,e){const r=l.slice();return r[58]=t[e],r}function Ot(l){let t,e;return{c(){t=a("p"),e=R(l[15]),i(t,"class","message svelte-1xd1o8i")},m(r,s){O(r,t,s),n(t,e)},p(r,s){s[0]&32768&&se(e,r[15])},d(r){r&&H(t)}}}function It(l){let t,e=l[58]+"",r;return{c(){t=a("option"),r=R(e),t.__value=l[58],E(t,t.__value)},m(s,f){O(s,t,f),n(t,r)},p:fe,d(s){s&&H(t)}}}function Ut(l){let t,e=l[55]+"",r,s;return{c(){t=a("option"),r=R(e),t.__value=s=l[55],E(t,t.__value)},m(f,c){O(f,t,c),n(t,r)},p(f,c){c[0]&16384&&e!==(e=f[55]+"")&&se(r,e),c[0]&16384&&s!==(s=f[55])&&(t.__value=s,E(t,t.__value))},d(f){f&&H(t)}}}function kl(l){let t,e,r,s,f,c,h,d,u,g,k,o;return{c(){t=a("div"),e=a("label"),e.textContent="Höhenunterschied",r=b(),s=a("input"),f=b(),c=a("label"),c.textContent="m Länge des Flusses",h=b(),d=a("input"),u=b(),g=a("label"),g.textContent="m",i(e,"for","hoehenunterschied"),i(e,"class","svelte-1xd1o8i"),i(s,"id","hoehenunterschied"),i(s,"type","number"),i(s,"placeholder","1"),i(s,"class","svelte-1xd1o8i"),i(c,"for","meter"),i(c,"class","svelte-1xd1o8i"),i(d,"id","laengeFluss"),i(d,"type","number"),i(d,"placeholder","1"),i(d,"class","svelte-1xd1o8i"),i(g,"for","meter"),i(g,"class","svelte-1xd1o8i"),i(t,"class","form-group small-margin svelte-1xd1o8i")},m(m,w){O(m,t,w),n(t,e),n(t,r),n(t,s),E(s,l[8]),n(t,f),n(t,c),n(t,h),n(t,d),E(d,l[9]),n(t,u),n(t,g),k||(o=[U(s,"input",l[41]),U(d,"input",l[42])],k=!0)},p(m,w){w[0]&256&&L(s.value)!==m[8]&&E(s,m[8]),w[0]&512&&L(d.value)!==m[9]&&E(d,m[9])},d(m){m&&H(t),k=!1,Fe(o)}}}function vl(l){let t,e,r,s,f,c;return{c(){t=a("div"),e=a("input"),r=b(),s=a("label"),s.textContent="%",i(e,"id","gefaelle"),i(e,"type","number"),i(e,"placeholder","1"),i(e,"class","svelte-1xd1o8i"),i(s,"for","prozent"),i(s,"class","svelte-1xd1o8i"),i(t,"class","form-group small-margin svelte-1xd1o8i")},m(h,d){O(h,t,d),n(t,e),E(e,l[1]),n(t,r),n(t,s),f||(c=U(e,"input",l[40]),f=!0)},p(h,d){d[0]&2&&L(e.value)!==h[1]&&E(e,h[1])},d(h){h&&H(t),f=!1,c()}}}function Rt(l){let t,e=l[52]+"",r;return{c(){t=a("option"),r=R(e),t.__value=l[52],E(t,t.__value)},m(s,f){O(s,t,f),n(t,r)},p:fe,d(s){s&&H(t)}}}function Gt(l){let t,e,r,s,f,c,h,d,u,g,k,o=l[27]&&Pt(l),m=l[26]&&Wt(l),w=l[25]&&Nt(l),B=l[24]&&Vt(l),T=l[23]&&Kt(l),M=l[30]&&jt(l),F=l[29]&&Qt(l);return{c(){t=a("div"),e=a("img"),s=b(),f=a("div"),o&&o.c(),c=b(),m&&m.c(),h=b(),w&&w.c(),d=b(),B&&B.c(),u=b(),T&&T.c(),g=b(),M&&M.c(),k=b(),F&&F.c(),Lt(e.src,r=l[28])||i(e,"src",r),i(e,"alt","Querschnitt Bild"),i(e,"class","svelte-1xd1o8i"),i(f,"class","input-fields svelte-1xd1o8i"),i(t,"class","image-input-group svelte-1xd1o8i")},m(v,q){O(v,t,q),n(t,e),n(t,s),n(t,f),o&&o.m(f,null),n(f,c),m&&m.m(f,null),n(f,h),w&&w.m(f,null),n(f,d),B&&B.m(f,null),n(f,u),T&&T.m(f,null),n(f,g),M&&M.m(f,null),n(f,k),F&&F.m(f,null)},p(v,q){q[0]&268435456&&!Lt(e.src,r=v[28])&&i(e,"src",r),v[27]?o?o.p(v,q):(o=Pt(v),o.c(),o.m(f,c)):o&&(o.d(1),o=null),v[26]?m?m.p(v,q):(m=Wt(v),m.c(),m.m(f,h)):m&&(m.d(1),m=null),v[25]?w?w.p(v,q):(w=Nt(v),w.c(),w.m(f,d)):w&&(w.d(1),w=null),v[24]?B?B.p(v,q):(B=Vt(v),B.c(),B.m(f,u)):B&&(B.d(1),B=null),v[23]?T?T.p(v,q):(T=Kt(v),T.c(),T.m(f,g)):T&&(T.d(1),T=null),v[30]?M?M.p(v,q):(M=jt(v),M.c(),M.m(f,k)):M&&(M.d(1),M=null),v[29]?F?F.p(v,q):(F=Qt(v),F.c(),F.m(f,null)):F&&(F.d(1),F=null)},d(v){v&&H(t),o&&o.d(),m&&m.d(),w&&w.d(),B&&B.d(),T&&T.d(),M&&M.d(),F&&F.d()}}}function Pt(l){let t,e,r,s,f,c,h,d;return{c(){t=a("div"),e=a("label"),e.textContent="b",r=b(),s=a("input"),f=b(),c=a("label"),c.textContent="m",i(e,"for","breite"),i(e,"class","svelte-1xd1o8i"),i(s,"id","breite"),i(s,"type","number"),i(s,"placeholder","50"),i(s,"class","svelte-1xd1o8i"),i(c,"for","breite"),i(c,"class","svelte-1xd1o8i"),i(t,"class","form-group svelte-1xd1o8i")},m(u,g){O(u,t,g),n(t,e),n(t,r),n(t,s),E(s,l[2]),n(t,f),n(t,c),h||(d=U(s,"input",l[44]),h=!0)},p(u,g){g[0]&4&&L(s.value)!==u[2]&&E(s,u[2])},d(u){u&&H(t),h=!1,d()}}}function Wt(l){let t,e,r,s,f,c,h,d;return{c(){t=a("div"),e=a("label"),e.textContent="h",r=b(),s=a("input"),f=b(),c=a("label"),c.textContent="m",i(e,"for","hoehe"),i(e,"class","svelte-1xd1o8i"),i(s,"id","hoehe"),i(s,"type","number"),i(s,"placeholder","50"),i(s,"class","svelte-1xd1o8i"),i(c,"for","hoehe"),i(c,"class","svelte-1xd1o8i"),i(t,"class","form-group svelte-1xd1o8i")},m(u,g){O(u,t,g),n(t,e),n(t,r),n(t,s),E(s,l[4]),n(t,f),n(t,c),h||(d=U(s,"input",l[45]),h=!0)},p(u,g){g[0]&16&&L(s.value)!==u[4]&&E(s,u[4])},d(u){u&&H(t),h=!1,d()}}}function Nt(l){let t,e,r,s,f,c,h,d;return{c(){t=a("div"),e=a("label"),e.innerHTML="b<sub>o</sub>",r=b(),s=a("input"),f=b(),c=a("label"),c.textContent="m",i(e,"for","breiteoben"),i(e,"class","svelte-1xd1o8i"),i(s,"id","breiteoben"),i(s,"type","number"),i(s,"placeholder","50"),i(s,"class","svelte-1xd1o8i"),i(c,"for","breiteoben"),i(c,"class","svelte-1xd1o8i"),i(t,"class","form-group svelte-1xd1o8i")},m(u,g){O(u,t,g),n(t,e),n(t,r),n(t,s),E(s,l[2]),n(t,f),n(t,c),h||(d=U(s,"input",l[46]),h=!0)},p(u,g){g[0]&4&&L(s.value)!==u[2]&&E(s,u[2])},d(u){u&&H(t),h=!1,d()}}}function Vt(l){let t,e,r,s,f,c,h,d;return{c(){t=a("div"),e=a("label"),e.innerHTML="b<sub>u</sub>",r=b(),s=a("input"),f=b(),c=a("label"),c.textContent="m",i(e,"for","breiteunten"),i(e,"class","svelte-1xd1o8i"),i(s,"id","breiteunten"),i(s,"type","number"),i(s,"placeholder","50"),i(s,"class","svelte-1xd1o8i"),i(c,"for","breiteunten"),i(c,"class","svelte-1xd1o8i"),i(t,"class","form-group svelte-1xd1o8i")},m(u,g){O(u,t,g),n(t,e),n(t,r),n(t,s),E(s,l[3]),n(t,f),n(t,c),h||(d=U(s,"input",l[47]),h=!0)},p(u,g){g[0]&8&&L(s.value)!==u[3]&&E(s,u[3])},d(u){u&&H(t),h=!1,d()}}}function Kt(l){let t,e,r,s,f,c,h,d;return{c(){t=a("div"),e=a("label"),e.textContent="x",r=b(),s=a("input"),f=b(),c=a("label"),c.textContent="m",i(e,"for","x"),i(e,"class","svelte-1xd1o8i"),i(s,"id","x"),i(s,"type","number"),i(s,"placeholder","50"),i(s,"class","svelte-1xd1o8i"),i(c,"for","x"),i(c,"class","svelte-1xd1o8i"),i(t,"class","form-group svelte-1xd1o8i")},m(u,g){O(u,t,g),n(t,e),n(t,r),n(t,s),E(s,l[5]),n(t,f),n(t,c),h||(d=U(s,"input",l[48]),h=!0)},p(u,g){g[0]&32&&L(s.value)!==u[5]&&E(s,u[5])},d(u){u&&H(t),h=!1,d()}}}function jt(l){let t,e,r,s,f,c,h,d;return{c(){t=a("div"),e=a("label"),e.textContent="Fläche",r=b(),s=a("input"),f=b(),c=a("label"),c.innerHTML="m<sup>2</sup>",i(e,"for","querschnittEingabe"),i(e,"class","svelte-1xd1o8i"),i(s,"id","querschnittEingabe"),i(s,"type","number"),i(s,"placeholder","50"),i(s,"class","svelte-1xd1o8i"),i(c,"for","querschnittEingabe"),i(c,"class","svelte-1xd1o8i"),i(t,"class","form-group svelte-1xd1o8i")},m(u,g){O(u,t,g),n(t,e),n(t,r),n(t,s),E(s,l[6]),n(t,f),n(t,c),h||(d=U(s,"input",l[49]),h=!0)},p(u,g){g[0]&64&&L(s.value)!==u[6]&&E(s,u[6])},d(u){u&&H(t),h=!1,d()}}}function Qt(l){let t,e,r,s,f,c,h,d;return{c(){t=a("div"),e=a("label"),e.textContent="Umfang",r=b(),s=a("input"),f=b(),c=a("label"),c.textContent="m",i(e,"for","umfangEingabe"),i(e,"class","svelte-1xd1o8i"),i(s,"id","umfangEingabe"),i(s,"type","number"),i(s,"placeholder","50"),i(s,"class","svelte-1xd1o8i"),i(c,"for","umfangEingabe"),i(c,"class","svelte-1xd1o8i"),i(t,"class","form-group svelte-1xd1o8i")},m(u,g){O(u,t,g),n(t,e),n(t,r),n(t,s),E(s,l[7]),n(t,f),n(t,c),h||(d=U(s,"input",l[50]),h=!0)},p(u,g){g[0]&128&&L(s.value)!==u[7]&&E(s,u[7])},d(u){u&&H(t),h=!1,d()}}}function Dt(l){let t,e,r,s,f,c=l[21]?"Button sichtbar":"Button versteckt",h,d,u,g,k=l[22]&&Zt(l);return{c(){t=a("div"),e=a("button"),e.textContent="Als App installieren",r=b(),s=a("p"),f=R("Status: "),h=R(c),d=b(),k&&k.c(),i(s,"class","installation-status svelte-1xd1o8i"),i(t,"class","install-container svelte-1xd1o8i")},m(o,m){O(o,t,m),n(t,e),n(t,r),n(t,s),n(s,f),n(s,h),n(s,d),k&&k.m(s,null),u||(g=U(e,"click",l[33]),u=!0)},p(o,m){m[0]&2097152&&c!==(c=o[21]?"Button sichtbar":"Button versteckt")&&se(h,c),o[22]?k?k.p(o,m):(k=Zt(o),k.c(),k.m(s,null)):k&&(k.d(1),k=null)},d(o){o&&H(t),k&&k.d(),u=!1,g()}}}function Zt(l){let t,e;return{c(){t=R("- "),e=R(l[22])},m(r,s){O(r,t,s),O(r,e,s)},p(r,s){s[0]&4194304&&se(e,r[22])},d(r){r&&(H(t),H(e))}}}function wl(l){let t,e,r,s,f,c,h,d,u,g,k,o,m,w,B,T,M,F,v,q,N,J,X,A,z,ce,ue,$,x,ae,he,I,Y,Z,ee,C,xe,Le,Oe,Ie,Ae,Ue,de,V,te,pe,Re,ge,be,Ce,Ge,_e,Pe,le,S,gt,We,Ne,nt,bt,Ve,_t,ie,Ke,mt,je,Qe,it,kt,De,vt,re,Ze,wt,Je,Xe,rt,Mt,Ye,Et,oe,$e,Bt,et,tt,ot,Tt,lt,St,ft,ct,yt,K=l[15]&&Ot(l),me=Be(l[31]),G=[];for(let p=0;p<me.length;p+=1)G[p]=It(xt(l,me,p));let ke=Be(l[14]),P=[];for(let p=0;p<ke.length;p+=1)P[p]=Ut(qt(l,ke,p));function zt(p,y){if(p[10]==="eingeben")return vl;if(p[10]==="berechnen")return kl}let ve=zt(l),j=ve&&ve(l),we=Be(l[32]),W=[];for(let p=0;p<we.length;p+=1)W[p]=Rt(Ht(l,we,p));let Q=l[28]&&Gt(l),D=l[21]&&Dt(l);return ft=sl(l[38][0]),{c(){t=a("main"),e=a("div"),e.innerHTML='<img src="/fliessgeschwindigkeit_svelte/icons/GeoInfoSim.png" alt="Logo" style="width: 150px; height: 150px;" class="svelte-1xd1o8i"/> <h1>Berechnung der Fliessgeschwindigkeit</h1>',r=b(),s=a("hr"),f=b(),c=a("h2"),c.textContent="Eingaben",h=b(),K&&K.c(),d=b(),u=a("div"),g=a("label"),g.innerHTML="<strong>Kategorie</strong>",k=b(),o=a("select");for(let p=0;p<G.length;p+=1)G[p].c();m=b(),w=a("select");for(let p=0;p<P.length;p+=1)P[p].c();B=b(),T=a("div"),M=a("label"),M.innerHTML="<strong>Stricklerindex</strong>",F=b(),v=a("input"),q=b(),N=a("div"),J=a("label"),J.innerHTML="<strong>Gefälle</strong>",X=b(),A=a("label"),z=a("input"),ce=R(`
            eingeben`),ue=b(),$=a("label"),x=a("input"),ae=R(`
            berechnen`),he=b(),j&&j.c(),I=b(),Y=a("div"),Z=a("label"),Z.innerHTML="<strong>Flußquerschnitt</strong>",ee=b(),C=a("select");for(let p=0;p<W.length;p+=1)W[p].c();xe=b(),Q&&Q.c(),Le=b(),Oe=a("hr"),Ie=b(),Ae=a("h2"),Ae.textContent="Ergebnisse",Ue=b(),de=a("div"),V=a("table"),te=a("tr"),pe=a("td"),pe.innerHTML='<label for="flaeche" class="svelte-1xd1o8i">Querschnittsfläche</label>',Re=b(),ge=a("td"),be=a("span"),Ce=R(l[16]),Ge=b(),_e=a("td"),_e.innerHTML='<label for="" class="svelte-1xd1o8i">m<sup>2</sup></label>',Pe=b(),le=a("tr"),S=a("td"),S.innerHTML='<label for="umfang" class="svelte-1xd1o8i">Benetzter Umfang</label>',gt=b(),We=a("td"),Ne=a("span"),nt=R(l[17]),bt=b(),Ve=a("td"),Ve.innerHTML='<label for="" class="svelte-1xd1o8i">m</label>',_t=b(),ie=a("tr"),Ke=a("td"),Ke.innerHTML='<label for="geschwindigkeit" class="svelte-1xd1o8i">Geschwindigkeit</label>',mt=b(),je=a("td"),Qe=a("span"),it=R(l[18]),kt=b(),De=a("td"),De.innerHTML='<label for="" class="svelte-1xd1o8i">m/s</label>',vt=b(),re=a("tr"),Ze=a("td"),Ze.innerHTML='<label for="geschwindigkeitkt" class="svelte-1xd1o8i">Geschwindigkeit</label>',wt=b(),Je=a("td"),Xe=a("span"),rt=R(l[19]),Mt=b(),Ye=a("td"),Ye.innerHTML='<label for="" class="svelte-1xd1o8i">kt</label>',Et=b(),oe=a("tr"),$e=a("td"),$e.innerHTML='<label for="durchfluss" class="svelte-1xd1o8i">Durchfluss</label>',Bt=b(),et=a("td"),tt=a("span"),ot=R(l[20]),Tt=b(),lt=a("td"),lt.innerHTML='<label for="" class="svelte-1xd1o8i">m<sup>3</sup>/s</label>',St=b(),D&&D.c(),i(e,"class","form-group svelte-1xd1o8i"),i(g,"for","cmbkategorie"),i(g,"class","svelte-1xd1o8i"),i(o,"id","cmbkategorie"),i(o,"class","svelte-1xd1o8i"),l[13]===void 0&&ze(()=>l[34].call(o)),i(w,"id","cmbbewuchs"),i(w,"class","svelte-1xd1o8i"),l[12]===void 0&&ze(()=>l[35].call(w)),i(u,"class","form-group svelte-1xd1o8i"),i(M,"for","strickler"),i(M,"class","svelte-1xd1o8i"),i(v,"id","strickler"),i(v,"type","number"),i(v,"placeholder","35"),i(v,"class","svelte-1xd1o8i"),i(T,"class","form-group svelte-1xd1o8i"),i(J,"for","gefaelle"),i(J,"class","svelte-1xd1o8i"),i(z,"type","radio"),i(z,"name","gefaelleOption"),z.__value="eingeben",E(z,z.__value),i(z,"class","svelte-1xd1o8i"),i(A,"class","svelte-1xd1o8i"),i(x,"type","radio"),i(x,"name","gefaelleOption"),x.__value="berechnen",E(x,x.__value),i(x,"class","svelte-1xd1o8i"),i($,"class","svelte-1xd1o8i"),i(N,"class","form-group small-margin svelte-1xd1o8i"),i(Z,"for","querschnitt"),i(Z,"class","svelte-1xd1o8i"),i(C,"id","cmbquerschnitt"),i(C,"class","svelte-1xd1o8i"),l[11]===void 0&&ze(()=>l[43].call(C)),i(Y,"class","form-group svelte-1xd1o8i"),i(pe,"class","svelte-1xd1o8i"),i(be,"id","flaeche"),i(ge,"class","svelte-1xd1o8i"),i(_e,"class","svelte-1xd1o8i"),i(S,"class","svelte-1xd1o8i"),i(Ne,"id","umfang"),i(We,"class","svelte-1xd1o8i"),i(Ve,"class","svelte-1xd1o8i"),i(Ke,"class","svelte-1xd1o8i"),i(Qe,"id","geschwindigkeitms"),i(je,"class","svelte-1xd1o8i"),i(De,"class","svelte-1xd1o8i"),i(Ze,"class","svelte-1xd1o8i"),i(Xe,"id","geschwindigkeitkt"),i(Je,"class","svelte-1xd1o8i"),i(Ye,"class","svelte-1xd1o8i"),i($e,"class","svelte-1xd1o8i"),i(tt,"id","durchfluss"),i(et,"class","svelte-1xd1o8i"),i(lt,"class","svelte-1xd1o8i"),i(V,"class","form-table svelte-1xd1o8i"),i(de,"class","table-container svelte-1xd1o8i"),i(t,"class","svelte-1xd1o8i"),ft.p(z,x)},m(p,y){O(p,t,y),n(t,e),n(t,r),n(t,s),n(t,f),n(t,c),n(t,h),K&&K.m(t,null),n(t,d),n(t,u),n(u,g),n(u,k),n(u,o);for(let _=0;_<G.length;_+=1)G[_]&&G[_].m(o,null);Me(o,l[13],!0),n(u,m),n(u,w);for(let _=0;_<P.length;_+=1)P[_]&&P[_].m(w,null);Me(w,l[12],!0),n(t,B),n(t,T),n(T,M),n(T,F),n(T,v),E(v,l[0]),n(t,q),n(t,N),n(N,J),n(N,X),n(N,A),n(A,z),z.checked=z.__value===l[10],n(A,ce),n(N,ue),n(N,$),n($,x),x.checked=x.__value===l[10],n($,ae),n(t,he),j&&j.m(t,null),n(t,I),n(t,Y),n(Y,Z),n(Y,ee),n(Y,C);for(let _=0;_<W.length;_+=1)W[_]&&W[_].m(C,null);Me(C,l[11],!0),n(t,xe),Q&&Q.m(t,null),n(t,Le),n(t,Oe),n(t,Ie),n(t,Ae),n(t,Ue),n(t,de),n(de,V),n(V,te),n(te,pe),n(te,Re),n(te,ge),n(ge,be),n(be,Ce),n(te,Ge),n(te,_e),n(V,Pe),n(V,le),n(le,S),n(le,gt),n(le,We),n(We,Ne),n(Ne,nt),n(le,bt),n(le,Ve),n(V,_t),n(V,ie),n(ie,Ke),n(ie,mt),n(ie,je),n(je,Qe),n(Qe,it),n(ie,kt),n(ie,De),n(V,vt),n(V,re),n(re,Ze),n(re,wt),n(re,Je),n(Je,Xe),n(Xe,rt),n(re,Mt),n(re,Ye),n(V,Et),n(V,oe),n(oe,$e),n(oe,Bt),n(oe,et),n(et,tt),n(tt,ot),n(oe,Tt),n(oe,lt),n(t,St),D&&D.m(t,null),ct||(yt=[U(o,"change",l[34]),U(w,"change",l[35]),U(v,"input",l[36]),U(z,"change",l[37]),U(x,"change",l[39]),U(C,"change",l[43])],ct=!0)},p(p,y){if(p[15]?K?K.p(p,y):(K=Ot(p),K.c(),K.m(t,d)):K&&(K.d(1),K=null),y[1]&1){me=Be(p[31]);let _;for(_=0;_<me.length;_+=1){const ne=xt(p,me,_);G[_]?G[_].p(ne,y):(G[_]=It(ne),G[_].c(),G[_].m(o,null))}for(;_<G.length;_+=1)G[_].d(1);G.length=me.length}if(y[0]&8192|y[1]&1&&Me(o,p[13]),y[0]&16384){ke=Be(p[14]);let _;for(_=0;_<ke.length;_+=1){const ne=qt(p,ke,_);P[_]?P[_].p(ne,y):(P[_]=Ut(ne),P[_].c(),P[_].m(w,null))}for(;_<P.length;_+=1)P[_].d(1);P.length=ke.length}if(y[0]&20480&&Me(w,p[12]),y[0]&1&&L(v.value)!==p[0]&&E(v,p[0]),y[0]&1024&&(z.checked=z.__value===p[10]),y[0]&1024&&(x.checked=x.__value===p[10]),ve===(ve=zt(p))&&j?j.p(p,y):(j&&j.d(1),j=ve&&ve(p),j&&(j.c(),j.m(t,I))),y[1]&2){we=Be(p[32]);let _;for(_=0;_<we.length;_+=1){const ne=Ht(p,we,_);W[_]?W[_].p(ne,y):(W[_]=Rt(ne),W[_].c(),W[_].m(C,null))}for(;_<W.length;_+=1)W[_].d(1);W.length=we.length}y[0]&2048|y[1]&2&&Me(C,p[11]),p[28]?Q?Q.p(p,y):(Q=Gt(p),Q.c(),Q.m(t,Le)):Q&&(Q.d(1),Q=null),y[0]&65536&&se(Ce,p[16]),y[0]&131072&&se(nt,p[17]),y[0]&262144&&se(it,p[18]),y[0]&524288&&se(rt,p[19]),y[0]&1048576&&se(ot,p[20]),p[21]?D?D.p(p,y):(D=Dt(p),D.c(),D.m(t,null)):D&&(D.d(1),D=null)},i:fe,o:fe,d(p){p&&H(t),K&&K.d(),at(G,p),at(P,p),j&&j.d(),at(W,p),Q&&Q.d(),D&&D.d(),ft.r(),ct=!1,Fe(yt)}}}function Ml(l,t,e){let r,s,f,c,h,d,u,g,k,o=0,m=0,w="",B=10,T=5,M=1,F=0,v=50,q=50,N=0,J=0,X="eingeben",A="",z="",ce=0,ue=0,$=0,x=0,ae=0,he=["Bach","Fluss","Kanal","Sonstige Fläche"],I=he[1],Y=["Rechteck","Gleichschenkliges Trapez","Allgemeines Trapez","Rohrsegment","Benutzerdefiniert"];A=Y[0];let Z=null,ee=!1,C="";rl(()=>{if(console.log("onMount ausgeführt"),window.matchMedia("(display-mode: standalone)").matches){console.log("App läuft bereits als Standalone"),e(21,ee=!1),e(22,C="App ist bereits installiert");return}window.addEventListener("beforeinstallprompt",S=>{console.log("beforeinstallprompt Event empfangen"),S.preventDefault(),Z=S,e(21,ee=!0),console.log("showInstallButton nach Event:",ee)}),window.addEventListener("appinstalled",()=>{console.log("App wurde erfolgreich installiert"),e(21,ee=!1),e(22,C="App wurde erfolgreich installiert"),Z=null})});async function xe(){if(console.log("Install-Button geklickt, deferredPrompt:",!!Z),!Z){/iPad|iPhone|iPod/.test(navigator.userAgent)?e(22,C="Für iOS: Tippen Sie auf 'Teilen' und dann 'Zum Home-Bildschirm'"):e(22,C="Installation nicht möglich");return}try{Z.prompt();const{outcome:S}=await Z.userChoice;console.log("User Entscheidung:",S),S==="accepted"?(console.log("Installation akzeptiert"),e(22,C="Installation erfolgreich"),e(21,ee=!1)):(console.log("Installation abgelehnt"),e(22,C="Installation abgelehnt"))}catch(S){console.error("Installationsfehler:",S),e(22,C="Installationsfehler: "+S.message)}Z=null}const Le=[[]];function Oe(){I=ht(this),e(13,I),e(31,he)}function Ie(){z=ht(this),e(12,z),e(14,r),e(13,I)}function Ae(){o=L(this.value),e(0,o),e(13,I),e(14,r),e(12,z)}function Ue(){X=this.__value,e(10,X)}function de(){X=this.__value,e(10,X)}function V(){m=L(this.value),e(1,m),e(10,X),e(8,N),e(9,J)}function te(){N=L(this.value),e(8,N)}function pe(){J=L(this.value),e(9,J)}function Re(){A=ht(this),e(11,A),e(32,Y)}function ge(){B=L(this.value),e(2,B)}function be(){M=L(this.value),e(4,M)}function Ce(){B=L(this.value),e(2,B)}function Ge(){T=L(this.value),e(3,T)}function _e(){F=L(this.value),e(5,F)}function Pe(){v=L(this.value),e(6,v)}function le(){q=L(this.value),e(7,q)}return l.$$.update=()=>{if(l.$$.dirty[0]&8192&&(I==="Bach"?e(14,r=["mäßiger Uferbewuchs","üppiger Uferbewuchs","verwachsen (Sträucher/Bäume)","mit großen Steinen","mit großen bewegten Steinen","Waldgraben; wenig Bewuchs","Betongerinne; neu/glatt","Betongerinne; alt/rau","Holzrinne","Gerinne; gepflastert","teils gepflastert, teils Wiese","naturnahe Sole; Ufermauern"]):I==="Fluss"?e(14,r=["mäßiger Uferbewuchs","üppiger Uferbewuchs","verwachsen (Sträucher/Bäume)","mit großen Steinen","mit großen bewegten Steinen","Waldgraben; wenig Bewuchs","Betongerinne; neu/glatt","Betongerinne; alt/rau","Gerinne; gepflastert","teils gepflastert, teils Wiese","naturnahe Sole; Ufermauern"]):I==="Kanal"?e(14,r=["Erdkanal; geringer Uferbewuchs","Erdkanal; üppiger Uferbewuchs","Beton; neu/glatt","Beton; alt/rau","Ziegel","Holz"]):I==="Sonstige Fläche"?e(14,r=["Beton; neu/glatt","Beton; alt/rau","Asphalt","Holz","Erdboden; glatt","Erdboden; rau","Wiese; mittelhoch"]):console.log("Error")),l.$$.dirty[0]&28673)if(I==="Bach")switch(r.indexOf(z)){case 0:o===0&&e(0,o=30);break;case 1:o===0&&e(0,o=22.5);break;case 2:o===0&&e(0,o=15);break;case 3:o===0&&e(0,o=22.5);break;case 4:o===0&&e(0,o=15);break;case 5:o===0&&e(0,o=30);break;case 6:o===0&&e(0,o=90);break;case 7:o===0&&e(0,o=60);break;case 8:o===0&&e(0,o=75);break;case 9:o===0&&e(0,o=50);break;case 10:o===0&&e(0,o=40);break;case 11:o===0&&e(0,o=40);break}else if(I==="Fluss")switch(r.indexOf(z)){case 0:o===0&&e(0,o=35);break;case 1:o===0&&e(0,o=30);break;case 2:o===0&&e(0,o=25);break;case 3:o===0&&e(0,o=20);break;case 4:o===0&&e(0,o=90);break;case 5:o===0&&e(0,o=60);break;case 6:o===0&&e(0,o=50);break;case 7:o===0&&e(0,o=40);break;case 8:o===0&&e(0,o=40);break}else if(I==="Kanal")switch(r.indexOf(z)){case 0:o===0&&e(0,o=40);break;case 1:o===0&&e(0,o=30);break;case 2:o===0&&e(0,o=90);break;case 3:o===0&&e(0,o=60);break;case 4:o===0&&e(0,o=70);break;case 5:o===0&&e(0,o=75);break}else if(I==="Sonstige Fläche")switch(r.indexOf(z)){case 0:o===0&&e(0,o=90);break;case 1:o===0&&e(0,o=60);break;case 2:o===0&&e(0,o=70);break;case 3:o===0&&e(0,o=75);break;case 4:o===0&&e(0,o=50);break;case 5:o===0&&e(0,o=35);break}else e(0,o=0),console.log("Error");if(l.$$.dirty[0]&2048&&(A==="Rechteck"?(e(28,s="/fliessgeschwindigkeit_svelte/icons/Rechteck_Ausschnitt.png"),e(27,f=!0),e(26,c=!0),e(25,h=!1),e(24,d=!1),e(23,u=!1),e(30,g=!1),e(29,k=!1)):A==="Gleichschenkliges Trapez"?(e(28,s="/fliessgeschwindigkeit_svelte/icons/GleichschenkligesTrapez_Ausschnitt.png"),e(27,f=!1),e(26,c=!0),e(25,h=!0),e(24,d=!0),e(23,u=!1),e(30,g=!1),e(29,k=!1)):A==="Allgemeines Trapez"?(e(28,s="/fliessgeschwindigkeit_svelte/icons/AllgemeinesTrapez_Ausschnitt.png"),e(27,f=!1),e(26,c=!0),e(25,h=!0),e(24,d=!0),e(23,u=!0),e(30,g=!1),e(29,k=!1)):A==="Rohrsegment"?(e(28,s="/fliessgeschwindigkeit_svelte/icons/Rohrsegement_Ausschnitt.png"),e(27,f=!1),e(26,c=!0),e(25,h=!0),e(24,d=!1),e(23,u=!1),e(30,g=!1),e(29,k=!1)):A==="Benutzerdefiniert"?(e(28,s="/fliessgeschwindigkeit_svelte/icons/Benutzerdefiniert.png"),e(27,f=!1),e(26,c=!1),e(25,h=!1),e(24,d=!1),e(23,u=!1),e(30,g=!0),e(29,k=!0)):(e(28,s=""),e(27,f=!1),e(26,c=!1),e(25,h=!1),e(24,d=!1),e(23,u=!1))),l.$$.dirty[0]&1794&&X==="berechnen"&&(e(1,m=Te.gefaelleRechnen(N,J)),e(1,m=parseFloat(m.toFixed(2)))),l.$$.dirty[0]&2303){o===0||m===0?(e(16,ce=0),e(17,ue=0),e(18,$=0),e(19,x=0),e(20,ae=0),e(15,w="Bitte geben Sie einen Stricklerindex und ein Gefälle ein.")):e(15,w="");let S;A==="Rechteck"?S=Te.rechteck(B,M,m,o):A==="Gleichschenkliges Trapez"?S=Te.gleichschenkligesTrapez(B,T,M,m,o):A==="Allgemeines Trapez"?S=Te.allgemeinesTrapez(B,T,F,M,m,o):A==="Rohrsegment"?S=Te.rohrsegment(B,M,m,o):A==="Benutzerdefiniert"&&(S=Te.benutzerdefiniert(m,o,v,q)),S&&(e(16,ce=parseFloat(S.querschnittsflaeche.toFixed(1))),e(17,ue=parseFloat(S.benetzterUmfang.toFixed(1))),e(18,$=parseFloat(S.vMittel.toFixed(1))),e(19,x=parseFloat((S.vMittel*3.6/1.852).toFixed(1))),e(20,ae=parseFloat(S.volMenge.toFixed(1))))}},e(14,r=[]),e(28,s=""),e(27,f=!1),e(26,c=!1),e(25,h=!1),e(24,d=!1),e(23,u=!1),e(30,g=!1),e(29,k=!1),[o,m,B,T,M,F,v,q,N,J,X,A,z,I,r,w,ce,ue,$,x,ae,ee,C,u,d,h,c,f,s,k,g,he,Y,xe,Oe,Ie,Ae,Ue,Le,de,V,te,pe,Re,ge,be,Ce,Ge,_e,Pe,le]}class El extends _l{constructor(t){super(),bl(this,t,Ml,wl,tl,{},null,[-1,-1])}}new El({target:document.getElementById("app")});"serviceWorker"in navigator&&navigator.serviceWorker.register("/fliessgeschwindigkeit_svelte/sw.js",{scope:"/fliessgeschwindigkeit_svelte/"}).then(l=>{console.log("Service Worker registriert:",l)}).catch(l=>{console.error("Service Worker Fehler:",l)});
