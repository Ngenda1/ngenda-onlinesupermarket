import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { useToast } from "@/components/ui/use-toast";

// Mock data - replace with actual API calls later
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

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-ngenda-50 to-ngenda-100 animate-fade-in">
      <div className="container px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-ngenda-900 mb-4">
            Ngenda Logistics
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            We Make Shopping Simple
          </p>
          <SearchBar onSearch={setSearchQuery} />
        </header>

        <main>
          <div className="product-grid">
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