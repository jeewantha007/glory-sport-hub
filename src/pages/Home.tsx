import { useEffect, useState } from "react";
import { Search, TrendingUp, Star, Zap, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmailPopup from "@/components/EmailPopup";
import PostCard from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {/* Decorative wave */}
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
          {searchQuery && (
            <div className="mt-3 text-sm text-gray-400">
              Found {filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'}
            </div>
          )}
        </div>
      </section>

      {/* Stats/Trust Bar */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { label: "Products", value: posts.length + "+" },
            { label: "Categories", value: new Set(posts.map(p => p.category)).size + "+" },
            { label: "Trusted Reviews", value: "500+" },
            { label: "Happy Customers", value: "10K+" }
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-800">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Section Header */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {searchQuery ? "Search Results" : "Featured Sports Gear"}
          </h2>
          <p className="text-gray-400 text-lg">
            {searchQuery 
              ? `Showing results for "${searchQuery}"`
              : "Hand-picked equipment and gear to elevate your game"
            }
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
              {searchQuery ? "No results found" : "No products yet"}
            </h3>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              {searchQuery 
                ? "Try adjusting your search terms or browse all categories"
                : "Check back soon for exciting new products"
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-6 px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPosts.map((post, index) => (
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
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Call to Action Banner */}
      {!searchQuery && filteredPosts.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-gradient-to-r from-gray-800 to-black rounded-2xl p-8 md:p-12 text-center shadow-2xl border border-gray-700">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Don't Miss Out on Exclusive Deals
            </h2>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
              Subscribe to get the latest sports gear recommendations and special offers delivered to your inbox
            </p>
           <EmailSubscribeForm/>
          </div>
        </section>
      )}

      <Footer />
      <EmailPopup />
    </div>
  );
};

export default Home;