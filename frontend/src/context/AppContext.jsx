import React, { createContext, useContext, useState } from 'react';
import {
  MOCK_PRODUCTS,
  MOCK_WAREHOUSES,
  MOCK_SUPPLIERS,
  MOCK_CUSTOMERS,
  MOCK_CATEGORIES,
  MOCK_PURCHASE_ORDERS,
  MOCK_SALES_ORDERS,
  MOCK_NOTIFICATIONS,
  MOCK_SUMMARY_STATS,
} from '../services/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Application Data States
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [warehouses, setWarehouses] = useState(MOCK_WAREHOUSES);
  const [suppliers, setSuppliers] = useState(MOCK_SUPPLIERS);
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [purchaseOrders, setPurchaseOrders] = useState(MOCK_PURCHASE_ORDERS);
  const [salesOrders, setSalesOrders] = useState(MOCK_SALES_ORDERS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [stats, setStats] = useState(MOCK_SUMMARY_STATS);

  // Authentication State
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@inventria.io',
    role: 'Manager', // Manager or Employee
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    company: 'Inventria Enterprise Logistics',
  });

  // Global Toast Alert State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // --- CRUD Handlers for Products ---
  const addProduct = (newProduct) => {
    const created = {
      ...newProduct,
      id: `PRD-${1000 + products.length + 1}`,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: Number(newProduct.stockQuantity) === 0 ? 'Out of Stock' : (Number(newProduct.stockQuantity) <= Number(newProduct.minStockThreshold || 30) ? 'Low Stock' : 'In Stock'),
    };
    setProducts([created, ...products]);
    setStats((prev) => ({ ...prev, totalProducts: prev.totalProducts + 1 }));
    showToast(`Product "${created.name}" created successfully!`);
  };

  const editProduct = (id, updatedFields) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updatedFields };
          const stock = Number(updated.stockQuantity);
          const thresh = Number(updated.minStockThreshold || 30);
          updated.status = stock === 0 ? 'Out of Stock' : (stock <= thresh ? 'Low Stock' : 'In Stock');
          return updated;
        }
        return p;
      })
    );
    showToast(`Product updated successfully.`);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    setStats((prev) => ({ ...prev, totalProducts: Math.max(0, prev.totalProducts - 1) }));
    showToast('Product deleted.', 'danger');
  };

  // --- CRUD Handlers for Warehouses ---
  const addWarehouse = (newWh) => {
    const created = {
      ...newWh,
      id: `WH-${String(warehouses.length + 1).padStart(2, '0')}`,
      currentStock: Number(newWh.currentStock || 0),
      capacityTotal: Number(newWh.capacityTotal || 10000),
      utilizationPct: Math.round(((Number(newWh.currentStock || 0) / Number(newWh.capacityTotal || 10000)) * 100) * 10) / 10,
      health: 'Healthy',
    };
    setWarehouses([...warehouses, created]);
    setStats((prev) => ({ ...prev, totalWarehouses: prev.totalWarehouses + 1 }));
    showToast(`Warehouse facility "${created.name}" added.`);
  };

  const editWarehouse = (id, fields) => {
    setWarehouses(warehouses.map((w) => (w.id === id ? { ...w, ...fields } : w)));
    showToast('Warehouse details updated.');
  };

  const deleteWarehouse = (id) => {
    setWarehouses(warehouses.filter((w) => w.id !== id));
    setStats((prev) => ({ ...prev, totalWarehouses: Math.max(0, prev.totalWarehouses - 1) }));
    showToast('Warehouse deleted.', 'danger');
  };

  // --- CRUD Handlers for Suppliers ---
  const addSupplier = (newSup) => {
    const created = {
      ...newSup,
      id: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`,
      rating: 5.0,
      status: 'Active',
      totalOrders: 0,
    };
    setSuppliers([...suppliers, created]);
    setStats((prev) => ({ ...prev, totalSuppliers: prev.totalSuppliers + 1 }));
    showToast(`Supplier "${created.name}" added.`);
  };

  const editSupplier = (id, fields) => {
    setSuppliers(suppliers.map((s) => (s.id === id ? { ...s, ...fields } : s)));
    showToast('Supplier details updated.');
  };

  const deleteSupplier = (id) => {
    setSuppliers(suppliers.filter((s) => s.id !== id));
    setStats((prev) => ({ ...prev, totalSuppliers: Math.max(0, prev.totalSuppliers - 1) }));
    showToast('Supplier deleted.', 'danger');
  };

  // --- CRUD Handlers for Customers ---
  const addCustomer = (newCust) => {
    const created = {
      ...newCust,
      id: `CUST-${100 + customers.length + 1}`,
      totalOrders: 0,
      totalSpent: 0,
      status: 'Active',
    };
    setCustomers([...customers, created]);
    showToast(`Customer "${created.name}" registered.`);
  };

  const deleteCustomer = (id) => {
    setCustomers(customers.filter((c) => c.id !== id));
    showToast('Customer record removed.', 'danger');
  };

  // --- CRUD Handlers for Categories ---
  const addCategory = (newCat) => {
    const created = {
      ...newCat,
      id: `CAT-${String(categories.length + 1).padStart(3, '0')}`,
      productCount: 0,
      icon: newCat.icon || 'Package',
    };
    setCategories([...categories, created]);
    showToast(`Category "${created.name}" created.`);
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
    showToast('Category deleted.', 'danger');
  };

  // --- Purchase Orders ---
  const addPurchaseOrder = (poData) => {
    const created = {
      ...poData,
      id: `PO-2026-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      orderDate: new Date().toISOString().split('T')[0],
      createdByName: user.name,
      status: 'Pending',
    };
    setPurchaseOrders([created, ...purchaseOrders]);
    showToast(`Purchase Order "${created.id}" created!`);
  };

  const updatePOStatus = (id, status) => {
    setPurchaseOrders(
      purchaseOrders.map((po) => (po.id === id ? { ...po, status } : po))
    );
    showToast(`Purchase Order ${id} status changed to ${status}.`);
  };

  // --- Sales Orders ---
  const addSalesOrder = (soData) => {
    const created = {
      ...soData,
      id: `SO-2026-${8800 + salesOrders.length + 1}`,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Processing',
      paymentStatus: 'Pending',
    };
    setSalesOrders([created, ...salesOrders]);
    showToast(`Sales Order "${created.id}" created successfully!`);
  };

  const updateSOStatus = (id, status) => {
    setSalesOrders(
      salesOrders.map((so) => (so.id === id ? { ...so, status } : so))
    );
    showToast(`Sales Order ${id} status updated to ${status}.`);
  };

  // Authentication Helpers
  const login = (email, role = 'Manager') => {
    setUser((prev) => ({
      ...prev,
      email,
      role,
      name: email.split('@')[0].replace('.', ' ').replace(/^./, (str) => str.toUpperCase()),
    }));
    showToast(`Logged in successfully as ${role}`);
  };

  const logout = () => {
    showToast('Logged out of session', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        products,
        addProduct,
        editProduct,
        deleteProduct,
        warehouses,
        addWarehouse,
        editWarehouse,
        deleteWarehouse,
        suppliers,
        addSupplier,
        editSupplier,
        deleteSupplier,
        customers,
        addCustomer,
        deleteCustomer,
        categories,
        addCategory,
        deleteCategory,
        purchaseOrders,
        addPurchaseOrder,
        updatePOStatus,
        salesOrders,
        addSalesOrder,
        updateSOStatus,
        notifications,
        setNotifications,
        stats,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
