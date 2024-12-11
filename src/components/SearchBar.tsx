import { Search } from "lucide-react";
import { Input } from "./ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="search"
        placeholder="Search products..."
        className="w-full pl-12 pr-4 h-12 rounded-full border-2 border-gray-200 focus:border-ngenda-500 transition-colors"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}