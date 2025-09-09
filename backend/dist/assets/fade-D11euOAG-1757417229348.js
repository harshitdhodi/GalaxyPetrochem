import{a9 as r,x as e}from"./ContextIsolator-DOZmGNLq-1757417229348.js";import"./index-BFW4k-KW-1757417229348.js";import"./AntdIcon-Vjn5gSkG-1757417229348.js";const s=new e("antFadeIn",{"0%":{opacity:0},"100%":{opacity:1}}),m=new e("antFadeOut",{"0%":{opacity:1},"100%":{opacity:0}}),l=function(a){let i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;const{antCls:o}=a,n=`${o}-fade`,t=i?"&":"";return[r(n,s,m,a.motionDurationMid,i),{[`
        ${t}${n}-enter,
        ${t}${n}-appear
      `]:{opacity:0,animationTimingFunction:"linear"},[`${t}${n}-leave`]:{animationTimingFunction:"linear"}}]};export{l as i};
