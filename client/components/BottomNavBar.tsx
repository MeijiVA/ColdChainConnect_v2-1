import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Settings,
  Users,
  FileText,
  Clock,
} from "lucide-react";

interface BottomNavBarProps {
  onLogout: () => void;
}

export function BottomNavBar({ onLogout }: BottomNavBarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/information-management/inventory", label: "Inventory", icon: Package },
    { path: "/information-management/customers", label: "Customers", icon: Users },
    { path: "/booking-dispatch/order-summary", label: "Orders", icon: FileText },
    { path: "/information-management/pricing", label: "Settings", icon: Settings },
    { path: "/audit", label: "Audit", icon: Clock },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-navy border-t border-white/10 z-30 md:hidden">
      {/* Scrollable Navigation Items - Swipeable on mobile */}
      <div className="flex overflow-x-auto overflow-y-hidden scrollbar-visible gap-1 scroll-smooth touch-pan-x px-1" style={{ WebkitOverflowScrolling: 'touch' }}>
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPath === item.path || currentPath.startsWith(item.path + "/");
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-shrink-0 flex flex-col items-center justify-center px-3 py-2 font-barlow text-[10px] font-semibold transition-all min-w-max ${
                isActive
                  ? "text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <IconComponent size={18} />
              <span className="mt-0.5">{item.label}</span>
            </Link>
          );
        })}
        {/* Right padding to allow full scrolling */}
        <div className="flex-shrink-0 w-2" />
      </div>
    </div>
  );
}
