import React from 'react';
import { useForm } from 'react-hook-form';
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
import { useAddInquiryMutation } from "@/slice/inquiry/inquiry";
import { useGetAllSourcesQuery } from "@/slice/source/source";
import { useGetAllStatusesQuery } from '@/slice/status/status';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BreadcrumbWithCustomSeparator } from '@/breadCrumb/BreadCrumb';

const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Inquiry Table", href: "/inquiry-list" },
    { label: "Inquiry Form", href: null }, // No `href` indicates the current page
]

// Define validation schema
const inquirySchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    organisation: z.string().min(2, { message: "Organisation name must be at least 2 characters" }),
    department: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string()
        .regex(/^[0-9]{10}$/, { message: "Phone number must be 10 digits" }),
    address: z.string().optional(),
    country: z.string().optional(),
    message: z.string().min(10, { message: "Message must be at least 10 characters" }),
    needCallback: z.boolean().default(false),
    status: z.string().nonempty({ message: "Please select a status" }),
    source: z.string().nonempty({ message: "Please select a source" })
});

export default function AddInquiryForm({ onClose }) {
    const [addInquiry, { isLoading: isAdding }] = useAddInquiryMutation();
    const { data: statuses, isLoading: statusesLoading } = useGetAllStatusesQuery();
    const { data: sources, isLoading: sourcesLoading } = useGetAllSourcesQuery();
    const navigate = useNavigate();

    // Initialize form with zod resolver
    const form = useForm({
        resolver: zodResolver(inquirySchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            // organisation: "",
            department: "",
            email: "",
            phone: "",
            address: "",
            country: "",
            message: "",
            needCallback: false,
            status: "",
            source: ""
        }
    });

    // Handle form submission
    const onSubmit = async (data) => {
        // Show loading toast
        const toastId = toast.loading('Adding inquiry...');

        try {
            const inquiryData = {
                ...data,
                date: new Date().toISOString().split('T')[0] // Current date
            };

            await addInquiry(inquiryData).unwrap();

            // Update loading toast to success
            toast.update(toastId, {
                render: 'Inquiry added successfully!',
                type: 'success',
                isLoading: false,
                autoClose: 3000,
            });

            // Reset form
            form.reset();

            // Navigate after a short delay
            setTimeout(() => {
                navigate('/inquiry-list');
            }, 1500);
        } catch (error) {
            console.error('Error adding inquiry:', error);
            
            // Update loading toast to error
            toast.update(toastId, {
                render: error?.data?.message || 'Failed to add inquiry. Please try again.',
                type: 'error',
                isLoading: false,
                autoClose: 4000,
            });
        }
    };

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
                    <h2 className="text-xl font-semibold mb-4">Add New Inquiry</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name <span className="text-red-500 text-lg">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter first name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name <span className="text-red-500 text-lg">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* <FormField
                        control={form.control}
                        name="organisation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Organisation <span className="text-red-500 text-lg">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter organisation name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email <span className="text-red-500 text-lg">*</span></FormLabel>
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
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number <span className="text-red-500 text-lg">*</span></FormLabel>
                                <FormControl>
                                    <Input
                                        type="tel"
                                        placeholder="Enter 10-digit phone"
                                        {...field}
                                        maxLength={10}
                                        minLength={10}
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
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter country"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message <span className="text-red-500 text-lg">*</span></FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter message"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="needCallback"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Need Callback</FormLabel>
                                <FormControl>
                                    <Input 
                                    className="w-5 h-5"
                                        type="checkbox"
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
                                <FormLabel>Status <span className="text-red-500 text-lg">*</span></FormLabel>
                                {statusesLoading ? (
                                    <div>Loading statuses...</div>
                                ) : (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {statuses?.data?.map((status) => (
                                                <SelectItem key={status._id} value={status.status}>
                                                    {status.status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="source"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Source <span className="text-red-500 text-lg">*</span></FormLabel>
                                {sourcesLoading ? (
                                    <div>Loading sources...</div>
                                ) : (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select source" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sources?.data?.map((source) => (
                                                <SelectItem key={source._id} value={source.source}>
                                                    {source.source}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-100"
                            onClick={() => navigate('/inquiry-list')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isAdding}
                        >
                            {isAdding ? "Adding..." : "Add Inquiry"}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}