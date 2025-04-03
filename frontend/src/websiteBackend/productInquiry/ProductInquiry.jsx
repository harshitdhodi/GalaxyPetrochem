"use client"

import React, { useState } from "react";
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetInquiriesQuery, useDeleteInquiryMutation } from '@/slice/inquiry/productInquiry';
import Swal from 'sweetalert2';

export function ProductInquiryTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const { data, isLoading, isError } = useGetInquiriesQuery();
  const [deleteInquiry] = useDeleteInquiryMutation();
  const inquiriesList = data?.inquiries || [];

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteInquiry(id).unwrap();
        Swal.fire(
          'Deleted!',
          'The inquiry has been deleted.',
          'success'
        );
      } catch (error) {
        console.error('Failed to delete inquiry:', error);
        Swal.fire(
          'Error!',
          'Failed to delete the inquiry.',
          'error'
        );
      }
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inquiriesList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(inquiriesList.length / itemsPerPage);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading inquiries</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-5">Contact List</h1>
      <div className="flex justify-between px-5 bg-gray-100 p-2 rounded-md items-center">
        <div className="flex items-center space-x-2">
          <span>Show</span>
          <Select onValueChange={handleItemsPerPageChange} defaultValue="10">
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>entries</span>
        </div>
        <div>
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, inquiriesList.length)} of {inquiriesList.length} entries
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-md font-medium  ">Name</TableHead>
              <TableHead className="text-md font-medium">Email</TableHead>
              <TableHead className="text-md font-medium">Phone</TableHead>
              <TableHead className="text-md font-medium">Subject</TableHead>
              <TableHead className="text-md font-medium">Message</TableHead>
              <TableHead className="text-md font-medium">Product Name</TableHead>
              <TableHead className="text-md font-medium text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((inquiry) => (
              <TableRow key={inquiry._id}>
                <TableCell>{inquiry.name}</TableCell>
                <TableCell>{inquiry.email}</TableCell>
                <TableCell>{inquiry.phone}</TableCell>
                <TableCell>{inquiry.subject}</TableCell>
                <TableCell className="max-w-xs truncate">{inquiry.message}</TableCell>
                <TableCell>{inquiry.productName}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(inquiry._id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500 font-bold" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div>
          Showing page {currentPage} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
