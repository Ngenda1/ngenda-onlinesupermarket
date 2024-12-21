import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { ProfileSettings } from "./ProfileSettings";
import { PaymentMethodsSection } from "./PaymentMethodsSection";
import { OrderHistory } from "./OrderHistory";

export function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    role: "customer",
  });
  const [orders, setOrders] = useState<any[]>([]);
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
          setProfile(prev => ({
            ...prev,
            role: profileData.role
          }));
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
      <ProfileSettings 
        user={user} 
        profile={profile} 
        onSignOut={handleSignOut}
      />
      <PaymentMethodsSection />
      <OrderHistory orders={orders} />
    </div>
  );
}