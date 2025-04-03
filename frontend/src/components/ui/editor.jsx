"use client"

import { useState } from "react"
import { Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Link, Code, Heading1, Heading2, Heading3, Image, Type } from 'lucide-react'
import { Toggle } from "@/components/ui/toggle"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Editor({ className }) {
  const [content, setContent] = useState("")

  return (
    <div className={`border rounded-md ${className}`}>
      <div className="flex flex-wrap gap-1 p-1 border-b overflow-x-auto">
        <Toggle aria-label="Toggle bold">
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Toggle italic">
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Toggle underline">
          <Underline className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-border mx-1" />
        <Toggle aria-label="Toggle heading 1">
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Toggle heading 2">
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Toggle heading 3">
          <Heading3 className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-border mx-1" />
        <Toggle aria-label="Toggle bullet list">
          <List className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-border mx-1" />
        <Toggle aria-label="Toggle align left">
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Toggle align center">
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Toggle align right">
          <AlignRight className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-border mx-1" />
        <Toggle aria-label="Add link">
          <Link className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Add code">
          <Code className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Add image">
          <Image className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-border mx-1" />
        <Select defaultValue="16px">
          <SelectTrigger className="w-[80px] h-8">
            <SelectValue placeholder="Font size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12px">12px</SelectItem>
            <SelectItem value="14px">14px</SelectItem>
            <SelectItem value="16px">16px</SelectItem>
            <SelectItem value="18px">18px</SelectItem>
            <SelectItem value="20px">20px</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="sans">
          <SelectTrigger className="w-[100px] h-8">
            <SelectValue placeholder="Font style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sans">Sans-serif</SelectItem>
            <SelectItem value="serif">Serif</SelectItem>
            <SelectItem value="mono">Monospace</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <textarea
        className="w-full p-2 focus:outline-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  )
}

