"use strict";var Tostack=(()=>{var Yt=Object.create;var dt=Object.defineProperty;var qt=Object.getOwnPropertyDescriptor;var Zt=Object.getOwnPropertyNames;var _t=Object.getPrototypeOf,Ut=Object.prototype.hasOwnProperty;var $t=(e,t)=>()=>{try{return t||e((t={exports:{}}).exports,t),t.exports}catch(s){throw t=0,s}},Kt=(e,t)=>{for(var s in t)dt(e,s,{get:t[s],enumerable:!0})},Pt=(e,t,s,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let c of Zt(t))!Ut.call(e,c)&&c!==s&&dt(e,c,{get:()=>t[c],enumerable:!(a=qt(t,c))||a.enumerable});return e};var ut=(e,t,s)=>(s=e!=null?Yt(_t(e)):{},Pt(t||!e||!e.__esModule?dt(s,"default",{value:e,enumerable:!0}):s,e)),Qt=e=>Pt(dt({},"__esModule",{value:!0}),e);var ft=$t((Te,St)=>{St.exports=window.React});var Ot=$t((we,Lt)=>{Lt.exports=window.ReactDOM});var xe={};Kt(xe,{Toaster:()=>Bt,default:()=>N,toast:()=>N,useToasts:()=>Et});var r=ut(ft(),1),jt=ut(Ot(),1);var It=`/* react-tostack \xB7 Lume \u2014 light, glass and spring motion */
.tostack-root {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2147483000;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", "Segoe UI", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  container-type: size;
  --tostack-maxw: min(380px, calc(100cqw - 24px));
  --tostack-minw: min(300px, calc(100cqw - 24px));
  --tostack-safe-top: env(safe-area-inset-top, 0px);
  --tostack-safe-bottom: env(safe-area-inset-bottom, 0px);
  --tostack-blur: 26px;

  /* Lume \xB7 dark */
  --tostack-bg: rgba(24, 24, 28, 0.72);
  --tostack-solid: #000000;
  --tostack-fg: #f5f5f7;
  --tostack-fg2: rgba(235, 235, 245, 0.62);
  --tostack-hairline: rgba(255, 255, 255, 0.10);
  --tostack-spec: rgba(255, 255, 255, 0.34);
  --tostack-btn: rgba(255, 255, 255, 0.12);
  --tostack-btn-hover: rgba(255, 255, 255, 0.2);
  --tostack-drop: rgba(0, 0, 0, 0.42);
  --tostack-lume: #ffb547;
  --tostack-on-lume: #1f1405;
  --tostack-green: #30d158;
  --tostack-mint: #63e6e2;
  --tostack-teal: #40c8e0;
  --tostack-blue: #0a84ff;
  --tostack-indigo: #5e5ce6;
  --tostack-pink: #ff375f;
  --tostack-red: #ff453a;
  --tostack-orange: #ff9f0a;
  --tostack-yellow: #ffd60a;
}
.tostack-root.tostack-contained { position: absolute; }
.tostack-root[data-theme="light"] {
  /* Lume \xB7 light */
  --tostack-bg: rgba(255, 255, 255, 0.72);
  --tostack-solid: #ffffff;
  --tostack-fg: #0b0b0f;
  --tostack-fg2: rgba(60, 60, 67, 0.66);
  --tostack-hairline: rgba(11, 11, 15, 0.08);
  --tostack-spec: rgba(255, 255, 255, 0.95);
  --tostack-btn: rgba(120, 120, 128, 0.12);
  --tostack-btn-hover: rgba(120, 120, 128, 0.2);
  --tostack-drop: rgba(28, 24, 18, 0.16);
  --tostack-lume: #f5a524;
  --tostack-on-lume: #1f1405;
  --tostack-green: #34c759;
  --tostack-mint: #00c7be;
  --tostack-teal: #30b0c7;
  --tostack-blue: #007aff;
  --tostack-indigo: #5856d6;
  --tostack-pink: #ff2d55;
  --tostack-red: #ff3b30;
  --tostack-orange: #ff9500;
  --tostack-yellow: #ffcc00;
}

.tostack-t {
  position: absolute;
  pointer-events: auto;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  will-change: transform;
  color: var(--tostack-fg);
  --tostack-fill: var(--tostack-bg);
  --tostack-accent: var(--tostack-lume);
  --tostack-on-accent: #ffffff;
}
.tostack-t[data-material="solid"] { --tostack-fill: var(--tostack-solid); }
.tostack-t[data-pos$="left"] { left: 0; }
.tostack-t[data-pos$="right"] { right: 0; }
.tostack-t[data-pos$="center"] { left: 50%; }
.tostack-t[data-pos^="top"] { top: 0; }
.tostack-t[data-pos^="bottom"] { bottom: 0; }

/* Glass: blurs what is behind the toast, clipped to the exact shape every frame. */
.tostack-mat {
  position: absolute;
  left: 0;
  top: 0;
  -webkit-backdrop-filter: blur(var(--tostack-blur)) saturate(180%);
  backdrop-filter: blur(var(--tostack-blur)) saturate(180%);
}
.tostack-t[data-material="solid"] .tostack-mat { display: none; }
.tostack-t.is-flip .tostack-mat { transform: scaleY(-1); }

.tostack-svg {
  position: absolute;
  left: 0;
  top: 0;
  overflow: visible;
  filter: drop-shadow(0 12px 30px var(--tostack-drop)) drop-shadow(0 1px 2px var(--tostack-drop));
}
.tostack-t.is-flip .tostack-svg { transform: scaleY(-1); }
.tostack-fill { fill: var(--tostack-fill); }
.tostack-spec { fill: none; stroke-width: 1; }
.tostack-line { fill: none; stroke-width: 1.25; stroke-linecap: round; }
.tostack-glow { fill: none; stroke-width: 5; opacity: 0.55; }
.tostack-t[data-glow="off"] .tostack-glow,
.tostack-t[data-glow="off"] .tostack-line { display: none; }
.tostack-t[data-glow="on"] .tostack-spec { display: none; }

.tostack-clip { position: absolute; top: 0; overflow: hidden; }
.tostack-c {
  position: absolute;
  left: 50%;
  top: 0;
  width: max-content;
  min-width: var(--tostack-minw);
  max-width: var(--tostack-maxw);
  box-sizing: border-box;
  transform: translateX(-50%);
  transition:
    opacity 0.26s ease,
    filter 0.34s ease,
    transform 0.5s cubic-bezier(0.2, 0.9, 0.2, 1);
}
.tostack-t.is-flip .tostack-c { top: auto; bottom: 0; }
.tostack-t.is-attached:not(.is-flip) .tostack-c { padding-top: var(--tostack-safe-top); }
.tostack-t.is-attached.is-flip .tostack-c { padding-bottom: var(--tostack-safe-bottom); }
.tostack-c.is-in { opacity: 0; filter: blur(8px); transform: translateX(-50%) scale(0.92); }
.tostack-c.is-out {
  opacity: 0;
  filter: blur(8px);
  transform: translateX(-50%) scale(1.03);
  transition-duration: 0.16s, 0.2s, 0.3s;
}
.tostack-c.is-x { width: var(--tostack-maxw); }

.tostack-row {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  min-width: 132px;
  padding: 0 18px 0 12px;
  box-sizing: border-box;
}
.tostack-t.is-attached .tostack-row { height: 44px; padding: 0 18px 0 14px; }
.tostack-ic { width: 24px; height: 24px; flex: none; display: grid; place-items: center; font-size: 19px; line-height: 1; }
.tostack-ic > svg { width: 24px; height: 24px; display: block; animation: tostack-pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
.tostack-title {
  min-width: 0;
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(var(--tostack-maxw) - 110px);
}
.tostack-c.is-x .tostack-title { white-space: normal; max-width: none; flex: 1; }
.tostack-acc {
  margin-left: auto;
  padding-left: 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--tostack-accent);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.tostack-x { padding: 0 16px 16px 46px; box-sizing: border-box; margin-top: -4px; }
.tostack-desc { font-size: 14px; line-height: 19px; letter-spacing: -0.15px; color: var(--tostack-fg2); }
.tostack-actions { display: flex; gap: 8px; margin-top: 12px; margin-left: -30px; }
.tostack-btn {
  flex: 1;
  height: 38px;
  border: 0;
  border-radius: 999px;
  background: var(--tostack-btn);
  color: var(--tostack-fg);
  font: 600 14px/1 inherit;
  font-family: inherit;
  letter-spacing: -0.15px;
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease;
}
.tostack-btn:hover { background: var(--tostack-btn-hover); }
.tostack-btn:active { transform: scale(0.95); }
.tostack-btn:focus-visible { outline: 2px solid var(--tostack-accent); outline-offset: 2px; }
.tostack-btn.is-primary { background: var(--tostack-accent); color: var(--tostack-on-accent); }
.tostack-btn.is-primary:hover { filter: brightness(1.08); }


.tostack-close {
  flex: none;
  width: 22px;
  height: 22px;
  margin: 0 -6px 0 auto;
  padding: 0;
  border: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--tostack-btn);
  color: var(--tostack-fg2);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.tostack-acc + .tostack-close { margin-left: 10px; }
.tostack-close:hover { background: var(--tostack-btn-hover); color: var(--tostack-fg); }
.tostack-close:active { transform: scale(0.88); }
.tostack-close:focus-visible { outline: 2px solid var(--tostack-accent); outline-offset: 2px; }

/* icons */
.tostack-check { stroke-dasharray: 16; stroke-dashoffset: 16; animation: tostack-draw 0.42s 0.12s cubic-bezier(0.65, 0, 0.35, 1) forwards; }
.tostack-spin { animation: tostack-spin 0.9s steps(8) infinite; transform-origin: 12px 12px; }
.tostack-shake { animation: tostack-shake 0.5s 0.1s ease both; }
.tostack-rich .tostack-title { color: var(--tostack-accent); }

@keyframes tostack-pop { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes tostack-draw { to { stroke-dashoffset: 0; } }
@keyframes tostack-spin { to { transform: rotate(360deg); } }
@keyframes tostack-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-2.5px); }
  40% { transform: translateX(2.5px); }
  60% { transform: translateX(-1.5px); }
  80% { transform: translateX(1px); }
}
@media (prefers-reduced-motion: reduce) {
  .tostack-c, .tostack-btn { transition-duration: 0.01s !important; }
  .tostack-ic > svg, .tostack-check, .tostack-shake { animation-duration: 0.01s !important; }
}
`;var j=[],xt=new Set,te=0,yt=()=>{j=[...j],xt.forEach(e=>e())},lt={get:()=>j,subscribe(e){return xt.add(e),()=>xt.delete(e)}};function pt(e,t,s={}){var v,p;let a=(v=s.id)!=null?v:`tostack-${++te}`,c=j.findIndex(d=>d.id===a);if(c>=0){let d=j[c];j[c]={...s,position:(p=s.position)!=null?p:d.position,id:a,type:e,message:t,createdAt:d.createdAt,visible:!0,rev:d.rev+1}}else j.unshift({...s,id:a,type:e,message:t,createdAt:Date.now(),visible:!0,rev:0});return yt(),a}function ee(e){let t=!1;j=j.map(s=>{var a;return(e===void 0||s.id===e)&&s.visible?(t=!0,(a=s.onDismiss)==null||a.call(s,s),{...s,visible:!1}):s}),t&&yt()}function se(e){j=e===void 0?[]:j.filter(t=>t.id!==e),yt()}var ot=e=>(t,s)=>pt(e,t,s),mt=(e,t)=>typeof e=="function"?e(t):e,N=Object.assign(ot("blank"),{success:ot("success"),error:ot("error"),warning:ot("warning"),info:ot("info"),loading:ot("loading"),custom:ot("custom"),dismiss:ee,remove:se,promise(e,t,s={}){let{success:a,error:c,loading:v,...p}=s,d=pt("loading",t.loading,{...p,...v}),x=typeof e=="function"?e():e;return x.then(b=>{pt("success",mt(t.success,b),{...p,...a,id:d})},b=>{pt("error",mt(t.error,b),{...p,...c,id:d})}),x}});var o=ut(ft(),1);var B=class{constructor(t,s=260,a=26){this.k=s;this.c=a;this.v=0;this.x=this.t=t}to(t){this.t=t}jump(t){this.x=this.t=t,this.v=0}step(t){let s=-this.k*(this.x-this.t)-this.c*this.v;this.v+=s*t,this.x+=this.v*t}settle(){return Math.abs(this.x-this.t)<.02&&Math.abs(this.v)<.05?(this.x=this.t,this.v=0,!0):!1}},kt=new Set,gt=0,ht=0;function At(e){gt=0;let t=ht?Math.min((e-ht)/1e3,.25):1/60;ht=e,kt.forEach(s=>{s.tick(t)||kt.delete(s)}),kt.size?gt=requestAnimationFrame(At):ht=0}function oe(e){kt.add(e),!gt&&typeof requestAnimationFrame!="undefined"&&(gt=requestAnimationFrame(At))}var it=(e,t,s)=>Math.max(t,Math.min(s,e)),ae=14,Ct=84,bt=class{constructor(t=260,s=26){this.y=new B(0,300,32);this.p=new B(0,260,26);this.dx=new B(0,420,36);this.dy=new B(0,420,36);this.cv=new B(1,300,30);this.ox=new B(0,300,32);this.els={};this.island=!1;this.attached=!1;this.bottom=!1;this.center=!0;this.reduced=!1;this.entered=!1;this.exiting=!1;this.last=[0,0,24];this.locked=null;this.w=new B(0,t,s),this.h=new B(0,t,s),this.r=new B(24,t,s)}springs(){return[this.w,this.h,this.r,this.y,this.p,this.dx,this.dy,this.cv,this.ox]}get naturalW(){return this.entered?this.last[0]:0}get naturalH(){return this.entered?this.last[1]:0}size(t,s,a){var d,x;this.last=[t,s,a];let[c,v,p]=(d=this.locked)!=null?d:this.last;this.entered||(this.entered=!0,this.island?(this.w.jump(Math.min(c,Ct)),this.h.jump(0),this.p.jump(1)):(this.w.jump(c),this.h.jump(v),this.p.jump(0)),this.r.jump(p)),this.w.to(c),this.h.to(v),this.r.to(p),this.exiting||this.p.to(1),this.reduced&&this.springs().forEach(b=>b.jump(b.t)),(x=this.onSize)==null||x.call(this),this.kick()}setY(t){!this.entered||this.y.x===0&&this.p.x===0?this.y.jump(t):this.y.to(t),this.kick()}lock(t,s,a){this.locked=[t,s,a],this.cv.to(0),this.entered?(this.w.to(t),this.h.to(s),this.r.to(a)):this.cv.jump(0),this.kick()}unlock(){this.locked&&(this.locked=null,this.cv.to(1),this.entered&&(this.w.to(this.last[0]),this.h.to(this.last[1]),this.r.to(this.last[2])),this.kick())}setOx(t){this.ox.to(t),this.kick()}setZ(t){this.els.root&&(this.els.root.style.zIndex=String(t))}drag(t,s){this.dx.jump(t),this.dy.jump(s),this.kick()}release(){this.dx.to(0),this.dy.to(0),this.kick()}fling(t,s){this.dx.to(t),this.dy.to(s),this.kick()}exit(t){this.onExited=t,!this.exiting&&(this.exiting=!0,this.island&&(this.w.to(Math.min(this.w.t,Ct)),this.h.to(0)),this.p.to(0),this.reduced&&this.springs().forEach(s=>s.jump(s.t)),this.kick())}revive(){this.exiting&&(this.exiting=!1,this.onExited=void 0,this.size(...this.last))}kick(){oe(this)}tick(t){let s=Math.max(1,Math.round(t*240)),a=t/s,c=this.springs();for(let p=0;p<s;p++)for(let d of c)d.step(a);let v=!0;for(let p of c)p.settle()||(v=!1);if(this.render(),this.exiting&&(this.island?this.h.x<.6:this.p.x<.02)){let d=this.onExited;return this.onExited=void 0,d==null||d(),!1}return!v}render(){let{root:t,svg:s,fill:a,line:c,glow:v,spec:p,mat:d,clip:x}=this.els;if(!t||!s||!a||!c||!x)return;let b=this.attached?ae:0,y=Math.max(0,this.w.x),T=Math.max(0,this.h.x),m=this.attached?Math.min(b,T*.6):0,l=this.attached?it(this.r.x,0,Math.min(Math.max(0,T-m),y/2)):it(this.r.x,0,Math.min(T/2,y/2)),E=y+2*b,R,M;this.attached?(R=`M${b-m} 0A${m} ${m} 0 0 1 ${b} ${m}V${T-l}A${l} ${l} 0 0 0 ${b+l} ${T}H${b+y-l}A${l} ${l} 0 0 0 ${b+y} ${T-l}V${m}A${m} ${m} 0 0 1 ${b+y+m} 0`,M=R+"Z"):(M=`M${l} 0H${y-l}A${l} ${l} 0 0 1 ${y} ${l}V${T-l}A${l} ${l} 0 0 1 ${y-l} ${T}H${l}A${l} ${l} 0 0 1 0 ${T-l}V${l}A${l} ${l} 0 0 1 ${l} 0Z`,R=M),t.style.width=`${E}px`,t.style.height=`${T}px`,s.setAttribute("width",String(E)),s.setAttribute("height",String(Math.max(T,.01))),s.setAttribute("viewBox",`0 0 ${E} ${Math.max(T,.01)}`),a.setAttribute("d",M),c.setAttribute("d",R),v==null||v.setAttribute("d",R),p==null||p.setAttribute("d",R),d&&(d.style.width=`${E}px`,d.style.height=`${T}px`,d.style.clipPath=`path('${M}')`),x.style.left=`${b}px`,x.style.width=`${y}px`,x.style.height=`${T}px`,x.style.borderRadius=this.attached?this.bottom?`${l}px ${l}px 0 0`:`0 0 ${l}px ${l}px`:`${l}px`;let O=it(this.p.x,0,1.2),H=this.bottom?-1:1,X=H*this.y.x+this.dy.x+(this.island?0:(1-O)*-16*H),G=this.island?1:.9+.1*O;t.style.transform=`${this.center?"translateX(-50%) ":""}translate3d(${this.dx.x+this.ox.x}px, ${X}px, 0) scale(${G})`,t.style.opacity="1";let V=String(this.island?it(T/6,0,1):it(O,0,1));s.style.opacity=V,x.style.opacity=String(Number(V)*it(this.cv.x,0,1)),d&&(d.style.opacity=V)}};var S=ut(ft(),1),Nt=({theme:e})=>S.createElement("svg",{viewBox:"0 0 24 24","aria-hidden":"true"},S.createElement("circle",{cx:"12",cy:"12",r:"11",fill:e.primary}),S.createElement("path",{className:"tostack-check",d:"M7.2 12.4l3.1 3.1 6.5-6.7",fill:"none",stroke:e.secondary,strokeWidth:"2.3",strokeLinecap:"round",strokeLinejoin:"round"})),zt=({theme:e})=>S.createElement("svg",{viewBox:"0 0 24 24","aria-hidden":"true",className:"tostack-shake"},S.createElement("circle",{cx:"12",cy:"12",r:"11",fill:e.primary}),S.createElement("path",{d:"M8.4 8.4l7.2 7.2M15.6 8.4l-7.2 7.2",stroke:e.secondary,strokeWidth:"2.3",strokeLinecap:"round"})),Ht=({theme:e})=>S.createElement("svg",{viewBox:"0 0 24 24","aria-hidden":"true"},S.createElement("path",{d:"M10.3 3.4a2 2 0 013.4 0l8.6 15a2 2 0 01-1.7 3H3.4a2 2 0 01-1.7-3z",fill:e.primary}),S.createElement("path",{d:"M12 9v5",stroke:e.secondary,strokeWidth:"2.3",strokeLinecap:"round"}),S.createElement("circle",{cx:"12",cy:"17.6",r:"1.3",fill:e.secondary})),Vt=({theme:e})=>S.createElement("svg",{viewBox:"0 0 24 24","aria-hidden":"true"},S.createElement("circle",{cx:"12",cy:"12",r:"11",fill:e.primary}),S.createElement("circle",{cx:"12",cy:"7.4",r:"1.4",fill:e.secondary}),S.createElement("path",{d:"M12 11v6.2",stroke:e.secondary,strokeWidth:"2.3",strokeLinecap:"round"})),Ft=({theme:e})=>S.createElement("svg",{viewBox:"0 0 24 24","aria-hidden":"true"},S.createElement("g",{className:"tostack-spin"},Array.from({length:8},(t,s)=>S.createElement("line",{key:s,x1:"12",y1:"3",x2:"12",y2:"7.2",stroke:e.primary,strokeWidth:"2.2",strokeLinecap:"round",opacity:1-s*.11,transform:`rotate(${-s*45} 12 12)`}))));var ne={blank:"var(--tostack-lume)",custom:"var(--tostack-lume)",success:"var(--tostack-green)",error:"var(--tostack-red)",warning:"var(--tostack-orange)",info:"var(--tostack-blue)",loading:"var(--tostack-lume)"},ie=new Set(["blank","custom","loading"]),re={blank:["var(--tostack-fg2)","var(--tostack-hairline)"],custom:["var(--tostack-fg2)","var(--tostack-hairline)"],success:["var(--tostack-green)","var(--tostack-mint)","var(--tostack-teal)","var(--tostack-green)"],error:["var(--tostack-red)","var(--tostack-pink)","var(--tostack-orange)","var(--tostack-red)"],warning:["var(--tostack-orange)","var(--tostack-yellow)","var(--tostack-orange)"],info:["var(--tostack-blue)","var(--tostack-teal)","var(--tostack-indigo)","var(--tostack-blue)"],loading:["var(--tostack-green)","var(--tostack-yellow)","var(--tostack-orange)","var(--tostack-red)","var(--tostack-pink)","var(--tostack-blue)","var(--tostack-green)"]},Dt=e=>{var t,s,a;return(a=(s=e.accent)!=null?s:(t=e.iconTheme)==null?void 0:t.primary)!=null?a:ne[e.type]};function ce({t:e}){var c;if(e.icon!==void 0)return e.icon===null||e.icon===!1?null:o.createElement("div",{className:"tostack-ic"},e.icon);let t=(c=e.iconTheme)!=null?c:{primary:Dt(e),secondary:"#fff"},a={success:Nt,error:zt,warning:Ht,info:Vt,loading:Ft}[e.type];return a?o.createElement("div",{className:"tostack-ic"},o.createElement(a,{theme:e.type==="loading"&&!e.iconTheme?{primary:"var(--tostack-fg)",secondary:""}:t})):null}var Tt=e=>{var t,s;return e.description!=null||((s=(t=e.actions)==null?void 0:t.length)!=null?s:0)>0};function le({t:e,expanded:t}){let s=mt(e.message,e);return e.type==="custom"?o.createElement(o.Fragment,null,s):o.createElement(o.Fragment,null,o.createElement("div",{className:"tostack-row"},o.createElement(ce,{t:e}),o.createElement("div",{className:"tostack-title"},s),e.accessory!=null&&o.createElement("div",{className:"tostack-acc"},e.accessory),e.closeButton&&o.createElement("button",{type:"button",className:"tostack-close","aria-label":"Close",onClick:a=>{a.stopPropagation(),N.dismiss(e.id)}},o.createElement("svg",{viewBox:"0 0 12 12",width:"10",height:"10","aria-hidden":"true"},o.createElement("path",{d:"M2 2l8 8M10 2l-8 8",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})))),t&&Tt(e)&&o.createElement("div",{className:"tostack-x"},e.description!=null&&o.createElement("div",{className:"tostack-desc"},e.description),e.actions&&e.actions.length>0&&o.createElement("div",{className:"tostack-actions"},e.actions.map((a,c)=>o.createElement("button",{key:c,type:"button",className:"tostack-btn"+(a.primary?" is-primary":""),onClick:v=>{var p;v.stopPropagation(),((p=a.onClick)==null?void 0:p.call(a,e))!==!1&&N.dismiss(e.id)}},a.label)))))}var Wt=(e,t=60)=>Math.sign(e)*t*(1-1/(Math.abs(e)/t+1));function wt(e){var st,rt;let{toast:t,position:s,island:a,material:c,exiting:v,onExited:p,register:d,hold:x,onTapStack:b}=e,y=s.startsWith("bottom"),T=s.endsWith("center"),m=o.useMemo(()=>new bt(e.stiffness,e.damping),[]);m.island=a,m.attached=a,m.bottom=y,m.center=T;let l=o.useRef(null),E=o.useRef(null),R=o.useRef(null),M=o.useRef(null),O=o.useRef(null),H=o.useRef(null),X=o.useRef(null),G=o.useRef(null),V=o.useRef(new Map),I="tostack-g"+o.useId().replace(/[^a-zA-Z0-9]/g,""),[J,C]=o.useState(null),F=J&&J.id===t.id?J.on:!!t.expanded,z=`${t.id}:${t.rev}:${F?1:0}`,[Y,at]=o.useState(()=>[{key:z,t,expanded:F}]);o.useLayoutEffect(()=>{at(i=>i[i.length-1].key===z?i:[...i.map(g=>({...g,out:!0})),{key:z,t,expanded:F}])},[z]),o.useEffect(()=>{if(!Y.some(g=>g.out))return;let i=setTimeout(()=>at(g=>g.filter(P=>!P.out)),320);return()=>clearTimeout(i)},[Y]),o.useLayoutEffect(()=>(m.els={root:l.current,svg:E.current,fill:R.current,line:M.current,glow:O.current,spec:H.current,mat:X.current,clip:G.current},m.reduced=typeof matchMedia!="undefined"&&matchMedia("(prefers-reduced-motion: reduce)").matches,d==null||d(t.id,m),()=>d==null?void 0:d(t.id,null)),[t.id]);let W=Y[Y.length-1];o.useLayoutEffect(()=>{let i=V.current.get(W.key);if(!i)return;let g=()=>{let A=i.offsetWidth,D=i.offsetHeight,w=a?W.expanded?32:22:26;m.size(A,D,w)};if(g(),i.classList.contains("is-in")&&requestAnimationFrame(()=>requestAnimationFrame(()=>i.classList.remove("is-in"))),typeof ResizeObserver=="undefined")return;let P=new ResizeObserver(g);return P.observe(i),()=>P.disconnect()},[W.key,a]),o.useEffect(()=>{v?m.exit(p):m.revive()},[v]),o.useEffect(()=>(x("x:"+t.id,F),()=>x("x:"+t.id,!1)),[F,t.id]);let U="hover:"+I,$=o.useRef(!1),q=i=>{$.current!==i&&($.current=i,x(U,i))},Z=o.useRef(null);o.useEffect(()=>()=>{var i;$.current&&x(U,!1),(i=Z.current)!=null&&i.moved&&x("drag",!1)},[]),o.useEffect(()=>{a&&m.release()},[t.id]);let nt=i=>{i.target.closest("button")||(Z.current={x:i.clientX,y:i.clientY,t:performance.now(),moved:!1,id:i.pointerId},i.currentTarget.setPointerCapture(i.pointerId))},K=i=>{let g=Z.current;if(!g&&i.pointerType==="mouse"&&q(!0),!g||g.id!==i.pointerId)return;let P=i.clientX-g.x,A=i.clientY-g.y;if(!g.moved&&Math.hypot(P,A)<6)return;g.moved||(g.moved=!0,x("drag",!0));let D=y?1:-1,w=t.dismissible;A=w&&Math.sign(A)===D?A:Wt(A,a?30:24),P=w&&!a?P:Wt(P,24),m.drag(P,A)},Q=i=>{var L;let g=Z.current;if(Z.current=null,!g||g.id!==i.pointerId)return;if(!g.moved){if(b!=null&&b())return;Tt(t)&&C({id:t.id,on:!F}),(L=t.onClick)==null||L.call(t,t);return}x("drag",!1);let P=Math.max(1,performance.now()-g.t),A=i.clientX-g.x,D=i.clientY-g.y,w=y?1:-1,_=Math.abs(D)/P>.5;t.dismissible&&Math.sign(D)===w&&(Math.abs(D)>36||_)?(m.fling(0,w*80),q(!1),N.dismiss(t.id)):t.dismissible&&!a&&Math.abs(A)>90?(m.fling(Math.sign(A)*260,0),q(!1),N.dismiss(t.id)):(a&&Tt(t)&&Math.sign(D)===-w&&Math.abs(D)>18&&C({id:t.id,on:!0}),m.release())},u=Dt(t),n=t.accent?[t.accent,"var(--tostack-fg2)",t.accent]:re[t.type],{background:f,...h}=(st=t.style)!=null?st:{},k={...h,"--tostack-accent":u,...ie.has(t.type)&&!t.accent&&!t.iconTheme?{"--tostack-on-accent":"var(--tostack-on-lume)"}:null,...f?{"--tostack-fill":f}:t.richColors&&t.type!=="blank"&&t.type!=="custom"?{"--tostack-fill":`color-mix(in srgb, ${u} 16%, var(--tostack-bg))`}:null},tt=(rt=t.ariaProps)!=null?rt:{role:t.type==="error"?"alert":"status","aria-live":t.type==="error"?"assertive":"polite"};return o.createElement("div",{ref:l,className:"tostack-t"+(a?" is-attached":"")+(a&&y?" is-flip":"")+(t.richColors?" tostack-rich":"")+(t.className?" "+t.className:""),"data-pos":s,"data-type":t.type,"data-glow":t.glow?"on":"off","data-material":c,style:{...k,transformOrigin:y?"50% 100%":"50% 0%",opacity:0},onPointerDown:nt,onPointerMove:K,onPointerUp:Q,onPointerCancel:Q,onPointerEnter:i=>i.pointerType==="mouse"&&q(!0),onPointerLeave:i=>i.pointerType==="mouse"&&q(!1)},o.createElement("div",{ref:X,className:"tostack-mat","aria-hidden":"true"}),o.createElement("svg",{ref:E,className:"tostack-svg","aria-hidden":"true"},o.createElement("defs",null,o.createElement("linearGradient",{id:I,x1:"0",y1:"0",x2:"1",y2:"0"},n.map((i,g)=>o.createElement("stop",{key:g,offset:g/(n.length-1),style:{stopColor:i}})),o.createElement("animateTransform",{attributeName:"gradientTransform",type:"rotate",from:"0 .5 .5",to:"360 .5 .5",dur:t.type==="loading"?"2.4s":"7s",repeatCount:"indefinite"})),o.createElement("linearGradient",{id:I+"s",x1:"0",y1:"0",x2:"0",y2:"1"},o.createElement("stop",{offset:"0",style:{stopColor:"var(--tostack-spec)"}}),o.createElement("stop",{offset:"0.45",style:{stopColor:"var(--tostack-spec)",stopOpacity:0}}),o.createElement("stop",{offset:"1",style:{stopColor:"var(--tostack-spec)",stopOpacity:.35}})),o.createElement("filter",{id:I+"b",x:"-20%",y:"-60%",width:"140%",height:"220%"},o.createElement("feGaussianBlur",{stdDeviation:"5"}))),o.createElement("path",{ref:R,className:"tostack-fill"}),o.createElement("path",{ref:H,className:"tostack-spec",stroke:`url(#${I}s)`}),o.createElement("path",{ref:O,className:"tostack-glow",stroke:`url(#${I})`,filter:`url(#${I}b)`}),o.createElement("path",{ref:M,className:"tostack-line",stroke:`url(#${I})`})),o.createElement("div",{ref:G,className:"tostack-clip",...tt},Y.map((i,g)=>o.createElement("div",{key:i.key,ref:P=>{P?V.current.set(i.key,P):V.current.delete(i.key)},className:"tostack-c"+(i.expanded?" is-x":"")+(i.out?" is-out":g>0||a?" is-in":""),"aria-hidden":i.out||void 0},o.createElement(le,{t:i.t,expanded:i.expanded})))))}var de={blank:4e3,success:2500,error:4e3,warning:4e3,info:3500,loading:1/0,custom:4e3},ue=["blank","success","error","warning","info","loading","custom"],fe=["top-left","top-center","top-right","bottom-left","bottom-center","bottom-right"];function Et(){return r.useSyncExternalStore(lt.subscribe,lt.get,lt.get)}var pe=typeof window!="undefined"?r.useLayoutEffect:r.useEffect;function me(){pe(()=>{if(document.getElementById("tostack-css"))return;let e=document.createElement("style");e.id="tostack-css",e.textContent=It,document.head.appendChild(e)},[])}function he(e){let[t,s]=r.useState("dark");return r.useEffect(()=>{if(e!=="system"||typeof matchMedia=="undefined")return;let a=matchMedia("(prefers-color-scheme: dark)"),c=()=>s(a.matches?"dark":"light");return c(),a.addEventListener("change",c),()=>a.removeEventListener("change",c)},[e]),e==="system"?t:e}function ke(){let[e,t]=r.useState(!1);return r.useEffect(()=>{let s=()=>t(document.visibilityState==="hidden");return document.addEventListener("visibilitychange",s),()=>document.removeEventListener("visibilitychange",s)},[]),e}var ge=e=>{let t={};for(let s in e)e[s]!==void 0&&(t[s]=e[s]);return t};function be(e,t){var v,p,d,x,b,y,T,m,l,E,R,M,O;let s={...(v=t.toastOptions)!=null?v:{}};ue.forEach(H=>delete s[H]);let a=(d=(p=t.toastOptions)==null?void 0:p[e.type])!=null?d:{},c={...s,...a,...ge(e)};return{...c,position:(b=(x=c.position)!=null?x:t.position)!=null?b:"top-center",duration:(y=c.duration)!=null?y:de[e.type],glow:(m=(T=c.glow)!=null?T:t.glow)!=null?m:!1,closeButton:(E=(l=c.closeButton)!=null?l:t.closeButton)!=null?E:!0,richColors:(M=(R=c.richColors)!=null?R:t.richColors)!=null?M:!1,dismissible:(O=c.dismissible)!=null?O:!1}}var Gt="__island",Rt=36;function ve(e){let{toasts:t,position:s,island:a,hold:c,gutter:v,reverseOrder:p,stiffness:d,damping:x,material:b}=e,y=Math.max(1,e.visibleToasts),T=t.filter(n=>n.visible),m=T.slice(0,y),l=T.slice(y);r.useEffect(()=>{let n=l.length-Math.max(0,e.maxQueue);for(let f=l.length-1;f>=0&&n>0;f--){let h=l[f];h.type==="error"||h.type==="loading"||(N.remove(h.id),n--)}});let[E,R]=r.useState(!1),M=r.useRef(new Set),O=r.useRef(),H=r.useCallback((n,f)=>{c(n,f),n.startsWith("hover:")&&(f?M.current.add(n):M.current.delete(n),clearTimeout(O.current),M.current.size?R(!0):O.current=setTimeout(()=>R(!1),180))},[c]);r.useEffect(()=>()=>clearTimeout(O.current),[]);let X=m.length>1,G=E&&X;r.useEffect(()=>(c("open:"+s,G),()=>c("open:"+s,!1)),[G]),r.useEffect(()=>{if(!E)return;let n=f=>{var h,k;f.pointerType!=="mouse"&&((k=(h=f.target)==null?void 0:h.closest)!=null&&k.call(h,".tostack-t")||R(!1))};return document.addEventListener("pointerdown",n,!0),()=>document.removeEventListener("pointerdown",n,!0)},[E]);let V=r.useRef(E);V.current=E;let I=r.useRef(X);I.current=X;let J=r.useCallback(()=>!I.current||V.current?!1:(R(!0),!0),[]),C=a?m[0]:void 0,F=r.useRef(null);C&&(F.current=C);let z=a?C!=null?C:F.current:null,[Y,at]=r.useState(0),W=new Set(m.map(n=>n.id)),U=t.filter(n=>n.visible?W.has(n.id)&&n.id!==(C==null?void 0:C.id):n.id!==(z==null?void 0:z.id)),$=r.useRef(new Map),q=r.useRef(U);q.current=U;let Z=r.useRef(G);Z.current=G;let nt=s.endsWith("left")?1:s.endsWith("right")?-1:0,K=r.useCallback(()=>{var i,g,P,A,D;let n=Z.current,f=q.current.filter(w=>w.visible),h=n&&p?[...f].reverse():f;if(a){let w=$.current.get(Gt);w==null||w.setZ(100);let _=(i=w==null?void 0:w.naturalW)!=null?i:0,L=w?w.h.t:0,ct=L+v;h.forEach((Xt,Mt)=>{let et=$.current.get(Xt.id);if(et)if(n)et.unlock(),et.setY(ct),et.setZ(90-Mt),ct+=et.naturalH+v;else{let vt=Mt+1;_>0&&et.lock(Math.max(60,_*(1-.1*vt)),Rt,Rt/2),et.setY(Math.max(0,L-Rt+9*vt)),et.setZ(90-vt)}});return}let k=$.current.get((P=(g=f[0])==null?void 0:g.id)!=null?P:""),tt=(A=k==null?void 0:k.naturalW)!=null?A:0,st=(D=k==null?void 0:k.naturalH)!=null?D:0,rt=0;h.forEach((w,_)=>{let L=$.current.get(w.id);if(L)if(n||_===0)L.unlock(),L.setOx(0),L.setY(rt),L.setZ(100-_),rt+=L.naturalH+v;else{if(tt>0){let ct=tt*(1-.06*_);L.lock(ct,st,26),L.setOx(nt*(tt-ct)/2)}L.setY(12*_),L.setZ(100-_)}})},[v,p,a,nt]),Q=r.useCallback((n,f)=>{f?($.current.set(n,f),f.onSize=K):$.current.delete(n),K()},[K]),u=r.useCallback((n,f)=>Q(Gt,f),[Q]);return r.useLayoutEffect(K),r.createElement(r.Fragment,null,a&&z&&r.createElement(wt,{key:"island"+Y,toast:z,position:s,island:!0,material:b,exiting:!C,onExited:()=>{N.remove(z.id),F.current=null,at(n=>n+1)},register:u,hold:H,onTapStack:J,stiffness:d,damping:x}),U.map(n=>r.createElement(wt,{key:n.id,toast:n,position:s,island:!1,material:b,exiting:!n.visible,onExited:()=>N.remove(n.id),register:Q,hold:H,onTapStack:J,stiffness:d,damping:x})))}function Bt(e){var K,Q;let{position:t="top-center",theme:s="system",island:a="auto",reverseOrder:c=!1,gutter:v=8,offset:p=16,containerStyle:d,containerClassName:x,container:b,spring:y,material:T="glass",visibleToasts:m=3,maxQueue:l=3,minWidth:E=300,maxWidth:R=380}=e,M=u=>typeof u=="number"?`${u}px`:u,O={"--tostack-minw":`min(${M(E)}, calc(100cqw - 24px))`,"--tostack-maxw":`min(${M(R)}, calc(100cqw - 24px))`},H=Et(),X=he(s),G=ke();me();let[V,I]=r.useState(!1);r.useEffect(()=>I(!0),[]);let J=r.useRef(new Set),[C,F]=r.useState(0),z=r.useCallback((u,n)=>{let f=J.current;n!==f.has(u)&&(n?f.add(u):f.delete(u),F(f.size))},[]),Y=H.map(u=>be(u,e)),at=u=>u.endsWith("center")&&(a===!0||a==="auto"&&u==="top-center"),W=new Map;for(let u of Y){let n=u.position;W.has(n)||W.set(n,[]),W.get(n).push(u)}let U=new Set;W.forEach(u=>{let n=u.find(f=>f.visible);n&&U.add(n.id)});let $=r.useRef(new Map);if(r.useEffect(()=>{let u=Date.now(),n=C>0||G,f=new Set;for(let h of Y){if(!h.visible||!Number.isFinite(h.duration))continue;f.add(h.id);let k=$.current.get(h.id);(!k||k.rev!==h.rev)&&(k!=null&&k.h&&clearTimeout(k.h),k={rev:h.rev,left:h.duration,start:null},$.current.set(h.id,k));let tt=!n&&U.has(h.id);tt&&k.start===null?(k.start=u,k.h=setTimeout(()=>{var st;$.current.delete(h.id),(st=h.onAutoClose)==null||st.call(h,h),N.dismiss(h.id)},Math.max(0,k.left))):!tt&&k.start!==null&&(clearTimeout(k.h),k.left-=u-k.start,k.start=null)}$.current.forEach((h,k)=>{f.has(k)||(h.h&&clearTimeout(h.h),$.current.delete(k))})}),r.useEffect(()=>()=>{$.current.forEach(u=>u.h&&clearTimeout(u.h)),$.current.clear()},[]),r.useEffect(()=>{let u=n=>{if(n.key!=="Escape")return;let f=lt.get().find(h=>h.visible);f&&N.dismiss(f.id)};return window.addEventListener("keydown",u),()=>window.removeEventListener("keydown",u)},[]),!V)return null;let q=b!=null?b:document.body,Z=(K=y==null?void 0:y.stiffness)!=null?K:260,nt=(Q=y==null?void 0:y.damping)!=null?Q:26;return(0,jt.createPortal)(r.createElement("div",{className:"tostack-root"+(b?" tostack-contained":"")+(x?" "+x:""),"data-theme":X,style:{...O,...d},role:"region","aria-label":"Notifications"},fe.filter(u=>W.has(u)).map(u=>{let n=at(u),f=u.startsWith("top");return r.createElement("div",{key:u,className:"tostack-lane",style:{position:"absolute",left:n?0:p,right:n?0:p,top:f?n?0:p:void 0,bottom:f?void 0:n?0:p,height:0,pointerEvents:"none"}},r.createElement(ve,{toasts:W.get(u),position:u,island:n,visibleToasts:m,maxQueue:l,hold:z,gutter:v,reverseOrder:c,stiffness:Z,damping:nt,material:T}))})),q)}return Qt(xe);})();
