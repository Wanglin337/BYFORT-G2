import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Moon, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function AuthModal() {
  const { login, register } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    displayName: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await register({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          displayName: formData.displayName,
        });
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      username: "",
      displayName: "",
      confirmPassword: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-[var(--byfort-dark)] border-[var(--byfort-gray)] text-white">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Moon className="w-8 h-8 text-[var(--byfort-cyan)]" />
            <DialogTitle className="text-2xl font-bold">BYFORT</DialogTitle>
          </div>
          <p className="text-gray-400">
            {isLogin ? "Welcome back!" : "Join the community"}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    placeholder="Enter username"
                    className="pl-10 bg-[var(--byfort-gray)] border-[var(--byfort-light-gray)] text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-white">Display Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange("displayName", e.target.value)}
                    placeholder="Enter display name"
                    className="pl-10 bg-[var(--byfort-gray)] border-[var(--byfort-light-gray)] text-white"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email"
                className="pl-10 bg-[var(--byfort-gray)] border-[var(--byfort-light-gray)] text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter password"
                className="pl-10 pr-10 bg-[var(--byfort-gray)] border-[var(--byfort-light-gray)] text-white"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 h-6 w-6 p-0 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Confirm password"
                  className="pl-10 bg-[var(--byfort-gray)] border-[var(--byfort-light-gray)] text-white"
                  required
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--byfort-pink)] hover:bg-[var(--byfort-pink)]/80 text-white"
          >
            {isLoading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
          </Button>

          <div className="text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={switchMode}
                className="text-[var(--byfort-cyan)] hover:text-[var(--byfort-cyan)]/80"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          <Separator className="bg-[var(--byfort-gray)]" />

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white text-black hover:bg-gray-100 border-[var(--byfort-gray)]"
            >
              Continue with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full bg-blue-600 text-white hover:bg-blue-700 border-[var(--byfort-gray)]"
            >
              Continue with Facebook
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
