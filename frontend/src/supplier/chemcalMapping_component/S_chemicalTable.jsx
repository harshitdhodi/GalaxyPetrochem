import React, { useState } from 'react';
import { Table, Button, Modal, Pagination } from 'antd';
import { useDeleteChemicalFromSupplierMutation } from '@/slice/supplierSlice/SupplierSlice';

export function S_ChemicalTable({ chemicals, refetch, supplierId, onRemoveChemical }) {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteChemicalFromSupplier] = useDeleteChemicalFromSupplierMutation();
  const [selectedChemical, setSelectedChemical] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmDelete = (chemical) => {
    setSelectedChemical(chemical);
    setIsModalOpen(true);
  };

  const handleRemoveChemical = async () => {
    if (!supplierId || !selectedChemical) return;
    try {
      await deleteChemicalFromSupplier({
        supplierId: supplierId,
        chemicalId: selectedChemical._id,
      });
      onRemoveChemical(selectedChemical);
      refetch();
      setIsModalOpen(false);
      setSelectedChemical(null);
      if (currentChemicals.length === 1 && page > 1) {
        setPage(1);
      }
    } catch (error) {
      console.error('Error removing chemical:', error);
    }
  };

  const totalPages = Math.ceil(chemicals.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentChemicals = chemicals.slice(startIndex, endIndex);

  const columns = [
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, chemical) => (
        <Button danger size="small" onClick={() => handleConfirmDelete(chemical)}>
          Delete
        </Button>
      ),
    },
    { title: 'Chemical Name', dataIndex: 'name' },
    { title: 'CAS Number', dataIndex: 'cas_number' },
  ];

  return (
    <div className="border rounded-md mt-4 p-4">
      <Table
        dataSource={currentChemicals}
        columns={columns}
        rowKey="_id"
        pagination={false}
      />
      <Pagination
        current={page}
        total={chemicals.length}
        pageSize={itemsPerPage}
        onChange={(page) => setPage(page)}
        showSizeChanger
        onShowSizeChange={(_, size) => setItemsPerPage(size)}
        className="mt-4 float-end pt-5"
      />
      <Modal
        title="Confirm Deletion"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleRemoveChemical}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete "{selectedChemical?.name}"?</p>
      </Modal>
    </div>
  );
}
