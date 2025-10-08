import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
  affiliate_link: string;
  category: string;
  tags: string[];
  created_at: string;
}

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      setPost(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-8" />
            <div className="aspect-video bg-muted rounded mb-8" />
            <div className="h-6 bg-muted rounded mb-4" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all posts
        </Link>

        <article className="max-w-4xl mx-auto">
          <div className="mb-8">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full aspect-video object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="bg-card rounded-lg p-8 shadow-md">
            {post.category && (
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                {post.category}
              </span>
            )}
            
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="prose prose-lg max-w-none text-muted-foreground mb-8">
              <p>{post.description}</p>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <a
              href={post.affiliate_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                <span>Shop This Product</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default PostDetail;
