import React, { useState } from 'react';
import { Plus, Cpu, Wrench, Package, Layers, Shield, Monitor, Trash2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import CategoryForm from '../../components/forms/CategoryForm';
import { useApp } from '../../context/AppContext';

const iconMap = {
  Cpu,
  Wrench,
  Package,
  Layers,
  Shield,
  Monitor,
};

const CategoriesPage = () => {
  const { categories, addCategory, deleteCategory } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingCat, setDeletingCat] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory Categories</h2>
          <p className="text-xs text-slate-500 mt-0.5">Organize items by department, material composition, and product line.</p>
        </div>
        <Button icon={Plus} onClick={() => setIsAddModalOpen(true)}>
          Add Category
        </Button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Package;

          return (
            <Card
              key={cat.id}
              className="flex flex-col justify-between"
              headerClassName="px-5 py-4 border-b border-slate-100 bg-slate-50/50"
              title={
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-none">{cat.name}</h3>
                    <span className="text-[10px] font-mono font-semibold text-slate-400 mt-1 block">
                      CODE: {cat.code}
                    </span>
                  </div>
                </div>
              }
              action={
                <button
                  onClick={() => setDeletingCat(cat)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              }
            >
              <div className="space-y-4">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {cat.description || 'No department description configured.'}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">Associated SKUs:</span>
                  <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full">
                    {cat.productCount || 0} Products
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Inventory Category"
        maxWidth="max-w-md"
      >
        <CategoryForm
          onSubmit={(data) => addCategory(data)}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deletingCat}
        onClose={() => setDeletingCat(null)}
        title="Delete Category"
        maxWidth="max-w-sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeletingCat(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                deleteCategory(deletingCat.id);
                setDeletingCat(null);
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-xs text-slate-600">
          Delete category <strong>{deletingCat?.name}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
