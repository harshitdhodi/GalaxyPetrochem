import React, { useState } from 'react';
import { Table, Button, Select, Space } from 'antd';

export function ChemicalTable({ chemicals, onRemoveChemical }) {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate pagination
  const totalPages = Math.ceil((chemicals?.length || 0) / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentChemicals = chemicals?.slice(startIndex, endIndex);

  const columns = [
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => (
        <Button type="primary" danger size="small" onClick={() => onRemoveChemical(record)}>
          Delete
        </Button>
      ),
    },
    {
      title: 'Chemical Name',
      dataIndex: 'name',
    },
    {
      title: 'CAS Number',
      dataIndex: 'cas_number',
    },
  ];

  return (
    <div className="border rounded-md mt-4 p-4">
      <Table
        columns={columns}
        dataSource={currentChemicals}
        rowKey="_id"
        pagination={false}
      />

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Items per page:{' '}
          <Select
            value={itemsPerPage}
            onChange={(value) => {
              setItemsPerPage(value);
              setPage(1); // Reset to first page when changing items per page
            }}
            options={[
              { value: 10, label: '10' },
              { value: 20, label: '20' },
              { value: 50, label: '50' },
            ]}
            style={{ width: 80 }}
          />
        </div>

        <Space>
          <Button
            type="default"
            size="small"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            {startIndex + 1} - {Math.min(endIndex, chemicals?.length || 0)} of{' '}
            {chemicals?.length || 0}
          </span>
          <Button
            type="default"
            size="small"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </Space>
      </div>
    </div>
  );
}
