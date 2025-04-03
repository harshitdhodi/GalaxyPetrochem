import React, { useMemo } from 'react';

export default function ProductInfo({ productDetails, name, price, categorySlug }) {
  // Process the HTML content using useMemo to avoid unnecessary re-processing
  const { extractedPContent, remainingContent } = useMemo(() => {
    // Create a temporary div to parse HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = productDetails;

    // Find the first <p> before a <table>
    const firstP = tempDiv.querySelector('p');
    const firstTable = tempDiv.querySelector('table');

    let extractedPContent = '';
    
    if (firstP && (!firstTable || firstP.compareDocumentPosition(firstTable) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      // Save the content, but don't manipulate the DOM element
      extractedPContent = firstP.innerHTML;
      
      // Remove the extracted <p> from productDetails
      firstP.remove();
    }

    return {
      extractedPContent,
      remainingContent: tempDiv.innerHTML
    };
  }, [productDetails]);

  return (
    <>
      <h1 className="text-2xl font-bold text-main mb-2">
        {name} 
      </h1>
      <p className="text-lg font-bold text-main">
        Price : {price}
        <span className='text-secondary font-semibold'>
          {categorySlug === "tubes-pipes" ? "/kg" : "/Piece"}
        </span>
      </p>

      {/* Apply styles directly to the container for the extracted paragraph */}
      {extractedPContent && (
        <p className="extracted-paragraph" dangerouslySetInnerHTML={{ __html: extractedPContent }} />
      )}

      <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <div 
          className="custom-product-details overflow-x-auto w-full"
          dangerouslySetInnerHTML={{ __html: remainingContent }} 
        />
      </div>

      {/* Using global styles instead of scoped styles */}
      <style jsx global>{`
        .extracted-paragraph {
          margin-bottom: 16px;
          font-size: 18px;
          color: #145bc7;
          font-weight: 600;
        }
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