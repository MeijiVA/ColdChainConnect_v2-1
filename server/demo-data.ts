// Demo data when no database is connected
export const demoCustomers = [
  {
    id: "cust-1",
    store_name: "ABC Market - Makati",
    location: "Makati City",
    contact_info: "555-0001",
    agent_id: null,
    payment_type: "cash",
    tax_rate: "0.12",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cust-2",
    store_name: "XYZ Supermarket - BGC",
    location: "Bonifacio Global City",
    contact_info: "555-0002",
    agent_id: null,
    payment_type: "bank_transfer",
    tax_rate: "0.12",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cust-3",
    store_name: "Fresh Mart - Tagaytay",
    location: "Tagaytay City",
    contact_info: "555-0003",
    agent_id: null,
    payment_type: "cod",
    tax_rate: "0.00",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const demoProducts = [
  {
    id: "prod-1",
    name: "Chicken Breast",
    price: "150.00",
    batch_tracking_enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "Pork Chops",
    price: "200.00",
    batch_tracking_enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Fish Fillet",
    price: "180.00",
    batch_tracking_enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const demoTrucks = [
  {
    id: "truck-1",
    name: "Truck A - Metro Manila",
    district: "Metro Manila",
    driver_id: null,
    status: "available" as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "truck-2",
    name: "Truck B - Cavite",
    district: "Cavite",
    driver_id: null,
    status: "available" as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "truck-3",
    name: "Truck C - Tagaytay",
    district: "Tagaytay",
    driver_id: null,
    status: "available" as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
