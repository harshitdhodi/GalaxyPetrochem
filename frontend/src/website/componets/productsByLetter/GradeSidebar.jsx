import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

export function GradeSidebar({ categorySlug, chemicals, selectedGrades, setSelectedGrades }) {

    // Handles the change in grade selection
    const handleGradeChange = (checked, gradeName) => {
        if (checked) {
            setSelectedGrades((prev) => [...prev, gradeName]);
        } else {
            setSelectedGrades((prev) => prev.filter((item) => item !== gradeName));
        }
    };

    // Clears all selected filters
    const handleClearAllFilters = () => {
        setSelectedGrades([]);
    };

    // Removes a specific grade from selected grades
    const removeGrade = (gradeName) => {
        setSelectedGrades((prev) => prev.filter((item) => item !== gradeName));
    };

    return (
        <Card className="md:col-span-1 bg-[#dee8ff] h-fit rounded-none p-3">
            <CardContent className="p-4">
                <h2 className="text-2xl font-normal mb-4">Your Selections</h2>

                {/* Display selected grades */}
                {selectedGrades.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-medium mb-2">Grades:</h3>
                        <div className="text-main py-3 flex flex-col gap-2 border-y-2 border-gray-300">
                            {selectedGrades.map((grade) => (
                                <div key={grade} className="flex justify-between items-center px-2 py-1 bg-blue-100 rounded">
                                    <span className="text-sm">{grade}</span>
                                    <button
                                        onClick={() => removeGrade(grade)}
                                        className="text-gray-600 hover:text-red-600"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Grades Filter */}
                <div className="space-y-6">
                    <div>
                        <h3 className="mb-2 text-2xl font-normal">Grades</h3>
                        <div className="space-y-2">
                            {chemicals.map((chemical) => (
                                <div key={chemical._id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={chemical._id}
                                        checked={selectedGrades.includes(chemical.grade)}
                                        onCheckedChange={(checked) => handleGradeChange(checked, chemical.grade)}
                                    />
                                    <label htmlFor={chemical._id} className="text-sm">
                                        {chemical.grade}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default GradeSidebar;
