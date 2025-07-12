import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Home, Compass, Plus, Mail, User, Settings, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/discover", icon: Compass, label: "Discover" },
    { path: "/upload", icon: Plus, label: "Upload", special: true },
    { path: "/inbox", icon: Mail, label: "Inbox" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--byfort-dark)]/90 backdrop-blur-md border-t border-[var(--byfort-gray)] z-50">
        <div className="flex items-center justify-around py-3 max-w-sm mx-auto">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <Button
                key={item.path}
                onClick={() => setLocation(item.path)}
                variant="ghost"
                className={cn(
                  "flex flex-col items-center gap-1 p-2 h-auto",
                  item.special && "bg-[var(--byfort-pink)] hover:bg-[var(--byfort-pink)]/80 rounded-lg"
                )}
              >
                <Icon 
                  className={cn(
                    "w-6 h-6",
                    isActive && !item.special ? "text-[var(--byfort-pink)]" : "text-gray-400",
                    item.special && "text-white"
                  )} 
                />
                <span 
                  className={cn(
                    "text-xs",
                    isActive && !item.special ? "text-[var(--byfort-pink)]" : "text-gray-400",
                    item.special && "text-white"
                  )}
                >
                  {item.label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop header
  return (
    <div className="fixed top-0 left-0 right-0 bg-[var(--byfort-dark)]/90 backdrop-blur-md border-b border-[var(--byfort-gray)] z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Moon className="w-8 h-8 text-[var(--byfort-cyan)]" />
            <span className="text-2xl font-bold text-white">BYFORT</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.slice(0, -1).map((item) => {
              const isActive = location === item.path;
              const Icon = item.icon;
              
              return (
                <Button
                  key={item.path}
                  onClick={() => setLocation(item.path)}
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2",
                    isActive ? "text-[var(--byfort-pink)]" : "text-gray-400 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation("/upload")}
              className="bg-[var(--byfort-pink)] hover:bg-[var(--byfort-pink)]/80 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload
            </Button>
            
            {user && (
              <>
                {user.isAdmin && (
                  <Button
                    onClick={() => setLocation("/admin")}
                    variant="outline"
                    className="border-[var(--byfort-gray)] text-white hover:bg-[var(--byfort-gray)]"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                )}
                
                <Button
                  onClick={() => setLocation("/profile")}
                  variant="ghost"
                  className="p-0 h-auto"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
