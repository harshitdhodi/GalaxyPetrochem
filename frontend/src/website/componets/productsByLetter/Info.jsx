import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Info({ letter, totalItems, itemsPerPage, setItemsPerPage }) {
  return (
    <div className="w-full mb-5">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Showing Products for "{letter}"</h1>
        <p className="text-sm text-muted-foreground uppercase tracking-wide">
          Fine Chemicals & Laboratory Reagents for Research & Industries
        </p>

        <div className="bg-blue-50 flex items-center px-3 py-1 justify-between">
          <span className="text-sm text-gray-600">
            1 to {itemsPerPage} of {totalItems} item(s) displayed
          </span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Show per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="25">25 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
              <SelectItem value="100">100 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
