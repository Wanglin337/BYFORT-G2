import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import AdminDashboard from "@/components/admin-dashboard";

export default function Admin() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "BYFORT 🌙 - Admin Dashboard";
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
      return;
    }
    
    if (!user?.isAdmin) {
      setLocation("/");
      return;
    }
  }, [isAuthenticated, user, setLocation]);

  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }

  return <AdminDashboard />;
}
