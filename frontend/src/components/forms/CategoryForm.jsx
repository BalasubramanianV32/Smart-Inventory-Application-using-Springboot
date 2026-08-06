import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const CategoryForm = ({ onSubmit, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      code: '',
      description: '',
      icon: 'Package',
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
          label="Category Name"
          required
          placeholder="e.g. Electrical Components"
          error={errors.name?.message}
          {...register('name', { required: 'Category name is required' })}
        />

        <Input
          label="Category Code"
          required
          placeholder="e.g. ELEC"
          error={errors.code?.message}
          {...register('code', { required: 'Code is required' })}
        />
      </div>

      <Select
        label="Icon Theme"
        options={[
          { value: 'Cpu', label: 'Cpu / Tech' },
          { value: 'Wrench', label: 'Wrench / Hardware' },
          { value: 'Package', label: 'Package / Logistics' },
          { value: 'Layers', label: 'Layers / Raw Materials' },
          { value: 'Shield', label: 'Shield / Safety PPE' },
          { value: 'Monitor', label: 'Monitor / IT Devices' },
        ]}
        {...register('icon')}
      />

      <Input
        label="Description"
        placeholder="Brief description of products included in this group..."
        {...register('description')}
      />

      <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Create Category
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
