import { useState } from "react";

// Inventory product interface to match inventory data
interface InventoryProduct {
  id: string;
  sku: string;
  description: string;
  unitPrice: number;
  supplierId: string;
  weight: number;
  quantity: number;
  expiryDate: string;
  imageFilename?: string;
  reorderPoint: number;
  lastUpdated: string;
}

interface SalesTransaction {
  id: string;
  salesId: string;
  customerId: string;
  customerName: string;
  region: string;
  agentId: string;
  agentName: string;
  date: string;
  items: SalesLineItem[];
  quantity: number;
  unitPrice: number;
  total: number;
  status: "paid" | "unpaid" | "revoked";
  paymentMethod?: string;
  notes?: string;
}

interface SalesLineItem {
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface ForecastRecommendation {
  sku: string;
  name: string;
  current: number;
  recommended: number;
  confidence: string;
}

export function Sales() {
  // Inventory data
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const [inventory] = useState<InventoryProduct[]>([
    {
      id: "1",
      sku: "7700165",
      description: "FF Bossing Hatdogs KingSize",
      unitPrice: 148.57,
      supplierId: "Frabelle Food Corp",
      weight: 1.0,
      quantity: 56,
      expiryDate: "2026-05-05",
      imageFilename: "ff-hatdogs-kingsize.jpg",
      reorderPoint: 100,
      lastUpdated: "2026-04-28",
    },
    {
      id: "2",
      sku: "7700169",
      description: "FF Bossing Cheesedog KingSize",
      unitPrice: 156.19,
      supplierId: "Frabelle Food Corp",
      weight: 1.0,
      quantity: 38,
      expiryDate: "2026-05-18",
      imageFilename: "ff-cheesedog-kingsize.jpg",
      reorderPoint: 100,
      lastUpdated: "2026-04-27",
    },
    {
      id: "3",
      sku: "7700160",
      description: "FF Bossing Chicken Franks King",
      unitPrice: 163.81,
      supplierId: "Frabelle Food Corp",
      weight: 1.0,
      quantity: 130,
      expiryDate: "2026-06-10",
      imageFilename: "ff-chicken-franks.jpg",
      reorderPoint: 100,
      lastUpdated: "2026-04-26",
    },
    {
      id: "4",
      sku: "7702039",
      description: "FF Bossing Cheesedogs",
      unitPrice: 36.19,
      supplierId: "Frabelle Food Corp",
      weight: 1.0,
      quantity: 148,
      expiryDate: "2026-06-22",
      imageFilename: "ff-cheesedogs.jpg",
      reorderPoint: 100,
      lastUpdated: "2026-04-25",
    },
    {
      id: "5",
      sku: "7700181",
      description: "FF Bossing Cheesedog Footlong",
      unitPrice: 153.33,
      supplierId: "Frabelle Food Corp",
      weight: 1.0,
      quantity: 148,
      expiryDate: "2026-07-01",
      imageFilename: "ff-cheesedog-footlong.jpg",
      reorderPoint: 100,
      lastUpdated: "2026-04-24",
    },
    {
      id: "6",
      sku: "7702041",
      description: "FF Bossing Chicken Hd Regular",
      unitPrice: 35.34,
      supplierId: "Frabelle Food Corp",
      weight: 1.0,
      quantity: 73,
      expiryDate: "2026-06-30",
      imageFilename: "ff-chicken-hd-regular.jpg",
      reorderPoint: 100,
      lastUpdated: "2026-04-23",
    },
    {
      id: "7",
      sku: "7702031",
      description: "FF Bossing Hungarian Sausage w/Cheese",
      unitPrice: 129.32,
      supplierId: "Frabelle Food Corp",
      weight: 1.0,
      quantity: 14,
      expiryDate: "2026-05-12",
      imageFilename: "ff-hungarian-sausage.jpg",
      reorderPoint: 100,
      lastUpdated: "2026-04-22",
    },
    {
      id: "8",
      sku: "770218",
      description: "McCain Fries",
      unitPrice: 500.0,
      supplierId: "Frabelle Food Corp",
      weight: 12.0,
      quantity: 199,
      expiryDate: "2026-08-15",
      imageFilename: "mccain-fries.jpg",
      reorderPoint: 100,
      lastUpdated: "2026-04-21",
    },
  ]);

  // Customer data with regions
  const customers = [
    { id: "CUST-001", name: "Aling Maria's Store", region: "Region 1" },
    { id: "CUST-002", name: "Sari-Sari Store ng Ading", region: "Region 2" },
    { id: "CUST-003", name: "KM5 Convenience Store", region: "Region 3" },
    { id: "CUST-004", name: "Mang Ben Palengke", region: "Region 1" },
    { id: "CUST-005", name: "Aling Nena Store", region: "Region 2" },
    { id: "CUST-0010", name: "Ate Rosa Sari-Sari", region: "Region 3" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "unpaid" | "revoked">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<SalesTransaction | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<SalesTransaction | null>(null);

  const [transactions, setTransactions] = useState<SalesTransaction[]>([
    {
      id: "1",
      salesId: "SLS-001",
      customerId: "CUST-003",
      customerName: "KM5 Convenience Store",
      region: "Region 3",
      agentId: "AGT-001",
      agentName: "Juan dela Cruz",
      date: "2025-12-01",
      items: [
        {
          sku: "7700165",
          description: "FF Bossing Hatdogs KingSize",
          quantity: 24,
          unitPrice: 156.19,
          amount: 3748.56,
        },
      ],
      quantity: 24,
      unitPrice: 156.19,
      total: 3748.56,
      status: "paid",
      paymentMethod: "Cash",
    },
    {
      id: "2",
      salesId: "SLS-002",
      customerId: "CUST-0010",
      customerName: "Ate Rosa Sari-Sari",
      region: "Region 3",
      agentId: "AGT-002",
      agentName: "Maria Santos",
      date: "2025-12-01",
      items: [
        {
          sku: "7700169",
          description: "FF Bossing Cheesedog KingSize",
          quantity: 8,
          unitPrice: 156.19,
          amount: 1249.52,
        },
      ],
      quantity: 8,
      unitPrice: 156.19,
      total: 1249.52,
      status: "unpaid",
    },
    {
      id: "3",
      salesId: "SLS-003",
      customerId: "CUST-005",
      customerName: "Aling Nena Store",
      region: "Region 2",
      agentId: "AGT-003",
      agentName: "Carlos Reyes",
      date: "2025-12-01",
      items: [
        {
          sku: "7702041",
          description: "FF Bossing Chicken Hd Regular",
          quantity: 15,
          unitPrice: 35.34,
          amount: 530.10,
        },
      ],
      quantity: 15,
      unitPrice: 35.34,
      total: 530.10,
      status: "paid",
      paymentMethod: "30 Days Credit",
    },
    {
      id: "4",
      salesId: "SLS-004",
      customerId: "CUST-004",
      customerName: "Mang Ben Palengke",
      region: "Region 1",
      agentId: "AGT-004",
      agentName: "Rosa Gonzales",
      date: "2025-12-01",
      items: [
        {
          sku: "7700160",
          description: "FF Bossing Chicken Franks King",
          quantity: 10,
          unitPrice: 156.19,
          amount: 1561.90,
        },
      ],
      quantity: 10,
      unitPrice: 156.19,
      total: 1561.90,
      status: "paid",
      paymentMethod: "Cash",
    },
    {
      id: "5",
      salesId: "SLS-005",
      customerId: "CUST-001",
      customerName: "Aling Maria's Store",
      region: "Region 1",
      agentId: "AGT-001",
      agentName: "Juan dela Cruz",
      date: "2025-12-05",
      items: [
        {
          sku: "7702031",
          description: "FF Bossing Hungarian Sausage w/Cheese",
          quantity: 23,
          unitPrice: 148.57,
          amount: 3417.11,
        },
      ],
      quantity: 23,
      unitPrice: 148.57,
      total: 3417.11,
      status: "paid",
      paymentMethod: "30 Days Credit",
    },
    {
      id: "6",
      salesId: "SLS-006",
      customerId: "CUST-001",
      customerName: "Aling Maria's Store",
      region: "Region 1",
      agentId: "AGT-002",
      agentName: "Maria Santos",
      date: "2025-12-05",
      items: [
        {
          sku: "7700169",
          description: "FF Bossing Cheesedog KingSize",
          quantity: 8,
          unitPrice: 156.19,
          amount: 1249.52,
        },
      ],
      quantity: 8,
      unitPrice: 156.19,
      total: 1249.52,
      status: "paid",
      paymentMethod: "Cash",
    },
    {
      id: "7",
      salesId: "SLS-007",
      customerId: "CUST-001",
      customerName: "Aling Maria's Store",
      region: "Region 1",
      agentId: "AGT-001",
      agentName: "Juan dela Cruz",
      date: "2025-12-05",
      items: [
        {
          sku: "7700160",
          description: "FF Bossing Chicken Franks King",
          quantity: 19,
          unitPrice: 163.81,
          amount: 3112.39,
        },
      ],
      quantity: 19,
      unitPrice: 163.81,
      total: 3112.39,
      status: "paid",
      paymentMethod: "GCash",
    },
    {
      id: "8",
      salesId: "SLS-008",
      customerId: "CUST-001",
      customerName: "Aling Maria's Store",
      region: "Region 1",
      agentId: "AGT-003",
      agentName: "Carlos Reyes",
      date: "2025-12-05",
      items: [
        {
          sku: "7702041",
          description: "FF Bossing Chicken Hd Regular",
          quantity: 1,
          unitPrice: 35.34,
          amount: 35.34,
        },
      ],
      quantity: 1,
      unitPrice: 35.34,
      total: 35.34,
      status: "paid",
      paymentMethod: "Cash",
    },
    {
      id: "9",
      salesId: "SLS-009",
      customerId: "CUST-001",
      customerName: "Aling Maria's Store",
      region: "Region 1",
      agentId: "AGT-004",
      agentName: "Rosa Gonzales",
      date: "2025-12-05",
      items: [
        {
          sku: "7700181",
          description: "FF Bossing Cheesedog Footlong",
          quantity: 1,
          unitPrice: 153.33,
          amount: 153.33,
        },
      ],
      quantity: 1,
      unitPrice: 153.33,
      total: 153.33,
      status: "paid",
      paymentMethod: "Bank Transfer",
    },
  ]);

  const itemsPerPage = 10;

  // Filter and search
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.salesId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || tx.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calculate totals
  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.total, 0);
  const paidRevenue = transactions
    .filter((tx) => tx.status === "paid")
    .reduce((sum, tx) => sum + tx.total, 0);
  const unpaidRevenue = transactions
    .filter((tx) => tx.status === "unpaid")
    .reduce((sum, tx) => sum + tx.total, 0);

  // Generate next Sales ID
  const getNextSalesId = () => {
    const lastId = transactions.reduce((max, tx) => {
      const num = parseInt(tx.salesId.split("-")[1]);
      return num > max ? num : max;
    }, 0);
    return `SLS-${String(lastId + 1).padStart(3, "0")}`;
  };

  // Handle add/edit transaction
  const handleSaveTransaction = (newTransaction: SalesTransaction) => {
    if (editingTransaction) {
      setTransactions(
        transactions.map((tx) =>
          tx.id === editingTransaction.id ? newTransaction : tx
        )
      );
      setEditingTransaction(null);
    } else {
      setTransactions([...transactions, newTransaction]);
    }
    setIsAddModalOpen(false);
  };

  // Handle delete transaction
  const handleDeleteTransaction = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      setTransactions(transactions.filter((tx) => tx.id !== id));
    }
  };

