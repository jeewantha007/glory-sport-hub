import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { newsService } from "@/services";
import NewsPostCard from "@/components/NewsPostCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Newspaper, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NewsPost {
  id: string;
  title: string;
  meta_description?: string;
  created_at?: string;
  image_url?: string;
}

const NewsList = () => {
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchNewsPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await newsService.fetchAllNews();
        
        if (error) throw error;
        setNewsPosts(data || []);
        setFilteredPosts(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load news posts");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsPosts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(newsPosts);
    } else {
      const filtered = newsPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.meta_description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, newsPosts]);

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
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Latest News
                </h1>
              </div>
            </div>
            <p className="text-gray-400 text-lg mt-3">
              Stay updated with the latest sports news and updates
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search news articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="rounded-xl overflow-hidden animate-pulse"
                style={{ backgroundColor: '#0a0c12' }}
              >
                <div className="h-48 bg-gray-800"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-gray-800 rounded w-full"></div>
                    <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-800 rounded w-4/6"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-800 rounded w-24"></div>
                    <div className="h-9 bg-gray-800 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-400">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
              <Button asChild variant="outline">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <NewsPostCard post={post} />
                </div>
              ))}
            </div>
          </>
        ) : searchQuery ? (
          <div className="text-center py-16 bg-gray-900/30 rounded-xl">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">No Results Found</h3>
            <p className="text-gray-400 mb-6">
              No articles match your search for "{searchQuery}"
            </p>
            <Button
              onClick={() => setSearchQuery("")}
              variant="outline"
              className="text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-white"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-900/30 rounded-xl">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Newspaper className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">No News Posts Yet</h3>
            <p className="text-gray-400">
              Check back later for the latest sports news and updates.
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

export default NewsList;