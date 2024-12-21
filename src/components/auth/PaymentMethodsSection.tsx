import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function PaymentMethodsSection() {
  const { toast } = useToast();

  const handleAddPaymentMethod = () => {
    toast({
      title: "Coming Soon",
      description: "Payment method management will be available soon!",
    });
  };

  return (
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
  );
}