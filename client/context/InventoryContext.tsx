import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface BatchItem {
  productId: string;
  quantity: number;
  expiryDate: string;
}

export interface Batch {
  id: string;
  name: string;
  items: BatchItem[];
  createdAt: string;
}

interface InventoryContextType {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedBatchId: string;
  setSelectedBatchId: (id: string) => void;
  batches: Batch[];
  setBatches: (batches: Batch[]) => void;
  refreshBatchesFromDB: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

const STORAGE_KEY_SELECTED = "inventory_selected_batch";

const ALL_PRODUCTS_BATCH: Batch = {
  id: "batch-all",
  name: "All Products",
  items: [],
  createdAt: new Date().toISOString(),
};

/**
 * Rebuild named frontend batch groups from raw DB pallet rows.
 * Each pallet row has a batch_name. We group by batch_name and collect
 * unique product_ids into items[]. This means the batch list always
 * reflects what is actually in the database, surviving page reloads.
 */
function buildBatchesFromDBRows(rows: any[]): Batch[] {
  const map = new Map<string, Batch>();

  for (const row of rows) {
    const name: string = row.batch_name || "Unnamed Batch";
    // Use a stable id derived from the name so localStorage selection survives
    const id = `db-batch-${name.toLowerCase().replace(/\s+/g, "-")}`;

    if (!map.has(id)) {
      map.set(id, {
        id,
        name,
        items: [],
        createdAt: row.created_at || new Date().toISOString(),
      });
    }

    const batch = map.get(id)!;
    // Avoid duplicate products within the same batch
    if (!batch.items.some((i) => i.productId === row.product_id)) {
      batch.items.push({
        productId: row.product_id,
        quantity: row.qty_units ?? 0,
        expiryDate: row.received_date || new Date().toISOString().split("T")[0],
      });
    }
  }

  return Array.from(map.values());
}

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("batch-all");
  const [batches, setBatches] = useState<Batch[]>([ALL_PRODUCTS_BATCH]);

  const refreshBatchesFromDB = async () => {
    try {
      const token = localStorage.getItem("auth_token") || "";
      const res = await fetch("/api/batches", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const rows: any[] = await res.json();
      const dbBatches = buildBatchesFromDBRows(rows);
      setBatches([ALL_PRODUCTS_BATCH, ...dbBatches]);
    } catch (err) {
      console.error("Failed to refresh batches from DB:", err);
    }
  };

  // On mount: load from DB (source of truth), restore selected batch from localStorage
  useEffect(() => {
    const savedSelected = localStorage.getItem(STORAGE_KEY_SELECTED) || "batch-all";
    setSelectedBatchId(savedSelected);
    refreshBatchesFromDB();
  }, []);

  // Persist selected batch id to localStorage
  useEffect(() => {
    if (selectedBatchId) {
      localStorage.setItem(STORAGE_KEY_SELECTED, selectedBatchId);
    }
  }, [selectedBatchId]);

  return (
    <InventoryContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedBatchId,
        setSelectedBatchId,
        batches,
        setBatches,
        refreshBatchesFromDB,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventoryContext() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventoryContext must be used within InventoryProvider");
  return ctx;
}
