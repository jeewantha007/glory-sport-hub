import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { newsService } from "@/services";
import NewsPostCard from "@/components/NewsPostCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface NewsPost {
  id: string;
  title: string;
  meta_description?: string;
  created_at?: string;
}

const NewsList = () => {
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await newsService.fetchAllNews();
        
        if (error) throw error;
        setNewsPosts(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load news posts");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsPosts();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild>
            <Link to="/" className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Latest News</h1>
          <p className="text-muted-foreground mt-2">
            Stay updated with the latest sports news and updates
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : newsPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsPosts.map((post) => (
            <NewsPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl">
          <h3 className="text-xl font-semibold mb-2">No News Posts Yet</h3>
          <p className="text-muted-foreground">
            Check back later for the latest sports news and updates.
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsList;