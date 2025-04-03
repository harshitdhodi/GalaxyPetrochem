import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, FileText, Eye } from "lucide-react";
import PropTypes from 'prop-types';

export const ChemicalPropertiesForm = ({ control, watch }) => {
  const [isUploading, setIsUploading] = useState({
    specs: false,
    msds: false
  });

  const currentSpecs = watch('specs');
  const currentMsds = watch('msds');

  const openPdfInNewTab = (filename, type = 'specs') => {
    if (filename) {
      const endpoint = type === 'msds' ? 'msds' : 'specs';
      
      // Extract just the ID part (remove the extension)
      const fileId = filename.split('.')[0];
      
      // OR if the entire filename is the ID:
      // const fileId = filename;
      
      window.open(`/api/image/${endpoint}/view/${fileId}`, '_blank');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-none">
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="packings">Packings</Label>
          <Controller
            name="packings"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter packing (e.g., 25kg)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.target.value.trim();
                        if (value && !field.value.includes(value)) {
                          field.onChange([...field.value, value]);
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousSibling;
                      const value = input.value.trim();
                      if (value && !field.value.includes(value)) {
                        field.onChange([...field.value, value]);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(field.value) && field.value.map((packing, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
                    >
                      <span>{packing}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newPackings = field.value.filter((_, i) => i !== index);
                          field.onChange(newPackings);
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grade">Grade</Label>
          <Controller
            name="grade"
            control={control}
            render={({ field }) => (
              <Input id="grade" placeholder="Enter grade" {...field} />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="iupac">IUPAC Name</Label>
          <Controller
            name="iupac"
            control={control}
            render={({ field }) => (
              <Input id="iupac" placeholder="Enter IUPAC name" {...field} />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="h_s_code">HS Code</Label>
          <Controller
            name="h_s_code"
            control={control}
            render={({ field }) => (
              <Input id="h_s_code" placeholder="Enter HS code" {...field} />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="molecular_weight">Molecular Weight</Label>
          <Controller
            name="molecular_weight"
            control={control}
            render={({ field }) => (
              <Input 
                id="molecular_weight" 
                type="number" 
                placeholder="Enter molecular weight"
                {...field} 
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="molecular_formula">Molecular Formula</Label>
          <Controller
            name="molecular_formula"
            control={control}
            render={({ field }) => (
              <Input 
                id="molecular_formula" 
                placeholder="Enter molecular formula"
                {...field} 
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="application">Applications</Label>
          <Controller
            name="application"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter application"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.target.value.trim();
                        if (value && !field.value.includes(value)) {
                          field.onChange([...field.value, value]);
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousSibling;
                      const value = input.value.trim();
                      if (value && !field.value.includes(value)) {
                        field.onChange([...field.value, value]);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(field.value) && field.value.map((app, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
                    >
                      <span>{app}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newApplications = field.value.filter((_, i) => i !== index);
                          field.onChange(newApplications);
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="specs">Specifications (PDF)</Label>
          <Controller
            name="specs"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <div className="space-y-2">
                {/* Show current specs file if it exists */}
                {typeof currentSpecs === 'string' && currentSpecs && (
                  <div className="flex items-center gap-2 p-2 bg-secondary rounded-md">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm truncate">{currentSpecs}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => openPdfInNewTab(currentSpecs, 'specs')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onChange('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <Input
                  id="specs"
                  type="file"
                  accept=".pdf"
                  disabled={isUploading.specs}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setIsUploading(prev => ({ ...prev, specs: true }));
                      onChange(file);
                      setIsUploading(prev => ({ ...prev, specs: false }));
                    }
                  }}
                  {...field}
                />
                {isUploading.specs && (
                  <p className="text-sm text-muted-foreground">
                    Uploading specification file...
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="msds">MSDS (PDF)</Label>
          <Controller
            name="msds"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <div className="space-y-2">
                {/* Show current MSDS file if it exists */}
                {typeof currentMsds === 'string' && currentMsds && (
                  <div className="flex items-center gap-2 p-2 bg-secondary rounded-md">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm truncate">{currentMsds}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => openPdfInNewTab(currentMsds, 'msds')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onChange('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <Input
                  id="msds"
                  type="file"
                  accept=".pdf"
                  disabled={isUploading.msds}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setIsUploading(prev => ({ ...prev, msds: true }));
                      onChange(file);
                      setIsUploading(prev => ({ ...prev, msds: false }));
                    }
                  }}
                  {...field}
                />
                {isUploading.msds && (
                  <p className="text-sm text-muted-foreground">
                    Uploading MSDS file...
                  </p>
                )}
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

ChemicalPropertiesForm.propTypes = {
  control: PropTypes.object.isRequired,
  watch: PropTypes.func
};

ChemicalPropertiesForm.defaultProps = {
  watch: () => undefined
};

export default ChemicalPropertiesForm;