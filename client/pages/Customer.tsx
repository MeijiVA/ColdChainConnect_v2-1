// Re-exports the canonical Customer management page.
// The AI-generated version of this file introduced a conflicting
// CustomerRecord type with hardcoded mock data that did not match
// the shared Customer type or the real API. This file now delegates
// to the correct implementation in modules/Customers.tsx.
export { Customers as Customer } from "./modules/Customers";
