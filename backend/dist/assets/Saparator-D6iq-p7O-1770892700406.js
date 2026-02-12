import{r as s,j as e,L as k,h as U,K as O,b as $,cH as ee,cI as te,B as z,cJ as se,G as ae,av as ne,ax as le,ay as re,az as ie,cq as oe,X as ce,l as R,u as de,cK as me,c as ue}from"./index-KfywG3O6-1770892700406.js";import{S as pe,a as ge}from"./404-D6fZ9wf5-1770892700406.js";import{_ as he}from"./extends-rM07bN2b-1770892700406.js";import{I as xe}from"./AntdIcon-CFMvIf1H-1770892700406.js";var fe={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"defs",attrs:{},children:[{tag:"style",attrs:{}}]},{tag:"path",attrs:{d:"M713.5 599.9c-10.9-5.6-65.2-32.2-75.3-35.8-10.1-3.8-17.5-5.6-24.8 5.6-7.4 11.1-28.4 35.8-35 43.3-6.4 7.4-12.9 8.3-23.8 2.8-64.8-32.4-107.3-57.8-150-131.1-11.3-19.5 11.3-18.1 32.4-60.2 3.6-7.4 1.8-13.7-1-19.3-2.8-5.6-24.8-59.8-34-81.9-8.9-21.5-18.1-18.5-24.8-18.9-6.4-.4-13.7-.4-21.1-.4-7.4 0-19.3 2.8-29.4 13.7-10.1 11.1-38.6 37.8-38.6 92s39.5 106.7 44.9 114.1c5.6 7.4 77.7 118.6 188.4 166.5 70 30.2 97.4 32.8 132.4 27.6 21.3-3.2 65.2-26.6 74.3-52.5 9.1-25.8 9.1-47.9 6.4-52.5-2.7-4.9-10.1-7.7-21-13z"}},{tag:"path",attrs:{d:"M925.2 338.4c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 00-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 00-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 00112 714v152a46 46 0 0046 46h152.1A449.4 449.4 0 00510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 00142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z"}}]},name:"whats-app",theme:"outlined"},be=function(a,t){return s.createElement(xe,he({},a,{ref:t,icon:fe}))},ye=s.forwardRef(be);const X=n=>n?n.split(/[-\s]+/).map(a=>a.charAt(0).toUpperCase()+a.slice(1).toLowerCase()).join(" "):"";function je({chemicalName:n,subCategorySlug:a,categorySlug:t,categoryName:c,slug2:l,subcategoryName:d}){return e.jsx("nav",{className:"mb-6 mt-2 pb-3 z-0",children:e.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1",children:[e.jsxs("div",{className:"flex items-center text-sm text-white whitespace-nowrap",children:[e.jsx(k,{to:"/",className:"rounded-md",children:"Home"}),e.jsx("span",{className:"mx-2",children:"/"}),e.jsx(k,{to:"/products",className:"rounded-md",children:"Products"})]}),e.jsxs("div",{className:"flex items-center text-sm text-white mt-1 sm:mt-0 sm:ml-4 whitespace-nowrap",children:[e.jsx("span",{className:"mr-2",children:"/"}),e.jsx(k,{to:`/${t}`,className:"rounded-md",children:X(t)}),d&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"mx-2",children:"/"}),e.jsx(k,{to:`/${t}/${a||d}`,className:"rounded-md",children:X(d)})]})]})]})})})}const we="/assets/banner-B-GX8lQy-1770892700406.webp";function ve(){const{slug:n,categorySlug:a}=U();console.log(n,a);const[t,c]=s.useState(null),[l,d]=s.useState([]),[h,f]=s.useState(!0),[p,v]=s.useState(!1),[u,N]=s.useState([]),[b,y]=s.useState(!0),j=location.pathname.replace(/^\//,"")||"introduction";s.useEffect(()=>{(async()=>{try{const o=await $.get(`/api/banner/getByPageSlug?pageSlug=${n}`);N(o.data||[])}catch(o){console.error("Failed to fetch banner:",o)}finally{y(!1)}})()},[j]),s.useEffect(()=>{(async()=>{try{const o=await $.get(`/api/chemicalCategory/getSpecificSubcategoryBySlug?slug=${n}`),{subCategory:m,products:i}=o.data;c(m),d(i)}catch(o){console.error("Error fetching category data:",o)}finally{f(!1)}})()},[n]),s.useEffect(()=>{if(t){document.title=t.metatitle||t.category||"Industrial Oils";const r=t.metadescription||I(t.details||"");S("description",r)}},[t]);const S=(r,o)=>{let m=document.querySelector(`meta[name="${r}"]`);m||(m=document.createElement("meta"),m.setAttribute("name",r),document.head.appendChild(m)),m.setAttribute("content",o)},I=r=>{const o=document.createElement("div");o.innerHTML=r;const m=o.textContent||o.innerText||"",i=Math.floor(m.length*.2);return m.substring(0,i)+"..."},L=(()=>{const r={};return l.forEach(o=>{var i;const m=((i=o.brandId)==null?void 0:i.name)||"Unknown Brand";r[m]||(r[m]=[]),r[m].push(o)}),r})();return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"relative",children:[u&&u.length>0?e.jsx(O,{imageUrl:`/api/image/download/${u[0].image}`,title:t==null?void 0:t.slug}):e.jsx(O,{imageUrl:we}),e.jsx("div",{className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-5 z-10",children:e.jsx(je,{subcategoryName:t==null?void 0:t.category,subCategorySlug:t==null?void 0:t.slug,categorySlug:a})})]}),e.jsxs("div",{className:"container mx-auto px-4 mt-5 pb-8 max-w-7xl",children:[e.jsx("div",{className:"text-gray-700 mb-4",children:(t==null?void 0:t.details)&&e.jsxs(e.Fragment,{children:[e.jsx("p",{dangerouslySetInnerHTML:{__html:p?t.details:I(t.details)}}),e.jsx("button",{onClick:()=>v(!p),className:"text-blue-600 underline mt-2 inline-block",children:p?"See Less":"See More"})]})}),h?e.jsx("p",{children:"Loading products..."}):Object.keys(L).length>0?e.jsx("div",{children:Object.keys(L).sort().map(r=>e.jsxs("div",{className:"mb-8",children:[e.jsx("h2",{className:"text-2xl font-bold text-[#0a3161] mb-4",children:r}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",children:L[r].map((o,m)=>e.jsx(pe,{product:o,categorySlug:t==null?void 0:t.categorySlug,subCategorySlug:t==null?void 0:t.slug},m))})]},r))}):e.jsx("p",{children:"No products found."})]})]})}function Ne({images:n,selectedImage:a,setSelectedImage:t}){var c,l;return console.log(n),e.jsx("div",{className:"sm:w-[80%] md:w-[100%]  lg:mt-2",children:e.jsx("div",{className:"border items-center flex justify-center  overflow-hidden mb-4 lg:h-[400px] md:h-[300px] h-[200px]",children:e.jsx("img",{src:(c=n[a])!=null&&c.url?`${n[a].url}`:"https://via.placeholder.com/300x300?text=No+Image+Available",alt:((l=n[a])==null?void 0:l.alt)||"Chemical bottles with blue liquid",className:"w-full h-full object-contain"})})})}function Se({tagline:n,productDetails:a,name:t,price:c,categorySlug:l}){const[d,h]=s.useState(!1),{extractedPContent:f,previewContent:p,remainingContent:v}=s.useMemo(()=>{const u=document.createElement("div");u.innerHTML=a;const N=u.querySelector("p");let b="";N&&(b=N.innerHTML,N.remove());const y=u.innerHTML,j=1e4;return{extractedPContent:b,previewContent:y.slice(0,j),remainingContent:y.slice(j)}},[a]);return e.jsxs("div",{className:"mb-8",children:[e.jsx("p",{className:"text-2xl pb-2 font-bold text-[#2e60d7]",children:t}),f&&e.jsx("p",{className:"extracted-paragraph text-md text-gray-900",dangerouslySetInnerHTML:{__html:f}}),e.jsx("div",{className:"custom-product-details overflow-x-auto w-full text-gray-800",dangerouslySetInnerHTML:{__html:d?p+v:p}}),v&&e.jsx("button",{onClick:()=>h(u=>!u),className:"text-blue-600 mt-2 font-semibold border-blue-600 border-b focus:outline-none",children:d?"See Less":"See More"}),e.jsx("style",{jsx:!0,global:!0,children:`
        .custom-product-details table {
          width: max-content;
          min-width: 100%;
          table-layout: fixed;
          border-collapse: collapse;
        }
        .custom-product-details tr:nth-child(odd) {
          background-color: #f5f9ff !important;
        }
        .custom-product-details tr:nth-child(even) {
          background-color: white !important;
        }
        .custom-product-details td {
          padding: 12px !important;
          font-size: 16px !important;
          line-height: 20px !important;
          text-align: left !important;
          color: black !important;
          word-wrap: break-word;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .custom-product-details td:first-child {
          color: #145bc7 !important;
          width: 25%;
          min-width: 120px;
        }
        .custom-product-details td:nth-child(2) {
          width: 75%;
          max-width: 300px;
          word-break: break-word;
        }
        .custom-product-details table,
        .custom-product-details td {
          border: none !important;
        }
        @media (max-width: 640px) {
          .custom-product-details td {
            font-size: 14px !important;
            padding: 8px !important;
            white-space: normal;
            max-width: 100px !important;
          }
          .custom-product-details table {
            table-layout: auto !important;
          }
        }
      `})]})}function Ce({msds:n,pdf:a,name:t,onInquiry:c}){const{data:l,isLoading:d}=ee(),{data:h,isLoading:f}=te(),[p,v]=s.useState(""),[u,N]=s.useState("");s.useEffect(()=>{l&&l.length>0&&(v(l[0].number),N(`Hi, I'm interested in ${t}`))},[l,t]);const b=()=>{const y=`https://wa.me/${p}?text=${encodeURIComponent(u)}`;window.open(y,"_blank")};return d||f?e.jsx("div",{children:"Loading..."}):e.jsxs("div",{className:" bg-gradient-to-r from-blue-50 to-blue-100 p-5 shadow-md",children:[e.jsxs("h2",{className:"text-xl font-semibold mb-6 text-blue-900 border-b border-blue-200 pb-3",children:[t," MSDS (Material Safety Data Sheet) or SDS, COA and Specs"]}),e.jsxs("div",{className:"flex flex-wrap gap-4 mb-3",children:[a&&e.jsx(z,{onClick:()=>window.open(`/api/image/view/${a}`,"_blank"),className:"w-full md:w-1/4 bg-[#e85920] hover:bg-[#e85920] transition-colors duration-300 text-white text-md py-2",children:"Data Sheet"}),n&&e.jsx(z,{onClick:()=>window.open(`/api/image/view/${n}`,"_blank"),className:"w-full md:w-1/4 bg-[#e95821] hover:bg-[#e85920] transition-colors duration-300 text-white text-md py-5 flex items-center gap-2",children:"MSDS"}),e.jsx(z,{onClick:c,className:"w-full md:w-1/4 bg-[#e85920] hover:bg-[#e95821] transition-colors duration-300 text-white text-md py-5 flex items-center gap-2",children:"Inquiry Now"}),e.jsxs("div",{className:"flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity",onClick:b,children:[e.jsx(ye,{className:"text-4xl text-green-500"})," "]})]})]})}function Pe({productName:n,onClose:a}){const[t,c]=s.useState(""),[l,d]=s.useState(""),[h,f]=s.useState(""),[p,v]=s.useState(""),[u,N]=s.useState(""),[b,y]=s.useState(null),[j,S]=s.useState(!1),[I,B]=s.useState(""),[L,r]=s.useState(!1),[o]=se(),m=async i=>{var M;if(i.preventDefault(),!b){B("Please complete the reCAPTCHA.");return}S(!0),B("");try{await o({name:t,email:l,phone:h,subject:p,message:u,productName:n,captchaToken:b}).unwrap(),r(!0),S(!1),c(""),d(""),f(""),v(""),N(""),y(null),a()}catch(T){B(((M=T.data)==null?void 0:M.message)||"Failed to submit inquiry. Please try again."),S(!1)}};return e.jsxs("div",{className:"fixed inset-0 top-[16%] flex items-center justify-center bg-black bg-opacity-50 p-4",children:[e.jsxs("div",{className:"bg-white p-6 rounded-md shadow-2xl w-full max-w-2xl",children:[e.jsx("h2",{className:"text-xl font-bold mb-6 text-gray-800 border-b pb-4",children:`Inquiry for ${n}`}),e.jsxs("form",{onSubmit:m,className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 text-sm font-semibold mb-2",children:"Name"}),e.jsx("input",{type:"text",value:t,onChange:i=>c(i.target.value),className:"w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 text-sm font-semibold mb-2",children:"Email"}),e.jsx("input",{type:"email",value:l,onChange:i=>d(i.target.value),className:"w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 text-sm font-semibold mb-2",children:"Phone No"}),e.jsx("input",{type:"text",value:h,maxLength:10,onChange:i=>f(i.target.value),className:"w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 text-sm font-semibold mb-2",children:"Subject"}),e.jsx("input",{type:"text",value:p,onChange:i=>v(i.target.value),className:"w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200",required:!0})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 text-sm font-semibold mb-2",children:"Message"}),e.jsx("textarea",{value:u,onChange:i=>N(i.target.value),className:"w-full border border-gray-300 p-2 rounded-lg transition duration-200 h-24",required:!0})]}),e.jsxs("div",{className:"flex flex-col  space-y-4",children:[e.jsx(ae,{sitekey:"6Lcs4YQrAAAAACTgdRmnJMQirPeDUcL5pfPyWAiy",onChange:i=>y(i),className:"w-full max-w-xs"}),I&&e.jsx("p",{className:"text-red-500 text-sm",children:I})]}),e.jsxs("div",{className:"flex justify-end space-x-4",children:[e.jsx("button",{type:"button",className:"bg-gray-500 hover:bg-gray-600 w-1/3 md:w-1/4 text-white px-4 py-2 rounded-md transition duration-200",onClick:a,disabled:j,children:"Cancel"}),e.jsx("button",{type:"submit",className:"bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 w-1/3 md:w-1/4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed",disabled:!b||j,children:j?"Submitting...":"Submit"})]})]})]}),e.jsx(ne,{open:L,onOpenChange:r,children:e.jsxs(le,{className:"bg-white max-w-md p-6",children:[e.jsxs(re,{children:[e.jsx(ie,{className:"text-green-700 text-xl font-bold",children:"Thank You!"}),e.jsx(oe,{className:"absolute right-4 top-4 text-gray-700",children:e.jsx(ce,{size:20})})]}),e.jsxs("div",{className:"text-gray-800 mt-2",children:[e.jsx("p",{className:"mb-2",children:"Your message has been successfully sent."}),e.jsx("p",{children:"We will get back to you soon."})]})]})})]})}const Ie=()=>{const[n,a]=s.useState([]),{categorySlug:t,slug:c}=U();return s.useEffect(()=>{(async()=>{var d;try{const h=await $.get(`/api/petrochemProduct/getRecentProductsByCategorySlug?slug=${c}`);a(((d=h.data)==null?void 0:d.slice(0,6))||[])}catch(h){console.error("Error fetching recent products:",h)}})()},[c]),e.jsxs("div",{className:"container mx-auto  py-5",children:[e.jsxs("div",{className:"mb-5",children:[e.jsx("h2",{className:"text-2xl lg:text-3xl font-bold mb-2 text-blue-900",children:"Recent Products"}),e.jsx("div",{className:"w-24 h-1 bg-blue-800"})]}),n.length>0?e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10",children:n.map(l=>{var d,h,f,p;return e.jsx(k,{to:`/${t}/${l.slug}`,className:"group bg-white hover:shadow-blue-100 shadow-blue-200 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transform transition-transform duration-300 hover:-translate-y-2",children:e.jsxs("div",{className:"flex flex-col h-full",children:[e.jsx("div",{className:"relative bg-white h-56 flex items-center justify-center",children:e.jsx("img",{src:(h=(d=l.images)==null?void 0:d[0])!=null&&h.url?`/api/image/download/${l.images[0].url}`:"/placeholder.jpg",alt:((p=(f=l.images)==null?void 0:f[0])==null?void 0:p.altText)||l.name,className:"max-h-48 w-auto object-contain transition-transform duration-300 group-hover:scale-105"})}),e.jsxs("div",{className:"p-4 bg-gradient-to-br from-blue-50 to-blue-100 flex-1 flex flex-col justify-between",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold text-blue-900 mb-1",children:l.name}),e.jsxs("p",{className:"text-sm text-blue-700 font-medium",children:["Category: ",l.categoryId.category]}),e.jsxs("p",{className:"text-sm text-gray-600 font-medium mb-2",children:["Brand: ",l.brandId.name]})]}),l.table&&e.jsx("div",{className:"text-sm text-gray-700 space-y-1 mt-2",dangerouslySetInnerHTML:{__html:l.table.replace(/border:\s?1px\s?solid[^;]+;/g,"").replace(/<table[^>]*>/g,"<div class='space-y-1'>").replace(/<\/table>/g,"</div>").replace(/<tbody>|<\/tbody>/g,"").replace(/<tr>/g,"<div class='flex space-x-2'>").replace(/<\/tr>/g,"</div>").replace(/<td[^>]*>(.*?)<\/td>\s*<td[^>]*>(.*?)<\/td>/g,"<span class='font-semibold text-blue-800'>$1:</span><span class='text-gray-800'>$2</span>").split("</div>").slice(0,2).join("</div>")}})]})]})},l._id)})}):e.jsx("p",{className:"text-center text-gray-500",children:"No recent products found."})]})},F=n=>n.split("-").map(a=>a.charAt(0).toUpperCase()+a.slice(1)).join(" ");function J({subCategorySlug:n,chemicals:a="",slug:t="",categorySlug:c=""}){return e.jsx("nav",{className:"mb-5 w-full pb-3 ",children:e.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:e.jsxs("div",{className:"flex flex-col gap-1 text-sm text-[#fff] sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:whitespace-nowrap sm:overflow-x-auto",children:[e.jsxs("div",{className:"flex items-center text-sm text-[#fff] whitespace-nowrap",children:[e.jsx(k,{to:"/",className:"hover:text-[#fff]",children:"Home"}),e.jsx("span",{className:"mx-2",children:"/"}),e.jsx(k,{to:"/products",className:"hover:text-[#fff]",children:"Products"})]}),e.jsxs("div",{className:"flex flex-wrap sm:flex-nowrap items-center text-sm text-[#fff] whitespace-normal sm:whitespace-nowrap sm:overflow-visible",children:[e.jsx("span",{className:"mr-2",children:"/"}),a?e.jsx(k,{to:`/${t}`,className:"hover:text-[#fff]",children:F(a)}):null,c&&!a&&e.jsx(k,{to:`/${c}`,className:"hover:text-[#fff]",children:F(c)}),n&&e.jsxs(e.Fragment,{children:[a||c?e.jsx("span",{className:"mx-2",children:"/"}):null,e.jsx(k,{to:`/${t}/${n}`,className:"hover:text-[#fff]",children:F(n)})]}),c&&a&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"mx-2 mt-2 sm:mt-0",children:"/"}),e.jsx("span",{children:F(c)})]})]})]})})})}J.propTypes={chemicals:R.string.isRequired,categorySlug:R.string.isRequired,subCategorySlug:R.string,slug:R.string};function Le(){var V,Q;const[n,a]=s.useState(0),[t,c]=s.useState(null),[l,d]=s.useState(!0),[h,f]=s.useState(!1),[p,v]=s.useState(!1),[u,N]=s.useState({}),{slug:b,categorySlug:y}=U(),j=de(),[S,I]=s.useState([]),[B,L]=s.useState(!0),[r,o]=s.useState(!1),m=(x,g=.5)=>{if(!x||typeof x!="string")return"No description available.";const C=document.createElement("div");C.innerHTML=x;const W=(C.textContent||C.innerText||"").trim().split(/\s+/).filter(w=>w.length>0),H=Math.floor(W.length*g);if(W.length<=50||W.length<=H)return x;let q=0,A=!1;function Y(w){if(A)return null;if(w.nodeType===Node.TEXT_NODE){const E=w.textContent.trim().split(/\s+/).filter(P=>P.length>0);if(q+E.length<=H)return q+=E.length,w.cloneNode(!0);{const P=H-q;if(P>0){const _=E.slice(0,P).join(" ")+"...",D=document.createTextNode(_);return q=H,A=!0,D}return A=!0,null}}else if(w.nodeType===Node.ELEMENT_NODE){const E=document.createElement(w.tagName);for(let P=0;P<w.attributes.length;P++)E.setAttribute(w.attributes[P].name,w.attributes[P].value);for(let P=0;P<w.childNodes.length&&!A;P++){const _=Y(w.childNodes[P]);_&&E.appendChild(_)}return E.childNodes.length>0?E:null}return null}const G=document.createElement("div");for(let w=0;w<C.childNodes.length&&!A;w++){const E=Y(C.childNodes[w]);E&&G.appendChild(E)}return G.innerHTML},i=x=>x?x.replace(/<p(?:\s[^>]*)?>\s*<\/p>/gi,"").replace(/<ul(?![^>]*class)/g,'<ul class="list-disc pl-6 space-y-2 my-4"').replace(/<ol(?![^>]*class)/g,'<ol class="list-decimal pl-6 space-y-2 my-4"').replace(/<li(?![^>]*class)/g,'<li class="leading-relaxed"').replace(/<p(?![^>]*class)/g,'<p class="mb-4 leading-relaxed"').replace(/<h1(?![^>]*class)/g,'<h1 class="text-2xl font-bold mb-4 mt-6"').replace(/<h2(?![^>]*class)/g,'<h2 class="text-xl font-bold mb-3 mt-5"').replace(/<h3(?![^>]*class)/g,'<h3 class="text-lg font-bold mb-3 mt-4"').replace(/<h4(?![^>]*class)/g,'<h4 class="text-base font-bold mb-2 mt-3"').replace(/<table(?![^>]*class)/g,'<table class="w-full border-collapse border border-gray-300 my-4"').replace(/<th(?![^>]*class)/g,'<th class="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left"').replace(/<td(?![^>]*class)/g,'<td class="border border-gray-300 px-4 py-2"').replace(/<strong>/g,'<strong class="font-bold">').replace(/<em>/g,'<em class="italic">').replace(/<ul class="[^"]*">\s*<ul/g,'<ul class="list-circle pl-4 mt-2"><ul').replace(/<ol class="[^"]*">\s*<ol/g,'<ol class="list-lower-alpha pl-4 mt-2"><ol'):"No content available.",M=x=>x?x.replace(/<[^>]+>/g,"").trim().length===0:!0;s.useEffect(()=>{(async()=>{try{const g=await $.get("/api/banner/getByPageSlug?pageSlug=hydraulic-oils");console.log(g.data),I(g.data||[])}catch(g){console.error("Failed to fetch banner:",g)}finally{L(!1)}})()},[]),s.useEffect(()=>{b&&(async()=>{try{d(!0),f(!1);const g=await fetch(`/api/petrochemProduct/getbySlug?slug=${b}`),C=await g.json();if(console.log(C),!g.ok)throw new Error("Failed to fetch product data");if(!C||C.length===0){j("/404",{replace:!0});return}c(C[0])}catch(g){console.error("Error fetching product data:",g),f(!0)}finally{d(!1)}})()},[b,j]);const T="https://via.placeholder.com/300x300?text=No+Image+Available",K=s.useMemo(()=>{var x;return(x=t==null?void 0:t.images)!=null&&x.length?t.images.map((g,C)=>({url:u[C]?T:`/api/image/download/${g.url}`,originalUrl:g.url,alt:g.alt||`Product Image ${C+1}`,title:g.title||"Product Image"})):[{url:T,alt:"No Image Available",title:"No Image"}]},[t==null?void 0:t.images,u]),Z=x=>{N(g=>({...g,[x]:!0}))};return h?e.jsxs("div",{className:"flex flex-col items-center justify-center min-h-screen",children:[e.jsx("p",{className:"text-red-600 font-semibold",children:"Error fetching product data."}),e.jsx(z,{onClick:()=>window.location.reload(),className:"mt-4",children:"Retry"})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"relative",children:[S&&S.length>0?e.jsx(O,{imageUrl:`/api/image/download/${S[0].image}`,title:t==null?void 0:t.name}):e.jsx("div",{className:"h-[30vh] flex items-center justify-center bg-gray-200",children:e.jsx("p",{className:"text-gray-500",children:"Banner not found"})}),e.jsx("div",{className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-5 z-10",children:e.jsx(J,{chemicals:(V=t==null?void 0:t.categoryId)==null?void 0:V.category,slug:(Q=t==null?void 0:t.categoryId)==null?void 0:Q.slug,categorySlug:t==null?void 0:t.name,subCategorySlug:y})})]}),e.jsxs("div",{className:"max-w-7xl mx-auto mb-10 px-4 py-2 relative",children:[p&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center",children:e.jsx(Pe,{productName:t==null?void 0:t.name,onClose:()=>v(!1)})}),l?e.jsx("div",{className:"flex justify-center items-center h-screen",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"})}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"lg:flex gap-12 mt-5",children:[e.jsx("div",{className:"w-full lg:w-1/2 flex flex-col items-center justify-start",children:e.jsx(Ne,{images:K,selectedImage:n,setSelectedImage:a,onError:Z})}),e.jsxs("div",{className:"w-full ",children:[e.jsx(Se,{productDetails:t==null?void 0:t.details,name:t==null?void 0:t.name,price:t==null?void 0:t.price,categorySlug:t==null?void 0:t.categorySlug,tagline:t==null?void 0:t.tagline}),e.jsx(Ce,{msds:t==null?void 0:t.msds,pdf:t==null?void 0:t.pdf,name:t==null?void 0:t.name,onInquiry:()=>v(!0)})]})]}),(!M(t==null?void 0:t.details)||!M(t==null?void 0:t.specifiction)||!M(t==null?void 0:t.tableInfo))&&e.jsxs("div",{className:"mt-5 bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-lg shadow-md border border-blue-200",children:[e.jsx("h2",{className:"text-2xl font-bold mb-6 text-blue-900 border-b border-blue-200 pb-3",children:"Product Description"}),((t==null?void 0:t.details)||(t==null?void 0:t.specifiction))&&e.jsx("div",{className:"mb-6",children:e.jsx("div",{className:"rich-content-display prose prose-blue max-w-none",dangerouslySetInnerHTML:{__html:i(r?(t==null?void 0:t.details)||(t==null?void 0:t.specifiction)||"No description available.":m((t==null?void 0:t.details)||(t==null?void 0:t.specifiction)||""))}})}),r&&!M(t==null?void 0:t.tableInfo)&&e.jsxs("div",{className:"mb-6",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-blue-800",children:"Specifications"}),e.jsx("div",{className:"rich-content-display prose prose-blue max-w-none",dangerouslySetInnerHTML:{__html:i(t==null?void 0:t.tableInfo)}})]}),e.jsx("button",{onClick:()=>o(x=>!x),className:"mt-4 px-4 text-blue-600 hover:border-b-2 hover:border-blue-600 hover:text-blue-700 font-medium transition-colors duration-200",children:r?"Show Less":"Show More"})]})]}),e.jsx(me,{}),e.jsx(Ie,{})]}),e.jsx("style",{jsx:!0,children:`
        .rich-content-display {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #374151;
        }

        .rich-content-display ul {
          list-style-type: disc !important;
          list-style-position: inside !important;
          margin: 16px 0 !important;
          padding-left: 1em !important;
        }

        .rich-content-display ol {
          list-style-type: decimal !important;
          list-style-position: inside !important;
          margin: 16px 0 !important;
          padding-left: 1.5em !important;
        }

        .rich-content-display li {
          margin: 8px 0 !important;
          line-height: 1.6 !important;
          display: list-item !important;
        }

        .rich-content-display ul ul {
          list-style-type: circle !important;
          list-style-position: inside !important;
          margin: 8px 0 !important;
        }

        .rich-content-display ul ul ul {
          list-style-type: square !important;
          list-style-position: inside !important;
        }

        .rich-content-display ol ol {
          list-style-type: lower-alpha !important;
          list-style-position: inside !important;
        }

        .rich-content-display ol ol ol {
          list-style-type: lower-roman !important;
          list-style-position: inside !important;
        }

        .rich-content-display p {
          margin: 12px 0 !important;
          line-height: 1.6 !important;
        }

        .rich-content-display p:empty,
        .rich-content-display p:has(br:only-child) {
          display: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .rich-content-display h1,
        .rich-content-display h2,
        .rich-content-display h3,
        .rich-content-display h4,
        .rich-content-display h5,
        .rich-content-display h6 {
          margin-top: 24px !important;
          margin-bottom: 16px !important;
          line-height: 1.3 !important;
          color: #1e40af !important;
        }

        .rich-content-display h1 { font-size: 1.5rem !important; font-weight: 700 !important; }
        .rich-content-display h2 { font-size: 1.25rem !important; font-weight: 600 !important; }
        .rich-content-display h3 { font-size: 1.125rem !important; font-weight: 600 !important; }

        .rich-content-display strong,
        .rich-content-display b {
          font-weight: 700 !important;
          color: #1f2937 !important;
        }

        .rich-content-display em,
        .rich-content-display i {
          font-style: italic !important;
        }

        .rich-content-display table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 16px 0 !important;
          border: 1px solid #d1d5db !important;
        }

        .rich-content-display th,
        .rich-content-display td {
          border: 1px solid #d1d5db !important;
          padding: 12px !important;
          text-align: left !important;
        }

        .rich-content-display th {
          background-color: #f3f4f6 !important;
          font-weight: 600 !important;
        }

        .rich-content-display blockquote {
          border-left: 4px solid #3b82f6 !important;
          padding-left: 16px !important;
          margin: 16px 0 !important;
          font-style: italic !important;
          color: #4b5563 !important;
        }

        .rich-content-display div {
          margin: 8px 0 !important;
        }

        /* Ensure nested content displays properly */
        .rich-content-display > *:first-child {
          margin-top: 0 !important;
        }

        .rich-content-display > *:last-child {
          margin-bottom: 0 !important;
        }
      `})]})}function $e(){const n=ue(),{slug:a}=U(),[t,c]=s.useState([]),[l,d]=s.useState([]),[h,f]=s.useState([]),[p,v]=s.useState(!0),[u,N]=s.useState(!1);s.useEffect(()=>{(async()=>{try{v(!0);const[L,r]=await Promise.all([$.get("/api/petrochemProduct/getAllSlugs"),$.get("/api/chemicalCategory/getAllSubcategories")]);console.log("categoryResponse---",r.data);const o=L.data.slugs||[];if(c(o),N(o.includes(a)),console.log("product slugs---",o),r.data.success&&r.data.data){const m=r.data.data.map(T=>T.parentSlug),i=[...new Set(m)];d(i),console.log("category slugs---",i);const M=r.data.data.map(T=>T.subcategorySlug);f(M),console.log("subcategory slugs---",M)}}catch(L){console.error("Error fetching data:",L)}finally{v(!1)}})()},[a]);const b=n.pathname.split("/").filter(Boolean),y=b[0],j=b[1];console.log("baseCategory:",y),console.log("subCategorySlug:",j),console.log("categorySlugs includes baseCategory:",l.includes(y)),console.log("subcategorySlugs includes subCategorySlug:",h.includes(j));const S=l.includes(y)&&!j,I=l.includes(y)&&h.includes(j);return console.log("isBaseCategoryPath:",S),console.log("isSubCategoryPath:",I),s.useEffect(()=>{p?document.title="Loading...":S||I?document.title="Subcategory Products":u?document.title="Product Details":document.title="404"},[p,S,I,u]),p?e.jsx("div",{children:"Loading..."}):e.jsx("div",{children:S||I?e.jsx(ve,{}):u?e.jsx(Le,{}):e.jsx(ge,{})})}export{$e as default};
