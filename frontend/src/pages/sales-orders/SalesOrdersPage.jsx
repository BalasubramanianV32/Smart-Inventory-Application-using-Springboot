import React, { useState } from 'react';
import { Plus, Printer, Eye, Truck, CheckCircle2, FileText, Building2 } from 'lucide-react';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import SalesOrderForm from '../../components/forms/SalesOrderForm';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const SalesOrdersPage = () => {
  const { salesOrders, addSalesOrder, updateSOStatus, user, showToast } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSO, setSelectedSO] = useState(null);
  const [invoiceSO, setInvoiceSO] = useState(null);

  const columns = [
    {
      header: 'Sales Order ID',
      accessor: 'id',
      render: (row) => (
        <div>
          <p className="font-bold text-blue-600 leading-snug">{row.id}</p>
          <p className="text-[10px] text-slate-400">Date: {formatDate(row.orderDate)}</p>
        </div>
      ),
    },
    {
      header: 'Customer Account',
      accessor: 'customerName',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900 text-xs">{row.customerName}</p>
          <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
            <Building2 className="w-2.5 h-2.5" /> {row.customerCompany}
          </p>
        </div>
      ),
    },
    {
      header: 'Line Items',
      accessor: 'itemsCount',
      render: (row) => <span className="text-xs text-slate-700 font-semibold">{row.itemsCount} SKUs</span>,
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
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Printer}
            onClick={() => setInvoiceSO(row)}
          >
            Invoice
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Eye}
            onClick={() => setSelectedSO(row)}
          >
            Details
          </Button>
        </div>
      ),
    },
  ];

  const handlePrintInvoice = () => {
    window.print();
    showToast('Invoice sent to print manager.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Orders & Fulfillment</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage customer sales pipelines, tax invoices, and shipment deliveries.</p>
        </div>
        <Button icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
          Create Sales Order
        </Button>
      </div>

      <Table
        columns={columns}
        data={salesOrders}
        searchPlaceholder="Search order ID, customer name, company..."
        pageSize={8}
      />

      {/* Create Sales Order Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Sales Order"
        maxWidth="max-w-3xl"
      >
        <SalesOrderForm
          onSubmit={(data) => addSalesOrder(data)}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* View SO Details Modal */}
      <Modal
        isOpen={!!selectedSO}
        onClose={() => setSelectedSO(null)}
        title={`Sales Order Details - ${selectedSO?.id}`}
        maxWidth="max-w-2xl"
        footer={
          <div className="flex items-center gap-2">
            {selectedSO?.status === 'Processing' && (
              <Button
                variant="primary"
                size="sm"
                icon={Truck}
                onClick={() => {
                  updateSOStatus(selectedSO.id, 'Shipped');
                  setSelectedSO({ ...selectedSO, status: 'Shipped' });
                }}
              >
                Dispatch Shipment
              </Button>
            )}
            {selectedSO?.status === 'Shipped' && (
              <Button
                variant="success"
                size="sm"
                icon={CheckCircle2}
                onClick={() => {
                  updateSOStatus(selectedSO.id, 'Delivered');
                  setSelectedSO({ ...selectedSO, status: 'Delivered' });
                }}
              >
                Confirm Delivered
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setSelectedSO(null)}>
              Close
            </Button>
          </div>
        }
      >
        {selectedSO && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Customer Account</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedSO.customerName}</p>
                <p className="text-slate-500">{selectedSO.customerCompany}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Shipping Address</span>
                <p className="text-slate-700 mt-0.5">{selectedSO.shippingAddress}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">Order Products</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="p-2.5">SKU / Item Name</th>
                      <th className="p-2.5">Qty</th>
                      <th className="p-2.5">Unit Price</th>
                      <th className="p-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedSO.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-medium text-slate-800">
                          {item.name || item.productName}
                        </td>
                        <td className="p-2.5">{item.quantity}</td>
                        <td className="p-2.5">{formatCurrency(item.unitPrice)}</td>
                        <td className="p-2.5 text-right font-bold text-slate-900">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Invoice Generator Modal */}
      <Modal
        isOpen={!!invoiceSO}
        onClose={() => setInvoiceSO(null)}
        title="Commercial Tax Invoice"
        maxWidth="max-w-2xl"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setInvoiceSO(null)}>
              Close Preview
            </Button>
            <Button size="sm" icon={Printer} onClick={handlePrintInvoice}>
              Print Invoice (PDF)
            </Button>
          </div>
        }
      >
        {invoiceSO && (
          <div id="printable-invoice" className="p-6 bg-white border border-slate-200 rounded-xl space-y-6 text-xs font-sans">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-wider">INVENTRIA</h1>
                <p className="text-[11px] text-slate-500 font-semibold">Enterprise Inventory Platform</p>
                <p className="text-slate-400 mt-1">100 Enterprise Way, Suite 400<br />San Francisco, CA 94107</p>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-bold text-blue-600">INVOICE</h2>
                <p className="font-mono text-slate-700 font-bold mt-1">INV-{invoiceSO.id}</p>
                <p className="text-slate-500 mt-1">Date: {formatDate(invoiceSO.orderDate)}</p>
                <Badge status={invoiceSO.paymentStatus || 'Paid'} className="mt-1" />
              </div>
            </div>

            {/* Billing Details */}
            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Billed To:</p>
                <p className="font-bold text-slate-900 mt-1">{invoiceSO.customerName}</p>
                <p className="font-semibold text-slate-700">{invoiceSO.customerCompany}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Ship To Destination:</p>
                <p className="text-slate-700 mt-1 leading-relaxed">{invoiceSO.shippingAddress}</p>
              </div>
            </div>

            {/* Line items */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800 text-[10px] font-bold text-slate-700 uppercase">
                  <th className="py-2">Item Description</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2">Unit Price</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoiceSO.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-medium text-slate-800">{item.name || item.productName}</td>
                    <td className="py-3 text-slate-600">{item.quantity}</td>
                    <td className="py-3 text-slate-600">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3 text-right font-bold text-slate-900">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Invoice Total */}
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoiceSO.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Tax (0%):</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-300 pt-2">
                  <span>Total Amount Due:</span>
                  <span className="text-blue-600">{formatCurrency(invoiceSO.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SalesOrdersPage;
