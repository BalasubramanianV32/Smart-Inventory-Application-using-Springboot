import React, { useState } from 'react';
import { Plus, Trash2, Mail, Phone, Building2 } from 'lucide-react';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import CustomerForm from '../../components/forms/CustomerForm';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

const CustomersPage = () => {
  const { customers, addCustomer, deleteCustomer } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState(null);

  const columns = [
    {
      header: 'Customer / Account',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900 leading-snug">{row.name}</p>
          <p className="text-[11px] font-semibold text-blue-600 flex items-center gap-1 mt-0.5">
            <Building2 className="w-3 h-3" /> {row.company}
          </p>
        </div>
      ),
    },
    {
      header: 'Contact Details',
      accessor: 'email',
      render: (row) => (
        <div className="text-xs space-y-0.5">
          <p className="text-slate-700 flex items-center gap-1">
            <Mail className="w-3 h-3 text-slate-400" /> {row.email}
          </p>
          <p className="text-slate-500 flex items-center gap-1 text-[11px]">
            <Phone className="w-3 h-3 text-slate-400" /> {row.phone}
          </p>
        </div>
      ),
    },
    {
      header: 'Total Orders',
      accessor: 'totalOrders',
      render: (row) => (
        <span className="font-bold text-slate-800 text-xs">
          {row.totalOrders} <span className="font-normal text-slate-400">orders</span>
        </span>
      ),
    },
    {
      header: 'Lifetime Spend',
      accessor: 'totalSpent',
      render: (row) => (
        <span className="font-bold text-emerald-600 text-xs">
          {formatCurrency(row.totalSpent)}
        </span>
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
        <button
          onClick={() => setDeletingCustomer(row)}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Accounts</h2>
          <p className="text-xs text-slate-500 mt-0.5">B2B client enterprise accounts, purchase history, and delivery destinations.</p>
        </div>
        <Button icon={Plus} onClick={() => setIsAddModalOpen(true)}>
          Register Customer
        </Button>
      </div>

      <Table
        columns={columns}
        data={customers}
        searchPlaceholder="Search customer account, company, email..."
        pageSize={8}
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register B2B Customer"
        maxWidth="max-w-xl"
      >
        <CustomerForm
          onSubmit={(data) => addCustomer(data)}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!deletingCustomer}
        onClose={() => setDeletingCustomer(null)}
        title="Remove Customer"
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeletingCustomer(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                deleteCustomer(deletingCustomer.id);
                setDeletingCustomer(null);
              }}
            >
              Delete Record
            </Button>
          </>
        }
      >
        <p className="text-xs text-slate-600">
          Remove customer account <strong>{deletingCustomer?.name}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default CustomersPage;
