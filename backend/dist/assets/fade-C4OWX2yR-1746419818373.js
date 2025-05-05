import{ae as r,y as i}from"./index-C3bxH8TE-1746419818373.js";import"./index-CyqvOuOg-1746419818373.js";import"./AntdIcon-DOEEMSan-1746419818373.js";const s=new i("antFadeIn",{"0%":{opacity:0},"100%":{opacity:1}}),m=new i("antFadeOut",{"0%":{opacity:1},"100%":{opacity:0}}),l=function(a){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;const{antCls:o}=a,n=`${o}-fade`,t=e?"&":"";return[r(n,s,m,a.motionDurationMid,e),{[`
        ${t}${n}-enter,
        ${t}${n}-appear
      `]:{opacity:0,animationTimingFunction:"linear"},[`${t}${n}-leave`]:{animationTimingFunction:"linear"}}]};export{l as i};
