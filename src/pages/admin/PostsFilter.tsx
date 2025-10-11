import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PostsFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  uniqueCategories: string[];
}

const PostsFilter = ({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  sortBy,
  setSortBy,
  uniqueCategories,
}: PostsFilterProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-xl mb-6 border border-border/50">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts by title, description, or tags..."
              className="pl-10 h-12"
            />
          </div>
        </div>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="h-12 px-4 rounded-md border border-input bg-background min-w-[180px]"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-12 px-4 rounded-md border border-input bg-background min-w-[180px]"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_high">Price: High to Low</option>
          <option value="price_low">Price: Low to High</option>
          <option value="featured">Featured First</option>
        </select>
      </div>
    </div>
  );
};

export default PostsFilter;