import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Boxes, Lock, Mail, User, Shield, UserCheck } from 'lucide-react';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { useApp } from '../../context/AppContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'Manager',
    },
  });

  const passwordVal = watch('password');

  const onSubmit = (data) => {
    login(data.email, data.role);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full my-8">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/30 mb-2">
            <Boxes className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create Enterprise Account</h1>
          <p className="text-xs text-slate-500 mt-0.5">Join Inventria Inventory Platform</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              icon={User}
              required
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name', { required: 'Full name is required' })}
            />

            <Input
              label="Work Email Address"
              type="email"
              icon={Mail}
              required
              placeholder="name@company.com"
              error={errors.email?.message}
              {...register('email', { required: 'Email address is required' })}
            />

            <Select
              label="Role Assignment"
              icon={Shield}
              required
              options={[
                { value: 'Manager', label: 'Warehouse Manager (Full Admin Access)' },
                { value: 'Employee', label: 'Inventory Employee (Standard Staff)' },
              ]}
              {...register('role')}
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              required
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />

            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              required
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm password',
                validate: (val) => val === passwordVal || 'Passwords do not match',
              })}
            />

            <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting} icon={UserCheck}>
              Register Account
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
