import { ReactNode, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import { authService } from "@/services";
import { useNavigate } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent body from scrolling
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLogout = async () => {
    await authService.signOut();
    navigate("/");
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      <AdminSidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
