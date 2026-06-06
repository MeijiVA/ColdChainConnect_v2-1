import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react";

type TabType = "expense-records" | "receivables" | "payables";

interface ExpenseRecord {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "completed" | "scheduled";
}

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
}

interface OperationalCost {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
}

interface MaintenanceRecord {
  id: string;
  date: string;
  truck: string;
  serviceProvider: string;
  service: string;
  cost: number;
  mileage: number;
  nextServiceDue: string;
  status: "completed" | "scheduled" | "pending";
}

interface AccountsReceivable {
  id: string;
  salesId: string;
  customerId: string;
  customerName: string;
  date: string;
  amount: number;
  status: "paid" | "unpaid" | "revoked";
  dueDate: string;
}

interface AccountsPayable {
  id: string;
  vendorId: string;
  vendorName: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: "unpaid" | "paid" | "revoked";
  dueDate: string;
}

// Mock data
const mockExpenses: Expense[] = [
  {
    id: "1",
    date: "2024-01-15",
    category: "Maintenance",
    description: "Truck #T001 Oil Change",
    amount: 150,
    status: "approved",
  },
  {
    id: "2",
    date: "2024-01-14",
    category: "Maintenance",
    description: "Truck #T002 Brake Pads Replacement",
    amount: 320,
    status: "approved",
  },
  {
    id: "3",
    date: "2024-01-13",
    category: "Maintenance",
    description: "Truck #T003 Tire Replacement",
    amount: 800,
    status: "pending",
  },
];

const mockOperationalCosts: OperationalCost[] = [
  {
    id: "1",
    date: "2024-01-15",
    category: "Fuel",
    description: "Fuel for Truck #T001 - 250L",
    amount: 625,
    status: "approved",
  },
  {
    id: "2",
    date: "2024-01-14",
    category: "Tolls",
    description: "Highway tolls - Route A-5",
    amount: 45,
    status: "approved",
  },
  {
    id: "3",
    date: "2024-01-13",
    category: "Office Supplies",
    description: "Office supplies and stationery",
    amount: 120,
    status: "pending",
  },
  {
    id: "4",
    date: "2024-01-12",
    category: "Fuel",
    description: "Fuel for Truck #T002 - 300L",
    amount: 750,
    status: "approved",
  },
];

const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: "1",
    date: "2024-01-15",
    truck: "T001",
    serviceProvider: "Quick Fix Auto",
    service: "Oil Change & Filter Replacement",
    cost: 150,
    mileage: 125000,
    nextServiceDue: "2024-03-15",
    status: "completed",
  },
  {
    id: "2",
    date: "2024-01-10",
    truck: "T002",
    serviceProvider: "Professional Mechanics",
    service: "Brake System Inspection & Pad Replacement",
    cost: 320,
    mileage: 98500,
    nextServiceDue: "2024-07-10",
    status: "completed",
  },
  {
    id: "3",
    date: "2024-01-20",
    truck: "T003",
    serviceProvider: "TireMaster Pro",
    service: "All-Terrain Tire Replacement",
    cost: 800,
    mileage: 156200,
    nextServiceDue: "2024-01-20",
    status: "scheduled",
  },
  {
    id: "4",
    date: "2024-02-05",
    truck: "T001",
    serviceProvider: "Quick Fix Auto",
    service: "Transmission Fluid Check",
    cost: 75,
    mileage: 127000,
    nextServiceDue: "2024-04-05",
    status: "pending",
  },
];

const mockAccountsReceivable: AccountsReceivable[] = [
  {
    id: "1",
    salesId: "SLS-001",
    customerId: "CUST-001",
    customerName: "Restaurant ABC",
    date: "2024-01-15",
    amount: 4500,
    status: "paid",
    dueDate: "2024-01-22",
  },
  {
    id: "2",
    salesId: "SLS-002",
    customerId: "CUST-002",
    customerName: "Cafe XYZ",
    date: "2024-01-14",
    amount: 2800,
    status: "unpaid",
    dueDate: "2024-01-21",
  },
  {
    id: "3",
    salesId: "SLS-003",
    customerId: "CUST-003",
    customerName: "Supermarket DEF",
    date: "2024-01-13",
    amount: 6200,
    status: "unpaid",
    dueDate: "2024-01-20",
  },
  {
    id: "4",
    salesId: "SLS-004",
    customerId: "CUST-001",
    customerName: "Restaurant ABC",
    date: "2024-01-12",
    amount: 3500,
    status: "paid",
    dueDate: "2024-01-19",
  },
];

