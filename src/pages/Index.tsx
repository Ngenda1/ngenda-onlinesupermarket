import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

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

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const filteredProducts = products.filter((product) =>
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ngenda-50 to-ngenda-100 flex items-center justify-center">
        <div className="text-2xl text-ngenda-600">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ngenda-50 to-ngenda-100 flex items-center justify-center">
        <div className="text-2xl text-red-600">Error loading products. Please try again later.</div>
      </div>
    );
  }

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