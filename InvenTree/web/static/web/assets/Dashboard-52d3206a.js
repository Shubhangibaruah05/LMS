import{r as h,R as l,j as a,T as p,q}from"./vendor-44a51bcb.js";import{c as G,g as R,a as M,T as Z,B as A,b as Q,O as V,I as W,P as H,G as O,d as b,i,e as K,f as U}from"./index-519700e6.js";import{S as X}from"./StylishText-6a4d85e7.js";import{C as J,S as Y}from"./SimpleGrid-0dc5591f.js";var ee=Object.defineProperty,te=Object.defineProperties,re=Object.getOwnPropertyDescriptors,w=Object.getOwnPropertySymbols,ae=Object.prototype.hasOwnProperty,se=Object.prototype.propertyIsEnumerable,I=(t,e,r)=>e in t?ee(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,ie=(t,e)=>{for(var r in e||(e={}))ae.call(e,r)&&I(t,r,e[r]);if(w)for(var r of w(e))se.call(e,r)&&I(t,r,e[r]);return t},oe=(t,e)=>te(t,re(e)),ne=G(t=>({root:oe(ie({},t.fn.cover()),{display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"})}));const le=ne;var de=Object.defineProperty,ce=Object.defineProperties,ue=Object.getOwnPropertyDescriptors,m=Object.getOwnPropertySymbols,D=Object.prototype.hasOwnProperty,k=Object.prototype.propertyIsEnumerable,S=(t,e,r)=>e in t?de(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,u=(t,e)=>{for(var r in e||(e={}))D.call(e,r)&&S(t,r,e[r]);if(m)for(var r of m(e))k.call(e,r)&&S(t,r,e[r]);return t},pe=(t,e)=>ce(t,ue(e)),me=(t,e)=>{var r={};for(var s in t)D.call(t,s)&&e.indexOf(s)<0&&(r[s]=t[s]);if(t!=null&&m)for(var s of m(t))e.indexOf(s)<0&&k.call(t,s)&&(r[s]=t[s]);return r};const fe={overlayOpacity:.75,transitionDuration:0,radius:0,zIndex:R("overlay")},T=h.forwardRef((t,e)=>{const r=M("LoadingOverlay",fe,t),{className:s,visible:f,loaderProps:_,overlayOpacity:x,overlayColor:d,transitionDuration:o,exitTransitionDuration:v,zIndex:n,style:y,loader:c,radius:E,overlayBlur:$,unstyled:j,variant:L,keepMounted:N}=r,z=me(r,["className","visible","loaderProps","overlayOpacity","overlayColor","transitionDuration","exitTransitionDuration","zIndex","style","loader","radius","overlayBlur","unstyled","variant","keepMounted"]),{classes:C,cx:F,theme:g}=le(null,{name:"LoadingOverlay",unstyled:j,variant:L}),P=`calc(${n} + 1)`;return l.createElement(Z,{keepMounted:N,duration:o,exitDuration:v,mounted:f,transition:"fade"},B=>l.createElement(A,u({className:F(C.root,s),style:pe(u(u({},B),y),{zIndex:n}),ref:e},z),c?l.createElement("div",{style:{zIndex:P}},c):l.createElement(Q,u({style:{zIndex:P}},_)),l.createElement(V,{opacity:x,zIndex:n,radius:E,blur:$,unstyled:j,color:d||(g.colorScheme==="dark"?g.colors.dark[5]:g.white)})))});T.displayName="@mantine/core/LoadingOverlay";function _e({id:t,data:e,isLoading:r}){const{classes:s}=W();return a.jsxs(H,{withBorder:!0,p:"xs",pos:"relative",children:[a.jsx(T,{visible:r,overlayBlur:2}),a.jsx(O,{position:"apart",children:a.jsx(b,{size:"xs",color:"dimmed",className:s.dashboardItemTitle,children:e.title})}),a.jsx(O,{align:"flex-end",spacing:"xs",mt:25,children:a.jsx(b,{className:s.dashboardItemValue,children:e.value})})]},t)}function xe({id:t,error:e}){const r=(e==null?void 0:e.message)||(e==null?void 0:e.toString())||a.jsx(p,{id:"29VNqC"});return a.jsxs(a.Fragment,{children:[a.jsx("p",{children:a.jsx(p,{id:"oFjpQm"})}),r]})}function ve({id:t,text:e,url:r,params:s,autoupdate:f=!0}){function _(){return K.get(`${r}/?search=&offset=0&limit=25`,{params:s}).then(c=>c.data)}const{isLoading:x,error:d,data:o,isFetching:v}=q({queryKey:[`dash_${t}`],queryFn:_,refetchOnWindowFocus:f}),[n,y]=h.useState({title:i._({id:"MHrjPM"}),value:"000"});return h.useEffect(()=>{o&&y({title:e,value:o.count})},[o]),d!=null?a.jsx(xe,{id:t,error:d}):a.jsx("div",{children:a.jsx(_e,{id:t,data:n,isLoading:x||v})},t)}function je(){const[t,e]=U(s=>[s.autoupdate,s.toggleAutoupdate]),r=[{id:"starred-parts",text:i._({id:"5QTyaY"}),icon:"fa-bell",url:"part",params:{starred:!0}},{id:"starred-categories",text:i._({id:"GuGbPw"}),icon:"fa-bell",url:"part/category",params:{starred:!0}},{id:"latest-parts",text:i._({id:"LcKNFQ"}),icon:"fa-newspaper",url:"part",params:{ordering:"-creation_date",limit:10}},{id:"bom-validation",text:i._({id:"eHUZsJ"}),icon:"fa-times-circle",url:"part",params:{bom_valid:!1}},{id:"recently-updated-stock",text:i._({id:"ZopSbj"}),icon:"fa-clock",url:"stock",params:{part_detail:!0,ordering:"-updated",limit:10}},{id:"low-stock",text:i._({id:"UgdO7s"}),icon:"fa-flag",url:"part",params:{low_stock:!0}},{id:"depleted-stock",text:i._({id:"Onj2Pw"}),icon:"fa-times",url:"part",params:{depleted_stock:!0}},{id:"stock-to-build",text:i._({id:"Iq/utX"}),icon:"fa-bullhorn",url:"part",params:{stock_to_build:!0}},{id:"expired-stock",text:i._({id:"ZOsmSm"}),icon:"fa-calendar-times",url:"stock",params:{expired:!0}},{id:"stale-stock",text:i._({id:"kc9cAF"}),icon:"fa-stopwatch",url:"stock",params:{stale:!0,expired:!0}},{id:"build-pending",text:i._({id:"zLhIiS"}),icon:"fa-cogs",url:"build",params:{active:!0}},{id:"build-overdue",text:i._({id:"UBWkDy"}),icon:"fa-calendar-times",url:"build",params:{overdue:!0}},{id:"po-outstanding",text:i._({id:"WsHr9R"}),icon:"fa-sign-in-alt",url:"order/po",params:{supplier_detail:!0,outstanding:!0}},{id:"po-overdue",text:i._({id:"fCNzWA"}),icon:"fa-calendar-times",url:"order/po",params:{supplier_detail:!0,overdue:!0}},{id:"so-outstanding",text:i._({id:"gyZThB"}),icon:"fa-sign-out-alt",url:"order/so",params:{customer_detail:!0,outstanding:!0}},{id:"so-overdue",text:i._({id:"Gu8K8T"}),icon:"fa-calendar-times",url:"order/so",params:{customer_detail:!0,overdue:!0}},{id:"news",text:i._({id:"XzTq3p"}),icon:"fa-newspaper",url:"news",params:{}}];return a.jsxs(a.Fragment,{children:[a.jsxs(O,{children:[a.jsx(X,{children:a.jsx(p,{id:"7p5kLi"})}),a.jsx(J,{checked:t,onChange:()=>e(),children:a.jsx(p,{id:"edpMcF"})})]}),a.jsx(Y,{cols:4,pt:"md",children:r.map(s=>a.jsx(ve,{...s,autoupdate:t},s.id))})]})}export{je as default};
