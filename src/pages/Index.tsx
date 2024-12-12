import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckoutForm } from "@/components/CheckoutForm";
import { PaymentMethods } from "@/components/PaymentMethods";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

const PRODUCTS = [
  {
    id: 1,
    title: "Fresh Organic Bananas",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24",
    category: "Fruits",
  },
  {
    id: 2,
    title: "Whole Grain Bread",
    price: 3.49,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
    category: "Bakery",
  },
  {
    id: 3,
    title: "Farm Fresh Eggs",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637",
    category: "Dairy",
  },
  {
    id: 4,
    title: "Organic Milk",
    price: 4.49,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150",
    category: "Dairy",
  },
];

  const filteredProducts = PRODUCTS.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (productId: number) => {
    toast({
      title: "Added to cart",
      description: "Product has been added to your cart",
      duration: 2000,
    });
  };

  const handleLoginClick = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ngenda-50 to-ngenda-100 animate-fade-in">
      <div className="container px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-ngenda-900 mb-4">
              Ngenda Logistics
            </h1>
            <p className="text-lg text-gray-600">
              We Make Shopping Simple
            </p>
          </div>
          <div className="flex gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Payment Methods</Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Payment Methods</SheetTitle>
                  <SheetDescription>
                    Manage your payment methods and add new ones.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-8">
                  <PaymentMethods />
                  <CheckoutForm />
                </div>
              </SheetContent>
            </Sheet>
            <Button 
              onClick={handleLoginClick}
              className="bg-ngenda-600 hover:bg-ngenda-700 text-white"
            >
              Login / Register
            </Button>
          </div>
        </header>

        <div className="mb-8">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
                category={product.category}
                onAddToCart={() => handleAddToCart(product.id)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;