import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

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
    <aside className="hidden md:flex w-56 bg-navy flex-col py-6 px-3 gap-2 flex-shrink-0 h-full overflow-y-auto scrollbar-visible">
      <nav className="flex flex-col gap-2">
        {modules.map((module) => {
          const fullPath = `${basePath}${module.path}`;
          const isActive = currentPath === fullPath || currentPath.startsWith(fullPath + "/");
          return (
            <Link
              key={module.path}
              to={fullPath}
              className={cn(
                "flex items-center px-4 py-3 rounded-full text-sm font-semibold transition-all",
                isActive
                  ? "bg-accent-2 text-white shadow-lg"
                  : "text-white/70 bg-white/5 hover:bg-white/15 hover:text-white"
              )}
            >
              {module.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
