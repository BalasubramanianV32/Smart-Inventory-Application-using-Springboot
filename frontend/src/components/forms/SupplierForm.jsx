import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';

const SupplierForm = ({ initialValues = null, onSubmit, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialValues || {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      categories: '',
    },
  });

  const handleFormSubmit = (data) => {
    const formatted = {
      ...data,
      categories: typeof data.categories === 'string' ? data.categories.split(',').map((c) => c.trim()) : data.categories,
    };
    onSubmit(formatted);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Company Name"
          required
          placeholder="e.g. Apex Automation Corp"
          error={errors.name?.message}
          {...register('name', { required: 'Company name is required' })}
        />

        <Input
          label="Contact Person"
          required
          placeholder="e.g. Marcus Sterling"
          error={errors.contactPerson?.message}
          {...register('contactPerson', { required: 'Contact person is required' })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email Address"
          type="email"
          required
          placeholder="m.sterling@apexauto.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />

        <Input
          label="Phone Number"
          required
          placeholder="+1 (800) 555-9011"
          error={errors.phone?.message}
          {...register('phone', { required: 'Phone is required' })}
        />
      </div>

      <Input
        label="Supplied Categories (comma separated)"
        placeholder="Electronics, Hardware"
        {...register('categories')}
      />

      <Input
        label="Business Address"
        placeholder="100 Tech Blvd, San Jose, CA"
        {...register('address')}
      />

      <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialValues ? 'Save Changes' : 'Add Supplier'}
        </Button>
      </div>
    </form>
  );
};

export default SupplierForm;
