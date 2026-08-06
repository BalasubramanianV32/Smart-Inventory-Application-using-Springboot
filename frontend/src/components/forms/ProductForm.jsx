import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';

const ProductForm = ({ initialValues = null, onSubmit, onClose }) => {
  const { warehouses, categories, suppliers } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialValues || {
      name: '',
      sku: '',
      category: categories[0]?.name || '',
      price: '',
      cost: '',
      stockQuantity: '',
      minStockThreshold: '30',
      warehouse: warehouses[0]?.name || '',
      location: '',
      supplier: suppliers[0]?.name || '',
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Product Name"
          required
          placeholder="e.g. High-Torque Stepper Motor"
          error={errors.name?.message}
          {...register('name', { required: 'Product name is required' })}
        />

        <Input
          label="SKU Code"
          required
          placeholder="e.g. MOT-NEMA23-01"
          error={errors.sku?.message}
          {...register('sku', { required: 'SKU is required' })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Category"
          required
          options={categories.map((c) => ({ value: c.name, label: c.name }))}
          error={errors.category?.message}
          {...register('category', { required: 'Select a category' })}
        />

        <Select
          label="Primary Supplier"
          required
          options={suppliers.map((s) => ({ value: s.name, label: s.name }))}
          error={errors.supplier?.message}
          {...register('supplier', { required: 'Select a supplier' })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Selling Price ($)"
          type="number"
          step="0.01"
          required
          placeholder="0.00"
          error={errors.price?.message}
          {...register('price', { required: 'Price is required', min: 0 })}
        />

        <Input
          label="Cost Price ($)"
          type="number"
          step="0.01"
          required
          placeholder="0.00"
          error={errors.cost?.message}
          {...register('cost', { required: 'Cost is required', min: 0 })}
        />

        <Input
          label="Initial Stock Qty"
          type="number"
          required
          placeholder="100"
          error={errors.stockQuantity?.message}
          {...register('stockQuantity', { required: 'Quantity is required', min: 0 })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Target Warehouse"
          required
          options={warehouses.map((w) => ({ value: w.name, label: `${w.name} (${w.id})` }))}
          error={errors.warehouse?.message}
          {...register('warehouse', { required: 'Select warehouse' })}
        />

        <Input
          label="Aisle / Bin Location"
          placeholder="e.g. Aisle 4, Shelf B2"
          {...register('location')}
        />
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialValues ? 'Save Changes' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
