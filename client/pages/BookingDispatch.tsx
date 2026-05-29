import { Routes, Route } from "react-router-dom";
import { HubSidebar } from "@/components/HubSidebar";
import { BookingSummary } from "./modules/BookingSummary";
import { Invoicing } from "./modules/Invoicing";
import { DeliveryDispatch } from "./modules/Delivery";
import { AccountsReceivable } from "./modules/AccountsReceivable";
import { DeliveryHistory } from "./modules/DeliveryHistory";

const modules = [
  { label: "Order Summary",     path: "/order-summary" },
  { label: "Invoicing",         path: "/invoicing" },
  { label: "Delivery",          path: "/delivery" },
  { label: "Accounts Receivable", path: "/accounts" },
  { label: "Delivery History",  path: "/delivery-history" },
];

export function BookingDispatch() {
  return (
    <div className="flex h-full">
      <HubSidebar modules={modules} basePath="/booking-dispatch" />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/order-summary"    element={<BookingSummary />} />
          <Route path="/invoicing"        element={<Invoicing />} />
          <Route path="/delivery"         element={<DeliveryDispatch />} />
          <Route path="/accounts"         element={<AccountsReceivable />} />
          <Route path="/delivery-history" element={<DeliveryHistory />} />
          <Route path="/"                 element={<BookingSummaryDefault />} />
        </Routes>
      </div>
    </div>
  );
}

function BookingSummaryDefault() {
  return <BookingSummary />;
}