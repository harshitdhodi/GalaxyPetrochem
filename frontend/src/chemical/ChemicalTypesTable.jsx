'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useCreateChemicalTypeMutation, useGetChemicalTypesQuery, useUpdateChemicalTypeMutation, useDeleteChemicalTypeMutation } from "@/slice/chemicalType/chemicalType"
import ChemicalTypesDialog from "./chemicalTypes_Components/Dialog"
import ChemicalTypesTable from "./chemicalTypes_Components/Table"

export default function ChemicalTypes() {
  const [open, setOpen] = useState(false)
  const [chemicalName, setChemicalName] = useState("")
  const [editingId, setEditingId] = useState(null) // Track the ID of the chemical type being edited

  // Fetch the chemical types
  const { data: chemicalTypes = [], isLoading, error } = useGetChemicalTypesQuery()

  // Mutations
  const [createChemicalType] = useCreateChemicalTypeMutation()
  const [updateChemicalType] = useUpdateChemicalTypeMutation()
  const [deleteChemicalType] = useDeleteChemicalTypeMutation()

  // Save the chemical type (create or update)
  const handleSave = async () => {
    try {
      if (chemicalName) {
        const updatedChemicalType = { name: chemicalName };
        console.log("Saving chemical type:", { id: editingId, updatedChemicalType }); // Log the ID and data
        if (editingId) {
          // Update the chemical type
          await updateChemicalType({ id: editingId, updatedChemicalType }).unwrap();
        } else {
          // Create a new chemical type
          await createChemicalType(updatedChemicalType).unwrap();
        }
        setChemicalName(""); // Clear the input field
        setEditingId(null); // Reset the editing ID
        setOpen(false); // Close the dialog
      }
    } catch (error) {
      console.error("Failed to save chemical type:", error);
    }
  };
  
  // Handle Edit (set chemical name and ID)
  const handleEdit = (type) => {
    if (type && type._id) {
      setChemicalName(type.name);
      setEditingId(type._id);
      setOpen(true);
    } else {
      console.error("Invalid chemical type selected:", type);
    }
  };
  

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await deleteChemicalType(id).unwrap()
    } catch (error) {
      console.error("Failed to delete chemical type:", error)
    }
  }

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error fetching chemical types.</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-purple-600">Chemical Types</h1>
        <Button onClick={() => setOpen(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Chemical Type
        </Button>
      </div>

      <ChemicalTypesTable 
        chemicalTypes={chemicalTypes} 
        handleEdit={handleEdit} 
        handleDelete={handleDelete} 
      />

      <ChemicalTypesDialog 
        open={open} 
        setOpen={setOpen} 
        chemicalName={chemicalName} 
        setChemicalName={setChemicalName} 
        handleSave={handleSave} 
        editingId={editingId}
      />
    </div>
  )
}
