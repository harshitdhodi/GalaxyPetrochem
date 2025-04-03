import CategoryTable from './chemicalCategory/CategoryTable'

export default function CategoriesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Product Categories</h1>
      <CategoryTable />
    </div>
  )
}

