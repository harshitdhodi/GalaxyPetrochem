import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { SupplierTable } from './SupplierTable'
import { useGetChemicalsByAlphabetQuery } from '@/slice/supplierSlice/chemicalBySupplier'

export function SearchChemical({ onSelectChemicals }) {
  const [chemicalSearch, setChemicalSearch] = useState('')
  const [queryString, setQueryString] = useState('')
  const [selectedChemical, setSelectedChemical] = useState(null)
  const [selectedChemicalIds, setSelectedChemicalIds] = useState([])
  const [chemicals, setChemicals] = useState([])

  // Fetch chemicals based on the first letter of the query string
  const { 
    data: chemicalsData, 
    isLoading: isLoadingChemicals, 
    error: chemicalsError 
  } = useGetChemicalsByAlphabetQuery(
    queryString.charAt(0) || '' 
  )

  // Normalize the data to ensure it's an array
  const normalizedChemicals = Array.isArray(chemicalsData) 
    ? chemicalsData 
    : (chemicalsData ? [chemicalsData] : [])

  // Filter chemicals based on the full query string
  const filteredChemicals = normalizedChemicals.filter(chemical => 
    chemical.name.toLowerCase().includes(queryString.toLowerCase()) ||
    (chemical.cas_number && chemical.cas_number.toLowerCase().includes(queryString.toLowerCase()))
  )

  const handleSelectChemical = (chemical) => {
    if (chemical) {
      // Prevent duplicate selections
      if (!selectedChemicalIds.includes(chemical._id)) {
        const updatedChemicals = [...chemicals, chemical]
        const updatedChemicalIds = [...selectedChemicalIds, chemical._id]
        
        setSelectedChemical(chemical)
        setChemicals(updatedChemicals)
        setSelectedChemicalIds(updatedChemicalIds)
        setChemicalSearch('')
        setQueryString('')
        
        // Optional: Notify parent component about selected chemicals
        onSelectChemicals?.(updatedChemicals)
      }
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setChemicalSearch(value)
    setQueryString(value)
  }

  const handleRemoveChemical = (removedChemical) => {
    const updatedChemicals = chemicals.filter(
      (chemical) => chemical._id !== removedChemical._id
    )
    const updatedChemicalIds = selectedChemicalIds.filter(
      (id) => id !== removedChemical._id
    )

    setChemicals(updatedChemicals)
    setSelectedChemicalIds(updatedChemicalIds)
    
    // Optional: Notify parent component about updated chemicals
    onSelectChemicals?.(updatedChemicals)
  }

  return (
    <div className="mt-4">
      <Input
        placeholder="Search Chemical by Name or CAS Number"
        value={chemicalSearch}
        onChange={handleInputChange}
        className="w-full mb-4"
      />

      {isLoadingChemicals ? (
        <div>Loading...</div>
      ) : (
        queryString &&
        filteredChemicals &&
        filteredChemicals.length > 0 && (
          <ul className="border bg-white rounded max-h-40 overflow-y-auto">
            {filteredChemicals.map((chemical) => (
              <li
                key={chemical._id}
                onClick={() => handleSelectChemical(chemical)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {chemical.name} (CAS: {chemical.cas_number || 'N/A'})
              </li>
            ))}
          </ul>
        )
      )}

      {chemicalsError && (
        <div className="p-2 text-red-500">Error loading chemicals: {chemicalsError.toString()}</div>
      )}

      {filteredChemicals?.length === 0 && !isLoadingChemicals && queryString && (
        <div className="p-2 text-gray-500">No Chemical found</div>
      )}

      <div className="mt-4">
        <SupplierTable
          chemicals={chemicals}
          selectedChemicalIds={selectedChemicalIds}
          onRemoveChemical={handleRemoveChemical}
        />
      </div>
    </div>
  )
}