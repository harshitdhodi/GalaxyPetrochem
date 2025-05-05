import React, { useMemo, useState } from 'react';

export default function ProductInfo({ tagline, productDetails, name, price, categorySlug }) {
  const [expanded, setExpanded] = useState(false);

  const { extractedPContent, previewContent, remainingContent } = useMemo(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = productDetails;

    const firstP = tempDiv.querySelector('p');
    let extractedPContent = '';
    if (firstP) {
      extractedPContent = firstP.innerHTML;
      firstP.remove();
    }

    const remainingHtml = tempDiv.innerHTML;
    const charLimit = 10000; // Show 10,000 characters at a time

    return {
      extractedPContent,
      previewContent: remainingHtml.slice(0, charLimit),
      remainingContent: remainingHtml.slice(charLimit),
    };
  }, [productDetails]);

  return (
    <>
      <h1 className="text-2xl pb-2 font-bold text-[#2e60d7]">
        {name}
      </h1>
      {extractedPContent && (
        <p
          className="extracted-paragraph text-md text-gray-900"
          dangerouslySetInnerHTML={{ __html: extractedPContent }}
        />
      )}

      <div
        className="custom-product-details overflow-x-auto w-full text-gray-800"
        dangerouslySetInnerHTML={{
          __html: expanded ? previewContent + remainingContent : previewContent,
        }}
      />

      {remainingContent && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="text-blue-600 mt-2 font-semibold border-blue-600 border-b focus:outline-none"
        >
          {expanded ? 'See Less' : 'See More'}
        </button>
      )}

      <style jsx global>{`
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
      `}</style>
    </>
  );
}