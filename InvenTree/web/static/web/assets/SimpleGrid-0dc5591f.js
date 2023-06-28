import{R as g,r as h}from"./vendor-44a51bcb.js";import{a as E,k as F,r as s,c as M,w as k,t as l,j as gr,s as yr,B as U,Y as z,D as vr}from"./index-519700e6.js";var kr=Object.defineProperty,I=Object.getOwnPropertySymbols,_r=Object.prototype.hasOwnProperty,br=Object.prototype.propertyIsEnumerable,V=(r,o,a)=>o in r?kr(r,o,{enumerable:!0,configurable:!0,writable:!0,value:a}):r[o]=a,Sr=(r,o)=>{for(var a in o||(o={}))_r.call(o,a)&&V(r,a,o[a]);if(I)for(var a of I(o))br.call(o,a)&&V(r,a,o[a]);return r};function Cr(r){return g.createElement("svg",Sr({viewBox:"0 0 10 7",fill:"none",xmlns:"http://www.w3.org/2000/svg"},r),g.createElement("path",{d:"M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z",fill:"currentColor",fillRule:"evenodd",clipRule:"evenodd"}))}const Y=h.createContext(null),wr=Y.Provider,$r=()=>h.useContext(Y),Pr={};function q(r){const{value:o,defaultValue:a,onChange:e,multiple:n,children:c}=E("ChipGroup",Pr,r),[i,f]=F({value:o,defaultValue:a,finalValue:n?[]:null,onChange:e}),t=p=>Array.isArray(i)?i.includes(p):p===i,y=p=>{const d=p.currentTarget.value;Array.isArray(i)?f(i.includes(d)?i.filter(v=>v!==d):[...i,d]):f(d)};return g.createElement(wr,{value:{isChipSelected:t,onChange:y,multiple:n}},c)}q.displayName="@mantine/core/ChipGroup";var Or=Object.defineProperty,xr=Object.defineProperties,hr=Object.getOwnPropertyDescriptors,W=Object.getOwnPropertySymbols,mr=Object.prototype.hasOwnProperty,zr=Object.prototype.propertyIsEnumerable,G=(r,o,a)=>o in r?Or(r,o,{enumerable:!0,configurable:!0,writable:!0,value:a}):r[o]=a,u=(r,o)=>{for(var a in o||(o={}))mr.call(o,a)&&G(r,a,o[a]);if(W)for(var a of W(o))zr.call(o,a)&&G(r,a,o[a]);return r},C=(r,o)=>xr(r,hr(o));const A={xs:s(24),sm:s(28),md:s(32),lg:s(36),xl:s(40)},S={xs:s(10),sm:s(12),md:s(14),lg:s(16),xl:s(18)},B={xs:s(16),sm:s(20),md:s(24),lg:s(28),xl:s(32)},$={xs:s(7.5),sm:s(10),md:s(11.5),lg:s(13),xl:s(15)};function Er(r,{color:o},a){const e=r.fn.variant({variant:"filled",color:o}),n=r.fn.variant({variant:"light",color:o});return a==="light"?{label:u({backgroundColor:r.colorScheme==="dark"?r.colors.dark[6]:r.colors.gray[1]},r.fn.hover({backgroundColor:r.colorScheme==="dark"?r.colors.dark[5]:r.colors.gray[0]})),checked:C(u({color:n.color,backgroundColor:n.background},r.fn.hover({backgroundColor:n.hover})),{"&, &:hover":{backgroundColor:r.fn.variant({variant:"light",color:o}).background}})}:a==="filled"?{label:u({backgroundColor:r.colorScheme==="dark"?r.colors.dark[6]:r.colors.gray[1]},r.fn.hover({backgroundColor:r.colorScheme==="dark"?r.colors.dark[5]:r.colors.gray[0]})),checked:u({color:e.color,backgroundColor:e.background},r.fn.hover({backgroundColor:e.hover}))}:a==="outline"?{label:u({backgroundColor:r.colorScheme==="dark"?r.colors.dark[6]:r.white,borderColor:r.colorScheme==="dark"?r.colors.dark[4]:r.colors.gray[4]},r.fn.hover({backgroundColor:r.colorScheme==="dark"?r.colors.dark[5]:r.colors.gray[0]})),checked:{border:`${s(1)} solid ${e.background}`}}:{label:null,checked:null}}var Nr=M((r,{radius:o,color:a},{size:e,variant:n})=>{const c=Er(r,{color:a},n);return{root:{},label:C(u(C(u({ref:k("label")},r.fn.fontStyles()),{boxSizing:"border-box",color:r.colorScheme==="dark"?r.colors.dark[0]:r.black,display:"inline-flex",alignItems:"center",userSelect:"none",border:`${s(1)} solid transparent`,borderRadius:r.fn.radius(o),height:l({size:e,sizes:A}),fontSize:l({size:e,sizes:r.fontSizes}),lineHeight:`calc(${l({size:e,sizes:A})} - ${s(2)})`,paddingLeft:l({size:e,sizes:B}),paddingRight:l({size:e,sizes:B}),cursor:"pointer",whiteSpace:"nowrap",transition:"background-color 100ms ease",WebkitTapHighlightColor:"transparent"}),c.label),{"&[data-disabled]":C(u({backgroundColor:r.colorScheme==="dark"?r.colors.dark[5]:r.colors.gray[1],borderColor:r.colorScheme==="dark"?r.colors.dark[5]:r.colors.gray[1],color:r.colorScheme==="dark"?r.colors.dark[3]:r.colors.gray[5],cursor:"not-allowed",pointerEvents:"none"},r.fn.hover({backgroundColor:r.colorScheme==="dark"?r.colors.dark[5]:r.colors.gray[1]})),{[`& .${k("iconWrapper")}`]:{color:r.colorScheme==="dark"?r.colors.dark[3]:r.colors.gray[5]}}),"&[data-checked]":{paddingLeft:l({size:e,sizes:$}),paddingRight:l({size:e,sizes:$}),"&:not([data-disabled])":c.checked}}),iconWrapper:{ref:k("iconWrapper"),color:n==="filled"?r.white:r.fn.variant({variant:"filled",color:a}).background,width:`calc(${l({size:e,sizes:S})} + (${l({size:e,sizes:r.spacing})} / 1.5))`,maxWidth:`calc(${l({size:e,sizes:S})} + (${l({size:e,sizes:r.spacing})} / 1.5))`,height:l({size:e,sizes:S}),display:"inline-block",verticalAlign:"middle",overflow:"hidden"},checkIcon:{width:l({size:e,sizes:S}),height:`calc(${l({size:e,sizes:S})} / 1.1)`,display:"block"},input:{width:0,height:0,padding:0,opacity:0,margin:0,"&:disabled + label":C(u({backgroundColor:r.colorScheme==="dark"?r.colors.dark[5]:r.colors.gray[1],borderColor:r.colorScheme==="dark"?r.colors.dark[5]:r.colors.gray[1],color:r.colorScheme==="dark"?r.colors.dark[3]:r.colors.gray[5],cursor:"not-allowed",pointerEvents:"none"},r.fn.hover({backgroundColor:r.colorScheme==="dark"?r.colors.dark[5]:r.colors.gray[1]})),{[`& .${k("iconWrapper")}`]:{color:r.colorScheme==="dark"?r.colors.dark[3]:r.colors.gray[5]},"&[data-checked]":{paddingLeft:l({size:e,sizes:$}),paddingRight:l({size:e,sizes:$}),"&:not([data-disabled])":{backgroundColor:r.colorScheme==="dark"?r.colors.dark[5]:r.colors.gray[1],borderColor:r.colorScheme==="dark"?r.colors.dark[5]:r.colors.gray[1],color:r.colorScheme==="dark"?r.colors.dark[3]:r.colors.gray[5]}}}),"&:focus":{outline:"none",[`& + .${k("label")}`]:u({},r.focusRing==="always"||r.focusRing==="auto"?r.focusRingStyles.styles(r):r.focusRingStyles.resetStyles(r)),"&:focus:not(:focus-visible)":{[`& + .${k("label")}`]:u({},r.focusRing==="auto"||r.focusRing==="never"?r.focusRingStyles.resetStyles(r):null)}}}}});const Rr=Nr;var jr=Object.defineProperty,O=Object.getOwnPropertySymbols,J=Object.prototype.hasOwnProperty,K=Object.prototype.propertyIsEnumerable,L=(r,o,a)=>o in r?jr(r,o,{enumerable:!0,configurable:!0,writable:!0,value:a}):r[o]=a,P=(r,o)=>{for(var a in o||(o={}))J.call(o,a)&&L(r,a,o[a]);if(O)for(var a of O(o))K.call(o,a)&&L(r,a,o[a]);return r},Ir=(r,o)=>{var a={};for(var e in r)J.call(r,e)&&o.indexOf(e)<0&&(a[e]=r[e]);if(r!=null&&O)for(var e of O(r))o.indexOf(e)<0&&K.call(r,e)&&(a[e]=r[e]);return a};const Vr={type:"checkbox",size:"sm",radius:"xl",variant:"outline"},Q=h.forwardRef((r,o)=>{const a=E("Chip",Vr,r),{radius:e,type:n,size:c,variant:i,disabled:f,id:t,color:y,children:p,className:d,classNames:v,style:_,styles:rr,checked:or,defaultChecked:ar,onChange:er,sx:lr,wrapperProps:sr,value:N,unstyled:nr}=a,cr=Ir(a,["radius","type","size","variant","disabled","id","color","children","className","classNames","style","styles","checked","defaultChecked","onChange","sx","wrapperProps","value","unstyled"]),w=$r(),R=gr(t),{systemStyles:ir,rest:tr}=yr(cr),{classes:b,cx:dr}=Rr({radius:e,color:y},{classNames:v,styles:rr,unstyled:nr,name:"Chip",variant:i,size:c}),[pr,ur]=F({value:or,defaultValue:ar,finalValue:!1,onChange:er}),j=w?{checked:w.isChipSelected(N),onChange:w.onChange,type:w.multiple?"checkbox":"radio"}:{},m=j.checked||pr;return g.createElement(U,P(P({className:dr(b.root,d),style:_,sx:lr},ir),sr),g.createElement("input",P(P({type:n,className:b.input,checked:m,onChange:fr=>ur(fr.currentTarget.checked),id:R,disabled:f,ref:o,value:N},j),tr)),g.createElement("label",{htmlFor:R,"data-checked":m||void 0,"data-disabled":f||void 0,className:b.label},m&&g.createElement("span",{className:b.iconWrapper},g.createElement(Cr,{className:b.checkIcon})),p))});Q.displayName="@mantine/core/Chip";Q.Group=q;function Wr(r,o){if(o.length===0)return o;const a="maxWidth"in o[0]?"maxWidth":"minWidth",e=[...o].sort((n,c)=>z(l({size:c[a],sizes:r.breakpoints}))-z(l({size:n[a],sizes:r.breakpoints})));return a==="minWidth"?e.reverse():e}var Gr=Object.defineProperty,T=Object.getOwnPropertySymbols,Ar=Object.prototype.hasOwnProperty,Br=Object.prototype.propertyIsEnumerable,D=(r,o,a)=>o in r?Gr(r,o,{enumerable:!0,configurable:!0,writable:!0,value:a}):r[o]=a,Lr=(r,o)=>{for(var a in o||(o={}))Ar.call(o,a)&&D(r,a,o[a]);if(T)for(var a of T(o))Br.call(o,a)&&D(r,a,o[a]);return r},Tr=M((r,{spacing:o,breakpoints:a,cols:e,verticalSpacing:n})=>{const c=n!=null,i=Wr(r,a).reduce((f,t)=>{var y,p;const d="maxWidth"in t?"max-width":"min-width",v=l({size:d==="max-width"?t.maxWidth:t.minWidth,sizes:r.breakpoints,units:"em"}),_=z(v)-(d==="max-width"?1:0);return f[`@media (${d}: ${vr(_)})`]={gridTemplateColumns:`repeat(${t.cols}, minmax(0, 1fr))`,gap:`${l({size:(y=t.verticalSpacing)!=null?y:c?n:o,sizes:r.spacing})} ${l({size:(p=t.spacing)!=null?p:o,sizes:r.spacing})}`},f},{});return{root:Lr({boxSizing:"border-box",display:"grid",gridTemplateColumns:`repeat(${e}, minmax(0, 1fr))`,gap:`${l({size:c?n:o,sizes:r.spacing})} ${l({size:o,sizes:r.spacing})}`},i)}});const Dr=Tr;var Hr=Object.defineProperty,x=Object.getOwnPropertySymbols,X=Object.prototype.hasOwnProperty,Z=Object.prototype.propertyIsEnumerable,H=(r,o,a)=>o in r?Hr(r,o,{enumerable:!0,configurable:!0,writable:!0,value:a}):r[o]=a,Fr=(r,o)=>{for(var a in o||(o={}))X.call(o,a)&&H(r,a,o[a]);if(x)for(var a of x(o))Z.call(o,a)&&H(r,a,o[a]);return r},Mr=(r,o)=>{var a={};for(var e in r)X.call(r,e)&&o.indexOf(e)<0&&(a[e]=r[e]);if(r!=null&&x)for(var e of x(r))o.indexOf(e)<0&&Z.call(r,e)&&(a[e]=r[e]);return a};const Ur={breakpoints:[],cols:1,spacing:"md"},Yr=h.forwardRef((r,o)=>{const a=E("SimpleGrid",Ur,r),{className:e,breakpoints:n,cols:c,spacing:i,verticalSpacing:f,children:t,unstyled:y,variant:p}=a,d=Mr(a,["className","breakpoints","cols","spacing","verticalSpacing","children","unstyled","variant"]),{classes:v,cx:_}=Dr({breakpoints:n,cols:c,spacing:i,verticalSpacing:f},{name:"SimpleGrid",unstyled:y,variant:p});return g.createElement(U,Fr({className:_(v.root,e),ref:o},d),t)});Yr.displayName="@mantine/core/SimpleGrid";export{Q as C,Yr as S};
