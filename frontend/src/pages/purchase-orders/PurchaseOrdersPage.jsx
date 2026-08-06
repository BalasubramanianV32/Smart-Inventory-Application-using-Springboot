import React, { useState } from 'react';
import { Plus, Eye, CheckCircle2, Clock, Truck, FileText } from 'lucide-react';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import PurchaseOrderForm from '../../components/forms/PurchaseOrderForm';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const PurchaseOrdersPage = () => {
  const { purchaseOrders, addPurchaseOrder, updatePOStatus } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);

  const columns = [
    {
      header: 'PO Reference',
      accessor: 'id',
      render: (row) => (
        <div>
          <p className="font-bold text-blue-600 leading-snug">{row.id}</p>
          <p className="text-[10px] text-slate-400">Created by {row.createdByName || 'Manager'}</p>
        </div>
      ),
    },
    {
      header: 'Supplier Vendor',
      accessor: 'supplier',
      render: (row) => <span className="font-semibold text-slate-800 text-xs">{row.supplier}</span>,
    },
    {
      header: 'Destination Hub',
      accessor: 'warehouse',
      render: (row) => <span className="text-xs text-slate-600">{row.warehouse}</span>,
    },
    {
      header: 'Order Date',
      accessor: 'orderDate',
      render: (row) => (
        <div>
          <p className="text-xs text-slate-700">{formatDate(row.orderDate)}</p>
          <p className="text-[10px] text-slate-400">Expected: {formatDate(row.expectedDelivery)}</p>
        </div>
      ),
    },
    {
      header: 'Total Value',
      accessor: 'totalAmount',
      render: (row) => (
        <span className="font-bold text-slate-900 text-xs">{formatCurrency(row.totalAmount)}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            icon={Eye}
            onClick={() => setSelectedPO(row)}
          >
            Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Purchase Orders</h2>
          <p className="text-xs text-slate-500 mt-0.5">Procurement purchase requisitions, supplier approvals, and inventory receiving.</p>
        </div>
        <Button icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
          Create Purchase Order
        </Button>
      </div>

      <Table
        columns={columns}
        data={purchaseOrders}
        searchPlaceholder="Search by PO ID, supplier name, warehouse..."
        pageSize={8}
      />

      {/* Create PO Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Requisition Purchase Order"
        subtitle="Specify vendor items and delivery warehouse"
        maxWidth="max-w-3xl"
      >
        <PurchaseOrderForm
          onSubmit={(data) => addPurchaseOrder(data)}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* View PO Details Modal */}
      <Modal
        isOpen={!!selectedPO}
        onClose={() => setSelectedPO(null)}
        title={`Purchase Order Details - ${selectedPO?.id}`}
        maxWidth="max-w-2xl"
        footer={
          <div className="flex items-center gap-2">
            {selectedPO?.status === 'Pending' && (
              <Button
                variant="primary"
                size="sm"
                icon={CheckCircle2}
                onClick={() => {
                  updatePOStatus(selectedPO.id, 'Approved');
                  setSelectedPO({ ...selectedPO, status: 'Approved' });
                }}
              >
                Approve PO
              </Button>
            )}
            {selectedPO?.status === 'Approved' && (
              <Button
                variant="success"
                size="sm"
                icon={Truck}
                onClick={() => {
                  updatePOStatus(selectedPO.id, 'Received');
                  setSelectedPO({ ...selectedPO, status: 'Received' });
                }}
              >
                Mark Items Received
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setSelectedPO(null)}>
              Close
            </Button>
          </div>
        }
      >
        {selectedPO && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Supplier Vendor</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedPO.supplier}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Destination</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedPO.warehouse}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Order Date</span>
                <p className="font-semibold text-slate-800 mt-0.5">{formatDate(selectedPO.orderDate)}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Status</span>
                <div className="mt-0.5">
                  <Badge status={selectedPO.status} />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">Purchased Items Breakdown</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="p-2.5">Item Description</th>
                      <th className="p-2.5">Quantity</th>
                      <th className="p-2.5">Unit Price</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedPO.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-medium text-slate-800">{item.name}</td>
                        <td className="p-2.5">{item.quantity} units</td>
                        <td className="p-2.5">{formatCurrency(item.unitPrice)}</td>
                        <td className="p-2.5 text-right font-bold text-slate-900">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50/60 border border-blue-100">
              <span className="font-bold text-blue-900">Total Purchase Order Value:</span>
              <span className="text-base font-bold text-blue-700">{formatCurrency(selectedPO.totalAmount)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PurchaseOrdersPage;
