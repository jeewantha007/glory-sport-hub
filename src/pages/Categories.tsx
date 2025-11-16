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
import heroBanner from "@/assets/hero-banner.jpg";
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

  // Get unique categories from posts with count and image
  const categoriesWithCount = Array.from(
    new Set(posts.map(p => p.category).filter(Boolean))
  ).map(category => {
    const categoryPosts = posts.filter(p => p.category === category);
    // Get the first product's image from this category (prefer featured products)
    const featuredPost = categoryPosts.find(p => p.is_featured);
    const firstPost = featuredPost || categoryPosts[0];
    return {
      name: category,
      count: categoryPosts.length,
      imageUrl: firstPost?.image_url || null
    };
  }).sort((a, b) => b.count - a.count); // Sort by count descending

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
      
      {/* Hero Section with Categories */}
      <section className="relative min-h-[600px] sm:min-h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBanner}
            alt="Categories"
            className="w-full h-full object-cover scale-105 animate-in fade-in duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-gray-900/80 to-black/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
        </div>
        
        {/* Hero Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Title Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-white/90 text-xs sm:text-sm font-medium mb-4 sm:mb-6 animate-in slide-in-from-top duration-700 border border-gray-700">
              <Grid className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Browse by Category</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 animate-in slide-in-from-bottom duration-700 delay-100">
              Categories
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto animate-in slide-in-from-bottom duration-700 delay-200">
              Explore our curated collection of sports products organized by category
            </p>
          </div>

          {/* Categories Grid on Hero */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">All Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 max-w-6xl mx-auto">
              {/* All Categories Button */}
              <button
                onClick={() => handleCategorySelect("all")}
                className={`group relative overflow-hidden rounded-xl text-center transition-all duration-300 border-2 ${
                  selectedCategory === "all"
                    ? "bg-white text-black border-white shadow-lg scale-105"
                    : "bg-gray-900/90 backdrop-blur-sm text-gray-300 border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/90"
                }`}
              >
                {/* All Categories - Show grid of category images */}
                {(() => {
                  // Get up to 6 category images
                  const categoryImages = categoriesWithCount
                    .slice(0, 6)
                    .map(cat => cat.imageUrl)
                    .filter(Boolean);
                  
                  return categoryImages.length > 0 ? (
                    <div className="relative w-full aspect-square overflow-hidden">
                      {/* Grid of category images */}
                      <div className="grid grid-cols-3 gap-0.5 h-full">
                        {categoryImages.map((imageUrl, index) => (
                          <div key={index} className="relative overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={`Category ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ))}
                        {/* Fill remaining slots if less than 6 */}
                        {Array.from({ length: 6 - categoryImages.length }).map((_, index) => (
                          <div key={`empty-${index}`} className="bg-gray-800" />
                        ))}
                      </div>
                      {/* Overlay with text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                      <div className="absolute inset-0 flex flex-col items-center justify-end p-2 sm:p-3 md:p-4">
                        <span className={`font-semibold text-xs sm:text-sm line-clamp-2 mb-1 ${selectedCategory === "all" ? "text-black bg-white/90 px-2 py-0.5 rounded" : "text-white"}`}>
                          All
                        </span>
                        <span className={`text-xs ${selectedCategory === "all" ? "text-gray-800 bg-white/90 px-2 py-0.5 rounded" : "text-gray-300"}`}>
                          {posts.length} items
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 p-4 sm:p-6">
                      <Package className={`w-6 h-6 sm:w-8 sm:h-8 ${selectedCategory === "all" ? "text-black" : "text-gray-400 group-hover:text-white"}`} />
                      <span className="font-semibold text-xs sm:text-sm">All</span>
                      <span className={`text-xs ${selectedCategory === "all" ? "text-gray-700" : "text-gray-500"}`}>
                        {posts.length} items
                      </span>
                    </div>
                  );
                })()}
              </button>

              {/* Category Buttons */}
              {categoriesWithCount.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategorySelect(category.name)}
                  className={`group relative overflow-hidden rounded-xl text-center transition-all duration-300 border-2 ${
                    selectedCategory === category.name
                      ? "bg-white text-black border-white shadow-lg scale-105"
                      : "bg-gray-900/90 backdrop-blur-sm text-gray-300 border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/90"
                  }`}
                >
                  {/* Category Image */}
                  {category.imageUrl ? (
                    <div className="relative w-full aspect-square overflow-hidden">
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute inset-0 flex flex-col items-center justify-end p-2 sm:p-3 md:p-4">
                        <span className={`font-semibold text-xs sm:text-sm line-clamp-2 mb-1 ${selectedCategory === category.name ? "text-black bg-white/90 px-2 py-0.5 rounded" : "text-white"}`}>
                          {category.name}
                        </span>
                        <span className={`text-xs ${selectedCategory === category.name ? "text-gray-800 bg-white/90 px-2 py-0.5 rounded" : "text-gray-300"}`}>
                          {category.count} {category.count === 1 ? "item" : "items"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 p-4 sm:p-6">
                      <Package className={`w-6 h-6 sm:w-8 sm:h-8 ${selectedCategory === category.name ? "text-black" : "text-gray-400 group-hover:text-white"}`} />
                      <span className="font-semibold text-xs sm:text-sm line-clamp-2">{category.name}</span>
                      <span className={`text-xs ${selectedCategory === category.name ? "text-gray-700" : "text-gray-500"}`}>
                        {category.count} {category.count === 1 ? "item" : "items"}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 text-black" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
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

