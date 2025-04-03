import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetAllServersQuery, useDeleteServerMutation } from '@/slice/smtpSlice/smtp';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { Pencil, Trash2 } from 'lucide-react'; // Import icons for buttons

const SMTPTable = () => {
  const { data: smtp, isLoading, error } = useGetAllServersQuery();
  const [deleteServer] = useDeleteServerMutation();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this server?')) {
      await deleteServer(id);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching data: {error.message}</p>;
  }

  return (
    <div className="w-full  p-4">
    
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">SMTP Settings</h1>
        <Link to="/add-smtp">
          <Button className="bg-[#3b1f91] text-white hover:bg-purple-700" variant="primary">Add SMTP</Button>
        </Link>
      </div>
      <hr className='mb-5' />
      {/* Table Section */}
      <Table className='border shadow-md'>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Actions</TableHead>
            <TableHead>Host</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>SSL</TableHead>
            <TableHead>Default</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {smtp?.data?.map((server) => (
            <TableRow key={server._id}>
              <TableCell>
                <div className="flex gap-2">
                  <Link to={`/edit-smtp-form/${server._id}`}>
                  <Button
                    className="bg-green-500 hover:bg-green-600"
                    size="sm"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  </Link>
                  <Button
                    onClick={() => handleDelete(server._id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </TableCell>
              <TableCell>{server.host}</TableCell>
              <TableCell>{server.name}</TableCell>
              <TableCell>{server.isSSL ? 'Yes' : 'No'}</TableCell>
              <TableCell>{server.isDefault ? 'Yes' : 'No'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SMTPTable;
