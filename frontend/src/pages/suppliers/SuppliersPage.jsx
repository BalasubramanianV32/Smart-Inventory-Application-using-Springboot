import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Star, Mail, Phone, MapPin } from 'lucide-react';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import SupplierForm from '../../components/forms/SupplierForm';
import { useApp } from '../../context/AppContext';

const SuppliersPage = () => {
  const { suppliers, addSupplier, editSupplier, deleteSupplier } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [deletingSupplier, setDeletingSupplier] = useState(null);

  const columns = [
    {
      header: 'Supplier Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900 leading-snug">{row.name}</p>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">ID: {row.id}</p>
        </div>
      ),
    },
    {
      header: 'Primary Contact',
      accessor: 'contactPerson',
      render: (row) => (
        <div>
          <p className="text-xs font-semibold text-slate-800">{row.contactPerson}</p>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
            <span className="flex items-center gap-0.5">
              <Mail className="w-3 h-3 text-slate-400" /> {row.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Phone / Address',
      accessor: 'phone',
      render: (row) => (
        <div>
          <p className="text-xs text-slate-700 font-medium">{row.phone}</p>
          <p className="text-[10px] text-slate-400 truncate max-w-xs">{row.address}</p>
        </div>
      ),
    },
    {
      header: 'Rating',
      accessor: 'rating',
      render: (row) => (
        <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{row.rating || 4.8} / 5.0</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status || 'Active'} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => setEditingSupplier(row)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingSupplier(row)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Suppliers Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage external vendors, procurement contacts, and supplier performance metrics.</p>
        </div>
        <Button icon={Plus} onClick={() => setIsAddModalOpen(true)}>
          Add New Supplier
        </Button>
      </div>

      {/* Supplier Table */}
      <Table
        columns={columns}
        data={suppliers}
        searchPlaceholder="Search supplier name, contact, email..."
        pageSize={8}
      />

      {/* Add Supplier Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Vendor / Supplier"
        subtitle="Register new procurement vendor details"
        maxWidth="max-w-xl"
      >
        <SupplierForm
          onSubmit={(data) => addSupplier(data)}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Supplier Modal */}
      <Modal
        isOpen={!!editingSupplier}
        onClose={() => setEditingSupplier(null)}
        title={`Edit Supplier - ${editingSupplier?.name}`}
        maxWidth="max-w-xl"
      >
        {editingSupplier && (
          <SupplierForm
            initialValues={editingSupplier}
            onSubmit={(data) => editSupplier(editingSupplier.id, data)}
            onClose={() => setEditingSupplier(null)}
          />
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deletingSupplier}
        onClose={() => setDeletingSupplier(null)}
        title="Remove Supplier"
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeletingSupplier(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                deleteSupplier(deletingSupplier.id);
                setDeletingSupplier(null);
              }}
            >
              Remove Supplier
            </Button>
          </>
        }
      >
        <p className="text-xs text-slate-600">
          Are you sure you want to remove vendor <strong>{deletingSupplier?.name}</strong> from directory?
        </p>
      </Modal>
    </div>
  );
};

export default SuppliersPage;
