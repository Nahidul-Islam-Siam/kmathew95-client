// components/SearchBar.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface SearchBarProps {
  categories: Array<{
    id: string;
    name: string;
  }>;

  onSearch: (query: string, category: string) => void;
}

export function SearchBar({ categories, onSearch }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize from URL params
  const [query, setQuery] = useState<string>(searchParams.get("search") || "");
  const [category, setCategory] = useState<string>(searchParams.get("category") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams);

    // Update search and category
    if (query) params.set("search", query);
    else params.delete("search");

    if (category) params.set("category", category);
    else params.delete("category");

    // Reset to page 1 when searching
    params.delete("page");

    // Update URL
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col sm:flex-row gap-4 items-center bg-white p-2 border border-gray-200 rounded-lg shadow-sm">
      <div className="flex-1">
        <Input
          placeholder="What are you looking for?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 bg-white border-0 text-gray-900 placeholder:text-gray-500"
        />
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px bg-gray-200" />

      <div className="w-full sm:w-48">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-12 bg-white text-gray-500">
            <SelectValue placeholder="Choose Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="" disabled>
                No categories available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white text-md"
      >
        Search
      </Button>
    </form>
  );
}