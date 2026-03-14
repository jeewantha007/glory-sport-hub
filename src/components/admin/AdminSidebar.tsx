import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  Newspaper, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SidebarProps {
  onLogout: () => void;
}

const AdminSidebar = ({ onLogout }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Package, label: "Products", path: "/admin?tab=products" },
    { icon: Database, label: "Sanity CMS", path: "http://localhost:3333/structure/", external: true },
  ];

  return (
    <aside 
      className={cn(
        "flex flex-col bg-card border-r transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b">
        {!collapsed && <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Glory Admin</span>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => {
          const content = (
            <>
              <item.icon className="w-5 h-5 min-w-[20px]" />
              {!collapsed && <span>{item.label}</span>}
            </>
          );

          if (item.external) {
            return (
              <a
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-muted-foreground hover:bg-muted"
              >
                {content}
              </a>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {content}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-2 border-t">
        <Button
          variant="ghost"
          className={cn(
            "w-full flex items-center justify-start gap-3 px-3 text-destructive hover:text-destructive hover:bg-destructive/10",
            collapsed && "justify-center px-0"
          )}
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5 min-w-[20px]" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
