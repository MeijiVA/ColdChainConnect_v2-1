import { createContext, useContext, useState, ReactNode } from "react";

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
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [batches, setBatches] = useState<Batch[]>([]);

  return (
    <InventoryContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedBatchId,
        setSelectedBatchId,
        batches,
        setBatches,
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