const mockAccountsPayable: AccountsPayable[] = [
  {
    id: "1",
    vendorId: "VEN-001",
    vendorName: "Fuel Supplier Inc.",
    invoiceNumber: "INV-2024-001",
    date: "2024-01-15",
    amount: 5000,
    status: "paid",
    dueDate: "2024-01-22",
  },
  {
    id: "2",
    vendorId: "VEN-002",
    vendorName: "Parts & Components Ltd.",
    invoiceNumber: "INV-2024-002",
    date: "2024-01-14",
    amount: 3200,
    status: "unpaid",
    dueDate: "2024-01-28",
  },
  {
    id: "3",
    vendorId: "VEN-003",
    vendorName: "Maintenance Services Co.",
    invoiceNumber: "INV-2024-003",
    date: "2024-01-13",
    amount: 2500,
    status: "unpaid",
    dueDate: "2024-01-27",
  },
  {
    id: "4",
    vendorId: "VEN-001",
    vendorName: "Fuel Supplier Inc.",
    invoiceNumber: "INV-2024-004",
    date: "2024-01-12",
    amount: 4800,
    status: "paid",
    dueDate: "2024-01-19",
  },
];

export function FinanceLedger() {
  const [activeTab, setActiveTab] = useState<TabType>("expense-records");
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [operationalCosts, setOperationalCosts] = useState<OperationalCost[]>(
    mockOperationalCosts
  );
  const [maintenanceRecords, setMaintenanceRecords] = useState<
    MaintenanceRecord[]
  >(mockMaintenanceRecords);
  const [accountsReceivable, setAccountsReceivable] = useState<
    AccountsReceivable[]
  >(mockAccountsReceivable);
  const [accountsPayable, setAccountsPayable] = useState<AccountsPayable[]>(
    mockAccountsPayable
  );
  const [expenseRecords, setExpenseRecords] = useState<ExpenseRecord[]>(() => {
    const combined: ExpenseRecord[] = [];

    mockExpenses.forEach(e => {
      combined.push({
        id: `exp-${e.id}`,
        date: e.date,
        category: e.category,
        description: e.description,
        amount: e.amount,
        status: e.status,
      });
    });

    mockOperationalCosts.forEach(oc => {
      combined.push({
        id: `op-${oc.id}`,
        date: oc.date,
        category: oc.category,
        description: oc.description,
        amount: oc.amount,
        status: oc.status,
      });
    });

    mockMaintenanceRecords.forEach(mr => {
      combined.push({
        id: `mnt-${mr.id}`,
        date: mr.date,
        category: "Maintenance",
        description: `${mr.service} - ${mr.truck}`,
        amount: mr.cost,
        status: mr.status as any,
      });
    });

    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Form states
  const [expenseForm, setExpenseForm] = useState({
    date: "",
    category: "Maintenance",
    description: "",
    amount: "",
    status: "pending" as const,
  });

  const handleAddExpense = async () => {
    if (
      !expenseForm.date ||
      !expenseForm.description ||
      !expenseForm.amount
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newRecord: ExpenseRecord = {
        id: `exp-${Date.now()}`,
        date: expenseForm.date,
        category: expenseForm.category,
        description: expenseForm.description,
        amount: parseFloat(expenseForm.amount),
        status: expenseForm.status,
      };
      setExpenseRecords([newRecord, ...expenseRecords]);
      setExpenseForm({
        date: "",
        category: "Maintenance",
        description: "",
        amount: "",
        status: "pending",
      });
      setShowAddForm(false);
      toast({
        title: "Success",
        description: "Expense record added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense record.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return "bg-green/15 text-green border border-green/30";
      case "pending":
        return "bg-yellow/15 text-yellow border border-yellow/30";
      case "rejected":
      case "scheduled":
        return "bg-accent-2/15 text-accent-2 border border-accent-2/30";
      default:
        return "bg-muted/15 text-muted border border-muted/30";
    }
  };

  const handleUpdateExpenseRecordStatus = (id: string, newStatus: string) => {
    setExpenseRecords(
      expenseRecords.map((r) =>
        r.id === id ? { ...r, status: newStatus as any } : r
      )
    );
    toast({
      title: "Success",
      description: `Status updated to ${newStatus}.`,
    });
  };

  const handleUpdateReceivableStatus = (id: string, newStatus: "paid" | "unpaid" | "revoked") => {
    setAccountsReceivable(
      accountsReceivable.map((ar) =>
        ar.id === id ? { ...ar, status: newStatus } : ar
      )
    );
    toast({
      title: "Success",
      description: `Payment status updated to ${newStatus}.`,
    });
  };

  const handleUpdatePayableStatus = (id: string, newStatus: "paid" | "unpaid" | "revoked") => {
    setAccountsPayable(
      accountsPayable.map((ap) =>
        ap.id === id ? { ...ap, status: newStatus } : ap
      )
    );
    toast({
      title: "Success",
      description: `Payable status updated to ${newStatus}.`,
    });
  };

  const totalExpenses = expenseRecords.reduce((sum, r) => sum + r.amount, 0);
  const totalOperational = expenseRecords.reduce((sum, r) => sum + r.amount, 0);
  const totalMaintenance = expenseRecords.reduce((sum, r) => sum + r.amount, 0);
  const totalReceivables = accountsReceivable.reduce((sum, ar) => sum + ar.amount, 0);
  const paidReceivables = accountsReceivable
    .filter((ar) => ar.status === "paid")
    .reduce((sum, ar) => sum + ar.amount, 0);
  const unpaidReceivables = totalReceivables - paidReceivables;

  const totalPayables = accountsPayable.reduce((sum, ap) => sum + ap.amount, 0);
  const paidPayables = accountsPayable
    .filter((ap) => ap.status === "paid")
    .reduce((sum, ap) => sum + ap.amount, 0);
  const unpaidPayables = totalPayables - paidPayables;

  const pendingExpenses = expenseRecords.filter((r) => r.status === "pending").reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="flex-1 px-4 md:px-6 lg:px-7 py-4 md:py-6 overflow-y-auto scrollbar-visible">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">Expenses & Finance</h1>
          <p className="text-muted">
            Manage financial operations, track expenses, and monitor accounts receivable
          </p>
        </div>

        {/* Main Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="p-6 border-l-4 border-l-green bg-gradient-to-br from-green/5 to-transparent">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-muted mb-1">
                  Receivables
                </h3>
                <p className="text-2xl md:text-3xl font-bold text-navy">
                  ₱{totalReceivables.toLocaleString()}
                </p>
                <p className="text-xs text-muted mt-2">
                  {accountsReceivable.length} invoices
                </p>
              </div>
              <div className="bg-green/10 p-3 rounded-lg">
                <DollarSign className="text-green" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-red bg-gradient-to-br from-red/5 to-transparent">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-muted mb-1">
                  Payables
                </h3>
                <p className="text-2xl md:text-3xl font-bold text-navy">
                  ₱{totalPayables.toLocaleString()}
                </p>
                <p className="text-xs text-muted mt-2">
                  {accountsPayable.length} invoices
                </p>
              </div>
              <div className="bg-red/10 p-3 rounded-lg">
                <DollarSign className="text-red" size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-yellow/5 border border-yellow/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-yellow" size={20} />
              <div>
                <h4 className="text-xs font-semibold text-muted">Pending Approvals</h4>
                <p className="text-lg font-bold text-navy">₱{pendingExpenses.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-red/5 border border-red/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red" size={20} />
              <div>
                <h4 className="text-xs font-semibold text-muted">Unpaid Receivables</h4>
                <p className="text-lg font-bold text-navy">₱{unpaidReceivables.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-red/5 border border-red/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red" size={20} />
              <div>
                <h4 className="text-xs font-semibold text-muted">Unpaid Payables</h4>
                <p className="text-lg font-bold text-navy">₱{unpaidPayables.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-green/5 border border-green/20">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-green" size={20} />
              <div>
                <h4 className="text-xs font-semibold text-muted">Collected Payments</h4>
                <p className="text-lg font-bold text-navy">₱{paidReceivables.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
          <button
            onClick={() => setActiveTab("expense-records")}
            className={`px-4 py-3 font-semibold transition-all border-b-2 whitespace-nowrap ${
              activeTab === "expense-records"
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-navy"
            }`}
          >
            Financial Records
          </button>
          <button
            onClick={() => setActiveTab("receivables")}
            className={`px-4 py-3 font-semibold transition-all border-b-2 whitespace-nowrap ${
              activeTab === "receivables"
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-navy"
            }`}
          >
            Accounts Receivable
          </button>
          <button
            onClick={() => setActiveTab("payables")}
            className={`px-4 py-3 font-semibold transition-all border-b-2 whitespace-nowrap ${
              activeTab === "payables"
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-navy"
            }`}
          >
            Accounts Payable
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "expense-records" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-navy">
                Financial Records
              </h2>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-accent hover:bg-accent-dark text-white"
              >
                {showAddForm ? "Cancel" : "+ Add Record"}
              </Button>
            </div>

            {showAddForm && (
              <Card className="p-6 mb-4 bg-off-white border-2 border-accent/20">
                <h3 className="font-bold text-navy mb-4">
                  Log New Financial Record
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Date
                    </label>
                    <Input
                      type="date"
                      value={expenseForm.date}
                      onChange={(e) =>
                        setExpenseForm({ ...expenseForm, date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Category
                    </label>
                    <select
                      value={expenseForm.category}
                      onChange={(e) =>
                        setExpenseForm({
                          ...expenseForm,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded bg-white text-navy"
                    >
                      <option>Maintenance</option>
                      <option>Fuel</option>
                      <option>Tolls</option>
                      <option>Repairs</option>
                      <option>Parts</option>
                      <option>Office Supplies</option>
                      <option>Utilities</option>
                      <option>Insurance</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Description
                  </label>
                  <Input
                    value={expenseForm.description}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="e.g., Truck #T001 Oil Change"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Amount (₱)
                    </label>
                    <Input
                      type="number"
                      value={expenseForm.amount}
                      onChange={(e) =>
                        setExpenseForm({ ...expenseForm, amount: e.target.value })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Status
                    </label>
                    <select
                      value={expenseForm.status}
                      onChange={(e) =>
                        setExpenseForm({
                          ...expenseForm,
                          status: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded bg-white text-navy"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => setShowAddForm(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddExpense}
                    disabled={isSubmitting}
                    className="bg-accent hover:bg-accent-dark text-white"
                  >
                    {isSubmitting ? "Saving..." : "Save Record"}
                  </Button>
                </div>
              </Card>
            )}

            <Card className="overflow-hidden border-2 border-border/50">
              <div className="overflow-x-auto scrollbar-visible">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-navy-mid">
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Description
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-white">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b border-border hover:bg-off-white transition-colors"
                      >
                        <td className="py-3 px-4 text-navy font-medium">
                          {record.date}
                        </td>
                        <td className="py-3 px-4 text-navy">
                          {record.category}
                        </td>
                        <td className="py-3 px-4 text-muted">
                          {record.description}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-navy">
                          ₱{record.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <select
                            value={record.status}
                            onChange={(e) =>
                              handleUpdateExpenseRecordStatus(record.id, e.target.value)
                            }
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border-none cursor-pointer transition-all ${getStatusBadgeColor(
                              record.status
                            )}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="completed">Completed</option>
                            <option value="scheduled">Scheduled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "receivables" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-navy">
                Accounts Receivable
              </h2>
            </div>

            <Card className="overflow-hidden border-2 border-border/50">
              <div className="overflow-x-auto scrollbar-visible">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-navy-mid">
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Sales ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Customer ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Customer Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Date
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-white">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Due Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountsReceivable.map((ar) => (
                      <tr
                        key={ar.id}
                        className="border-b border-border hover:bg-off-white transition-colors"
                      >
                        <td className="py-3 px-4 text-accent font-bold">
                          {ar.salesId}
                        </td>
                        <td className="py-3 px-4 text-muted font-medium">
                          {ar.customerId}
                        </td>
                        <td className="py-3 px-4 text-navy font-medium">
                          {ar.customerName}
                        </td>
                        <td className="py-3 px-4 text-muted">
                          {ar.date}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-navy">
                          ₱{ar.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-muted">
                          {ar.dueDate}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <select
                            value={ar.status}
                            onChange={(e) =>
                              handleUpdateReceivableStatus(ar.id, e.target.value as "paid" | "unpaid" | "revoked")
                            }
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border-none cursor-pointer transition-all ${
                              ar.status === "paid"
                                ? "bg-green/15 text-green"
                                : ar.status === "unpaid"
                                ? "bg-yellow/15 text-yellow"
                                : "bg-gray-400/15 text-gray-600"
                            }`}
                          >
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="revoked">Revoked</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "payables" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-navy">
                Accounts Payable
              </h2>
            </div>

            <Card className="overflow-hidden border-2 border-border/50">
              <div className="overflow-x-auto scrollbar-visible">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-navy-mid">
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Vendor ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Vendor Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Invoice Number
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Date
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-white">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Due Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountsPayable.map((ap) => (
                      <tr
                        key={ap.id}
                        className="border-b border-border hover:bg-off-white transition-colors"
                      >
                        <td className="py-3 px-4 text-accent font-bold">
                          {ap.vendorId}
                        </td>
                        <td className="py-3 px-4 text-navy font-medium">
                          {ap.vendorName}
                        </td>
                        <td className="py-3 px-4 text-muted font-medium">
                          {ap.invoiceNumber}
                        </td>
                        <td className="py-3 px-4 text-muted">
                          {ap.date}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-navy">
                          ₱{ap.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-muted">
                          {ap.dueDate}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <select
                            value={ap.status}
                            onChange={(e) =>
                              handleUpdatePayableStatus(ap.id, e.target.value as "paid" | "unpaid" | "revoked")
                            }
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border-none cursor-pointer transition-all ${
                              ap.status === "paid"
                                ? "bg-green/15 text-green"
                                : ap.status === "unpaid"
                                ? "bg-yellow/15 text-yellow"
                                : "bg-gray-400/15 text-gray-600"
                            }`}
                          >
                            <option value="unpaid">Unpaid</option>
                            <option value="paid">Paid</option>
                            <option value="revoked">Revoked</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
