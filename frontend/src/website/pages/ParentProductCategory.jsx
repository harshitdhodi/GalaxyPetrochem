import ProductSection from "../componets/parentProductCategory/ProductSection"
import { productData } from "../componets/parentProductCategory/ProductData"

function ParentProductCategory() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold text-[#0a3161] mb-4">INDUSTRIAL OILS</h1>
      <div className="h-1 w-24 bg-[#0a3161] mb-6"></div>

      <p className="text-gray-700 mb-10">
        HP Lubricants caters to a wide array of industries, with a diverse range of Industrial Oils. It is due to
        several inherent strengths that HP Lubricants has the largest Industrial Oil market share in India. Trusted by
        all our customers for Consistent quality, Timely Delivery and a robust Technical Services backup, HP Lubricants
        continues its growth in this segment by offering newer and advanced products as required by the market. HP
        lubricants brands such as Enklo, Parthan, Hycom, Numatic, Yantrol etc. find usages in all applications such as
        hydraulic systems, enclosed gear boxes, compressors, pumps, pneumatic tools, general purpose machinery
        applications etc.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {productData.map((section) => (
          <ProductSection key={section.id} title={section.title} image={section.image} products={section.products} />
        ))}
      </div>
    </div>
  )
}

export default ParentProductCategory
