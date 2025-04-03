import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useGetSuppliersByAlphabetQuery } from '@/slice/supplierSlice/SupplierSlice'
// import { S_ChemicalSearch } from './S_chemicalSearch'
import { ChemicalTable } from './ChemicalTable'

export function SearchSupplier ({ onSelectSupplier }) {
  const [supplierSearch, setSupplierSearch] = useState('')
  const [queryString, setQueryString] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [chemicals, setChemicals] = useState([])

  // Fetch suppliers based on the first letter of the query string
  const { data: suppliers, isLoading: isLoadingSuppliers } = useGetSuppliersByAlphabetQuery(
    queryString.charAt(0),
    { skip: queryString.length === 0 }
  )

  const handleSelectSupplier = (supplier) => {
    setSelectedSupplier(supplier)
    setSupplierSearch(supplier.name)
    setQueryString('')
    onSelectSupplier(supplier)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setSupplierSearch(value)
    setQueryString(value)
  }

  const handleAddChemical = (chemical) => {
    console.log('Added:', chemical)
    setChemicals((prevChemicals) => [...prevChemicals, chemical])
  }

  const handleRemoveChemical = (removedChemical) => {
    setChemicals((prevChemicals) =>
      prevChemicals.filter((chemical) => chemical.id !== removedChemical.id)
    )
  }

  return (
    <div className="mt-4">
      <Input
        placeholder="Search Supplier"
        value={supplierSearch}
        onChange={handleInputChange}
        className="w-full mb-4"
      />

      {isLoadingSuppliers ? (
        <div>Loading...</div>
      ) : (
        queryString &&
        suppliers &&
        suppliers.length > 0 && (
          <ul className="border bg-white rounded max-h-40 overflow-y-auto">
            {suppliers.map((supplier) => (
              <li
                key={supplier.id}
                onClick={() => handleSelectSupplier(supplier)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {supplier.name}
              </li>
            ))}
          </ul>
        )
      )}

      {suppliers?.length === 0 && !isLoadingSuppliers && queryString && (
        <div className="p-2 text-gray-500">No Supplier found</div>
      )}

      {/* <S_ChemicalSearch
        selectedSupplier={selectedSupplier}
        onAddChemical={handleAddChemical}
      /> */}

      <div className="mt-4">
        <ChemicalTable
        chemicals={selectedSupplier?.chemical_ids || []} // Default empty array if no customer is selected
       
          onRemoveChemical={handleRemoveChemical}
        />
      </div>
    </div>
  )
}
