'use client'

import React from 'react'
import { SupplierSearch } from './chemcalMapping_component/SupplierSearch'

export default function AssignChemicals() {
  const [selectedCustomer, setSelectedCustomer] = React.useState(null)
  const [chemicals, setChemicals] = React.useState([])

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer)
    setChemicals([])
  }

 
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-purple-700">
        Assign Chemicals to Supplier
      </h1>

      <div className="space-y-4">
        <SupplierSearch onSelectCustomer={handleSelectCustomer} />

        
        

       
      </div>
    </div>
  )
}
