import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ProfileSettings } from "./ProfileSettings";
import { PaymentMethodsSection } from "./PaymentMethodsSection";
import { OrderHistory } from "./OrderHistory";
import { useToast } from "@/components/ui/use-toast";

export function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    role: "customer",
  });
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Get profile data using maybeSingle() instead of single()
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select()
            .eq("id", user.id)
            .maybeSingle();
          
          if (profileError) {
            toast({
              title: "Error",
              description: "Failed to load profile data",
              variant: "destructive",
            });
            return;
          }
          
          if (profileData) {
            setProfile(prev => ({
              ...prev,
              role: profileData.role
            }));
          }

          // Get orders data
          const { data: ordersData, error: ordersError } = await supabase
            .from("orders")
            .select()
            .eq("user_id", user.id)
            .order('created_at', { ascending: false });

          if (ordersError) {
            toast({
              title: "Error",
              description: "Failed to load orders data",
              variant: "destructive",
            });
            return;
          }

          if (ordersData) {
            setOrders(ordersData);
          }
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    };
    getUser();
  }, [toast]);

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