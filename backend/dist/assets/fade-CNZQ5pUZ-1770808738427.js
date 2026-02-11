import{a9 as r,x as o}from"./ContextIsolator-C7xDH9qu-1770808738427.js";import"./index-Bci9lOMk-1770808738427.js";import"./AntdIcon-1XYv_1kH-1770808738427.js";const c=new o("antFadeIn",{"0%":{opacity:0},"100%":{opacity:1}}),s=new o("antFadeOut",{"0%":{opacity:1},"100%":{opacity:0}}),f=(t,a=!1)=>{const{antCls:e}=t,n=`${e}-fade`,i=a?"&":"";return[r(n,c,s,t.motionDurationMid,a),{[`
        ${i}${n}-enter,
        ${i}${n}-appear
      `]:{opacity:0,animationTimingFunction:"linear"},[`${i}${n}-leave`]:{animationTimingFunction:"linear"}}]};export{f as i};
