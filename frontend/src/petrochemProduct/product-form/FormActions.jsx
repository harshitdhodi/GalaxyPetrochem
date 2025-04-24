// product-form/FormActions.jsx
const FormActions = ({ navigate, loading, isEdit }) => {
    return (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? <span>Saving...</span> : <span>{isEdit ? "Update Product" : "Add Product"}</span>}
        </button>
      </div>
    );
  };
  
  export default FormActions;