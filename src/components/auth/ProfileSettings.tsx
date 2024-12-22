import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, UserCog } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProfileSettingsProps {
  user: any;
  profile: {
    role: string;
  };
  onSignOut: () => void;
}

export function ProfileSettings({ user, profile, onSignOut }: ProfileSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState(profile.role);
  const { toast } = useToast();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          role: currentRole,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Profile updated successfully. Your role is now: ${currentRole}`,
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="h-5 w-5" />
          Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-2">
            <label>Email</label>
            <Input
              value={user.email}
              disabled
              className="bg-gray-100"
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium">Role</label>
            <Select value={currentRole} onValueChange={setCurrentRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              Select "Manager" to gain access to product management features.
            </p>
          </div>
          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Profile
            </Button>
            <Button type="button" variant="destructive" onClick={onSignOut}>
              Sign Out
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}