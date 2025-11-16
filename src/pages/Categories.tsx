import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Grid, Package, Search, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
  affiliate_link: string;
  category: string;
  tags: string[];
  price?: number;
  is_featured?: boolean;
  stock_status?: 'in_stock' | 'limited' | 'out_of_stock';
  affiliate_platform?: string;
  video_url?: string;
  additional_images?: string[];
  slug?: string;
}

const POSTS_PER_PAGE = 12; // Number of products to load per page

const Categories = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [displayedCount, setDisplayedCount] = useState(POSTS_PER_PAGE); // Show 12 products initially
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "all";
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  // Reset displayed count when search query or category changes
  useEffect(() => {
    setDisplayedCount(POSTS_PER_PAGE);
  }, [searchQuery, selectedCategory]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique categories from posts with count
  const categoriesWithCount = Array.from(
    new Set(posts.map(p => p.category).filter(Boolean))
  ).map(category => ({
    name: category,
    count: posts.filter(p => p.category === category).length
  })).sort((a, b) => b.count - a.count); // Sort by count descending

  const handleCategorySelect = (category: string) => {
    if (category === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
    setDisplayedCount(POSTS_PER_PAGE); // Reset to initial count when category changes
    // Scroll to top when category changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSearchParams({});
    setDisplayedCount(POSTS_PER_PAGE); // Reset to initial count when filters cleared
  };

  const handleLoadMore = () => {
    setDisplayedCount(prev => prev + POSTS_PER_PAGE);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-800 to-black py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm font-medium mb-6 animate-in fade-in slide-in-from-top duration-700 border border-gray-700">
            <Grid className="w-4 h-4" />
            <span>Browse by Category</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            Categories
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            Explore our curated collection of sports products organized by category
          </p>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
              />
            </div>
            {(searchQuery || selectedCategory !== "all") && (
              <Button
                onClick={clearFilters}
                variant="outline"
                className="bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">All Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* All Categories Button */}
            <button
              onClick={() => handleCategorySelect("all")}
              className={`group relative overflow-hidden rounded-xl p-6 text-center transition-all duration-300 border-2 ${
                selectedCategory === "all"
                  ? "bg-white text-black border-white shadow-lg scale-105"
                  : "bg-gray-900 text-gray-300 border-gray-800 hover:border-gray-700 hover:bg-gray-800"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Package className={`w-8 h-8 ${selectedCategory === "all" ? "text-black" : "text-gray-400 group-hover:text-white"}`} />
                <span className="font-semibold text-sm">All</span>
                <span className={`text-xs ${selectedCategory === "all" ? "text-gray-700" : "text-gray-500"}`}>
                  {posts.length} items
                </span>
              </div>
            </button>

            {/* Category Buttons */}
            {categoriesWithCount.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategorySelect(category.name)}
                className={`group relative overflow-hidden rounded-xl p-6 text-center transition-all duration-300 border-2 ${
                  selectedCategory === category.name
                    ? "bg-white text-black border-white shadow-lg scale-105"
                    : "bg-gray-900 text-gray-300 border-gray-800 hover:border-gray-700 hover:bg-gray-800"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Package className={`w-8 h-8 ${selectedCategory === category.name ? "text-black" : "text-gray-400 group-hover:text-white"}`} />
                  <span className="font-semibold text-sm line-clamp-2">{category.name}</span>
                  <span className={`text-xs ${selectedCategory === category.name ? "text-gray-700" : "text-gray-500"}`}>
                    {category.count} {category.count === 1 ? "item" : "items"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {selectedCategory === "all" ? "All Products" : `${selectedCategory} Products`}
            </h2>
            <span className="text-gray-400 text-sm">
              Showing {Math.min(displayedCount, filteredPosts.length)} of {filteredPosts.length} {filteredPosts.length === 1 ? "result" : "results"}
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-900 rounded-xl p-4 animate-pulse shadow-lg border border-gray-800">
                  <div className="aspect-square bg-gray-800 rounded-lg mb-4" />
                  <div className="h-5 bg-gray-800 rounded-lg mb-3" />
                  <div className="h-4 bg-gray-800 rounded-lg w-2/3 mb-2" />
                  <div className="h-4 bg-gray-800 rounded-lg w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No products available in this category"}
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.slice(0, displayedCount).map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    description={post.description}
                    imageUrl={post.image_url}
                    affiliateLink={post.affiliate_link}
                    price={post.price}
                    category={post.category}
                    tags={post.tags}
                    stock_status={post.stock_status}
                    affiliate_platform={post.affiliate_platform}
                    is_featured={post.is_featured}
                    video_url={post.video_url}
                    additional_images={post.additional_images}
                    slug={post.slug}
                  />
                ))}
              </div>
              
              {/* Load More Button */}
              {filteredPosts.length > displayedCount && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handleLoadMore}
                    className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    Load More Products
                    <span className="ml-2 text-sm text-gray-300">
                      ({filteredPosts.length - displayedCount} more available)
                    </span>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;

