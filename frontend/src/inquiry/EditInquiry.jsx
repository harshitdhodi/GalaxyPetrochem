import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";
import { useAddInquiryMutation, useGetInquiryByIdQuery, useUpdateInquiryMutation } from "@/slice/inquiry/inquiry";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate and useParams
import { BreadcrumbWithCustomSeparator } from '@/breadCrumb/BreadCrumb';
import { useGetAllStatusesQuery } from '@/slice/status/status';

const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Inquiry Table", href: "/inquiry-list" },
    { label: "Inquiry Form", href: null }, // No `href` indicates the current page
]
// Define validation schema
const inquirySchema = z.object({
    companyName: z.string().min(2, { message: "Company name must be at least 2 characters" }),
    name: z.string().min(2, { message: "Full name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    mobile: z.string()
        .regex(/^[0-9]{10}$/, { message: "Mobile number must be 10 digits" }),
    address: z.string().min(2, { message: "Address must be at least 2 characters" }),
    status: z.string({ required_error: "Please select a status" })
});

export default function EditInquiryForm({ onClose }) {
    const { id } = useParams();  // Use the id from route params
    const navigate = useNavigate(); // Initialize useNavigate
    const { data: inquiryData, isLoading: isFetching } = useGetInquiryByIdQuery(id); // Fetch inquiry data by id
    const [updateInquiry, { isLoading }] = useUpdateInquiryMutation();
    const { data: statusesData, isLoading: isLoadingStatuses } = useGetAllStatusesQuery();

    // Initialize form with zod resolver
    const form = useForm({
        resolver: zodResolver(inquirySchema),
        defaultValues: {
            companyName: "",
            name: "",
            email: "",
            mobile: "",
            address: "",
            status: "New Inquiry"
        }
    });

    // Set form values when inquiry data is fetched
    useEffect(() => {
        if (inquiryData) {
            form.reset({
                companyName: inquiryData.companyName || "",
                name: inquiryData.name || "",
                email: inquiryData.email || "",
                mobile: inquiryData.mobile || "",
                address: inquiryData.address || "",
                status: inquiryData.status || "New Inquiry"
            });
        }
    }, [inquiryData, form]);

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            // Perform update mutation
            const response = await updateInquiry({ id, ...data }).unwrap();
            
            // Reset form
            form.reset();

            // Redirect to the inquiry list page
            navigate('/inquiry-list');
        } catch (error) {
            // Handle error
            alert({
                title: "Error",
                description: error?.data?.message || "Failed to update inquiry",
                variant: "destructive"
            });
        }
    };

    if (isFetching) return <div>Loading...</div>;  // Loading state

    return (
        <>
          <div className="ml-1">
                <BreadcrumbWithCustomSeparator items={breadcrumbItems} />

            </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
                <h2 className="text-xl font-semibold mb-4">Update Inquiry</h2>
                
                <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="Enter company name" 
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="Enter full name" 
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input 
                                    type="email"
                                    placeholder="Enter email" 
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                                <Input 
                                    type="tel"
                                    placeholder="Enter 10-digit mobile" 
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="Enter address" 
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {statusesData?.data?.map((statusItem) => (
                                        <SelectItem key={statusItem._id} value={statusItem.status}>
                                            {statusItem.status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating..." : "Update Inquiry"}
                    </Button>
                </div>
            </form>
        </Form>
        </>
    );
}
