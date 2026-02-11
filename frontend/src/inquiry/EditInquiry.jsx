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
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BreadcrumbWithCustomSeparator } from '@/breadCrumb/BreadCrumb';
import { useGetAllStatusesQuery } from '@/slice/status/status';

const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Inquiry Table", href: "/inquiry-list" },
    { label: "Edit Inquiry", href: null },
]

// Define validation schema
const inquirySchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string()
        .regex(/^[0-9]{10}$/, { message: "Phone number must be 10 digits" }),
    address: z.string().min(2, { message: "Address is required" }),
    country: z.string().min(2, { message: "Country is required" }),
    department: z.string().min(2, { message: "Department is required" }),
    organisation: z.string().optional(),
    message: z.string().optional(),
    needCallback: z.boolean().default(false),
    source: z.string().optional(),
    status: z.string({ required_error: "Please select a status" })
});

export default function EditInquiryForm({ onClose }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: inquiryData, isLoading: isFetching, error: fetchError } = useGetInquiryByIdQuery(id);
    console.log("Fetched inquiry data:", inquiryData);
    const [updateInquiry, { isLoading }] = useUpdateInquiryMutation();
    const { data: statusesData, isLoading: isLoadingStatuses } = useGetAllStatusesQuery();

    // Initialize form with zod resolver
    const form = useForm({
        resolver: zodResolver(inquirySchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            country: "",
            department: "",
            organisation: "",
            message: "",
            needCallback: false,
            source: "",
            status: ""
        },
    });

    // Set form values when inquiryData is loaded
    useEffect(() => {
        if (inquiryData) {
            const patchedValues = {
                ...inquiryData,
                status:
                    typeof inquiryData.status === 'object'
                        ? inquiryData.status?.status
                        : inquiryData.status || '',
                source: inquiryData.source || '',
                needCallback: inquiryData.needCallback ?? false,
            };

            console.log("Patching form with:", patchedValues);
            form.reset(patchedValues);
        }
    }, [inquiryData, form]);

    // Also log current form value after reset
    useEffect(() => {
        console.log("Current form source value:", form.getValues("source"));
        console.log("Current form status value:", form.getValues("status"));
    }, [form.watch(["source", "status"])]);

    // Show error toast if fetch fails
    useEffect(() => {
        if (fetchError) {
            toast.error('Failed to load inquiry data. Please try again.');
        }
    }, [fetchError]);

    const onSubmit = async (data) => {
        // Show loading toast
        const toastId = toast.loading('Updating inquiry...');

        try {
            await updateInquiry({ id, ...data }).unwrap();

            // Update loading toast to success
            toast.update(toastId, {
                render: 'Inquiry updated successfully!',
                type: 'success',
                isLoading: false,
                autoClose: 3000,
            });

            // Navigate after a short delay
            setTimeout(() => {
                navigate("/inquiry-list");
            }, 1500);
        } catch (error) {
            console.error("Failed to update inquiry:", error);

            // Update loading toast to error
            toast.update(toastId, {
                render: error?.data?.message || 'Failed to update inquiry. Please try again.',
                type: 'error',
                isLoading: false,
                autoClose: 4000,
            });
        }
    };

    if (isFetching || isLoadingStatuses) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading inquiry data...</div>
            </div>
        );
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div className="ml-1">
                <BreadcrumbWithCustomSeparator items={breadcrumbItems} />
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
                    <h2 className="text-2xl font-semibold mb-6">Update Inquiry</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* First Name */}
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter first name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Last Name */}
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Enter email address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                            <FormField
                            control={form.control}
                            name="organisation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Organization</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter organization name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />   
                        {/* Phone */}
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter phone number" {...field} maxLength={10} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Country */}
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter country" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Department */}
                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter department" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Status */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Array.isArray(statusesData?.data) ? (
                                                statusesData.data.map((status) => (
                                                    <SelectItem key={status._id} value={status.status}>
                                                        {status.status}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="New Inquiry">New Inquiry</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Source */}
                        <FormField
                            control={form.control}
                            name="source"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Source</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select lead source" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="website">Website</SelectItem>
                                            <SelectItem value="facebook">Facebook</SelectItem>
                                            <SelectItem value="instagram">Instagram</SelectItem>
                                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Need Callback */}
                        <FormField
                            control={form.control}
                            name="needCallback"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={field.onChange}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Request Callback</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Address */}
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter full address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Message */}
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                    <textarea
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Enter your message"
                                        rows={4}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end space-x-4 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(-1)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Updating..." : "Update Inquiry"}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}