  // Handle status change
  const handleStatusChange = (id: string, newStatus: "paid" | "unpaid" | "revoked") => {
    setTransactions(
      transactions.map((tx) =>
        tx.id === id ? { ...tx, status: newStatus } : tx
      )
    );
  };

  // Print receipt
  const handlePrintReceipt = (transaction: SalesTransaction) => {
    const printWindow = window.open("", "", "width=400,height=600");
    if (printWindow) {
      const itemsHtml = transaction.items
        .map(
          (item) => `
        <tr>
          <td class="qty">${item.quantity}</td>
          <td class="desc">
            <strong>${item.sku}</strong><br/>
            ${item.description}
          </td>
          <td class="price">₱ ${item.unitPrice.toFixed(2)}</td>
          <td class="amount">₱ ${item.amount.toFixed(2)}</td>
        </tr>
      `
        )
        .join("");

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Delivery Receipt - ${transaction.salesId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 10px; font-size: 11px; line-height: 1.4; }
            .header { text-align: center; margin-bottom: 10px; border-bottom: 1px solid #000; padding-bottom: 8px; }
            .company-name { font-size: 14px; font-weight: bold; }
            .company-desc { font-size: 9px; color: #666; }
            .delivery-receipt { text-align: center; font-weight: bold; font-size: 12px; margin: 5px 0; color: #d00; }
            .receipt-no { text-align: right; margin-bottom: 5px; }
            .info-row { display: flex; justify-content: space-between; margin: 3px 0; }
            .info-label { font-weight: bold; }
            table { width: 100%; margin: 8px 0; border-collapse: collapse; }
            th { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 3px; text-align: left; font-weight: bold; font-size: 10px; }
            td { padding: 3px; }
            .qty { text-align: center; width: 30px; }
            .desc { flex: 1; }
            .price { text-align: right; width: 60px; }
            .amount { text-align: right; width: 80px; border-left: 1px solid #ccc; padding-left: 5px; }
            .totals { border-top: 1px solid #000; border-bottom: 2px solid #000; margin: 5px 0; padding-top: 5px; }
            .total-row { display: flex; justify-content: space-between; margin: 3px 0; }
            .total-label { font-weight: bold; }
            .total-amount { font-weight: bold; font-size: 13px; text-align: right; }
            .footer { text-align: center; margin-top: 8px; padding-top: 8px; border-top: 1px solid #000; font-size: 9px; }
            .footer-line { margin: 2px 0; }
            @media print { body { margin: 0; padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">ACDP CONSUMER GOODS TRADING</div>
            <div class="company-desc">Serbisyo & Supply, City of San Fernando (Capas), Pampanga Philippines</div>
            <div class="delivery-receipt">DELIVERY RECEIPT</div>
          </div>

          <div class="receipt-no">No. ${transaction.salesId.replace("SLS-", "")}</div>

          <div class="info-row">
            <div>
              <div class="info-label">SOLD TO:</div>
              <div>${transaction.customerName}</div>
            </div>
          </div>

          <div class="info-row">
            <div>
              <div class="info-label">DATE:</div>
              <div>${new Date(transaction.date).toLocaleDateString()}</div>
            </div>
            <div>
              <div class="info-label">TERMS:</div>
              <div>${transaction.paymentMethod || "Cash"}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>QTY</th>
                <th>UNIT DESCRIPTION</th>
                <th>UNIT PRICE</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span class="total-label">GROSS</span>
              <span class="total-amount">₱ ${transaction.total.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span class="total-label">LESS DISCOUNT</span>
              <span class="total-amount">₱ 0.00</span>
            </div>
            <div class="total-row">
              <span class="total-label">TOTAL AMOUNT DUE</span>
              <span class="total-amount">₱ ${transaction.total.toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <div class="footer-line">RECEIVED BY: _________________________ PREPARED BY: Antonio C. Dela Pena</div>
          </div>

          <script>window.print(); window.close();</script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="flex-1 px-4 md:px-6 lg:px-7 py-4 md:py-6 overflow-y-auto scrollbar-visible space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-rajdhani text-3xl font-bold text-navy letter-spacing-tight">
            Sales Tracking
          </h1>
          <p className="text-xs text-muted mt-1">
            Record, track, and monitor all sales transactions with integrated AI forecasting
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          label="Total Sales Revenue"
          value={`₱${totalRevenue.toLocaleString("en-PH", { maximumFractionDigits: 2 })}`}
          subtitle="All transactions"
          icon="💰"
          color="green"
        />
        <SummaryCard
          label="Paid"
          value={`₱${paidRevenue.toLocaleString("en-PH", { maximumFractionDigits: 2 })}`}
          subtitle={`${transactions.filter((t) => t.status === "paid").length} transactions`}
          icon="✅"
          color="green"
        />
        <SummaryCard
          label="Unpaid"
          value={`₱${unpaidRevenue.toLocaleString("en-PH", { maximumFractionDigits: 2 })}`}
          subtitle={`${transactions.filter((t) => t.status === "unpaid").length} transactions`}
          icon="⏳"
          color="red"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <button
          onClick={() => setShowDeleteButtons(!showDeleteButtons)}
          className="px-4 py-2 bg-white border border-border text-navy rounded-lg font-semibold text-sm hover:bg-off-white"
        >
          {showDeleteButtons ? "🔒 Hide Delete" : "🔓 Show Delete"}
        </button>
        <div className="flex gap-2 ml-auto">
          <button className="px-4 py-2 bg-white border border-border text-navy rounded-lg font-semibold text-sm hover:bg-off-white">
            ⬇ Import
          </button>
          <button className="px-4 py-2 bg-white border border-border text-navy rounded-lg font-semibold text-sm hover:bg-off-white">
            ⬆ Export
          </button>
          <button
            onClick={() => {
              setEditingTransaction(null);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 bg-white border border-border text-navy rounded-lg font-semibold text-sm hover:bg-off-white"
          >
            ＋ Create Sales
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center bg-navy-mid border border-border rounded-lg px-3 gap-2">
          <span className="text-muted">🔍</span>
          <input
            type="text"
            placeholder="Search by Sales ID, Customer ID, name…"
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
            setFilterStatus(e.target.value as "all" | "paid" | "unpaid" | "revoked");
            setCurrentPage(1);
          }}
          className="px-3 py-2 bg-navy-mid border border-border text-white rounded-lg text-sm outline-none cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="revoked">Revoked</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto scrollbar-visible text-xs md:text-sm">
          <table className="w-full">
            <thead>
              <tr>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Date
                </th>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Customer Name
                </th>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Sales Region
                </th>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Sales Agent
                </th>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  SKU No.
                </th>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Product Name
                </th>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Price per Unit
                </th>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Units Sold
                </th>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Total Sale Value
                </th>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Payment Method
                </th>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Invoice No.
                </th>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Order Status
                </th>
                <th className="bg-navy-mid text-muted font-barlow-cond text-xs font-bold letter-spacing-wider uppercase px-3 py-3 text-left border-b border-border whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-border hover:bg-off-white/50 transition-colors"
                >
                  <td className="px-3 py-3 text-navy text-xs">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-3 text-navy">{transaction.customerName}</td>
                  <td className="px-3 py-3 text-navy text-sm">
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-blue/10 text-blue">
                      {transaction.region}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-navy">{transaction.agentName}</td>
                  <td className="px-3 py-3 text-navy font-semibold">
                    {transaction.items[0]?.sku}
                  </td>
                  <td className="px-3 py-3 text-navy">
                    {transaction.items[0]?.description}
                  </td>
                  <td className="px-3 py-3 text-navy">
                    ₱{transaction.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-navy text-center">{transaction.quantity}</td>
                  <td className="px-3 py-3 text-navy font-semibold">
                    ₱{transaction.total.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-navy text-xs">
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-navy/10 text-navy">
                      {transaction.paymentMethod || "Cash"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-navy font-semibold">
                    {transaction.salesId}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <select
                      value={transaction.status}
                      onChange={(e) => handleStatusChange(transaction.id, e.target.value as "paid" | "unpaid" | "revoked")}
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border-0 cursor-pointer ${
                        transaction.status === "paid"
                          ? "bg-green text-white"
                          : transaction.status === "unpaid"
                          ? "bg-red text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="revoked">Revoked</option>
                    </select>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handlePrintReceipt(transaction)}
                        className="px-2 py-1 bg-white border border-border text-navy rounded text-xs font-semibold hover:bg-off-white"
                        title="Print Receipt"
                      >
                        🖨
                      </button>
                      <button
                        onClick={() => {
                          setEditingTransaction(transaction);
                          setIsAddModalOpen(true);
                        }}
                        className="px-2 py-1 bg-gold text-white rounded text-xs font-semibold hover:opacity-90"
                        title="Edit"
                      >
                        ✏
                      </button>
                      {showDeleteButtons && (
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="px-2 py-1 bg-red text-white rounded text-xs font-semibold hover:opacity-90"
                          title="Delete"
                        >
                          🗑
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <div className="text-xs text-muted">
            Page {currentPage} of {totalPages} · {filteredTransactions.length} items
          </div>
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
            <span className="px-3 py-1 text-xs text-muted">Page: {currentPage} of {totalPages}</span>
          </div>
        </div>
      </div>

      {/* AI Demand Forecasting Section */}
      <ForecastingSection />

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <SalesModal
          transaction={editingTransaction}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingTransaction(null);
          }}
          onSave={handleSaveTransaction}
          nextSalesId={getNextSalesId()}
          inventory={inventory}
          customers={customers}
        />
      )}
    </div>
  );
}

function ForecastingSection() {
  const [forecasts] = useState<ForecastRecommendation[]>([
    {
      sku: "7702031",
      name: "FF Bossing Hungarian Sausage w/Cheese",
      current: 14,
      recommended: 200,
      confidence: "92%",
    },
    {
      sku: "7700169",
      name: "FF Bossing Cheesedog KingSize",
      current: 38,
      recommended: 150,
      confidence: "88%",
    },
    {
      sku: "7700165",
      name: "FF Bossing Hatdogs KingSize",
      current: 56,
      recommended: 80,
      confidence: "74%",
    },
    {
      sku: "7702041",
      name: "FF Bossing Chicken Hd Regular",
      current: 73,
      recommended: 60,
      confidence: "70%",
    },
  ]);

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-rajdhani text-xl font-bold text-navy">
            📈 AI Demand Forecasting
          </h2>
          <p className="text-xs text-muted mt-1">
            S.M.A.R.T. recommendations based on historical sales data
          </p>
        </div>
        <button className="px-4 py-2 bg-accent-2 text-white rounded-lg font-semibold text-sm hover:opacity-90">
          🔄 Regenerate Forecast
        </button>
      </div>

      <div className="bg-off-white rounded-lg p-4 mb-4">
        <p className="text-xs text-muted mb-4">
          🤖 The AI has analyzed your sales data and recommends the following stock orders:
        </p>

        <div className="space-y-2">
          {forecasts.map((rec) => (
            <div
              key={rec.sku}
              className="flex items-center justify-between p-3 bg-white border border-border rounded-lg"
            >
              <div>
                <p className="text-sm font-semibold text-navy">{rec.name}</p>
                <p className="text-xs text-muted">
                  Current: {rec.current} units → Recommend: +{rec.recommended} units
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold badge-green">
                  {rec.confidence} confidence
                </span>
                <button className="px-3 py-1 bg-green text-white rounded text-xs font-semibold hover:opacity-90">
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SalesModal({
  transaction,
  onClose,
  onSave,
  nextSalesId,
  inventory,
  customers,
}: {
  transaction: SalesTransaction | null;
  onClose: () => void;
  onSave: (transaction: SalesTransaction) => void;
  nextSalesId: string;
  inventory: InventoryProduct[];
  customers: { id: string; name: string; region: string }[];
}) {
  const agents = [
    { id: "AGT-001", name: "Juan dela Cruz" },
    { id: "AGT-002", name: "Maria Santos" },
    { id: "AGT-003", name: "Carlos Reyes" },
    { id: "AGT-004", name: "Rosa Gonzales" },
  ];

  const [formData, setFormData] = useState<SalesTransaction>(
    transaction || {
      id: Date.now().toString(),
      salesId: nextSalesId,
      customerId: "",
      customerName: "",
      region: "",
      agentId: "",
      agentName: "",
      date: new Date().toISOString().split("T")[0],
      items: [
        {
          sku: "",
          description: "",
          quantity: 0,
          unitPrice: 0,
          amount: 0,
        },
      ],
      quantity: 0,
      unitPrice: 0,
      total: 0,
      status: "unpaid",
    }
  );

  const [items, setItems] = useState(formData.items);

  const updateItem = (index: number, field: keyof SalesLineItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // If SKU changed, auto-fill description and unit price from inventory
    if (field === "sku") {
      const inventoryItem = inventory.find((inv) => inv.sku === value);
      if (inventoryItem) {
        updatedItems[index].description = inventoryItem.description;
        updatedItems[index].unitPrice = inventoryItem.unitPrice;
      }
    }

    // Recalculate amount
    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index].amount =
        updatedItems[index].quantity * updatedItems[index].unitPrice;
    }

    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        sku: "",
        description: "",
        quantity: 0,
        unitPrice: 0,
        amount: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!formData.customerId || !formData.customerName) {
      alert("Please fill in customer information");
      return;
    }

    if (!formData.agentId || !formData.agentName) {
      alert("Please select an agent");
      return;
    }

    if (items.some((item) => !item.sku || !item.description || item.quantity <= 0)) {
      alert("Please fill in all item details");
      return;
    }

    const total = items.reduce((sum, item) => sum + item.amount, 0);
    const firstItem = items[0];

    const updatedTransaction: SalesTransaction = {
      ...formData,
      items,
      total,
      quantity: firstItem.quantity,
      unitPrice: firstItem.unitPrice,
    };

    onSave(updatedTransaction);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-border max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-navy-mid px-6 py-4 flex items-center justify-between border-b border-border">
          <h2 className="font-rajdhani text-lg font-bold text-white">
            {transaction ? "Edit Sale Transaction" : "Create New Sale Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:opacity-70 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Transaction Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Sales ID
              </label>
              <input
                type="text"
                value={formData.salesId}
                disabled
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-off-white text-navy font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Agent *
              </label>
              <select
                value={formData.agentId}
                onChange={(e) => {
                  const agent = agents.find((a) => a.id === e.target.value);
                  setFormData({
                    ...formData,
                    agentId: e.target.value,
                    agentName: agent?.name || "",
                  });
                }}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
              >
                <option value="">Select agent...</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Customer *
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => {
                  const customer = customers.find((c) => c.id === e.target.value);
                  if (customer) {
                    setFormData({
                      ...formData,
                      customerId: customer.id,
                      customerName: customer.name,
                      region: customer.region,
                    });
                  }
                }}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
              >
                <option value="">Select customer...</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.id} - {customer.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={formData.customerName}
                disabled
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-off-white text-navy font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Region
              </label>
              <input
                type="text"
                value={formData.region}
                disabled
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-off-white text-navy font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Sales Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentMethod: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
              >
                <option value="">Select method</option>
                <option value="cash">Cash</option>
                <option value="credit">Credit</option>
                <option value="check">Check</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          {/* Items Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-rajdhani text-lg font-bold text-navy">Items</h3>
              <div className="flex gap-2">
                {items.length > 1 && (
                  <div className="text-xs text-muted">
                    {items.length} items added
                  </div>
                )}
                <button
                  onClick={addItem}
                  className="px-3 py-1 bg-accent-2 text-white rounded text-xs font-semibold hover:opacity-90"
                >
                  ＋ Add Product
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="border border-border rounded-lg p-4 bg-off-white">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-1">
                        Select Product *
                      </label>
                      <select
                        value={item.sku}
                        onChange={(e) => updateItem(index, "sku", e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
                      >
                        <option value="">Choose product...</option>
                        {inventory.map((inv) => (
                          <option key={inv.id} value={inv.sku}>
                            {inv.sku} - {inv.description}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-navy mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        disabled
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-off-white text-navy font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", parseInt(e.target.value) || 0)
                        }
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-1">
                        Unit Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitPrice}
                        disabled
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-off-white text-navy font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted">Amount: </span>
                      <span className="font-semibold text-navy">
                        ₱{item.amount.toFixed(2)}
                      </span>
                    </div>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(index)}
                        className="px-3 py-1 bg-red text-white rounded text-xs font-semibold hover:opacity-90"
                        title="Remove product"
                      >
                        🗑 Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-navy-mid rounded-lg p-4 flex justify-between items-center">
            <span className="font-rajdhani text-lg font-bold text-white">Total Amount:</span>
            <span className="font-rajdhani text-2xl font-bold text-green">
              ₱{items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="sticky bottom-0 bg-off-white px-6 py-4 flex justify-end gap-2 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg font-semibold text-sm hover:bg-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-accent-2 text-white rounded-lg font-semibold text-sm hover:opacity-90"
          >
            {transaction ? "Update" : "Create"} Transaction
          </button>
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
