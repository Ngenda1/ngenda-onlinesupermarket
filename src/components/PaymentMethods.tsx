import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Banknote, Phone } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CheckoutForm } from "./CheckoutForm";
import { useToast } from "@/components/ui/use-toast";

interface PaymentMethod {
  id: string;
  type: string;
  last_four: string;
  created_at: string;
}

export function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("payment_methods")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setPaymentMethods(data);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleMpesaPayment = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to use M-Pesa",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "M-Pesa",
      description: "M-Pesa payment integration coming soon!",
    });
  };

  const handleCashOnDelivery = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to use Cash on Delivery",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("payment_methods").insert({
        user_id: user.id,
        type: "cash_on_delivery",
        last_four: "COD",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Cash on Delivery option added",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add Cash on Delivery option",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Payment Methods</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="w-full flex items-center gap-2" variant="outline">
              <CreditCard className="h-4 w-4" />
              Credit Card
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add Credit Card</SheetTitle>
              <SheetDescription>
                Add a new credit card to your account
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <CheckoutForm />
            </div>
          </SheetContent>
        </Sheet>

        <Button 
          onClick={handleMpesaPayment} 
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <Phone className="h-4 w-4" />
          M-Pesa
        </Button>

        <Button 
          onClick={handleCashOnDelivery} 
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <Banknote className="h-4 w-4" />
          Cash on Delivery
        </Button>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Saved Payment Methods</h3>
        {paymentMethods.length === 0 ? (
          <p className="text-muted-foreground">No payment methods saved yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    {method.type === "credit" && <CreditCard className="h-4 w-4 text-primary" />}
                    {method.type === "cash_on_delivery" && <Banknote className="h-4 w-4 text-primary" />}
                    {method.type === "mpesa" && <Phone className="h-4 w-4 text-primary" />}
                  </div>
                  <CardTitle className="text-lg">
                    {method.type === "credit" && "Credit Card"}
                    {method.type === "cash_on_delivery" && "Cash on Delivery"}
                    {method.type === "mpesa" && "M-Pesa"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {method.last_four && (
                    <p className="text-sm text-muted-foreground">
                      {method.type === "credit" ? `**** **** **** ${method.last_four}` : method.last_four}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}