import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';

const CustomerForm = ({ onSubmit, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
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
          label="Account / Contact Name"
          required
          placeholder="e.g. Tesla Gigafactory Supply"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />

        <Input
          label="Company Name"
          required
          placeholder="e.g. Tesla Motors Inc"
          error={errors.company?.message}
          {...register('company', { required: 'Company is required' })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          required
          placeholder="procurement@tesla.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />

        <Input
          label="Phone"
          placeholder="+1 (650) 555-0100"
          {...register('phone')}
        />
      </div>

      <Input
        label="Shipping / Billing Address"
        placeholder="3500 Deer Creek Rd, Palo Alto, CA"
        {...register('address')}
      />

      <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Register Customer
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;
