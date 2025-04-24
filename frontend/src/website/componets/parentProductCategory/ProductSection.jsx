function ProductSection({ title, image, products }) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-[#0a3161] mb-2">{title}</h2>
        <div className="h-1 w-16 bg-[#0a3161] mb-6"></div>
  
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-64 h-64 rounded-full overflow-hidden ">
              <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
            </div>
          </div>
  
          <div className="flex-grow">
            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-2 scrollbar">
              {products.map((product, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors">
                  {product}
                </div>
              ))}
            </div>
          </div>
        </div>
  
        <button className="mt-6 bg-red-600 float-end hover:bg-red-700 text-white font-bold py-2 px-8 rounded transition-colors">
          VIEW MORE
        </button>
      </div>
    )
  }
  
  export default ProductSection
  