import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Warehouse,
  Truck,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Plus,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { MOCK_CHART_DATA } from '../../services/mockData';

// Register Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const { stats, products, salesOrders, showToast } = useApp();

  const lowStockItems = products.filter((p) => p.status === 'Low Stock' || p.status === 'Out of Stock');
  const recentOrders = salesOrders.slice(0, 5);

  // Line Chart Config: Monthly Sales & Expenses
  const lineChartData = {
    labels: MOCK_CHART_DATA.monthlySales.labels,
    datasets: [
      {
        label: 'Revenue ($)',
        data: MOCK_CHART_DATA.monthlySales.revenue,
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: '#2563EB',
      },
      {
        label: 'Expenses ($)',
        data: MOCK_CHART_DATA.monthlySales.expenses,
        borderColor: '#94A3B8',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
      tooltip: { cornerRadius: 8, padding: 10 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: {
        grid: { color: '#F1F5F9' },
        ticks: {
          font: { size: 11 },
          callback: (value) => `$${value / 1000}k`,
        },
      },
    },
  };

  // Doughnut Chart Config: Inventory by Category
  const doughnutData = {
    labels: MOCK_CHART_DATA.categoryDistribution.labels,
    datasets: [
      {
        data: MOCK_CHART_DATA.categoryDistribution.data,
        backgroundColor: [
          '#2563EB',
          '#3B82F6',
          '#60A5FA',
          '#93C5FD',
          '#F59E0B',
          '#10B981',
        ],
        borderWidth: 2,
        borderColor: '#FFFFFF',
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } },
    },
    cutout: '70%',
  };

  // Bar Chart Config: Warehouse Capacity
  const barData = {
    labels: MOCK_CHART_DATA.warehouseCapacity.labels,
    datasets: [
      {
        label: 'Current Used Stock (Units)',
        data: MOCK_CHART_DATA.warehouseCapacity.used,
        backgroundColor: '#3B82F6',
        borderRadius: 6,
      },
      {
        label: 'Total Capacity Limit',
        data: MOCK_CHART_DATA.warehouseCapacity.capacity,
        backgroundColor: '#E2E8F0',
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: { grid: { color: '#F1F5F9' }, ticks: { font: { size: 11 } } },
    },
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time overview of inventory, warehouses, orders, and sales performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Plus} onClick={() => navigate('/products')}>
            Add Product
          </Button>
          <Button size="sm" icon={Plus} onClick={() => navigate('/purchase-orders')}>
            New Purchase Order
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards Grid (6 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          trend={8.2}
          icon={Package}
          iconBgColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Warehouses"
          value={stats.totalWarehouses}
          trend={0}
          icon={Warehouse}
          iconBgColor="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Total Suppliers"
          value={stats.totalSuppliers}
          trend={4.5}
          icon={Truck}
          iconBgColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Low Stock Alert"
          value={lowStockItems.length}
          trend={-12.5}
          trendLabel="vs last week"
          icon={AlertTriangle}
          iconBgColor="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Today's Sales"
          value={formatCurrency(stats.todaysSales)}
          trend={15.4}
          icon={DollarSign}
          iconBgColor="bg-sky-50 text-sky-600"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue)}
          trend={stats.salesGrowthPct}
          icon={TrendingUp}
          iconBgColor="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Sales Line Chart */}
        <Card
          title="Monthly Revenue & Expenses"
          subtitle="Financial trajectory for current fiscal year (₹ INR)"
          className="lg:col-span-2"
        >
          <div className="h-72">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </Card>

        {/* Inventory Category Doughnut Chart */}
        <Card
          title="Stock by Category"
          subtitle="Product breakdown across 6 departments"
        >
          <div className="h-72">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </Card>
      </div>

      {/* Warehouse Distribution Chart */}
      <Card
        title="Warehouse Capacity Utilization"
        subtitle="Stock volume vs maximum unit capacity by warehouse"
      >
        <div className="h-64">
          <Bar data={barData} options={barOptions} />
        </div>
      </Card>

      {/* Recent Orders & Low Stock Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Table */}
        <Card
          title="Recent Sales Orders"
          subtitle="Latest client shipments & fulfillment status"
          action={
            <Button variant="ghost" size="sm" icon={ArrowRight} onClick={() => navigate('/sales-orders')}>
              View All
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((so) => (
                  <tr key={so.id} className="hover:bg-slate-50/50">
                    <td className="py-3 font-semibold text-blue-600">{so.id}</td>
                    <td className="py-3 font-medium text-slate-800">{so.customerName}</td>
                    <td className="py-3 text-slate-700">{formatCurrency(so.totalAmount)}</td>
                    <td className="py-3 text-right">
                      <Badge status={so.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Low Stock Warning Table */}
        <Card
          title="Critical Low Stock Items"
          subtitle="Items requiring immediate purchase reorders"
          action={
            <Button variant="ghost" size="sm" icon={ArrowRight} onClick={() => navigate('/products')}>
              Manage Stock
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-2">Product Name</th>
                  <th className="pb-2">SKU</th>
                  <th className="pb-2">Remaining Qty</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lowStockItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-3 font-medium text-slate-800">{item.name}</td>
                    <td className="py-3 text-slate-500 font-mono text-[11px]">{item.sku}</td>
                    <td className="py-3 font-bold text-rose-600">{item.stockQuantity} units</td>
                    <td className="py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          showToast(`Initiating restock order for ${item.sku}...`);
                          navigate('/purchase-orders');
                        }}
                      >
                        Restock
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
