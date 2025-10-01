import{r as s,j as e,L as M,h as F,K as W,b as H,cD as se,cE as le,B as R,cF as ae,G as ne,av as re,ax as ie,ay as oe,az as ce,cm as de,X as me,l as _,u as ue,cG as he,c as ge}from"./index-BvAahcPH-1759289662115.js";import{S as xe,a as pe}from"./404-BxCLwkzY-1759289662115.js";import{_ as fe}from"./extends-rM07bN2b-1759289662115.js";import{I as be}from"./AntdIcon-QRVyLUE0-1759289662115.js";var ye={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"defs",attrs:{},children:[{tag:"style",attrs:{}}]},{tag:"path",attrs:{d:"M713.5 599.9c-10.9-5.6-65.2-32.2-75.3-35.8-10.1-3.8-17.5-5.6-24.8 5.6-7.4 11.1-28.4 35.8-35 43.3-6.4 7.4-12.9 8.3-23.8 2.8-64.8-32.4-107.3-57.8-150-131.1-11.3-19.5 11.3-18.1 32.4-60.2 3.6-7.4 1.8-13.7-1-19.3-2.8-5.6-24.8-59.8-34-81.9-8.9-21.5-18.1-18.5-24.8-18.9-6.4-.4-13.7-.4-21.1-.4-7.4 0-19.3 2.8-29.4 13.7-10.1 11.1-38.6 37.8-38.6 92s39.5 106.7 44.9 114.1c5.6 7.4 77.7 118.6 188.4 166.5 70 30.2 97.4 32.8 132.4 27.6 21.3-3.2 65.2-26.6 74.3-52.5 9.1-25.8 9.1-47.9 6.4-52.5-2.7-4.9-10.1-7.7-21-13z"}},{tag:"path",attrs:{d:"M925.2 338.4c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 00-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 00-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 00112 714v152a46 46 0 0046 46h152.1A449.4 449.4 0 00510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 00142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z"}}]},name:"whats-app",theme:"outlined"},je=function(l,t){return s.createElement(be,fe({},l,{ref:t,icon:ye}))},we=s.forwardRef(je);const Z=a=>a?a.split(/[-\s]+/).map(l=>l.charAt(0).toUpperCase()+l.slice(1).toLowerCase()).join(" "):"";function Ne({chemicalName:a,subCategorySlug:l,categorySlug:t,categoryName:d,slug2:n,subcategoryName:o}){return console.log(l),e.jsx("nav",{className:"mb-6 md:mx-5 mt-2 lg:mx-5  xl:ml-0 pb-3 z-0",children:e.jsxs("ol",{className:"list-none inline-flex",children:[e.jsxs("li",{className:"flex items-center",children:[e.jsx(M,{to:"/",className:"text-[12px]   rounded-md sm:text-[15px] text-white",children:"Home"}),e.jsx("span",{className:"mx-2 text-white",children:"/"})]}),e.jsxs("li",{className:"flex items-center",children:[e.jsx(M,{to:"/products",className:"text-[12px] sm:text-[15px] text-white   rounded-md",children:"Products"}),e.jsx("span",{className:"mx-2 text-white",children:"/"})]}),e.jsx("li",{className:"flex items-center",children:e.jsx("span",{className:"text-[12px] sm:text-[15px]",children:e.jsx(M,{to:`/${t}`,className:"text-white   rounded-md",children:Z(t)})})}),o&&e.jsxs("li",{className:"flex items-center",children:[e.jsx("span",{className:"mx-2 text-white",children:"/"}),e.jsx("span",{className:"text-[15px] text-white   rounded-md",children:Z(o)})]})]})})}const ve="/assets/banner-B-GX8lQy-1759289662115.webp";function Se(){const{slug:a,categorySlug:l}=F();console.log(a,l);const[t,d]=s.useState(null),[n,o]=s.useState([]),[c,x]=s.useState(!0),[p,v]=s.useState(!1),[u,f]=s.useState([]),[y,b]=s.useState(!0),N=location.pathname.replace(/^\//,"")||"introduction";s.useEffect(()=>{(async()=>{try{const m=await H.get(`/api/banner/getByPageSlug?pageSlug=${a}`);f(m.data||[])}catch(m){console.error("Failed to fetch banner:",m)}finally{b(!1)}})()},[N]),s.useEffect(()=>{(async()=>{try{const m=await H.get(`/api/chemicalCategory/getSpecificSubcategoryBySlug?slug=${a}`),{subCategory:h,products:i}=m.data;d(h),o(i)}catch(m){console.error("Error fetching category data:",m)}finally{x(!1)}})()},[a]),s.useEffect(()=>{if(t){document.title=t.metatitle||t.category||"Industrial Oils";const r=t.metadescription||L(t.details||"");P("description",r)}},[t]);const P=(r,m)=>{let h=document.querySelector(`meta[name="${r}"]`);h||(h=document.createElement("meta"),h.setAttribute("name",r),document.head.appendChild(h)),h.setAttribute("content",m)},L=r=>{const m=document.createElement("div");m.innerHTML=r;const h=m.textContent||m.innerText||"",i=Math.floor(h.length*.2);return h.substring(0,i)+"..."},k=(()=>{const r={};return n.forEach(m=>{var i;const h=((i=m.brandId)==null?void 0:i.name)||"Unknown Brand";r[h]||(r[h]=[]),r[h].push(m)}),r})();return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"relative",children:[u&&u.length>0?e.jsx(W,{imageUrl:`/api/image/download/${u[0].image}`,title:t==null?void 0:t.slug}):e.jsx(W,{imageUrl:ve}),e.jsx("div",{className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-5 z-10",children:e.jsx(Ne,{subcategoryName:t==null?void 0:t.category,subCategorySlug:t==null?void 0:t.slug,categorySlug:l})})]}),e.jsxs("div",{className:"container mx-auto px-4 mt-5 pb-8 max-w-7xl",children:[e.jsx("div",{className:"text-gray-700 mb-4",children:(t==null?void 0:t.details)&&e.jsxs(e.Fragment,{children:[e.jsx("p",{dangerouslySetInnerHTML:{__html:p?t.details:L(t.details)}}),e.jsx("button",{onClick:()=>v(!p),className:"text-blue-600 underline mt-2 inline-block",children:p?"See Less":"See More"})]})}),c?e.jsx("p",{children:"Loading products..."}):Object.keys(k).length>0?e.jsx("div",{children:Object.keys(k).sort().map(r=>e.jsxs("div",{className:"mb-8",children:[e.jsx("h2",{className:"text-2xl font-bold text-[#0a3161] mb-4",children:r}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",children:k[r].map((m,h)=>e.jsx(xe,{product:m,categorySlug:t==null?void 0:t.categorySlug,subCategorySlug:t==null?void 0:t.slug},h))})]},r))}):e.jsx("p",{children:"No products found."})]})]})}function Ce({images:a,selectedImage:l,setSelectedImage:t}){var d,n;return console.log(a),e.jsx("div",{className:"sm:w-[80%] md:w-[100%]  lg:mt-2",children:e.jsx("div",{className:"border items-center flex justify-center  overflow-hidden mb-4 lg:h-[400px] md:h-[300px] h-[200px]",children:e.jsx("img",{src:(d=a[l])!=null&&d.url?`${a[l].url}`:"https://via.placeholder.com/300x300?text=No+Image+Available",alt:((n=a[l])==null?void 0:n.alt)||"Chemical bottles with blue liquid",className:"w-full h-full object-contain"})})})}function Pe({tagline:a,productDetails:l,name:t,price:d,categorySlug:n}){const[o,c]=s.useState(!1),{extractedPContent:x,previewContent:p,remainingContent:v}=s.useMemo(()=>{const u=document.createElement("div");u.innerHTML=l;const f=u.querySelector("p");let y="";f&&(y=f.innerHTML,f.remove());const b=u.innerHTML,N=1e4;return{extractedPContent:y,previewContent:b.slice(0,N),remainingContent:b.slice(N)}},[l]);return e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"text-2xl pb-2 font-bold text-[#2e60d7]",children:t}),x&&e.jsx("p",{className:"extracted-paragraph text-md text-gray-900",dangerouslySetInnerHTML:{__html:x}}),e.jsx("div",{className:"custom-product-details overflow-x-auto w-full text-gray-800",dangerouslySetInnerHTML:{__html:o?p+v:p}}),v&&e.jsx("button",{onClick:()=>c(u=>!u),className:"text-blue-600 mt-2 font-semibold border-blue-600 border-b focus:outline-none",children:o?"See Less":"See More"}),e.jsx("style",{jsx:!0,global:!0,children:`
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
      `})]})}function Ie({msds:a,specs:l,name:t,onInquiry:d}){const{data:n,isLoading:o}=se(),{data:c,isLoading:x}=le(),[p,v]=s.useState(""),[u,f]=s.useState("");s.useEffect(()=>{n&&n.length>0&&(v(n[0].number),f(`Hi, I'm interested in ${t}`))},[n,t]);const y=()=>{const b=`https://wa.me/${p}?text=${encodeURIComponent(u)}`;window.open(b,"_blank")};return o||x?e.jsx("div",{children:"Loading..."}):e.jsxs("div",{className:" bg-gradient-to-r from-blue-50 to-blue-100 p-5 shadow-md",children:[e.jsxs("h2",{className:"text-xl font-semibold mb-6 text-blue-900 border-b border-blue-200 pb-3",children:[t," MSDS (Material Safety Data Sheet) or SDS, COA and Specs"]}),e.jsxs("div",{className:"flex flex-wrap gap-4 mb-3",children:[c&&c.length>0?c.map(b=>e.jsx("div",{className:"w-full md:w-1/3 lg:w-1/4",children:e.jsx(R,{onClick:()=>window.open(`/api/image/view/${l}`,"_blank"),className:"w-full bg-[#e85920] hover:bg-[#e85920] transition-colors duration-300 text-white text-md py-2",children:"Catalogue"})},b._id)):e.jsx("div",{children:"No catalogues available for download."}),e.jsx(R,{onClick:()=>window.open(`/api/image/view/${a}`,"_blank"),className:"w-full md:w-1/4 bg-[#e95821] hover:bg-[#e85920] transition-colors duration-300 text-white text-md py-5 flex items-center gap-2",children:"MSDS"}),e.jsx(R,{onClick:d,className:"w-full md:w-1/4 bg-[#e85920] hover:bg-[#e95821] transition-colors duration-300 text-white text-md py-5 flex items-center gap-2",children:"Inquiry Now"}),e.jsxs("div",{className:"flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity",onClick:y,children:[e.jsx(we,{className:"text-4xl text-green-500"})," "]})]})]})}function Le({productName:a,onClose:l}){const[t,d]=s.useState(""),[n,o]=s.useState(""),[c,x]=s.useState(""),[p,v]=s.useState(""),[u,f]=s.useState(""),[y,b]=s.useState(null),[N,P]=s.useState(!1),[L,E]=s.useState(""),[k,r]=s.useState(!1),[m]=ae(),h=async i=>{var T;if(i.preventDefault(),!y){E("Please complete the reCAPTCHA.");return}P(!0),E("");try{await m({name:t,email:n,phone:c,subject:p,message:u,productName:a,captchaToken:y}).unwrap(),r(!0),P(!1),d(""),o(""),x(""),v(""),f(""),b(null),l()}catch(A){E(((T=A.data)==null?void 0:T.message)||"Failed to submit inquiry. Please try again."),P(!1)}};return e.jsxs("div",{className:"fixed inset-0 top-[16%] flex items-center justify-center bg-black bg-opacity-50 p-4",children:[e.jsxs("div",{className:"bg-white p-6 rounded-md shadow-2xl w-full max-w-2xl",children:[e.jsx("h2",{className:"text-xl font-bold mb-6 text-gray-800 border-b pb-4",children:`Inquiry for ${a}`}),e.jsxs("form",{onSubmit:h,className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 text-sm font-semibold mb-2",children:"Name"}),e.jsx("input",{type:"text",value:t,onChange:i=>d(i.target.value),className:"w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 text-sm font-semibold mb-2",children:"Email"}),e.jsx("input",{type:"email",value:n,onChange:i=>o(i.target.value),className:"w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 text-sm font-semibold mb-2",children:"Phone No"}),e.jsx("input",{type:"text",value:c,maxLength:10,onChange:i=>x(i.target.value),className:"w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 text-sm font-semibold mb-2",children:"Subject"}),e.jsx("input",{type:"text",value:p,onChange:i=>v(i.target.value),className:"w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200",required:!0})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 text-sm font-semibold mb-2",children:"Message"}),e.jsx("textarea",{value:u,onChange:i=>f(i.target.value),className:"w-full border border-gray-300 p-2 rounded-lg transition duration-200 h-24",required:!0})]}),e.jsxs("div",{className:"flex flex-col  space-y-4",children:[e.jsx(ne,{sitekey:"6Lcs4YQrAAAAACTgdRmnJMQirPeDUcL5pfPyWAiy",onChange:i=>b(i),className:"w-full max-w-xs"}),L&&e.jsx("p",{className:"text-red-500 text-sm",children:L})]}),e.jsxs("div",{className:"flex justify-end space-x-4",children:[e.jsx("button",{type:"button",className:"bg-gray-500 hover:bg-gray-600 w-1/3 md:w-1/4 text-white px-4 py-2 rounded-md transition duration-200",onClick:l,disabled:N,children:"Cancel"}),e.jsx("button",{type:"submit",className:"bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 w-1/3 md:w-1/4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed",disabled:!y||N,children:N?"Submitting...":"Submit"})]})]})]}),e.jsx(re,{open:k,onOpenChange:r,children:e.jsxs(ie,{className:"bg-white max-w-md p-6",children:[e.jsxs(oe,{children:[e.jsx(ce,{className:"text-green-700 text-xl font-bold",children:"Thank You!"}),e.jsx(de,{className:"absolute right-4 top-4 text-gray-700",children:e.jsx(me,{size:20})})]}),e.jsxs("div",{className:"text-gray-800 mt-2",children:[e.jsx("p",{className:"mb-2",children:"Your message has been successfully sent."}),e.jsx("p",{children:"We will get back to you soon."})]})]})})]})}const Ee=()=>{const[a,l]=s.useState([]),{categorySlug:t,slug:d}=F();return s.useEffect(()=>{(async()=>{var o;try{const c=await H.get(`/api/petrochemProduct/getRecentProductsByCategorySlug?slug=${d}`);l(((o=c.data)==null?void 0:o.slice(0,6))||[])}catch(c){console.error("Error fetching recent products:",c)}})()},[d]),e.jsxs("div",{className:"container mx-auto  py-5",children:[e.jsxs("div",{className:"mb-5",children:[e.jsx("h2",{className:"text-2xl lg:text-3xl font-bold mb-2 text-blue-900",children:"Recent Products"}),e.jsx("div",{className:"w-24 h-1 bg-blue-800"})]}),a.length>0?e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10",children:a.map(n=>{var o,c,x,p;return e.jsx(M,{to:`/${t}/${n.slug}`,className:"group bg-white hover:shadow-blue-100 shadow-blue-200 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transform transition-transform duration-300 hover:-translate-y-2",children:e.jsxs("div",{className:"flex flex-col h-full",children:[e.jsx("div",{className:"relative bg-white h-56 flex items-center justify-center",children:e.jsx("img",{src:(c=(o=n.images)==null?void 0:o[0])!=null&&c.url?`/api/image/download/${n.images[0].url}`:"/placeholder.jpg",alt:((p=(x=n.images)==null?void 0:x[0])==null?void 0:p.altText)||n.name,className:"max-h-48 w-auto object-contain transition-transform duration-300 group-hover:scale-105"})}),e.jsxs("div",{className:"p-4 bg-gradient-to-br from-blue-50 to-blue-100 flex-1 flex flex-col justify-between",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold text-blue-900 mb-1",children:n.name}),e.jsxs("p",{className:"text-sm text-blue-700 font-medium",children:["Category: ",n.categoryId.category]}),e.jsxs("p",{className:"text-sm text-gray-600 font-medium mb-2",children:["Brand: ",n.brandId.name]})]}),n.table&&e.jsx("div",{className:"text-sm text-gray-700 space-y-1 mt-2",dangerouslySetInnerHTML:{__html:n.table.replace(/border:\s?1px\s?solid[^;]+;/g,"").replace(/<table[^>]*>/g,"<div class='space-y-1'>").replace(/<\/table>/g,"</div>").replace(/<tbody>|<\/tbody>/g,"").replace(/<tr>/g,"<div class='flex space-x-2'>").replace(/<\/tr>/g,"</div>").replace(/<td[^>]*>(.*?)<\/td>\s*<td[^>]*>(.*?)<\/td>/g,"<span class='font-semibold text-blue-800'>$1:</span><span class='text-gray-800'>$2</span>").split("</div>").slice(0,2).join("</div>")}})]})]})},n._id)})}):e.jsx("p",{className:"text-center text-gray-500",children:"No recent products found."})]})},U=a=>a.split("-").map(l=>l.charAt(0).toUpperCase()+l.slice(1)).join(" ");function D({subCategorySlug:a,chemicals:l="",slug:t="",categorySlug:d=""}){return e.jsx("nav",{className:"pt-5 sm:text-xs md:text-sm lg:text-base text-md pb-3 w-full mb-5 py-2",children:e.jsxs("ul",{className:"flex gap-2 flex-wrap",children:[e.jsx("li",{children:e.jsx(M,{to:"/",className:"text-[#fff] hover:text-[#fff]",children:"Home"})}),e.jsx("li",{className:"text-[#fff]",children:"/"}),e.jsx("li",{children:e.jsx(M,{to:"/categories",className:"text-[#fff] hover:text-[#fff]",children:"Products"})}),l&&e.jsx("li",{className:"text-[#fff]",children:"/"}),l&&e.jsx("li",{children:e.jsx(M,{to:`/${t}`,className:"text-[#fff] hover:text-[#fff]",children:U(l)})}),a&&e.jsx("li",{className:"text-[#fff]",children:"/"}),a&&e.jsx("li",{children:e.jsx(M,{to:`/${t}/${a}`,className:"text-[#fff] hover:text-[#fff]",children:U(a)})}),d&&e.jsx("li",{className:"text-[#fff]",children:"/"}),d&&e.jsx("li",{children:e.jsx("span",{className:"text-[#fff]",children:U(d)})})]})})}D.propTypes={chemicals:_.string.isRequired,categorySlug:_.string.isRequired,subCategorySlug:_.string,slug:_.string};function Me(){var G,V,Q,Y,X;const[a,l]=s.useState(0),[t,d]=s.useState(null),[n,o]=s.useState(!0),[c,x]=s.useState(!1),[p,v]=s.useState(!1),[u,f]=s.useState({}),{slug:y,categorySlug:b}=F(),N=ue(),[P,L]=s.useState([]),[E,k]=s.useState(!0),[r,m]=s.useState(!1),h=(j,g=.5)=>{if(!j||typeof j!="string")return"No description available.";const S=document.createElement("div");S.innerHTML=j;const z=(S.textContent||S.innerText||"").trim().split(/\s+/).filter(w=>w.length>0),$=Math.floor(z.length*g);if(z.length<=50||z.length<=$)return j;let q=0,B=!1;function K(w){if(B)return null;if(w.nodeType===Node.TEXT_NODE){const I=w.textContent.trim().split(/\s+/).filter(C=>C.length>0);if(q+I.length<=$)return q+=I.length,w.cloneNode(!0);{const C=$-q;if(C>0){const O=I.slice(0,C).join(" ")+"...",te=document.createTextNode(O);return q=$,B=!0,te}return B=!0,null}}else if(w.nodeType===Node.ELEMENT_NODE){const I=document.createElement(w.tagName);for(let C=0;C<w.attributes.length;C++)I.setAttribute(w.attributes[C].name,w.attributes[C].value);for(let C=0;C<w.childNodes.length&&!B;C++){const O=K(w.childNodes[C]);O&&I.appendChild(O)}return I.childNodes.length>0?I:null}return null}const J=document.createElement("div");for(let w=0;w<S.childNodes.length&&!B;w++){const I=K(S.childNodes[w]);I&&J.appendChild(I)}return J.innerHTML},i=j=>j?j.replace(/<ul(?![^>]*class)/g,'<ul class="list-disc pl-6 space-y-2 my-4"').replace(/<ol(?![^>]*class)/g,'<ol class="list-decimal pl-6 space-y-2 my-4"').replace(/<li(?![^>]*class)/g,'<li class="leading-relaxed"').replace(/<p(?![^>]*class)/g,'<p class="mb-4 leading-relaxed"').replace(/<h1(?![^>]*class)/g,'<h1 class="text-2xl font-bold mb-4 mt-6"').replace(/<h2(?![^>]*class)/g,'<h2 class="text-xl font-bold mb-3 mt-5"').replace(/<h3(?![^>]*class)/g,'<h3 class="text-lg font-bold mb-3 mt-4"').replace(/<h4(?![^>]*class)/g,'<h4 class="text-base font-bold mb-2 mt-3"').replace(/<table(?![^>]*class)/g,'<table class="w-full border-collapse border border-gray-300 my-4"').replace(/<th(?![^>]*class)/g,'<th class="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left"').replace(/<td(?![^>]*class)/g,'<td class="border border-gray-300 px-4 py-2"').replace(/<strong>/g,'<strong class="font-bold">').replace(/<em>/g,'<em class="italic">').replace(/<ul class="[^"]*">\s*<ul/g,'<ul class="list-circle pl-4 mt-2"><ul').replace(/<ol class="[^"]*">\s*<ol/g,'<ol class="list-lower-alpha pl-4 mt-2"><ol'):"No content available.";s.useEffect(()=>{(async()=>{try{const g=await H.get("/api/banner/getByPageSlug?pageSlug=hydraulic-oils");console.log(g.data),L(g.data||[])}catch(g){console.error("Failed to fetch banner:",g)}finally{k(!1)}})()},[]),s.useEffect(()=>{y&&(async()=>{try{o(!0),x(!1);const g=await fetch(`/api/petrochemProduct/getbySlug?slug=${y}`),S=await g.json();if(console.log(S),!g.ok)throw new Error("Failed to fetch product data");if(!S||S.length===0){N("/404",{replace:!0});return}d(S[0])}catch(g){console.error("Error fetching product data:",g),x(!0)}finally{o(!1)}})()},[y,N]);const T="https://via.placeholder.com/300x300?text=No+Image+Available",A=s.useMemo(()=>{var j;return(j=t==null?void 0:t.images)!=null&&j.length?t.images.map((g,S)=>({url:u[S]?T:`/api/image/download/${g.url}`,originalUrl:g.url,alt:g.alt||`Product Image ${S+1}`,title:g.title||"Product Image"})):[{url:T,alt:"No Image Available",title:"No Image"}]},[t==null?void 0:t.images,u]),ee=j=>{f(g=>({...g,[j]:!0}))};return c?e.jsxs("div",{className:"flex flex-col items-center justify-center min-h-screen",children:[e.jsx("p",{className:"text-red-600 font-semibold",children:"Error fetching product data."}),e.jsx(R,{onClick:()=>window.location.reload(),className:"mt-4",children:"Retry"})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"relative",children:[P&&P.length>0?e.jsx(W,{imageUrl:`/api/image/download/${P[0].image}`,title:t==null?void 0:t.name}):e.jsx("div",{className:"h-[30vh] flex items-center justify-center bg-gray-200",children:e.jsx("p",{className:"text-gray-500",children:"Banner not found"})}),e.jsx("div",{className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-5 z-10",children:e.jsx(D,{chemicals:(G=t==null?void 0:t.categoryId)==null?void 0:G.category,slug:(V=t==null?void 0:t.categoryId)==null?void 0:V.slug,categorySlug:t==null?void 0:t.name,subCategorySlug:b})})]}),e.jsxs("div",{className:"max-w-7xl mx-auto mb-10 px-4 py-2 relative",children:[p&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center",children:e.jsx(Le,{productName:t==null?void 0:t.name,onClose:()=>v(!1)})}),n?e.jsx("div",{className:"flex justify-center items-center h-screen",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"})}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"lg:flex gap-12 mt-5",children:[e.jsx("div",{className:"w-full lg:w-1/2 flex flex-col items-center justify-start",children:e.jsx(Ce,{images:A,selectedImage:a,setSelectedImage:l,onError:ee})}),e.jsxs("div",{className:"w-full",children:[e.jsx(Pe,{productDetails:t==null?void 0:t.details,name:t==null?void 0:t.name,price:t==null?void 0:t.price,categorySlug:t==null?void 0:t.categorySlug,tagline:t==null?void 0:t.tagline}),e.jsx(Ie,{msds:t==null?void 0:t.msds,specs:t==null?void 0:t.pdf,name:t==null?void 0:t.name,onInquiry:()=>v(!0)})]})]}),e.jsxs("div",{className:"mt-5 bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-lg shadow-md border border-blue-200",children:[e.jsx("h2",{className:"text-2xl font-bold mb-6 text-blue-900 border-b border-blue-200 pb-3",children:"Product Description"}),((t==null?void 0:t.details)||(t==null?void 0:t.specifiction))&&e.jsx("div",{className:"mb-6",children:e.jsx("div",{className:"rich-content-display prose prose-blue max-w-none",dangerouslySetInnerHTML:{__html:i(r?(t==null?void 0:t.details)||(t==null?void 0:t.specifiction)||"No description available.":h((t==null?void 0:t.details)||(t==null?void 0:t.specifiction)||""))}})}),r&&(t==null?void 0:t.tableInfo)&&e.jsxs("div",{className:"mb-6",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-blue-800",children:"Specifications"}),e.jsx("div",{className:"rich-content-display prose prose-blue max-w-none",dangerouslySetInnerHTML:{__html:i(t==null?void 0:t.tableInfo)}})]}),(((Q=t==null?void 0:t.details)==null?void 0:Q.length)>0||((Y=t==null?void 0:t.specifiction)==null?void 0:Y.length)>0||((X=t==null?void 0:t.tableInfo)==null?void 0:X.length)>0)&&e.jsx("button",{onClick:()=>m(j=>!j),className:"mt-4 px-4  text-blue-600 hover:border-b-2 hover:border-blue-600 hover:text-blue-700   font-medium   transition-colors duration-200",children:r?"Show Less":"Show More"})]})]}),e.jsx(he,{}),e.jsx(Ee,{})]}),e.jsx("style",{jsx:!0,children:`
        .rich-content-display {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #374151;
        }

        .rich-content-display ul {
          list-style-type: disc !important;
          margin: 16px 0 !important;
          padding-left: 24px !important;
        }

        .rich-content-display ol {
          list-style-type: decimal !important;
          margin: 16px 0 !important;
          padding-left: 24px !important;
        }

        .rich-content-display li {
          margin: 8px 0 !important;
          line-height: 1.6 !important;
          display: list-item !important;
        }

        .rich-content-display ul ul {
          list-style-type: circle !important;
          margin: 8px 0 !important;
        }

        .rich-content-display ul ul ul {
          list-style-type: square !important;
        }

        .rich-content-display ol ol {
          list-style-type: lower-alpha !important;
        }

        .rich-content-display ol ol ol {
          list-style-type: lower-roman !important;
        }

        .rich-content-display p {
          margin: 12px 0 !important;
          line-height: 1.6 !important;
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
      `})]})}function $e(){const a=ge(),{slug:l}=F(),[t,d]=s.useState([]),[n,o]=s.useState(!0),[c,x]=s.useState(!1),v=["Hydraulic Oils","Gear Oils","Cutting oil","Turbine oil","Refrigeration Oil","Rust Prevention Oil","Slideway Oil","Engine Oil","Knitting Oil","Food Grade Mineral Oil","Thermic Oil","Compressor Oil","Multipurpose grease","Extreme Pressure Grease","High Temperature Grease","Water Resistant Grease","Silicon Grease","High Speed Grease","Copper Paste"].map(P=>P.toLowerCase().replace(/\s+/g,"-"));s.useEffect(()=>{(async()=>{try{const E=(await H.get("/api/petrochemProduct/getAllSlugs")).data.slugs||[];d(E),x(E.includes(l))}catch(L){console.error("Error fetching slugs:",L)}finally{o(!1)}})()},[l]);const u=a.pathname.split("/").filter(Boolean),f=u[0],y=u[1],b=(f==="industrial-oils"||f==="greases")&&!y,N=(f==="industrial-oils"||f==="greases")&&v.includes(y);return s.useEffect(()=>{n?document.title="Loading...":b||N?document.title="Subcategory Products":c?document.title="Product Details":document.title="404"},[n,b,N,c]),n?e.jsx("div",{children:"Loading..."}):e.jsx("div",{children:b||N?e.jsx(Se,{}):c?e.jsx(Me,{}):e.jsx(pe,{})})}export{$e as default};
