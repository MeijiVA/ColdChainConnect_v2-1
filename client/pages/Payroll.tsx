import { useState } from "react";

interface Agent {
  id: string;
  name: string;
  employeeId: string;
  commissionRate: number; // percentage
  totalSales: number;
  verifiedSales: number;
  commissionEarned: number;
  status: "pending" | "approved" | "disbursed";
}

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  position: string;
  baseSalary: number;
  hoursWorked: number;
  overtimeHours: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  status: "pending" | "approved" | "disbursed";
}

interface DisbursementRecord {
  id: string;
  type: "commission" | "payroll";
  recipientId: string;
  recipientName: string;
  recipientType: "agent" | "employee";
  amount: number;
  paymentMethod: "bank_transfer" | "gcash" | "paymaya";
  status: "pending" | "processing" | "completed" | "failed";
  createdDate: string;
  completedDate?: string;
  referenceNumber?: string;
  notes?: string;
  saleId?: string;
  saleReference?: string;
}

export function Payroll() {
  const [activeTab, setActiveTab] = useState<"commissions" | "payroll" | "disbursements">(
    "commissions"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "disbursed">(
    "all"
  );

  // Sample sales data (would come from Sales page in real app)
  const [sales] = useState([
    { id: "1", salesId: "SLS-001", agentId: "AGT-001", agentName: "Juan dela Cruz", total: 3748.56, status: "paid" },
    { id: "2", salesId: "SLS-002", agentId: "AGT-002", agentName: "Maria Santos", total: 1249.52, status: "unpaid" },
    { id: "3", salesId: "SLS-003", agentId: "AGT-003", agentName: "Carlos Reyes", total: 530.10, status: "paid" },
    { id: "4", salesId: "SLS-004", agentId: "AGT-004", agentName: "Rosa Gonzales", total: 1561.90, status: "paid" },
    { id: "5", salesId: "SLS-005", agentId: "AGT-001", agentName: "Juan dela Cruz", total: 3417.11, status: "paid" },
    { id: "6", salesId: "SLS-006", agentId: "AGT-002", agentName: "Maria Santos", total: 1249.52, status: "paid" },
    { id: "7", salesId: "SLS-007", agentId: "AGT-001", agentName: "Juan dela Cruz", total: 3112.39, status: "paid" },
    { id: "8", salesId: "SLS-008", agentId: "AGT-003", agentName: "Carlos Reyes", total: 35.34, status: "paid" },
    { id: "9", salesId: "SLS-009", agentId: "AGT-004", agentName: "Rosa Gonzales", total: 153.33, status: "paid" },
  ]);

  // Calculate agent commissions from sales
  const calculateAgentStats = () => {
    const commissionRate = 0.05; // 5%
    const agentMap = new Map<
      string,
      { id: string; name: string; totalSales: number; paidSales: number; count: number }
    >();

    sales.forEach((sale) => {
      const existing = agentMap.get(sale.agentId) || {
        id: sale.agentId,
        name: sale.agentName,
        totalSales: 0,
        paidSales: 0,
        count: 0,
      };
      existing.totalSales += sale.total;
      if (sale.status === "paid") {
        existing.paidSales += sale.total;
      }
      existing.count += 1;
      agentMap.set(sale.agentId, existing);
    });

    return [
      {
        id: "AGT-001",
        name: "Juan dela Cruz",
        employeeId: "EMP-101",
        commissionRate: 5,
        totalSales: agentMap.get("AGT-001")?.totalSales || 0,
        verifiedSales: agentMap.get("AGT-001")?.paidSales || 0,
        commissionEarned: ((agentMap.get("AGT-001")?.paidSales || 0) * commissionRate),
        status: "pending" as const,
      },
      {
        id: "AGT-002",
        name: "Maria Santos",
        employeeId: "EMP-102",
        commissionRate: 5,
        totalSales: agentMap.get("AGT-002")?.totalSales || 0,
        verifiedSales: agentMap.get("AGT-002")?.paidSales || 0,
        commissionEarned: ((agentMap.get("AGT-002")?.paidSales || 0) * commissionRate),
        status: "approved" as const,
      },
      {
        id: "AGT-003",
        name: "Carlos Reyes",
        employeeId: "EMP-103",
        commissionRate: 5,
        totalSales: agentMap.get("AGT-003")?.totalSales || 0,
        verifiedSales: agentMap.get("AGT-003")?.paidSales || 0,
        commissionEarned: ((agentMap.get("AGT-003")?.paidSales || 0) * commissionRate),
        status: "disbursed" as const,
      },
      {
        id: "AGT-004",
        name: "Rosa Gonzales",
        employeeId: "EMP-104",
        commissionRate: 5,
        totalSales: agentMap.get("AGT-004")?.totalSales || 0,
        verifiedSales: agentMap.get("AGT-004")?.paidSales || 0,
        commissionEarned: ((agentMap.get("AGT-004")?.paidSales || 0) * commissionRate),
        status: "pending" as const,
      },
    ];
  };

  const [agents, setAgents] = useState<Agent[]>(calculateAgentStats());

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "EMP-001",
      name: "Antonio Dela Pena",
      employeeId: "EMP-201",
      position: "Sales Manager",
      baseSalary: 25000,
      hoursWorked: 160,
      overtimeHours: 8,
      grossSalary: 26500,
      deductions: 2650,
      netSalary: 23850,
      status: "pending",
    },
    {
      id: "EMP-002",
      name: "Michelle Aquino",
      employeeId: "EMP-202",
      position: "Inventory Coordinator",
      baseSalary: 18000,
      hoursWorked: 160,
      overtimeHours: 0,
      grossSalary: 18000,
      deductions: 1800,
      netSalary: 16200,
      status: "approved",
    },
    {
      id: "EMP-003",
      name: "Robert Cruz",
      employeeId: "EMP-203",
      position: "Logistics Officer",
      baseSalary: 20000,
      hoursWorked: 160,
      overtimeHours: 12,
      grossSalary: 21500,
      deductions: 2150,
      netSalary: 19350,
      status: "disbursed",
    },
  ]);

  // Generate commission disbursements from sales
  const generateCommissionDisbursements = () => {
    const commissionRate = 0.05; // 5%
    return sales.map((sale) => {
      const commission = sale.total * commissionRate;
      return {
        id: `COMM-${sale.id}`,
        type: "commission" as const,
        recipientId: sale.agentId,
        recipientName: sale.agentName,
        recipientType: "agent" as const,
        amount: commission,
        paymentMethod: "bank_transfer" as const,
        status: "pending" as const,
        createdDate: "2025-12-05",
        saleId: sale.id,
        saleReference: sale.salesId,
      };
    });
  };

  const [disbursements, setDisbursements] = useState<DisbursementRecord[]>(
    generateCommissionDisbursements()
  );

  const itemsPerPage = 10;

  // Calculate totals
  const totalCommissions = agents.reduce((sum, agent) => sum + agent.commissionEarned, 0);
  const pendingCommissions = agents
    .filter((a) => a.status === "pending")
    .reduce((sum, a) => sum + a.commissionEarned, 0);
  const totalPayroll = employees.reduce((sum, emp) => sum + emp.netSalary, 0);
  const pendingPayroll = employees
    .filter((e) => e.status === "pending")
    .reduce((sum, e) => sum + e.netSalary, 0);

  // Filtered data
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || agent.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || emp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle approval
  const handleApproveAgent = (id: string) => {
    setAgents(
      agents.map((a) => (a.id === id ? { ...a, status: "approved" } : a))
    );
  };

  const handleApproveEmployee = (id: string) => {
    setEmployees(
      employees.map((e) => (e.id === id ? { ...e, status: "approved" } : e))
    );
  };

  return (
    <div className="flex-1 px-4 md:px-6 lg:px-7 py-4 md:py-6 overflow-y-auto scrollbar-visible space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-rajdhani text-3xl font-bold text-navy letter-spacing-tight">
            Payroll & Disbursement
          </h1>
          <p className="text-xs text-muted mt-1">
            Manage agent commissions, employee payroll, and automated disbursements
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Commissions"
          value={`₱${totalCommissions.toLocaleString("en-PH", { maximumFractionDigits: 2 })}`}
          subtitle="All agents"
          icon="💼"
          color="blue"
        />
        <SummaryCard
          label="Pending Commissions"
          value={`₱${pendingCommissions.toLocaleString("en-PH", { maximumFractionDigits: 2 })}`}
          subtitle={`${agents.filter((a) => a.status === "pending").length} agents`}
          icon="⏳"
          color="gold"
        />
        <SummaryCard
          label="Total Payroll"
          value={`₱${totalPayroll.toLocaleString("en-PH", { maximumFractionDigits: 2 })}`}
          subtitle={`${employees.length} employees`}
          icon="💰"
          color="green"
        />
        <SummaryCard
          label="Pending Payroll"
          value={`₱${pendingPayroll.toLocaleString("en-PH", { maximumFractionDigits: 2 })}`}
          subtitle={`${employees.filter((e) => e.status === "pending").length} employees`}
          icon="⏳"
          color="gold"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border bg-white rounded-t-2xl px-6 pt-4">
        {(["commissions", "payroll", "disbursements"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`px-4 py-3 font-semibold text-sm transition-all border-b-2 ${
              activeTab === tab
                ? "text-accent-2 border-b-accent-2"
                : "text-muted border-b-transparent hover:text-navy"
            }`}
          >
            {tab === "commissions"
              ? "Agent Commissions"
              : tab === "payroll"
                ? "Employee Payroll"
                : "Disbursements"}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center bg-navy-mid border border-border rounded-lg px-3 gap-2">
          <span className="text-muted">🔍</span>
          <input
            type="text"
            placeholder="Search by name or ID…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 bg-transparent border-none text-white placeholder-muted py-2 outline-none text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value as any);
            setCurrentPage(1);
          }}
          className="px-3 py-2 bg-navy-mid border border-border text-white rounded-lg text-sm outline-none cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="disbursed">Disbursed</option>
        </select>
        <button className="px-4 py-2 bg-accent-2 text-white rounded-lg font-semibold text-sm hover:opacity-90">
          📤 Bulk Disburse
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "commissions" && (
        <CommissionsSection
          agents={paginatedAgents}
          totalPages={Math.ceil(filteredAgents.length / itemsPerPage)}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onApprove={handleApproveAgent}
        />
      )}

      {activeTab === "payroll" && (
        <PayrollSection
          employees={paginatedEmployees}
          totalPages={Math.ceil(filteredEmployees.length / itemsPerPage)}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onApprove={handleApproveEmployee}
        />
      )}

      {activeTab === "disbursements" && (
        <DisbursementsSection disbursements={disbursements} />
      )}
    </div>
  );
}

