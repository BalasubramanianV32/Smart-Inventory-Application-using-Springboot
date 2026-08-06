import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, BarChart2, PieChart, TrendingUp, ShieldCheck } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatCard from '../../components/common/StatCard';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ReportsPage = () => {
  const { showToast, stats, products, suppliers } = useApp();
  const [activeTab, setActiveTab] = useState('sales');

  const exportExcel = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,ID,Product,SKU,Stock,Price\n' +
      products.map((p) => `${p.id},"${p.name}",${p.sku},${p.stockQuantity},${p.price}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Inventria_Audit_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Excel CSV report generated and downloaded.');
  };

  const exportPDF = () => {
    window.print();
    showToast('Generating PDF Report view...');
  };

  const salesTrendData = {
    labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'],
    datasets: [
      {
        label: 'Gross Sales ($)',
        data: [420000, 580000, 610000, 790000, 840000, 960000],
        backgroundColor: '#2563EB',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics & Enterprise Reports</h2>
          <p className="text-xs text-slate-500 mt-0.5">Audit inventory valuation, order velocity, and supply chain efficiency.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={FileSpreadsheet} onClick={exportExcel}>
            Export Excel (CSV)
          </Button>
          <Button icon={FileText} onClick={exportPDF}>
            Export PDF Report
          </Button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('sales')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'sales'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Sales & Revenue Velocity
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'inventory'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Inventory Valuation & Stock Audit
        </button>
        <button
          onClick={() => setActiveTab('supplier')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'supplier'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Supplier SLA Performance
        </button>
      </div>

      {/* Summary KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Inventory Valuation"
          value={formatCurrency(stats.inventoryValue)}
          trend={12.4}
          icon={TrendingUp}
        />
        <StatCard
          title="Fulfillment Accuracy"
          value="99.4%"
          trend={0.8}
          icon={ShieldCheck}
          iconBgColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Stock Turnaround Rate"
          value="6.2x / yr"
          trend={3.1}
          icon={BarChart2}
          iconBgColor="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Chart Visualizer */}
      <Card
        title={
          activeTab === 'sales'
            ? 'Quarterly Revenue Performance'
            : activeTab === 'inventory'
            ? 'Inventory Stock Holding Levels'
            : 'Vendor Reliability Scores'
        }
        subtitle="Historical breakdown generated live from ERP context"
      >
        <div className="h-80">
          <Bar
            data={salesTrendData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;
