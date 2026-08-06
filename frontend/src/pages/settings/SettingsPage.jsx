import React, { useState } from 'react';
import { Building, User, Lock, Save, ShieldCheck } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { useApp } from '../../context/AppContext';

const SettingsPage = () => {
  const { user, setUser, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('profile');

  // Form local states
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [companyName, setCompanyName] = useState('Inventria Enterprise Logistics Corp');
  const [taxId, setTaxId] = useState('IN-GSTIN-27AABCU9603R1ZM');

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser((prev) => ({ ...prev, name: profileName, email: profileEmail }));
    showToast('User profile settings updated!');
  };

  const handleSaveCompany = (e) => {
    e.preventDefault();
    showToast('Company information saved!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPass || newPass !== confirmPass) {
      showToast('Passwords do not match!', 'danger');
      return;
    }
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    showToast('Password changed successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System & Account Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage organizational preferences, user profile credentials, and security controls.</p>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>User Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('company')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'company'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Company Information</span>
        </button>

        <button
          onClick={() => setActiveTab('password')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'password'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Change Password</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'profile' && (
        <Card title="User Profile Details" subtitle="Update your personal workspace identity">
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-md"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.role} Account</p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Active Verified Session
                </span>
              </div>
            </div>

            <Input
              label="Display Name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />

            <Input
              label="Work Email Address"
              type="email"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
            />

            <div className="pt-2">
              <Button type="submit" icon={Save}>
                Save Profile
              </Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === 'company' && (
        <Card title="Enterprise Organization Info" subtitle="Configure legal entity and ERP invoice headers">
          <form onSubmit={handleSaveCompany} className="space-y-4 max-w-xl">
            <Input
              label="Company Legal Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <Input
              label="Tax Registration ID"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
            />

            <Select
              label="Default Base Currency"
              options={[
                { value: 'INR', label: 'INR (₹) Indian Rupee' },
                { value: 'USD', label: 'USD ($) United States Dollar' },
                { value: 'EUR', label: 'EUR (€) Euro' },
              ]}
            />

            <div className="pt-2">
              <Button type="submit" icon={Save}>
                Save Company Info
              </Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === 'password' && (
        <Card title="Password & Security Controls" subtitle="Update authentication password for this user account">
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
            />

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />

            <div className="pt-2">
              <Button type="submit" icon={ShieldCheck}>
                Update Security Password
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default SettingsPage;
