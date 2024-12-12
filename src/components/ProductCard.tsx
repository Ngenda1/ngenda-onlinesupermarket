import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ProductCardProps {
  title: string;
  price: number;
  image: string;
  category: string;
  id: number;
}

export function ProductCard({ title, price, image, category, id }: ProductCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Please login",
          description: "You need to be logged in to add items to cart",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from("cart_items")
        .insert([
          {
            user_id: user.id,
            product_id: id,
            price,
            title,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Added to cart",
        description: "Product has been added to your cart",
        duration: 2000,
      });
      
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="glass-card overflow-hidden group transition-all duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <Badge className="absolute top-4 left-4 bg-ngenda-500 text-white">
            {category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-medium line-clamp-2">{title}</CardTitle>
        <p className="text-2xl font-bold text-ngenda-900 mt-2">
          Ksh {price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-ngenda-500 hover:bg-ngenda-600 text-white transition-colors"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}