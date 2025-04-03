'use client'

import React from 'react'
import { CustomerSearch } from './components/CustomerSearch'
// import { ChemicalSearch } from './components/ChemicalSearch'
import { ChemicalTable } from './components/ChemicalTable'
import { Button } from '@/components/ui/button'
import { BreadcrumbWithCustomSeparator } from '@/breadCrumb/BreadCrumb'

const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Chemical Mapping", href: null },
]
export default function AssignChemicals() {
  const [selectedCustomer, setSelectedCustomer] = React.useState(null)
  const [chemicals, setChemicals] = React.useState([])

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer)
    setChemicals([])
  }
  return (
    <>
    <div className="ml-1">
              <BreadcrumbWithCustomSeparator items={breadcrumbItems} />
        
            </div>
    <div className="py-4 space-y-6">

      <h1 className="text-2xl font-bold text-purple-700">
        Assign Chemicals to Customer
      </h1>

      <div className="space-y-4">
        <CustomerSearch onSelectCustomer={handleSelectCustomer} />

        
        
 
       
      </div>
    </div>
    </>
  )
}
