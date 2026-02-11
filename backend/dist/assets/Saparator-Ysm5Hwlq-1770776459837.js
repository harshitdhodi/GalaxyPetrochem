import{r as s,j as e,L as B,h as V,K as G,b as q,cI as ee,cJ as te,B as Q,cK as se,G as ae,av as re,ax as ne,ay as le,az as ie,cr as oe,X as ce,l as W,u as de,cL as me,c as ue}from"./index-BclWhhaR-1770776459837.js";import{S as pe,a as ge}from"./404-0TdidfUP-1770776459837.js";import{_ as he}from"./extends-rM07bN2b-1770776459837.js";import{I as xe}from"./AntdIcon-HMmzeblx-1770776459837.js";var fe={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"defs",attrs:{},children:[{tag:"style",attrs:{}}]},{tag:"path",attrs:{d:"M713.5 599.9c-10.9-5.6-65.2-32.2-75.3-35.8-10.1-3.8-17.5-5.6-24.8 5.6-7.4 11.1-28.4 35.8-35 43.3-6.4 7.4-12.9 8.3-23.8 2.8-64.8-32.4-107.3-57.8-150-131.1-11.3-19.5 11.3-18.1 32.4-60.2 3.6-7.4 1.8-13.7-1-19.3-2.8-5.6-24.8-59.8-34-81.9-8.9-21.5-18.1-18.5-24.8-18.9-6.4-.4-13.7-.4-21.1-.4-7.4 0-19.3 2.8-29.4 13.7-10.1 11.1-38.6 37.8-38.6 92s39.5 106.7 44.9 114.1c5.6 7.4 77.7 118.6 188.4 166.5 70 30.2 97.4 32.8 132.4 27.6 21.3-3.2 65.2-26.6 74.3-52.5 9.1-25.8 9.1-47.9 6.4-52.5-2.7-4.9-10.1-7.7-21-13z"}},{tag:"path",attrs:{d:"M925.2 338.4c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 00-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 00-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 00112 714v152a46 46 0 0046 46h152.1A449.4 449.4 0 00510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 00142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z"}}]},name:"whats-app",theme:"outlined"},be=function(a,t){return s.createElement(xe,he({},a,{ref:t,icon:fe}))},ye=s.forwardRef(be);const K=r=>r?r.split(/[-\s]+/).map(a=>a.charAt(0).toUpperCase()+a.slice(1).toLowerCase()).join(" "):"";function je({chemicalName:r,subCategorySlug:a,categorySlug:t,categoryName:d,slug2:n,subcategoryName:m}){return e.jsx("nav",{className:"mb-6 mt-2 pb-3 z-0",children:e.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1",children:[e.jsxs("div",{className:"flex items-center text-sm text-white whitespace-nowrap",children:[e.jsx(B,{to:"/",className:"rounded-md",children:"Home"}),e.jsx("span",{className:"mx-2",children:"/"}),e.jsx(B,{to:"/products",className:"rounded-md",children:"Products"})]}),e.jsxs("div",{className:"flex items-center text-sm text-white mt-1 sm:mt-0 sm:ml-4 whitespace-nowrap",children:[e.jsx("span",{className:"mr-2",children:"/"}),e.jsx(B,{to:`/${t}`,className:"rounded-md",children:K(t)}),m&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"mx-2",children:"/"}),e.jsx(B,{to:`/${t}/${a||m}`,className:"rounded-md",children:K(m)})]})]})]})})})}const we="/assets/banner-B-GX8lQy-1770776459837.webp";function Ne(){const{slug:r,categorySlug:a}=V();console.log(r,a);const[t,d]=s.useState(null),[n,m]=s.useState([]),[p,b]=s.useState(!0),[u,v]=s.useState(!1),[f,S]=s.useState([]),[y,C]=s.useState(!0),w=location.pathname.replace(/^\//,"")||"introduction";s.useEffect(()=>{(async()=>{try{const g=await q.get(`/api/banner/getByPageSlug?pageSlug=${r}`);S(g.data||[])}catch(g){console.error("Failed to fetch banner:",g)}finally{C(!1)}})()},[w]),s.useEffect(()=>{(async()=>{try{const g=await q.get(`/api/chemicalCategory/getSpecificSubcategoryBySlug?slug=${r}`),{subCategory:h,products:c}=g.data;d(h),m(c)}catch(g){console.error("Error fetching category data:",g)}finally{b(!1)}})()},[r]),s.useEffect(()=>{if(t){document.title=t.metatitle||t.category||"Industrial Oils";const o=t.metadescription||P(t.details||"");j("description",o)}},[t]);const j=(o,g)=>{let h=document.querySelector(`meta[name="${o}"]`);h||(h=document.createElement("meta"),h.setAttribute("name",o),document.head.appendChild(h)),h.setAttribute("content",g)},P=o=>{const g=document.createElement("div");g.innerHTML=o;const h=g.textContent||g.innerText||"",c=Math.floor(h.length*.2);return h.substring(0,c)+"..."},k=(()=>{const o={};return n.forEach(g=>{var c;const h=((c=g.brandId)==null?void 0:c.name)||"Unknown Brand";o[h]||(o[h]=[]),o[h].push(g)}),o})();return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"relative",children:[f&&f.length>0?e.jsx(G,{imageUrl:`/api/image/download/${f[0].image}`,title:t==null?void 0:t.slug}):e.jsx(G,{imageUrl:we}),e.jsx("div",{className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-5 z-10",children:e.jsx(je,{subcategoryName:t==null?void 0:t.category,subCategorySlug:t==null?void 0:t.slug,categorySlug:a})})]}),e.jsxs("div",{className:"container mx-auto px-4 mt-5 pb-8 max-w-7xl",children:[e.jsx("div",{className:"text-gray-700 mb-4",children:(t==null?void 0:t.details)&&e.jsxs(e.Fragment,{children:[e.jsx("p",{dangerouslySetInnerHTML:{__html:u?t.details:P(t.details)}}),e.jsx("button",{onClick:()=>v(!u),className:"text-blue-600 underline mt-2 inline-block",children:u?"See Less":"See More"})]})}),p?e.jsx("p",{children:"Loading products..."}):Object.keys(k).length>0?e.jsx("div",{children:Object.keys(k).sort().map(o=>e.jsxs("div",{className:"mb-8",children:[e.jsx("h2",{className:"text-2xl font-bold text-[#0a3161] mb-4",children:o}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",children:k[o].map((g,h)=>e.jsx(pe,{product:g,categorySlug:t==null?void 0:t.categorySlug,subCategorySlug:t==null?void 0:t.slug},h))})]},o))}):e.jsx("p",{children:"No products found."})]})]})}function ve({images:r,selectedImage:a,setSelectedImage:t}){var d,n;return console.log(r),e.jsx("div",{className:"sm:w-[80%] md:w-[100%]  lg:mt-2",children:e.jsx("div",{className:"border items-center flex justify-center  overflow-hidden mb-4 lg:h-[400px] md:h-[300px] h-[200px]",children:e.jsx("img",{src:(d=r[a])!=null&&d.url?`${r[a].url}`:"https://via.placeholder.com/300x300?text=No+Image+Available",alt:((n=r[a])==null?void 0:n.alt)||"Chemical bottles with blue liquid",className:"w-full h-full object-contain"})})})}function Se({tagline:r,productDetails:a,name:t,price:d,categorySlug:n}){const[m,p]=s.useState(!1),{extractedPContent:b,previewContent:u,remainingContent:v}=s.useMemo(()=>{const f=document.createElement("div");f.innerHTML=a;const S=f.querySelector("p");let y="";S&&(y=S.innerHTML,S.remove());const C=f.innerHTML,w=1e4;return{extractedPContent:y,previewContent:C.slice(0,w),remainingContent:C.slice(w)}},[a]);return e.jsxs("div",{className:"mb-8",children:[e.jsx("p",{className:"text-2xl pb-2 font-bold text-[#2e60d7]",children:t}),b&&e.jsx("p",{className:"extracted-paragraph text-md text-gray-900",dangerouslySetInnerHTML:{__html:b}}),e.jsx("div",{className:"custom-product-details overflow-x-auto w-full text-gray-800",dangerouslySetInnerHTML:{__html:m?u+v:u}}),v&&e.jsx("button",{onClick:()=>p(f=>!f),className:"text-blue-600 mt-2 font-semibold border-blue-600 border-b focus:outline-none",children:m?"See Less":"See More"}),e.jsx("style",{jsx:!0,global:!0,children:`
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
      `})]})}function Ce({msds:r,pdf:a,name:t,onInquiry:d}){const{data:n,isLoading:m}=ee(),{data:p,isLoading:b}=te(),[u,v]=s.useState(""),[f,S]=s.useState("");s.useEffect(()=>{n&&n.length>0&&(v(n[0].number),S(`Hi, I'm interested in ${t}`))},[n,t]);const y=()=>{const C=`https://wa.me/${u}?text=${encodeURIComponent(f)}`;window.open(C,"_blank")};return m||b?e.jsx("div",{children:"Loading..."}):e.jsxs("div",{className:" bg-gradient-to-r from-blue-50 to-blue-100 p-5 shadow-md",children:[e.jsxs("h2",{className:"text-xl font-semibold mb-6 text-blue-900 border-b border-blue-200 pb-3",children:[t," MSDS (Material Safety Data Sheet) or SDS, COA and Specs"]}),e.jsxs("div",{className:"flex flex-wrap gap-4 mb-3",children:[a&&e.jsx(Q,{onClick:()=>window.open(`/api/image/view/${a}`,"_blank"),className:"w-full md:w-1/4 bg-[#e85920] hover:bg-[#e85920] transition-colors duration-300 text-white text-md py-2",children:"Data Sheet"}),e.jsx(Q,{onClick:()=>window.open(`/api/image/view/${r}`,"_blank"),className:"w-full md:w-1/4 bg-[#e95821] hover:bg-[#e85920] transition-colors duration-300 text-white text-md py-5 flex items-center gap-2",children:"MSDS"}),e.jsx(Q,{onClick:d,className:"w-full md:w-1/4 bg-[#e85920] hover:bg-[#e95821] transition-colors duration-300 text-white text-md py-5 flex items-center gap-2",children:"Inquiry Now"}),e.jsxs("div",{className:"flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity",onClick:y,children:[e.jsx(ye,{className:"text-4xl text-green-500"})," "]})]})]})}function Pe({productName:r,onClose:a}){const[t,d]=s.useState(""),[n,m]=s.useState(""),[p,b]=s.useState(""),[u,v]=s.useState(""),[f,S]=s.useState(""),[y,C]=s.useState(null),[w,j]=s.useState(!1),[P,I]=s.useState(""),[k,o]=s.useState(!1),[g]=se(),h=async c=>{var A;if(c.preventDefault(),!y){I("Please complete the reCAPTCHA.");return}j(!0),I("");try{await g({name:t,email:n,phone:p,subject:u,message:f,productName:r,captchaToken:y}).unwrap(),o(!0),j(!1),d(""),m(""),b(""),v(""),S(""),C(null),a()}catch(T){I(((A=T.data)==null?void 0:A.message)||"Failed to submit inquiry. Please try again."),j(!1)}};return e.jsxs("div",{className:"fixed inset-0 top-[16%] flex items-center justify-center bg-black bg-opacity-50 p-4",children:[e.jsxs("div",{className:"bg-white p-6 rounded-md shadow-2xl w-full max-w-2xl",children:[e.jsx("h2",{className:"text-xl font-bold mb-6 text-gray-800 border-b pb-4",children:`Inquiry for ${r}`}),e.jsxs("form",{onSubmit:h,className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 text-sm font-semibold mb-2",children:"Name"}),e.jsx("input",{type:"text",value:t,onChange:c=>d(c.target.value),className:"w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 text-sm font-semibold mb-2",children:"Email"}),e.jsx("input",{type:"email",value:n,onChange:c=>m(c.target.value),className:"w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 text-sm font-semibold mb-2",children:"Phone No"}),e.jsx("input",{type:"text",value:p,maxLength:10,onChange:c=>b(c.target.value),className:"w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 text-sm font-semibold mb-2",children:"Subject"}),e.jsx("input",{type:"text",value:u,onChange:c=>v(c.target.value),className:"w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200",required:!0})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 text-sm font-semibold mb-2",children:"Message"}),e.jsx("textarea",{value:f,onChange:c=>S(c.target.value),className:"w-full border border-gray-300 p-2 rounded-lg transition duration-200 h-24",required:!0})]}),e.jsxs("div",{className:"flex flex-col  space-y-4",children:[e.jsx(ae,{sitekey:"6Lcs4YQrAAAAACTgdRmnJMQirPeDUcL5pfPyWAiy",onChange:c=>C(c),className:"w-full max-w-xs"}),P&&e.jsx("p",{className:"text-red-500 text-sm",children:P})]}),e.jsxs("div",{className:"flex justify-end space-x-4",children:[e.jsx("button",{type:"button",className:"bg-gray-500 hover:bg-gray-600 w-1/3 md:w-1/4 text-white px-4 py-2 rounded-md transition duration-200",onClick:a,disabled:w,children:"Cancel"}),e.jsx("button",{type:"submit",className:"bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 w-1/3 md:w-1/4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed",disabled:!y||w,children:w?"Submitting...":"Submit"})]})]})]}),e.jsx(re,{open:k,onOpenChange:o,children:e.jsxs(ne,{className:"bg-white max-w-md p-6",children:[e.jsxs(le,{children:[e.jsx(ie,{className:"text-green-700 text-xl font-bold",children:"Thank You!"}),e.jsx(oe,{className:"absolute right-4 top-4 text-gray-700",children:e.jsx(ce,{size:20})})]}),e.jsxs("div",{className:"text-gray-800 mt-2",children:[e.jsx("p",{className:"mb-2",children:"Your message has been successfully sent."}),e.jsx("p",{children:"We will get back to you soon."})]})]})})]})}const Le=()=>{const[r,a]=s.useState([]),{categorySlug:t,slug:d}=V();return s.useEffect(()=>{(async()=>{var m;try{const p=await q.get(`/api/petrochemProduct/getRecentProductsByCategorySlug?slug=${d}`);a(((m=p.data)==null?void 0:m.slice(0,6))||[])}catch(p){console.error("Error fetching recent products:",p)}})()},[d]),e.jsxs("div",{className:"container mx-auto  py-5",children:[e.jsxs("div",{className:"mb-5",children:[e.jsx("h2",{className:"text-2xl lg:text-3xl font-bold mb-2 text-blue-900",children:"Recent Products"}),e.jsx("div",{className:"w-24 h-1 bg-blue-800"})]}),r.length>0?e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10",children:r.map(n=>{var m,p,b,u;return e.jsx(B,{to:`/${t}/${n.slug}`,className:"group bg-white hover:shadow-blue-100 shadow-blue-200 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transform transition-transform duration-300 hover:-translate-y-2",children:e.jsxs("div",{className:"flex flex-col h-full",children:[e.jsx("div",{className:"relative bg-white h-56 flex items-center justify-center",children:e.jsx("img",{src:(p=(m=n.images)==null?void 0:m[0])!=null&&p.url?`/api/image/download/${n.images[0].url}`:"/placeholder.jpg",alt:((u=(b=n.images)==null?void 0:b[0])==null?void 0:u.altText)||n.name,className:"max-h-48 w-auto object-contain transition-transform duration-300 group-hover:scale-105"})}),e.jsxs("div",{className:"p-4 bg-gradient-to-br from-blue-50 to-blue-100 flex-1 flex flex-col justify-between",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold text-blue-900 mb-1",children:n.name}),e.jsxs("p",{className:"text-sm text-blue-700 font-medium",children:["Category: ",n.categoryId.category]}),e.jsxs("p",{className:"text-sm text-gray-600 font-medium mb-2",children:["Brand: ",n.brandId.name]})]}),n.table&&e.jsx("div",{className:"text-sm text-gray-700 space-y-1 mt-2",dangerouslySetInnerHTML:{__html:n.table.replace(/border:\s?1px\s?solid[^;]+;/g,"").replace(/<table[^>]*>/g,"<div class='space-y-1'>").replace(/<\/table>/g,"</div>").replace(/<tbody>|<\/tbody>/g,"").replace(/<tr>/g,"<div class='flex space-x-2'>").replace(/<\/tr>/g,"</div>").replace(/<td[^>]*>(.*?)<\/td>\s*<td[^>]*>(.*?)<\/td>/g,"<span class='font-semibold text-blue-800'>$1:</span><span class='text-gray-800'>$2</span>").split("</div>").slice(0,2).join("</div>")}})]})]})},n._id)})}):e.jsx("p",{className:"text-center text-gray-500",children:"No recent products found."})]})},O=r=>r.split("-").map(a=>a.charAt(0).toUpperCase()+a.slice(1)).join(" ");function Z({subCategorySlug:r,chemicals:a="",slug:t="",categorySlug:d=""}){return e.jsx("nav",{className:"mb-5 w-full pb-3 ",children:e.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:e.jsxs("div",{className:"flex flex-col gap-1 text-sm text-[#fff] sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:whitespace-nowrap sm:overflow-x-auto",children:[e.jsxs("div",{className:"flex items-center text-sm text-[#fff] whitespace-nowrap",children:[e.jsx(B,{to:"/",className:"hover:text-[#fff]",children:"Home"}),e.jsx("span",{className:"mx-2",children:"/"}),e.jsx(B,{to:"/products",className:"hover:text-[#fff]",children:"Products"})]}),e.jsxs("div",{className:"flex flex-wrap sm:flex-nowrap items-center text-sm text-[#fff] whitespace-normal sm:whitespace-nowrap sm:overflow-visible",children:[e.jsx("span",{className:"mr-2",children:"/"}),a?e.jsx(B,{to:`/${t}`,className:"hover:text-[#fff]",children:O(a)}):null,d&&!a&&e.jsx(B,{to:`/${d}`,className:"hover:text-[#fff]",children:O(d)}),r&&e.jsxs(e.Fragment,{children:[a||d?e.jsx("span",{className:"mx-2",children:"/"}):null,e.jsx(B,{to:`/${t}/${r}`,className:"hover:text-[#fff]",children:O(r)})]}),d&&a&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"mx-2 mt-2 sm:mt-0",children:"/"}),e.jsx("span",{children:O(d)})]})]})]})})})}Z.propTypes={chemicals:W.string.isRequired,categorySlug:W.string.isRequired,subCategorySlug:W.string,slug:W.string};function Ie(){var H,E;const[r,a]=s.useState(0),[t,d]=s.useState(null),[n,m]=s.useState(!0),[p,b]=s.useState(!1),[u,v]=s.useState(!1),[f,S]=s.useState({}),{slug:y,categorySlug:C}=V(),w=de(),[j,P]=s.useState([]),[I,k]=s.useState(!0),[o,g]=s.useState(!1),h=(x,l=.5)=>{if(!x||typeof x!="string")return"No description available.";const i=document.createElement("div");i.innerHTML=x;const Y=(i.textContent||i.innerText||"").trim().split(/\s+/).filter(N=>N.length>0),_=Math.floor(Y.length*l);if(Y.length<=50||Y.length<=_)return x;let U=0,F=!1;function X(N){if(F)return null;if(N.nodeType===Node.TEXT_NODE){const M=N.textContent.trim().split(/\s+/).filter(L=>L.length>0);if(U+M.length<=_)return U+=M.length,N.cloneNode(!0);{const L=_-U;if(L>0){const z=M.slice(0,L).join(" ")+"...",D=document.createTextNode(z);return U=_,F=!0,D}return F=!0,null}}else if(N.nodeType===Node.ELEMENT_NODE){const M=document.createElement(N.tagName);for(let L=0;L<N.attributes.length;L++)M.setAttribute(N.attributes[L].name,N.attributes[L].value);for(let L=0;L<N.childNodes.length&&!F;L++){const z=X(N.childNodes[L]);z&&M.appendChild(z)}return M.childNodes.length>0?M:null}return null}const J=document.createElement("div");for(let N=0;N<i.childNodes.length&&!F;N++){const M=X(i.childNodes[N]);M&&J.appendChild(M)}return J.innerHTML},c=x=>x?x.replace(/<p(?:\s[^>]*)?>\s*<\/p>/gi,"").replace(/<ul(?![^>]*class)/g,'<ul class="list-disc pl-6 space-y-2 my-4"').replace(/<ol(?![^>]*class)/g,'<ol class="list-decimal pl-6 space-y-2 my-4"').replace(/<li(?![^>]*class)/g,'<li class="leading-relaxed"').replace(/<p(?![^>]*class)/g,'<p class="mb-4 leading-relaxed"').replace(/<h1(?![^>]*class)/g,'<h1 class="text-2xl font-bold mb-4 mt-6"').replace(/<h2(?![^>]*class)/g,'<h2 class="text-xl font-bold mb-3 mt-5"').replace(/<h3(?![^>]*class)/g,'<h3 class="text-lg font-bold mb-3 mt-4"').replace(/<h4(?![^>]*class)/g,'<h4 class="text-base font-bold mb-2 mt-3"').replace(/<table(?![^>]*class)/g,'<table class="w-full border-collapse border border-gray-300 my-4"').replace(/<th(?![^>]*class)/g,'<th class="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left"').replace(/<td(?![^>]*class)/g,'<td class="border border-gray-300 px-4 py-2"').replace(/<strong>/g,'<strong class="font-bold">').replace(/<em>/g,'<em class="italic">').replace(/<ul class="[^"]*">\s*<ul/g,'<ul class="list-circle pl-4 mt-2"><ul').replace(/<ol class="[^"]*">\s*<ol/g,'<ol class="list-lower-alpha pl-4 mt-2"><ol'):"No content available.",A=x=>x?x.replace(/<[^>]+>/g,"").trim().length===0:!0;s.useEffect(()=>{(async()=>{try{const l=await q.get("/api/banner/getByPageSlug?pageSlug=hydraulic-oils");console.log(l.data),P(l.data||[])}catch(l){console.error("Failed to fetch banner:",l)}finally{k(!1)}})()},[]),s.useEffect(()=>{y&&(async()=>{try{m(!0),b(!1);const l=await fetch(`/api/petrochemProduct/getbySlug?slug=${y}`),i=await l.json();if(console.log(i),!l.ok)throw new Error("Failed to fetch product data");if(!i||i.length===0){w("/404",{replace:!0});return}d(i[0])}catch(l){console.error("Error fetching product data:",l),b(!0)}finally{m(!1)}})()},[y,w]);const T="https://via.placeholder.com/300x300?text=No+Image+Available",R=s.useMemo(()=>{var x;return(x=t==null?void 0:t.images)!=null&&x.length?t.images.map((l,i)=>({url:f[i]?T:`/api/image/download/${l.url}`,originalUrl:l.url,alt:l.alt||`Product Image ${i+1}`,title:l.title||"Product Image"})):[{url:T,alt:"No Image Available",title:"No Image"}]},[t==null?void 0:t.images,f]),$=x=>{S(l=>({...l,[x]:!0}))};return p?e.jsxs("div",{className:"flex flex-col items-center justify-center min-h-screen",children:[e.jsx("p",{className:"text-red-600 font-semibold",children:"Error fetching product data."}),e.jsx(Q,{onClick:()=>window.location.reload(),className:"mt-4",children:"Retry"})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"relative",children:[j&&j.length>0?e.jsx(G,{imageUrl:`/api/image/download/${j[0].image}`,title:t==null?void 0:t.name}):e.jsx("div",{className:"h-[30vh] flex items-center justify-center bg-gray-200",children:e.jsx("p",{className:"text-gray-500",children:"Banner not found"})}),e.jsx("div",{className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-5 z-10",children:e.jsx(Z,{chemicals:(H=t==null?void 0:t.categoryId)==null?void 0:H.category,slug:(E=t==null?void 0:t.categoryId)==null?void 0:E.slug,categorySlug:t==null?void 0:t.name,subCategorySlug:C})})]}),e.jsxs("div",{className:"max-w-7xl mx-auto mb-10 px-4 py-2 relative",children:[u&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center",children:e.jsx(Pe,{productName:t==null?void 0:t.name,onClose:()=>v(!1)})}),n?e.jsx("div",{className:"flex justify-center items-center h-screen",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"})}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"lg:flex gap-12 mt-5",children:[e.jsx("div",{className:"w-full lg:w-1/2 flex flex-col items-center justify-start",children:e.jsx(ve,{images:R,selectedImage:r,setSelectedImage:a,onError:$})}),e.jsxs("div",{className:"w-full ",children:[e.jsx(Se,{productDetails:t==null?void 0:t.details,name:t==null?void 0:t.name,price:t==null?void 0:t.price,categorySlug:t==null?void 0:t.categorySlug,tagline:t==null?void 0:t.tagline}),e.jsx(Ce,{msds:t==null?void 0:t.msds,pdf:t==null?void 0:t.pdf,name:t==null?void 0:t.name,onInquiry:()=>v(!0)})]})]}),(!A(t==null?void 0:t.details)||!A(t==null?void 0:t.specifiction)||!A(t==null?void 0:t.tableInfo))&&e.jsxs("div",{className:"mt-5 bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-lg shadow-md border border-blue-200",children:[e.jsx("h2",{className:"text-2xl font-bold mb-6 text-blue-900 border-b border-blue-200 pb-3",children:"Product Description"}),((t==null?void 0:t.details)||(t==null?void 0:t.specifiction))&&e.jsx("div",{className:"mb-6",children:e.jsx("div",{className:"rich-content-display prose prose-blue max-w-none",dangerouslySetInnerHTML:{__html:c(o?(t==null?void 0:t.details)||(t==null?void 0:t.specifiction)||"No description available.":h((t==null?void 0:t.details)||(t==null?void 0:t.specifiction)||""))}})}),o&&!A(t==null?void 0:t.tableInfo)&&e.jsxs("div",{className:"mb-6",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-blue-800",children:"Specifications"}),e.jsx("div",{className:"rich-content-display prose prose-blue max-w-none",dangerouslySetInnerHTML:{__html:c(t==null?void 0:t.tableInfo)}})]}),e.jsx("button",{onClick:()=>g(x=>!x),className:"mt-4 px-4 text-blue-600 hover:border-b-2 hover:border-blue-600 hover:text-blue-700 font-medium transition-colors duration-200",children:o?"Show Less":"Show More"})]})]}),e.jsx(me,{}),e.jsx(Le,{})]}),e.jsx("style",{jsx:!0,children:`
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
      `})]})}function Te(){var k,o;const r=ue(),{slug:a}=V(),[t,d]=s.useState([]),[n,m]=s.useState([]),[p,b]=s.useState([]),[u,v]=s.useState(!0),[f,S]=s.useState(null);s.useEffect(()=>{(async()=>{var h,c,A,T,R;v(!0),S(null);try{const[$,H,E]=await Promise.all([q.get("/api/petrochemProduct/getAllSlugs"),q.get("/api/chemicalCategory/getAllSubcategories"),q.get("/api/chemicalCategory/getAllCategories")]);console.log("Fetched Data:",{products:$.data,subcategories:H.data,categories:E.data});const x=($.data.slugs||[]).map(l=>l.trim().toLowerCase());if(console.log("Valid Product Slugs:",x),d(x),(h=H.data)!=null&&h.success&&Array.isArray((c=H.data)==null?void 0:c.data)){const l=H.data.data.filter(i=>i.subcategorySlug).map(i=>i.subcategorySlug.trim().toLowerCase());console.log("Subcategory Slugs:",l),m(l)}if((A=E.data)!=null&&A.success&&Array.isArray((T=E.data)==null?void 0:T.data)){const l=E.data.data.filter(i=>i.categorySlug).map(i=>i.categorySlug.trim().toLowerCase());console.log("Supported Base Categories:",l),b(l)}else if(Array.isArray((R=E.data)==null?void 0:R.categories)){const l=E.data.categories.filter(i=>i.slug).map(i=>i.slug.trim().toLowerCase());console.log("Supported Base Categories (alt):",l),b(l)}else if(Array.isArray(E.data)){const l=E.data.filter(i=>i.categorySlug||i.slug).map(i=>(i.categorySlug||i.slug).trim().toLowerCase());console.log("Supported Base Categories (direct array):",l),b(l)}}catch($){console.error("Error fetching dynamic data:",$),S($.message)}finally{v(!1)}})()},[]);const y=r.pathname.split("/").filter(Boolean),C=(k=y[0])==null?void 0:k.toLowerCase(),w=(o=y[1])==null?void 0:o.toLowerCase();s.useEffect(()=>{u||console.log("Path Analysis:",{pathname:r.pathname,pathSegments:y,baseCategory:C,subCategorySlugFromUrl:w,slug:a,supportedBaseCategories:p,subcategorySlugs:n,validProductSlugs:t})},[r.pathname,u,p,n,t]);const j=p.length>0&&p.includes(C)&&!w&&!a;console.log("isBaseCategoryPath:",j);const P=p.length>0&&n.length>0&&p.includes(C)&&w&&n.includes(w);console.log("isSubCategoryPath:",P);const I=t.length>0&&a&&t.includes(a.toLowerCase())&&y.length===1;return s.useEffect(()=>{u||console.log("Route Matching:",{isBaseCategoryPath:j,isSubCategoryPath:P,isProductDetailPage:I,willRender:j||P?"SubCategoryProductList":I?"ProductDetailPage":"404"})},[j,P,I,u]),s.useEffect(()=>{u?document.title="Loading...":j||P?document.title="Subcategory Products":I?document.title="Product Details":document.title="404 – Page Not Found"},[u,j,P,I]),u?e.jsx("div",{className:"min-h-screen flex items-center justify-center",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"}),e.jsx("p",{className:"text-lg text-gray-600",children:"Loading content..."})]})}):f?e.jsx("div",{className:"min-h-screen flex items-center justify-center",children:e.jsxs("div",{className:"text-center text-red-600",children:[e.jsx("p",{className:"text-lg",children:"Error loading page data"}),e.jsx("p",{className:"text-sm mt-2",children:f})]})}):j||P?e.jsx(Ne,{}):I?e.jsx(Ie,{}):e.jsx(ge,{})}export{Te as default};
