import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, ArrowLeft, CreditCard } from "lucide-react";

interface CartItem {
  id: string;
  product_id: number;
  quantity: number;
  price: number;
  title: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const { data: items, error } = await supabase
        .from("cart_items")
        .select("*");

      if (error) throw error;

      setCartItems(items || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-ngenda-50 to-ngenda-100">
      <div className="container px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Keep Shopping
          </Button>
          <h1 className="text-2xl font-bold text-ngenda-900">Your Cart</h1>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading cart...</div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Your cart is empty</p>
            <Button
              onClick={() => navigate("/")}
              className="mt-4 bg-ngenda-500 hover:bg-ngenda-600"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">Ksh {item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-4">
                <span>Total Items:</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="flex justify-between mb-6">
                <span className="font-bold">Total Amount:</span>
                <span className="font-bold">Ksh {totalAmount.toFixed(2)}</span>
              </div>
              <Button
                onClick={() => navigate("/checkout")}
                className="w-full bg-ngenda-500 hover:bg-ngenda-600"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;