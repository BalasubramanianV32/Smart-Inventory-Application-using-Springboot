import React, { useState } from 'react';
import { Plus, Warehouse, MapPin, User, Mail, Phone, Edit2, Trash2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import WarehouseForm from '../../components/forms/WarehouseForm';
import { useApp } from '../../context/AppContext';
import { formatNumber } from '../../utils/formatters';

const WarehousesPage = () => {
  const { warehouses, addWarehouse, editWarehouse, deleteWarehouse } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingWh, setEditingWh] = useState(null);
  const [deletingWh, setDeletingWh] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Warehouse Facilities</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage distribution hubs, capacity thresholds, and regional managers.</p>
        </div>
        <Button icon={Plus} onClick={() => setIsAddModalOpen(true)}>
          Add Warehouse Facility
        </Button>
      </div>

      {/* Grid of Warehouse Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((wh) => {
          const utilPct = wh.utilizationPct || 0;
          const isHighCapacity = utilPct > 90;

          return (
            <Card
              key={wh.id}
              className="flex flex-col justify-between"
              headerClassName="px-5 py-4 border-b border-slate-100 bg-slate-50/50"
              title={
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Warehouse className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-none">{wh.name}</p>
                    <span className="text-[11px] font-mono text-slate-400 mt-1 block">
                      ID: {wh.id} • {wh.code}
                    </span>
                  </div>
                </div>
              }
              action={
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingWh(wh)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingWh(wh)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              }
            >
              <div className="space-y-4 text-xs">
                {/* Location */}
                <div className="flex items-center text-slate-600 gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{wh.address || wh.location}</span>
                </div>

                {/* Capacity Progress Bar */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Capacity Usage</span>
                    <span className={`font-bold ${isHighCapacity ? 'text-rose-600' : 'text-slate-800'}`}>
                      {utilPct}% ({formatNumber(wh.currentStock)} / {formatNumber(wh.capacityTotal)} units)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isHighCapacity ? 'bg-rose-500' : utilPct > 75 ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(utilPct, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Manager Contact Info */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-slate-600">
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{wh.manager}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{wh.contactPhone || 'N/A'}</span>
                  </div>
                </div>

                {/* Status & Health */}
                <div className="pt-2 flex items-center justify-between">
                  <Badge status={wh.health || 'Healthy'} />
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {wh.status || 'Active'}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Warehouse Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Warehouse Facility"
        subtitle="Register new regional distribution warehouse"
        maxWidth="max-w-xl"
      >
        <WarehouseForm
          onSubmit={(data) => addWarehouse(data)}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Warehouse Modal */}
      <Modal
        isOpen={!!editingWh}
        onClose={() => setEditingWh(null)}
        title={`Edit Facility - ${editingWh?.name}`}
        maxWidth="max-w-xl"
      >
        {editingWh && (
          <WarehouseForm
            initialValues={editingWh}
            onSubmit={(data) => editWarehouse(editingWh.id, data)}
            onClose={() => setEditingWh(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deletingWh}
        onClose={() => setDeletingWh(null)}
        title="Delete Facility"
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeletingWh(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                deleteWarehouse(deletingWh.id);
                setDeletingWh(null);
              }}
            >
              Delete Facility
            </Button>
          </>
        }
      >
        <p className="text-xs text-slate-600">
          Are you sure you want to remove warehouse <strong>{deletingWh?.name}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default WarehousesPage;
