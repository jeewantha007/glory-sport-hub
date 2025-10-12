import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postService } from "@/services";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShoppingCart, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

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

const ProductList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await postService.fetchPosts();
        
        if (error) throw error;
        setPosts(data || []);
        setFilteredPosts(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let result = posts;
    
    // Apply search filter
    if (searchQuery.trim() !== "") {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply featured filter
    if (showFeaturedOnly) {
      result = result.filter(post => post.is_featured);
    }
    
    setFilteredPosts(result);
  }, [searchQuery, showFeaturedOnly, posts]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#05070b' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12 max-w-md mx-auto">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-red-500">⚠</span>
            </div>
            <h2 className="text-3xl font-bold text-red-400 mb-4">Error</h2>
            <p className="text-gray-400 mb-8 text-lg">{error}</p>
            <Button 
              asChild 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Link to="/" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#05070b' }}>
      {/* Hero Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)'
        }}></div>
        
        <div className="container mx-auto px-4 py-12 relative">
          <Button 
            asChild 
            variant="ghost" 
            className="mb-6 text-gray-400 hover:text-white hover:bg-gray-800/50"
          >
            <Link to="/" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Sports Gear
                </h1>
              </div>
            </div>
            <p className="text-gray-400 text-lg mt-3">
              Discover premium sports equipment and gear
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search sports gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
              />
            </div>
          </div>
          
          {/* Filter Options */}
          <div className="mt-6 flex flex-wrap gap-4">
            <Button
              variant={showFeaturedOnly ? "default" : "outline"}
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className={showFeaturedOnly ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFeaturedOnly ? "Showing Featured" : "Show Featured Only"}
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div 
                key={i} 
                className="rounded-xl overflow-hidden animate-pulse"
                style={{ backgroundColor: '#0a0c12' }}
              >
                <div className="aspect-square bg-gray-800"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-800 rounded w-3/4 mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-800 rounded w-full"></div>
                    <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-800 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-800 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-400">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'product' : 'products'} found
                {searchQuery && ` for "${searchQuery}"`}
                {showFeaturedOnly && " (featured only)"}
              </p>
              <Button asChild variant="outline">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
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
          </>
        ) : searchQuery || showFeaturedOnly ? (
          <div className="text-center py-16 bg-gray-900/30 rounded-xl">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">No Results Found</h3>
            <p className="text-gray-400 mb-6">
              No products match your search criteria
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => setSearchQuery("")}
                variant="outline"
                className="text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-white"
              >
                Clear Search
              </Button>
              {showFeaturedOnly && (
                <Button
                  onClick={() => setShowFeaturedOnly(false)}
                  variant="outline"
                  className="text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-white"
                >
                  Show All Products
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-900/30 rounded-xl">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">No Products Available</h3>
            <p className="text-gray-400">
              Check back later for new sports gear and equipment.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProductList;