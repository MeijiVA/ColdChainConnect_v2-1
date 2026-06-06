import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Clock, Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuditLog } from "@shared/api";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// ─── Report Types & Mock Data ─────────────────────────────────────────────────

type ReportTab = "sales" | "inventory" | "customer" | "performance" | "profit";
type DateRange = "daily" | "weekly" | "monthly";

const mockSalesReports = [
  { period: "2024-01-15 (Today)", totalRevenue: 4250, totalTransactions: 12, averageTransaction: 354.17, topProduct: "Premium Chicken Breast", topProductSales: 1200 },
  { period: "2024-01-08 - 2024-01-14 (This Week)", totalRevenue: 28450, totalTransactions: 82, averageTransaction: 346.95, topProduct: "Frozen Fish", topProductSales: 8200 },
  { period: "January 2024 (This Month)", totalRevenue: 125680, totalTransactions: 356, averageTransaction: 353.06, topProduct: "Ice Cream Varieties", topProductSales: 35400 },
];

const mockInventoryReports = [
  { sku: "SKU-2301", productName: "Premium Chicken Breast", currentStock: 45, reorderLevel: 50, expiryDate: "2024-01-25", status: "low-stock" as const, value: 2700 },
  { sku: "SKU-3405", productName: "Frozen Fish", currentStock: 120, reorderLevel: 80, expiryDate: "2024-01-22", status: "expiring" as const, value: 7200 },
  { sku: "SKU-5102", productName: "Ice Cream Varieties", currentStock: 300, reorderLevel: 100, expiryDate: "2024-03-15", status: "in-stock" as const, value: 9000 },
  { sku: "SKU-1450", productName: "Beef Cuts", currentStock: 75, reorderLevel: 60, expiryDate: "2024-01-28", status: "in-stock" as const, value: 4500 },
];

const mockCustomerReports = [
  { customerId: "CUST-001", customerName: "Restaurant ABC", totalPurchases: 45, totalSpent: 15750, lastPurchaseDate: "2024-01-15", frequency: "Daily" },
  { customerId: "CUST-002", customerName: "Cafe XYZ", totalPurchases: 32, totalSpent: 11200, lastPurchaseDate: "2024-01-14", frequency: "3x/Week" },
  { customerId: "CUST-003", customerName: "Supermarket DEF", totalPurchases: 28, totalSpent: 18900, lastPurchaseDate: "2024-01-13", frequency: "2x/Week" },
];

const mockPerformanceMetrics = [
  { productName: "Ice Cream Varieties", unitsSold: 1250, revenue: 35400, growth: 12.5, ranking: 1 },
  { productName: "Frozen Fish", unitsSold: 890, revenue: 28900, growth: 8.3, ranking: 2 },
  { productName: "Premium Chicken Breast", unitsSold: 750, revenue: 25200, growth: 5.8, ranking: 3 },
  { productName: "Beef Cuts", unitsSold: 620, revenue: 18600, growth: 3.2, ranking: 4 },
];

const mockProfitData = [
  { productName: "Ice Cream Varieties", unitPrice: 28.32, costPrice: 15.5, profitMargin: 45.3, quantitySold: 1250, totalProfit: 16004.64 },
  { productName: "Frozen Fish", unitPrice: 32.48, costPrice: 19.2, profitMargin: 40.9, quantitySold: 890, totalProfit: 11807.04 },
  { productName: "Premium Chicken Breast", unitPrice: 33.6, costPrice: 19.5, profitMargin: 42.1, quantitySold: 750, totalProfit: 10626 },
  { productName: "Beef Cuts", unitPrice: 30, costPrice: 17.8, profitMargin: 40.7, quantitySold: 620, totalProfit: 7597.6 },
];

// ─── Reports Panel ────────────────────────────────────────────────────────────

