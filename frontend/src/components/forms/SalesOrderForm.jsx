import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

const SalesOrderForm = ({ onSubmit, onClose }) => {
  const { customers, products } = useApp();

  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]?.name || '');
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]
  );
  const [shippingAddress, setShippingAddress] = useState(customers[0]?.address || '');

  const [items, setItems] = useState([
    {
      productName: products[0]?.name || '',
      sku: products[0]?.sku || '',
      quantity: 10,
      unitPrice: products[0]?.price || 50,
      total: (products[0]?.price || 50) * 10,
    },
  ]);

  const handleCustomerSelect = (custName) => {
    setSelectedCustomer(custName);
    const found = customers.find((c) => c.name === custName);
    if (found) {
      setShippingAddress(found.address);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === 'productName') {
      const found = products.find((p) => p.name === value);
      if (found) {
        updated[index].sku = found.sku;
        updated[index].unitPrice = found.price || 50;
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
        sku: products[0]?.sku || '',
        quantity: 5,
        unitPrice: products[0]?.price || 50,
        total: (products[0]?.price || 50) * 5,
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
    const custObj = customers.find((c) => c.name === selectedCustomer);
    const soData = {
      customerName: selectedCustomer,
      customerCompany: custObj?.company || selectedCustomer,
      deliveryDate,
      shippingAddress,
      totalAmount: grandTotal,
      itemsCount: items.length,
      items,
    };
    onSubmit(soData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Customer Account"
          required
          options={customers.map((c) => ({ value: c.name, label: `${c.name} (${c.company})` }))}
          value={selectedCustomer}
          onChange={(e) => handleCustomerSelect(e.target.value)}
        />

        <Input
          label="Expected Delivery Date"
          type="date"
          required
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
        />
      </div>

      <Input
        label="Shipping Destination Address"
        required
        value={shippingAddress}
        onChange={(e) => setShippingAddress(e.target.value)}
      />

      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Sales Line Items</h4>
          <Button variant="ghost" size="sm" icon={Plus} onClick={addItemRow}>
            Add Line Item
          </Button>
        </div>

        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-center bg-white p-3 rounded-lg border border-slate-200">
            <div className="col-span-12 sm:col-span-5">
              <Select
                placeholder="Choose Product..."
                options={products.map((p) => ({ value: p.name, label: `${p.name} ($${p.price})` }))}
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
                placeholder="Price $"
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
          <span>Total Order Value:</span>
          <span className="text-base text-blue-600">{formatCurrency(grandTotal)}</span>
        </div>
      </div>

      <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Generate Sales Order</Button>
      </div>
    </form>
  );
};

export default SalesOrderForm;
