'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'
import UnitDialog from './unitComponent/UnitDialog'
import UnitTable from './unitComponent/UnitTable'
import { 
  useGetAllUnitsQuery, 
  useCreateUnitMutation, 
  useUpdateUnitMutation, 
  useDeleteUnitMutation 
} from '@/slice/chemicalUnit/unitSlice'

export default function UnitsPage() {
  // Fetch units data from the API
  const { data: units = [], isLoading, isError, refetch } = useGetAllUnitsQuery()
  const [createUnit] = useCreateUnitMutation()
  const [updateUnit] = useUpdateUnitMutation()
  const [deleteUnit] = useDeleteUnitMutation()

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState(null)
  const [newUnitName, setNewUnitName] = useState('')
  
  // Handle saving a unit (create or update)
  const handleSave = async () => {
    try {
      if (newUnitName) {
        const updatedUnit = { name: newUnitName };
        console.log("Saving unit:", { id: editingUnit?._id, updatedUnit });
  
        // Ensure we're passing the correct data and the ID exists
        if (editingUnit?._id) {
          console.log(newUnitName)
          // Update the unit
          await updateUnit({ id: editingUnit._id, updatedUnit }).unwrap();
        } else {
          // Create a new unit
          await createUnit(updatedUnit).unwrap();
        }
  
        setNewUnitName(''); // Clear the input field
        setEditingUnit(null); // Reset the editing state
        setIsAddOpen(false); // Close the dialog
        setIsEditOpen(false); // Close the edit dialog
        refetch(); // Trigger refetch to get the updated data
      } else {
        console.error("Unit name is empty");
      }
    } catch (error) {
      console.error("Failed to save unit:", error);
    }
  };
  

  // Handle editing a unit (set name and ID)
  const handleEdit = (unit) => {
   
    if (unit && unit._id) {
      setNewUnitName(unit.name)
      setEditingUnit(unit)
      setIsEditOpen(true)
    } else {
      console.error("Invalid unit selected:", unit)
    }
  }

  // Handle deleting a unit
  const handleDelete = async (id) => {
    try {
      await deleteUnit(id).unwrap() // Call the mutation to delete the unit
      refetch() // Trigger refetch to get the updated data
    } catch (error) {
      console.error("Failed to delete unit:", error)
    }
  }

  // Loading and error states for the fetch query
  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading units</div>

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Units</h1>
        <UnitDialog
          isOpen={isAddOpen}
          onOpenChange={setIsAddOpen}
          unitName={newUnitName}
          setUnitName={setNewUnitName}
          handleSubmit={handleSave} // Use handleSave for both create and update
          title="Add New Unit"
        />
        <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setIsAddOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Unit
        </Button>
      </div>

      <UnitTable
        units={units}
        openEditDialog={handleEdit} // Edit functionality
        handleDelete={handleDelete} // Delete functionality
      />

      <UnitDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        unitName={newUnitName}
        setUnitName={setNewUnitName}
        handleSubmit={handleSave} // Use handleSave for both create and update
        title="Edit Unit"
      />
    </div>
  )
}
