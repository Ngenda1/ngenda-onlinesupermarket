import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    {
      id: 5,
      title: "Fresh Mixed Fruits",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
      category: "Fruits",
    },
    {
      id: 6,
      title: "Premium Coffee Beans",
      price: 15.99,
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e",
      category: "Beverages",
    },
    {
      id: 7,
      title: "Organic Honey",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38",
      category: "Condiments",
    },
    {
      id: 8,
      title: "Fresh Vegetables Pack",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999",
      category: "Vegetables",
    }
  ];

  const filteredProducts = PRODUCTS.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoginClick = () => {
    navigate('/auth');
  };

  const handleLogoutClick = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
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
            {isAuthenticated ? (
              <Button 
                onClick={handleLogoutClick}
                className="bg-ngenda-600 hover:bg-ngenda-700 text-white"
              >
                Logout
              </Button>
            ) : (
              <Button 
                onClick={handleLoginClick}
                className="bg-ngenda-600 hover:bg-ngenda-700 text-white"
              >
                Login / Register
              </Button>
            )}
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
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
                category={product.category}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;