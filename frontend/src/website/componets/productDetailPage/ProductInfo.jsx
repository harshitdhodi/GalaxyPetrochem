import React, { useMemo } from 'react';

export default function ProductInfo({ tagline, productDetails, name, price, categorySlug }) {
  // Process the HTML content using useMemo to avoid unnecessary re-processing
  const { extractedPContent, remainingContent } = useMemo(() => {
    // Create a temporary div to parse HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = productDetails;

    // Find the first <p> tag
    const firstP = tempDiv.querySelector('p');
    let extractedPContent = '';

    if (firstP) {
      // Extract the content of the first <p> tag
      extractedPContent = firstP.innerHTML;

      // Remove the extracted <p> tag from the remaining content
      firstP.remove();
    }

    return {
      extractedPContent,
      remainingContent: tempDiv.innerHTML,
    };
  }, [productDetails]);

  return (
    <>
      <h1 className="text-2xl font-bold text-[#2e60d7]">
        {name}
      </h1>
      <p className="text-lg font-bold mb-4 text-[#3a6ada]">
        {tagline}
      </p>

      {/* Render the extracted paragraph content */}
      {extractedPContent && (
        <p
          className="extracted-paragraph text-md text-gray-900"
          dangerouslySetInnerHTML={{ __html: extractedPContent }}
        />
      )}

      {/* Render the remaining content */}
      {remainingContent && (
        <div
          className="custom-product-details overflow-x-auto w-full"
          dangerouslySetInnerHTML={{ __html: remainingContent }}
        />
      )}

      {/* Using global styles instead of scoped styles */}
      <style jsx global>{`
        .custom-product-details table {
          width: max-content;
          min-width: 100%;
          table-layout: fixed;
          border-collapse: collapse;
        }
        .custom-product-details {
          max-width: 100%;
          overflow-x-auto;
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