function ReportsPanel() {
  const [activeTab, setActiveTab] = useState<ReportTab>("sales");
  const [dateRange, setDateRange] = useState<DateRange>("monthly");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "in-stock": return "bg-green-100 text-green-800";
      case "low-stock": return "bg-yellow-100 text-yellow-800";
      case "expiring": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleExport = (reportType: string) => {
    setIsExporting(true);
    try {
      let csv = "";
      const date = new Date().toLocaleDateString();
      if (reportType === "Sales") {
        csv = `Sales Report\nGenerated: ${date}\n\nPeriod,Revenue,Transactions,Avg Transaction,Top Product\n`;
        mockSalesReports.forEach(r => { csv += `"${r.period}",${r.totalRevenue},${r.totalTransactions},${r.averageTransaction.toFixed(2)},"${r.topProduct}"\n`; });
      } else if (reportType === "Inventory") {
        csv = `Inventory Report\nGenerated: ${date}\n\nSKU,Product,Stock,Reorder,Status,Value,Expiry\n`;
        mockInventoryReports.forEach(r => { csv += `${r.sku},"${r.productName}",${r.currentStock},${r.reorderLevel},${r.status},${r.value},${r.expiryDate}\n`; });
      } else if (reportType === "Customer") {
        csv = `Customer Report\nGenerated: ${date}\n\nID,Name,Purchases,Total Spent,Last Purchase,Frequency\n`;
        mockCustomerReports.forEach(r => { csv += `${r.customerId},"${r.customerName}",${r.totalPurchases},${r.totalSpent},${r.lastPurchaseDate},"${r.frequency}"\n`; });
      } else if (reportType === "Performance") {
        csv = `Performance Report\nGenerated: ${date}\n\nRanking,Product,Units Sold,Revenue,Growth %\n`;
        mockPerformanceMetrics.forEach(r => { csv += `#${r.ranking},"${r.productName}",${r.unitsSold},${r.revenue},${r.growth}\n`; });
      } else if (reportType === "Profit") {
        csv = `Profit Report\nGenerated: ${date}\n\nProduct,Unit Price,Cost Price,Margin %,Qty Sold,Total Profit\n`;
        mockProfitData.forEach(r => { csv += `"${r.productName}",${r.unitPrice},${r.costPrice},${r.profitMargin},${r.quantitySold},${r.totalProfit}\n`; });
      }
      const el = document.createElement("a");
      el.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      el.download = `${reportType}_Report_${Date.now()}.csv`;
      document.body.appendChild(el); el.click(); document.body.removeChild(el);
      URL.revokeObjectURL(el.href);
      toast({ title: "Exported", description: `${reportType} Report downloaded as CSV.` });
    } finally {
      setIsExporting(false);
    }
  };

  const reportTabs = [
    { id: "sales", label: "Sales", icon: "📊" },
    { id: "inventory", label: "Inventory", icon: "📦" },
    { id: "customer", label: "Customer", icon: "👥" },
    { id: "performance", label: "Performance", icon: "📈" },
    { id: "profit", label: "Profit", icon: "💰" },
  ];

  return (
    <div className="space-y-4">
      {/* Sub-tab bar */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {reportTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ReportTab)}
            className={`px-3 py-1.5 text-sm whitespace-nowrap font-semibold rounded-lg transition-all ${
              activeTab === tab.id ? "bg-accent text-white" : "bg-off-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="mr-1.5">{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* Sales */}
      {activeTab === "sales" && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-navy">Sales Reports</h2>
            <select value={dateRange} onChange={e => setDateRange(e.target.value as DateRange)} className="px-3 py-1.5 border border-border rounded bg-white text-navy text-sm">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="space-y-3">
            {mockSalesReports.map((r, i) => (
              <div key={i} className="border border-border rounded-lg p-4 hover:bg-off-white transition-colors">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div><p className="text-xs text-gray-500">Period</p><p className="font-semibold text-navy text-sm">{r.period}</p></div>
                  <div><p className="text-xs text-gray-500">Revenue</p><p className="font-semibold text-navy">₱{r.totalRevenue.toLocaleString()}</p></div>
                  <div><p className="text-xs text-gray-500">Transactions</p><p className="font-semibold text-navy">{r.totalTransactions}</p></div>
                  <div><p className="text-xs text-gray-500">Avg Transaction</p><p className="font-semibold text-navy">₱{r.averageTransaction.toFixed(2)}</p></div>
                  <div><p className="text-xs text-gray-500">Top Product</p><p className="font-semibold text-navy text-sm">{r.topProduct}</p></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4"><Button onClick={() => handleExport("Sales")} disabled={isExporting} className="bg-accent hover:bg-accent-dark text-white text-sm">📥 Export CSV</Button></div>
        </Card>
      )}

      {/* Inventory */}
      {activeTab === "inventory" && (
        <Card className="p-6 overflow-hidden">
          <h2 className="text-xl font-bold text-navy mb-4">Inventory Reports</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-off-white">
                  {["SKU", "Product", "Stock", "Reorder", "Expiry", "Value", "Status"].map(h => (
                    <th key={h} className="text-left py-2 px-3 font-semibold text-navy">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockInventoryReports.map((r, i) => (
                  <tr key={i} className="border-b border-border hover:bg-off-white">
                    <td className="py-2 px-3 font-mono text-gray-700">{r.sku}</td>
                    <td className="py-2 px-3 text-gray-700">{r.productName}</td>
                    <td className="py-2 px-3 text-gray-700 font-semibold">{r.currentStock}</td>
                    <td className="py-2 px-3 text-gray-700">{r.reorderLevel}</td>
                    <td className="py-2 px-3 text-gray-700">{r.expiryDate}</td>
                    <td className="py-2 px-3 text-gray-700 font-semibold">₱{r.value.toLocaleString()}</td>
                    <td className="py-2 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeColor(r.status)}`}>{r.status.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4"><Button onClick={() => handleExport("Inventory")} disabled={isExporting} className="bg-accent hover:bg-accent-dark text-white text-sm">📥 Export CSV</Button></div>
        </Card>
      )}

      {/* Customer */}
      {activeTab === "customer" && (
        <Card className="p-6 overflow-hidden">
          <h2 className="text-xl font-bold text-navy mb-4">Customer Purchase History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-off-white">
                  {["Customer ID", "Name", "Purchases", "Total Spent", "Last Purchase", "Frequency"].map(h => (
                    <th key={h} className="text-left py-2 px-3 font-semibold text-navy">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockCustomerReports.map((r, i) => (
                  <tr key={i} className="border-b border-border hover:bg-off-white">
                    <td className="py-2 px-3 font-mono text-gray-700">{r.customerId}</td>
                    <td className="py-2 px-3 text-gray-700 font-medium">{r.customerName}</td>
                    <td className="py-2 px-3 text-gray-700 font-semibold">{r.totalPurchases}</td>
                    <td className="py-2 px-3 text-gray-700 font-semibold">₱{r.totalSpent.toLocaleString()}</td>
                    <td className="py-2 px-3 text-gray-700">{r.lastPurchaseDate}</td>
                    <td className="py-2 px-3 text-gray-700">{r.frequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4"><Button onClick={() => handleExport("Customer")} disabled={isExporting} className="bg-accent hover:bg-accent-dark text-white text-sm">📥 Export CSV</Button></div>
        </Card>
      )}

      {/* Performance */}
      {activeTab === "performance" && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-navy mb-4">Sales Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {mockPerformanceMetrics.map((r, i) => (
              <div key={i} className="border border-border rounded-lg p-4 hover:bg-off-white transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-navy">#{r.ranking} {r.productName}</p>
                    <p className="text-xs text-gray-500">Top Performer</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.growth > 10 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>↑ {r.growth}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><p className="text-xs text-gray-500">Units Sold</p><p className="font-semibold text-navy">{r.unitsSold.toLocaleString()}</p></div>
                  <div><p className="text-xs text-gray-500">Revenue</p><p className="font-semibold text-navy">₱{r.revenue.toLocaleString()}</p></div>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={() => handleExport("Performance")} disabled={isExporting} className="bg-accent hover:bg-accent-dark text-white text-sm">📥 Export CSV</Button>
        </Card>
      )}

      {/* Profit */}
      {activeTab === "profit" && (
        <Card className="p-6 overflow-hidden">
          <h2 className="text-xl font-bold text-navy mb-4">Profit Tracking & Margins</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-off-white">
                  {["Product", "Unit Price", "Cost Price", "Margin", "Qty Sold", "Total Profit"].map(h => (
                    <th key={h} className="text-left py-2 px-3 font-semibold text-navy">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockProfitData.map((r, i) => (
                  <tr key={i} className="border-b border-border hover:bg-off-white">
                    <td className="py-2 px-3 text-gray-700 font-medium">{r.productName}</td>
                    <td className="py-2 px-3 text-gray-700 font-semibold">₱{r.unitPrice.toFixed(2)}</td>
                    <td className="py-2 px-3 text-gray-700">₱{r.costPrice.toFixed(2)}</td>
                    <td className="py-2 px-3"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">{r.profitMargin.toFixed(1)}%</span></td>
                    <td className="py-2 px-3 text-gray-700 font-semibold">{r.quantitySold}</td>
                    <td className="py-2 px-3 text-navy font-bold">₱{r.totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
                <tr className="bg-off-white font-bold border-t-2 border-border">
                  <td colSpan={5} className="py-2 px-3 text-right text-navy">Total Profit:</td>
                  <td className="py-2 px-3 text-navy">₱{mockProfitData.reduce((s, r) => s + r.totalProfit, 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4"><Button onClick={() => handleExport("Profit")} disabled={isExporting} className="bg-accent hover:bg-accent-dark text-white text-sm">📥 Export CSV</Button></div>
        </Card>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type PageTab = "activity" | "reports";

export function AuditLogPage() {
  const [pageTab, setPageTab] = useState<PageTab>("activity");
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/audit-logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch audit logs");
      const data = await response.json();
      setLogs(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading logs");
      setLogs([{ id: "log-1", user_id: "user-1", action: "create", resource_type: "customer", created_at: new Date().toISOString() }] as AuditLog[]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLogs();
    setIsRefreshing(false);
  };

  useEffect(() => { if (token) fetchLogs(); }, [token]);

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      create: "bg-green-100 text-green-800",
      update: "bg-blue-100 text-blue-800",
      delete: "bg-red-100 text-red-800",
    };
    return colors[action] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="flex-1 flex flex-col p-6 gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy">Audit Log</h1>
          <p className="text-gray-600">System activity and business reports</p>
        </div>
        {pageTab === "activity" && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-off-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-fit"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        )}
      </div>

      {/* Top-level tabs */}
      <div className="flex gap-2 border-b border-border pb-0">
        {[
          { id: "activity", label: "Activity Log", icon: "🕐" },
          { id: "reports", label: "Reports", icon: "📊" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setPageTab(tab.id as PageTab)}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg border border-b-0 transition-all ${
              pageTab === tab.id
                ? "bg-white border-border text-navy -mb-px"
                : "bg-off-white border-transparent text-gray-500 hover:text-navy"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* Activity Log */}
      {pageTab === "activity" && (
        <>
          {error && (
            <Card className="p-4 bg-red-50 border-red-200">
              <p className="text-red-700">{error}</p>
            </Card>
          )}
          {isLoading ? (
            <div className="p-6 text-gray-500">Loading...</div>
          ) : (
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Resource ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">No activity yet</TableCell>
                    </TableRow>
                  ) : (
                    logs.map(log => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {new Date(log.created_at).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{log.user_id.slice(0, 8)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getActionColor(log.action)}`}>
                            {log.action.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm capitalize">{log.resource_type}</TableCell>
                        <TableCell className="font-mono text-sm">{log.resource_id?.slice(0, 8) || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          )}
        </>
      )}

      {/* Reports */}
      {pageTab === "reports" && <ReportsPanel />}
    </div>
  );
}
