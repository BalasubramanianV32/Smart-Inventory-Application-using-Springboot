import React, { useState } from 'react';
import { Plus, Edit2, Trash2, PackageCheck, AlertCircle } from 'lucide-react';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ProductForm from '../../components/forms/ProductForm';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ProductsPage = () => {
  const { products, addProduct, editProduct, deleteProduct, categories } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const filterOptions = categories.map((c) => ({ value: c.name, label: c.name }));

  const columns = [
    {
      header: 'Product Info',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900 leading-snug">{row.name}</p>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">{row.sku}</p>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => (
        <span className="text-xs text-slate-600 font-medium bg-slate-100 px-2 py-1 rounded-md">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Warehouse & Loc',
      accessor: 'warehouse',
      render: (row) => (
        <div>
          <p className="text-xs font-medium text-slate-800">{row.warehouse}</p>
          <p className="text-[10px] text-slate-400">{row.location}</p>
        </div>
      ),
    },
    {
      header: 'Price / Cost',
      accessor: 'price',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900">{formatCurrency(row.price)}</p>
          <p className="text-[10px] text-slate-400">Cost: {formatCurrency(row.cost)}</p>
        </div>
      ),
    },
    {
      header: 'Stock Qty',
      accessor: 'stockQuantity',
      render: (row) => (
        <div className="font-bold text-slate-800">
          {row.stockQuantity}{' '}
          <span className="text-[10px] font-normal text-slate-400">units</span>
        </div>
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
          <button
            onClick={() => setEditingProduct(row)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="Edit product"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingProduct(row)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete product"
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
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Products Inventory</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage master catalog items, prices, stock levels, and warehouse placements.</p>
        </div>
        <Button icon={Plus} onClick={() => setIsAddModalOpen(true)}>
          Add New Product
        </Button>
      </div>

      {/* Main Table */}
      <Table
        columns={columns}
        data={products}
        searchPlaceholder="Search by product name, SKU, warehouse..."
        filterOptions={filterOptions}
        onFilterChange={(row, filterVal) => row.category === filterVal}
        pageSize={8}
      />

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Inventory Product"
        subtitle="Fill in catalog details to register new SKU into inventory"
        maxWidth="max-w-2xl"
      >
        <ProductForm
          onSubmit={(data) => addProduct(data)}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title={`Edit Product - ${editingProduct?.sku}`}
        subtitle="Update inventory parameters and location"
        maxWidth="max-w-2xl"
      >
        {editingProduct && (
          <ProductForm
            initialValues={editingProduct}
            onSubmit={(data) => editProduct(editingProduct.id, data)}
            onClose={() => setEditingProduct(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        title="Confirm Delete Product"
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeletingProduct(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                deleteProduct(deletingProduct.id);
                setDeletingProduct(null);
              }}
            >
              Delete Product
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-rose-100 rounded-lg text-rose-600 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Are you sure you want to delete "{deletingProduct?.name}"?
            </p>
            <p className="text-xs text-slate-500 mt-1">
              This action cannot be undone. Removing SKU {deletingProduct?.sku} will erase historical audit logs for this item.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductsPage;
