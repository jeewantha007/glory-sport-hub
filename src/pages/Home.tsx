import { useEffect, useState } from "react";
import { Search, TrendingUp, Star, Zap, Award, Filter, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmailPopup from "@/components/EmailPopup";
import PostCard from "@/components/PostCard";
import NewsPostCard from "@/components/NewsPostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { newsService } from "@/services";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";
import EmailSubscribeForm from "@/components/EmailSubscribeForm";

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

interface NewsPost {
  id: string;
  title: string;
  meta_description?: string;
  created_at?: string;
}

const POSTS_PER_PAGE = 12; // Number of products to load per page

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [displayedCount, setDisplayedCount] = useState(POSTS_PER_PAGE); // Show 12 products initially
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
    fetchNewsPosts();
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

  const fetchNewsPosts = async () => {
    try {
      const { data, error } = await newsService.fetchAllNews();
      
      if (error) throw error;
      setNewsPosts(data?.slice(0, 3) || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load news. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get unique categories from posts
  const categories = ["all", ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowMobileFilters(false);
    setDisplayedCount(POSTS_PER_PAGE); // Reset to initial count when category changes
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setDisplayedCount(POSTS_PER_PAGE); // Reset to initial count when filters cleared
  };

  const handleLoadMore = () => {
    setDisplayedCount(prev => prev + POSTS_PER_PAGE);
  };

  const activeFiltersCount = (selectedCategory !== "all" ? 1 : 0) + (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900">
      <Navbar />
      
      {/* Enhanced Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBanner}
            alt="Glory of Sport"
            className="w-full h-full object-cover scale-105 animate-in fade-in duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-gray-900/80 to-black/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <div className="mb-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm font-medium animate-in slide-in-from-top duration-700 border border-gray-700">
            <TrendingUp className="w-4 h-4" />
            <span>Top Rated Sports Gear & Equipment</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-in slide-in-from-bottom duration-700 delay-100">
            Glory of Sport
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-8 animate-in slide-in-from-bottom duration-700 delay-200">
            Discover premium sports gear, exclusive deals, and expert-reviewed equipment
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 animate-in slide-in-from-bottom duration-700 delay-300">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">Curated Selection</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">Best Deals</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">Expert Reviews</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 text-black" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Enhanced Search Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-3xl mx-auto border border-gray-800 backdrop-blur-sm">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-gray-300 transition-colors" />
            <Input
              type="text"
              placeholder="Search for sports gear, categories, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-base rounded-xl border-2 focus:border-gray-700 transition-all bg-gray-800 text-white placeholder-gray-500"
            />
          </div>
          {(searchQuery || selectedCategory !== "all") && (
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-400">
                Found {filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'}
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Stats/Trust Bar */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { label: "Products", value: posts.length + "+" },
            { label: "Categories", value: categories.length - 1 + "+" },
            { label: "Trusted Reviews", value: "100+" },
            { label: "Happy Customers", value: "1K+" }
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-800">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Products Section - 3/4 width */}
          <div className="xl:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                  {searchQuery || selectedCategory !== "all" ? "Filtered Results" : "Featured Sports Gear"}
                </h2>
                <p className="text-gray-400">
                  {searchQuery 
                    ? `Showing results for "${searchQuery}"`
                    : selectedCategory !== "all"
                    ? `Category: ${selectedCategory}`
                    : "Hand-picked equipment and gear to elevate your game"
                  }
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Mobile Filter Toggle */}
                <Button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  variant="outline"
                  className="md:hidden relative"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
                {!searchQuery && selectedCategory === "all" && (
                  <Button asChild variant="outline" className="hidden md:flex">
                    <Link to="/products">View All</Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Category Filter - Desktop */}
            <div className="hidden md:flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-white text-black shadow-lg"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                  }`}
                >
                  {category === "all" ? "All Categories" : category}
                </button>
              ))}
            </div>

            {/* Category Filter - Mobile Dropdown */}
            {showMobileFilters && (
              <div className="md:hidden mb-6 bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">Filter by Category</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                        selectedCategory === category
                          ? "bg-white text-black"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {category === "all" ? "All Categories" : category}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
              <div className="text-center py-20 bg-gray-900 rounded-2xl shadow-lg border border-gray-800">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800">
                  <Search className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-white">
                  {searchQuery || selectedCategory !== "all" ? "No results found" : "No products yet"}
                </h3>
                <p className="text-gray-400 text-lg max-w-md mx-auto mb-4">
                  {searchQuery || selectedCategory !== "all"
                    ? "Try adjusting your filters or browse all categories"
                    : "Check back soon for exciting new products"
                  }
                </p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mt-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.slice(0, displayedCount).map((post, index) => (
                    <div
                      key={post.id}
                      className="animate-in fade-in slide-in-from-bottom duration-500"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <PostCard
                        id={post.id}
                        title={post.title}
                        description={post.description}
                        imageUrl={post.image_url || ""}
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
                    </div>
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

          {/* News Sidebar - 1/4 width */}
          {!searchQuery && selectedCategory === "all" && (
            <div className="xl:col-span-1">
              <div className="sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Latest News</h3>
                  <Link to="/news" className="text-sm text-gray-400 hover:text-white transition-colors">
                    View All
                  </Link>
                </div>
                
                {newsPosts.length > 0 ? (
                  <div className="space-y-6">
                    {newsPosts.map((post) => (
                      <NewsPostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-gray-400">No news posts available yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action Banner */}
      {!searchQuery && selectedCategory === "all" && filteredPosts.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-gradient-to-r from-gray-800 to-black rounded-2xl p-8 md:p-12 text-center shadow-2xl border border-gray-700">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Don't Miss Out on Exclusive Deals
            </h2>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
              Subscribe to get the latest sports gear recommendations and special offers delivered to your inbox
            </p>
            <EmailSubscribeForm />
          </div>
        </section>
      )}

      <Footer />
      <EmailPopup />
    </div>
  );
};

export default Home;