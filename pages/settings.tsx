import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Eye, 
  DollarSign, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  Smartphone,
  History,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [settings, setSettings] = useState({
    notifications: {
      likes: true,
      comments: true,
      follows: true,
      mentions: true,
      pushNotifications: true,
      emailNotifications: false,
    },
    privacy: {
      privateAccount: false,
      showOnlineStatus: true,
      allowDuets: true,
      allowStitch: true,
      allowDownloads: false,
    },
    monetization: {
      creatorFund: true,
      tipsEnabled: true,
      liveGifts: true,
    },
    general: {
      darkMode: true,
      language: "en",
      autoPlay: true,
      dataUsage: "wifi",
    }
  });

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    setLocation("/");
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully",
    });
  };

  const isMonetizationEligible = (user?.followersCount || 0) >= 1000;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--byfort-dark)]">
        <div className="text-center">
          <h1 className="text-white text-xl mb-4">Please log in to view settings</h1>
          <Button onClick={() => setLocation("/")}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[var(--byfort-dark)] text-white ${isMobile ? 'pb-20' : 'pt-16'}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--byfort-gray)]">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/profile")}>
              <ChevronRight className="h-5 w-5 rotate-180" />
            </Button>
            <h1 className="text-xl font-bold">Settings</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Account Settings */}
          <Card className="bg-[var(--byfort-gray)] border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Email</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
                <Button variant="outline" size="sm" className="border-gray-600 text-white">
                  Change
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Password</p>
                  <p className="text-sm text-gray-400">••••••••</p>
                </div>
                <Button variant="outline" size="sm" className="border-gray-600 text-white">
                  Change
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Phone Number</p>
                  <p className="text-sm text-gray-400">Not added</p>
                </div>
                <Button variant="outline" size="sm" className="border-gray-600 text-white">
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Monetization Settings */}
          {isMonetizationEligible && (
            <Card className="bg-[var(--byfort-gray)] border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Monetization
                  <Badge className="bg-green-600 text-white">Active</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Creator Fund</p>
                    <p className="text-sm text-gray-400">Earn from video views</p>
                  </div>
                  <Switch
                    checked={settings.monetization.creatorFund}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        monetization: { ...prev.monetization, creatorFund: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Tips</p>
                    <p className="text-sm text-gray-400">Allow viewers to tip you</p>
                  </div>
                  <Switch
                    checked={settings.monetization.tipsEnabled}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        monetization: { ...prev.monetization, tipsEnabled: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Live Gifts</p>
                    <p className="text-sm text-gray-400">Receive gifts during live streams</p>
                  </div>
                  <Switch
                    checked={settings.monetization.liveGifts}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        monetization: { ...prev.monetization, liveGifts: checked }
                      }))
                    }
                  />
                </div>
                
                <Separator className="bg-gray-600" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Withdrawal History</p>
                    <p className="text-sm text-gray-400">View your past withdrawals</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-600 text-white">
                    <History className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Payment Methods</p>
                    <p className="text-sm text-gray-400">Manage your payment methods</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-600 text-white">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications */}
          <Card className="bg-[var(--byfort-gray)] border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Likes</p>
                  <p className="text-sm text-gray-400">When someone likes your video</p>
                </div>
                <Switch
                  checked={settings.notifications.likes}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, likes: checked }
                    }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Comments</p>
                  <p className="text-sm text-gray-400">When someone comments on your video</p>
                </div>
                <Switch
                  checked={settings.notifications.comments}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, comments: checked }
                    }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">New Followers</p>
                  <p className="text-sm text-gray-400">When someone follows you</p>
                </div>
                <Switch
                  checked={settings.notifications.follows}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, follows: checked }
                    }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-400">Receive notifications on your device</p>
                </div>
                <Switch
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, pushNotifications: checked }
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Safety */}
          <Card className="bg-[var(--byfort-gray)] border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Safety
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Private Account</p>
                  <p className="text-sm text-gray-400">Only approved followers can see your content</p>
                </div>
                <Switch
                  checked={settings.privacy.privateAccount}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, privateAccount: checked }
                    }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Allow Duets</p>
                  <p className="text-sm text-gray-400">Let others create duets with your videos</p>
                </div>
                <Switch
                  checked={settings.privacy.allowDuets}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, allowDuets: checked }
                    }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Allow Downloads</p>
                  <p className="text-sm text-gray-400">Let others download your videos</p>
                </div>
                <Switch
                  checked={settings.privacy.allowDownloads}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, allowDownloads: checked }
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Support & Help */}
          <Card className="bg-[var(--byfort-gray)] border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Support & Help
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Help Center</p>
                  <p className="text-sm text-gray-400">Get help with your account</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Report a Problem</p>
                  <p className="text-sm text-gray-400">Report bugs or issues</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Community Guidelines</p>
                  <p className="text-sm text-gray-400">Learn about our community rules</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Save Settings Button */}
          <Button 
            onClick={handleSaveSettings} 
            className="w-full bg-[var(--byfort-pink)] hover:bg-[var(--byfort-pink)]/80"
          >
            Save Settings
          </Button>

          {/* Logout Button */}
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="w-full border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}