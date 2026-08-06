import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';

const WarehouseForm = ({ initialValues = null, onSubmit, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialValues || {
      name: '',
      code: '',
      location: '',
      address: '',
      manager: '',
      contactEmail: '',
      contactPhone: '',
      capacityTotal: '50000',
      currentStock: '0',
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
          label="Warehouse Name"
          required
          placeholder="e.g. Midwest Logistics Hub"
          error={errors.name?.message}
          {...register('name', { required: 'Warehouse name is required' })}
        />

        <Input
          label="Facility Code"
          required
          placeholder="e.g. WH-MW-01"
          error={errors.code?.message}
          {...register('code', { required: 'Facility code is required' })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="City / Location"
          required
          placeholder="e.g. Chicago, IL"
          error={errors.location?.message}
          {...register('location', { required: 'Location is required' })}
        />

        <Input
          label="Facility Manager"
          required
          placeholder="e.g. Sarah Jenkins"
          error={errors.manager?.message}
          {...register('manager', { required: 'Manager name is required' })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Contact Email"
          type="email"
          placeholder="manager@inventora.io"
          {...register('contactEmail')}
        />

        <Input
          label="Contact Phone"
          placeholder="+1 (312) 555-0192"
          {...register('contactPhone')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Total Capacity (Units)"
          type="number"
          required
          placeholder="50000"
          error={errors.capacityTotal?.message}
          {...register('capacityTotal', { required: 'Capacity is required' })}
        />

        <Input
          label="Current Stock Count"
          type="number"
          placeholder="0"
          {...register('currentStock')}
        />
      </div>

      <Input
        label="Full Physical Address"
        placeholder="1400 Industrial Parkway, Chicago, IL 60601"
        {...register('address')}
      />

      <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialValues ? 'Update Warehouse' : 'Add Facility'}
        </Button>
      </div>
    </form>
  );
};

export default WarehouseForm;
