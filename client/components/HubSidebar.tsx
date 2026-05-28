import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface Module {
  label: string;
  path: string;
}

interface HubSidebarProps {
  modules: Module[];
  basePath: string;
}

export function HubSidebar({ modules, basePath }: HubSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col">
      <nav className="flex-1 p-6 space-y-2">
        {modules.map((module) => {
          const fullPath = `${basePath}${module.path}`;
          const isActive = currentPath === fullPath || currentPath.startsWith(fullPath + "/");

          return (
            <Link
              key={module.path}
              to={fullPath}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <span>{module.label}</span>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
