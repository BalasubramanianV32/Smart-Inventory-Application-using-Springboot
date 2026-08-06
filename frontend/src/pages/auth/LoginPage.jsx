import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Boxes, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useApp } from '../../context/AppContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [rememberMe, setRememberMe] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: 'john.doe@inventria.io',
      password: 'password123',
    },
  });

  const onSubmit = (data) => {
    login(data.email, 'Manager');
    navigate('/');
  };

  const fillDemoManager = () => {
    setValue('email', 'sarah.jenkins@inventria.io');
    setValue('password', 'manager2026');
    login('sarah.jenkins@inventria.io', 'Manager');
    navigate('/');
  };

  const fillDemoEmployee = () => {
    setValue('email', 'alex.employee@inventria.io');
    setValue('password', 'employee2026');
    login('alex.employee@inventria.io', 'Employee');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/30 mb-3">
            <Boxes className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome to Inventria</h1>
          <p className="text-xs text-slate-500 mt-1">Smart Inventory & Warehouse Management Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Work Email Address"
              type="email"
              icon={Mail}
              required
              placeholder="name@company.com"
              error={errors.email?.message}
              {...register('email', { required: 'Email address is required' })}
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              required
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', { required: 'Password is required' })}
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember me</span>
              </label>

              <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline font-semibold">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting} icon={ArrowRight}>
              Sign In to Dashboard
            </Button>
          </form>

          {/* Quick Demo Login Auto-fill Buttons */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-2">
              Quick Demo Fill
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoManager}
                className="py-2 px-3 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Manager Demo
              </button>
              <button
                type="button"
                onClick={fillDemoEmployee}
                className="py-2 px-3 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                Employee Demo
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Create Enterprise Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
