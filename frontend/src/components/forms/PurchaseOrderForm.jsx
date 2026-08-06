import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

const PurchaseOrderForm = ({ onSubmit, onClose }) => {
  const { suppliers, warehouses, products } = useApp();

  const [selectedSupplier, setSelectedSupplier] = useState(suppliers[0]?.name || '');
  const [selectedWarehouse, setSelectedWarehouse] = useState(warehouses[0]?.name || '');
  const [expectedDelivery, setExpectedDelivery] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );

  // PO Items list state
  const [items, setItems] = useState([
    {
      productName: products[0]?.name || '',
      quantity: 100,
      unitPrice: products[0]?.cost || 25,
      total: (products[0]?.cost || 25) * 100,
    },
  ]);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === 'productName') {
      const found = products.find((p) => p.name === value);
      if (found) {
        updated[index].unitPrice = found.cost || 10;
      }
    }

    const qty = Number(updated[index].quantity) || 0;
    const price = Number(updated[index].unitPrice) || 0;
    updated[index].total = qty * price;

    setItems(updated);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      {
        productName: products[0]?.name || '',
        quantity: 50,
        unitPrice: products[0]?.cost || 20,
        total: (products[0]?.cost || 20) * 50,
      },
    ]);
  };

  const removeItemRow = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const grandTotal = items.reduce((sum, item) => sum + (item.total || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const poData = {
      supplier: selectedSupplier,
      warehouse: selectedWarehouse,
      expectedDelivery,
      totalAmount: grandTotal,
      itemsCount: items.length,
      items,
    };
    onSubmit(poData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Target Supplier"
          required
          options={suppliers.map((s) => ({ value: s.name, label: s.name }))}
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
        />

        <Select
          label="Receiving Warehouse"
          required
          options={warehouses.map((w) => ({ value: w.name, label: w.name }))}
          value={selectedWarehouse}
          onChange={(e) => setSelectedWarehouse(e.target.value)}
        />

        <Input
          label="Expected Delivery Date"
          type="date"
          required
          value={expectedDelivery}
          onChange={(e) => setExpectedDelivery(e.target.value)}
        />
      </div>

      {/* Item Rows */}
      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Order Line Items</h4>
          <Button variant="ghost" size="sm" icon={Plus} onClick={addItemRow}>
            Add Item Line
          </Button>
        </div>

        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-center bg-white p-3 rounded-lg border border-slate-200">
            <div className="col-span-12 sm:col-span-5">
              <Select
                placeholder="Choose Product..."
                options={products.map((p) => ({ value: p.name, label: `${p.name} ($${p.cost})` }))}
                value={item.productName}
                onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
              />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <Input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <Input
                type="number"
                step="0.01"
                placeholder="Unit $"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
              />
            </div>
            <div className="col-span-3 sm:col-span-2 font-semibold text-xs text-slate-800 text-right pr-2">
              {formatCurrency(item.total)}
            </div>
            <div className="col-span-1 flex justify-end">
              <button
                type="button"
                onClick={() => removeItemRow(index)}
                disabled={items.length === 1}
                className="text-slate-400 hover:text-rose-600 disabled:opacity-30 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between pt-2 text-sm font-bold text-slate-900 border-t border-slate-200">
          <span>Total Purchase Amount:</span>
          <span className="text-base text-blue-600">{formatCurrency(grandTotal)}</span>
        </div>
      </div>

      <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Submit Purchase Order</Button>
      </div>
    </form>
  );
};

export default PurchaseOrderForm;
