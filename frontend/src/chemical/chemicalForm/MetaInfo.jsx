import React from 'react'
import { Controller } from 'react-hook-form'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export const MetaInformationForm = ({ control }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-none">
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="metatitle">Meta Title</Label>
          <Controller
            name="metatitle"
            control={control}
            render={({ field }) => (
              <Input 
                id="metatitle" 
                placeholder="Enter meta title"
                {...field} 
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metadescription">Meta Description</Label>
          <Controller
            name="metadescription"
            control={control}
            render={({ field }) => (
              <Textarea 
                id="metadescription"
                placeholder="Enter meta description"
                {...field} 
                rows={3}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metakeywords">Meta Keywords</Label>
          <Controller
            name="metakeywords"
            control={control}
            render={({ field }) => (
              <Input 
                id="metakeywords" 
                placeholder="Enter meta keywords"
                {...field} 
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metacanonical">Meta Canonical URL</Label>
          <Controller
            name="metacanonical"
            control={control}
            render={({ field }) => (
              <Input 
                id="metacanonical" 
                placeholder="Enter canonical URL"
                {...field} 
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metalanguage">Meta Language</Label>
          <Controller
            name="metalanguage"
            control={control}
            render={({ field }) => (
              <Input 
                id="metalanguage" 
                placeholder="Enter language code (e.g., en-US)"
                {...field} 
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaschema">Meta Schema</Label>
          <Controller
            name="metaschema"
            control={control}
            render={({ field }) => (
              <Textarea 
                id="metaschema"
                placeholder="Enter JSON-LD schema"
                {...field} 
                rows={4}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="otherMeta">Other Meta Information</Label>
          <Controller
            name="otherMeta"
            control={control}
            render={({ field }) => (
              <Textarea 
                id="otherMeta"
                placeholder="Enter any additional meta information"
                {...field} 
                rows={3}
              />
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default MetaInformationForm

