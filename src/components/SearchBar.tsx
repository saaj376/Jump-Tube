import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ onSearch, isLoading = false, placeholder = "Search YouTube videos...", className }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`pl-12 pr-4 backdrop-glass border-border/50 focus:border-primary/50 focus:shadow-glow transition-smooth ${
              className?.includes('text-lg') ? 'search-hero' : 'h-14 text-lg'
            }`}
            disabled={isLoading}
          />
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground ${
            className?.includes('text-lg') ? 'h-6 w-6' : 'h-5 w-5'
          }`} />
        </div>
        <Button 
          type="submit" 
          variant="hero" 
          size={className?.includes('text-lg') ? "lg" : "xl"}
          disabled={!query.trim() || isLoading}
          className={className?.includes('text-lg') ? "px-8 h-16 text-lg" : "px-8"}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Searching...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </div>
    </form>
  );
}