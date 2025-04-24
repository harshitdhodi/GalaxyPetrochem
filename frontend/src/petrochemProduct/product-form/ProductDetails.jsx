import { useRef } from "react";
import JoditEditor from "jodit-react";

const ProductDetails = ({ product, handleChange }) => {
  const specRef = useRef(null);
  const detailsRef = useRef(null);
  const tableRef = useRef(null);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Product Details</h3>

      {/* Specification */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Specification</label>
        <JoditEditor
          ref={specRef}
          value={product.specifiction}
          tabIndex={1}
          onBlur={(newContent) =>
            handleChange({ target: { name: "specifiction", value: newContent } })
          }
        />
      </div>

      {/* Details */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
        <JoditEditor
          ref={detailsRef}
          value={product.details}
          tabIndex={2}
          onBlur={(newContent) =>
            handleChange({ target: { name: "details", value: newContent } })
          }
        />
      </div>

      {/* Table Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Table Information</label>
        <JoditEditor
          ref={tableRef}
          value={product.tableInfo}
          tabIndex={3}
          onBlur={(newContent) =>
            handleChange({ target: { name: "tableInfo", value: newContent } })
          }
        />
      </div>
    </div>
  );
};

export default ProductDetails;
