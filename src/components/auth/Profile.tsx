import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CreditCard, ShoppingBag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [orders, setOrders] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        // Get profile data
        const { data: profileData } = await supabase
          .from("profiles")
          .select()
          .eq("id", user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }

        // Get orders data
        const { data: ordersData } = await supabase
          .from("orders")
          .select()
          .eq("user_id", user.id)
          .order('created_at', { ascending: false });

        if (ordersData) {
          setOrders(ordersData);
        }
      }
    };
    getUser();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user?.id,
          ...profile,
          updated_at: new Date(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = () => {
    // This would typically integrate with a payment provider like Stripe
    toast({
      title: "Coming Soon",
      description: "Payment method management will be available soon!",
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center">Please log in to view your profile.</p>
            <Button className="w-full mt-4" onClick={() => navigate("/auth")}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <label>Name</label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <label>Address</label>
              <Input
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                placeholder="Your address"
              />
            </div>
            <div className="space-y-2">
              <label>Phone</label>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Your phone number"
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Profile
              </Button>
              <Button type="button" variant="destructive" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAddPaymentMethod}>
            Add Payment Method
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border p-4 rounded-lg">
                  <p>Order #{order.id}</p>
                  <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                  <p>Total: ${order.total}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No orders yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}