function CommissionsSection({
  agents,
  totalPages,
  currentPage,
  setCurrentPage,
  onApprove,
}: {
  agents: Agent[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onApprove: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="overflow-x-auto scrollbar-visible text-xs md:text-sm">
        <table className="w-full">
          <thead>
            <tr>
              <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                Agent Name
              </th>
              <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                Employee ID
              </th>
              <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                Commission Rate
              </th>
              <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                Total Sales
              </th>
              <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                Verified Sales
              </th>
              <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                Commission
              </th>
              <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                Status
              </th>
              <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr
                key={agent.id}
                className="border-b border-border hover:bg-off-white/50 transition-colors"
              >
                <td className="px-3 py-3 text-navy font-semibold">{agent.name}</td>
                <td className="px-3 py-3 text-navy">{agent.employeeId}</td>
                <td className="px-3 py-3 text-navy">{agent.commissionRate}%</td>
                <td className="px-3 py-3 text-navy">
                  ₱{agent.totalSales.toLocaleString("en-PH")}
                </td>
                <td className="px-3 py-3 text-navy">
                  ₱{agent.verifiedSales.toLocaleString("en-PH")}
                </td>
                <td className="px-3 py-3 text-navy font-semibold">
                  ₱{agent.commissionEarned.toLocaleString("en-PH", {
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold badge-${
                      agent.status === "disbursed"
                        ? "green"
                        : agent.status === "approved"
                          ? "blue"
                          : "gold"
                    }`}
                  >
                    {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {agent.status === "pending" && (
                    <button
                      onClick={() => onApprove(agent.id)}
                      className="px-3 py-1 bg-accent-2 text-white rounded text-xs font-semibold hover:opacity-90"
                    >
                      Approve
                    </button>
                  )}
                  {agent.status === "approved" && (
                    <button className="px-3 py-1 bg-green text-white rounded text-xs font-semibold hover:opacity-90">
                      Disburse
                    </button>
                  )}
                  {agent.status === "disbursed" && (
                    <span className="text-xs text-muted">✓ Paid</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border">
        <div className="text-xs text-muted">Page {currentPage} of {totalPages}</div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-border rounded text-xs font-semibold disabled:opacity-50"
          >
            ← Prev
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-border rounded text-xs font-semibold disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

function PayrollSection({
  employees,
  totalPages,
  currentPage,
  setCurrentPage,
  onApprove,
}: {
  employees: Employee[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onApprove: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="overflow-x-auto scrollbar-visible text-xs md:text-sm">
        <table className="w-full">
          <thead>
            <tr>
              <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                Employee Name
              </th>
              <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                Position
              </th>
              <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                Base Salary
              </th>
              <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap hidden sm:table-cell">
                Hours
              </th>
              <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap hidden sm:table-cell">
                OT Hours
              </th>
              <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                Gross Salary
              </th>
              <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                Net Salary
              </th>
              <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                Status
              </th>
              <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="border-b border-border hover:bg-off-white/50 transition-colors"
              >
                <td className="px-3 py-3 text-navy font-semibold">{employee.name}</td>
                <td className="px-3 py-3 text-navy">{employee.position}</td>
                <td className="px-3 py-3 text-navy">
                  ₱{employee.baseSalary.toLocaleString("en-PH")}
                </td>
                <td className="px-3 py-3 text-navy hidden sm:table-cell">
                  {employee.hoursWorked}h
                </td>
                <td className="px-3 py-3 text-navy hidden sm:table-cell">
                  {employee.overtimeHours}h
                </td>
                <td className="px-3 py-3 text-navy font-semibold">
                  ₱{employee.grossSalary.toLocaleString("en-PH")}
                </td>
                <td className="px-3 py-3 text-navy font-semibold text-green">
                  ₱{employee.netSalary.toLocaleString("en-PH")}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold badge-${
                      employee.status === "disbursed"
                        ? "green"
                        : employee.status === "approved"
                          ? "blue"
                          : "gold"
                    }`}
                  >
                    {employee.status.charAt(0).toUpperCase() +
                      employee.status.slice(1)}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {employee.status === "pending" && (
                    <button
                      onClick={() => onApprove(employee.id)}
                      className="px-3 py-1 bg-accent-2 text-white rounded text-xs font-semibold hover:opacity-90"
                    >
                      Approve
                    </button>
                  )}
                  {employee.status === "approved" && (
                    <button className="px-3 py-1 bg-green text-white rounded text-xs font-semibold hover:opacity-90">
                      Disburse
                    </button>
                  )}
                  {employee.status === "disbursed" && (
                    <span className="text-xs text-muted">✓ Paid</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border">
        <div className="text-xs text-muted">Page {currentPage} of {totalPages}</div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-border rounded text-xs font-semibold disabled:opacity-50"
          >
            ← Prev
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-border rounded text-xs font-semibold disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

function DisbursementsSection({
  disbursements,
}: {
  disbursements: DisbursementRecord[];
}) {
  const [filterMethod, setFilterMethod] = useState<"all" | "bank_transfer" | "gcash" | "paymaya">(
    "all"
  );
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<"all" | "pending" | "processing" | "completed" | "failed">(
    "all"
  );

  const filteredDisbursements = disbursements.filter((d) => {
    const methodMatch = filterMethod === "all" || d.paymentMethod === filterMethod;
    const statusMatch = filterPaymentStatus === "all" || d.status === filterPaymentStatus;
    return methodMatch && statusMatch;
  });

  const totalDisbursed = disbursements
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + d.amount, 0);
  const totalPending = disbursements
    .filter((d) => d.status === "pending" || d.status === "processing")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      {/* Disbursement Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-border rounded-2xl p-5">
          <div className="text-xs text-muted font-semibold letter-spacing-tight uppercase">
            Total Disbursed
          </div>
          <div className="font-rajdhani text-2xl font-bold mt-2 text-green">
            ₱{totalDisbursed.toLocaleString("en-PH", { maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-white border border-border rounded-2xl p-5">
          <div className="text-xs text-muted font-semibold letter-spacing-tight uppercase">
            Pending Disbursement
          </div>
          <div className="font-rajdhani text-2xl font-bold mt-2 text-gold">
            ₱{totalPending.toLocaleString("en-PH", { maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <select
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value as any)}
          className="px-3 py-2 bg-navy-mid border border-border text-white rounded-lg text-sm outline-none cursor-pointer"
        >
          <option value="all">All Payment Methods</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="gcash">GCash</option>
          <option value="paymaya">PayMaya</option>
        </select>
        <select
          value={filterPaymentStatus}
          onChange={(e) => setFilterPaymentStatus(e.target.value as any)}
          className="px-3 py-2 bg-navy-mid border border-border text-white rounded-lg text-sm outline-none cursor-pointer"
        >
          <option value="all">All Payment Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Disbursement Records */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto scrollbar-visible text-xs md:text-sm">
          <table className="w-full">
            <thead>
              <tr>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Reference
                </th>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Type
                </th>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Recipient
                </th>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Sale Reference
                </th>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Amount
                </th>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Method
                </th>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Created Date
                </th>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Status
                </th>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDisbursements.map((disbursement) => (
                <tr
                  key={disbursement.id}
                  className="border-b border-border hover:bg-off-white/50 transition-colors"
                >
                  <td className="px-3 py-3 text-navy font-semibold">
                    {disbursement.referenceNumber || disbursement.id}
                  </td>
                  <td className="px-3 py-3 text-navy">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        disbursement.type === "commission"
                          ? "bg-blue/10 text-blue"
                          : "bg-green/10 text-green"
                      }`}
                    >
                      {disbursement.type === "commission" ? "Commission" : "Payroll"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-navy">
                    <div>
                      <div className="font-semibold">{disbursement.recipientName}</div>
                      <div className="text-xs text-muted">{disbursement.recipientType}</div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-navy font-semibold">
                    {disbursement.saleReference && (
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-off-white text-navy">
                        {disbursement.saleReference}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-navy font-semibold">
                    ₱{disbursement.amount.toLocaleString("en-PH", {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-3 py-3 text-navy">
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-navy/10 text-navy">
                      {disbursement.paymentMethod === "bank_transfer"
                        ? "Bank Transfer"
                        : disbursement.paymentMethod === "gcash"
                          ? "GCash"
                          : "PayMaya"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-navy text-xs">
                    {new Date(disbursement.createdDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold badge-${
                        disbursement.status === "completed"
                          ? "green"
                          : disbursement.status === "processing"
                            ? "blue"
                            : disbursement.status === "failed"
                              ? "red"
                              : "gold"
                      }`}
                    >
                      {disbursement.status.charAt(0).toUpperCase() +
                        disbursement.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {disbursement.status === "pending" && (
                      <button className="px-3 py-1 bg-accent-2 text-white rounded text-xs font-semibold hover:opacity-90">
                        Process
                      </button>
                    )}
                    {disbursement.status === "processing" && (
                      <button className="px-3 py-1 bg-blue text-white rounded text-xs font-semibold hover:opacity-90">
                        Cancel
                      </button>
                    )}
                    {disbursement.status === "completed" && (
                      <button className="px-3 py-1 bg-white border border-border text-navy rounded text-xs font-semibold hover:bg-off-white">
                        Receipt
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods Info */}
      <div className="bg-off-white border border-border rounded-2xl p-6">
        <h3 className="font-rajdhani text-lg font-bold text-navy mb-4">
          Integrated Payment Methods
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-border rounded-lg p-4">
            <div className="text-2xl mb-2">🏦</div>
            <div className="font-semibold text-navy">Bank Transfer</div>
            <div className="text-xs text-muted mt-1">
              Direct deposit to employee/agent bank accounts
            </div>
          </div>
          <div className="bg-white border border-border rounded-lg p-4">
            <div className="text-2xl mb-2">📱</div>
            <div className="font-semibold text-navy">GCash</div>
            <div className="text-xs text-muted mt-1">
              Mobile wallet transfer for quick disbursement
            </div>
          </div>
          <div className="bg-white border border-border rounded-lg p-4">
            <div className="text-2xl mb-2">💳</div>
            <div className="font-semibold text-navy">PayMaya</div>
            <div className="text-xs text-muted mt-1">
              Digital payment platform integration
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  subtitle,
  icon,
  color,
}: {
  label: string;
  value: string;
  subtitle: string;
  icon: string;
  color: string;
}) {
  return (
    <div className={`bg-white border border-border rounded-2xl p-5 flex flex-col gap-2`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-xs text-muted font-semibold letter-spacing-tight uppercase">
            {label}
          </div>
          <div className={`font-rajdhani text-2xl font-bold mt-2 text-${color}`}>
            {value}
          </div>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
      <div className="text-xs text-muted mt-1">{subtitle}</div>
    </div>
  );
}
