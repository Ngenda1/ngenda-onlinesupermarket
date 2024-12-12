import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface PaymentMethod {
  id: string;
  type: string;
  last_four: string;
  created_at: string;
}

export function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Saved Payment Methods</h2>
      {paymentMethods.length === 0 ? (
        <p className="text-muted-foreground">No payment methods saved yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {paymentMethods.map((method) => (
            <Card key={method.id}>
              <CardHeader className="flex flex-row items-center space-x-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">
                  {method.type.charAt(0).toUpperCase() + method.type.slice(1)} Card
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  **** **** **** {method.last_four}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}