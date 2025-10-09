import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Star, Shield, TrendingUp, CheckCircle, Tag, Calendar } from "lucide-react";
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

  const features = [
    { icon: Shield, text: "Verified Quality" },
    { icon: Star, text: "Expert Reviewed" },
    { icon: TrendingUp, text: "Best Value" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto animate-pulse">
            <div className="h-10 bg-gray-800 rounded w-40 mb-8" />
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-800 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-800 rounded w-3/4" />
                <div className="h-6 bg-gray-800 rounded w-1/2" />
                <div className="h-32 bg-gray-800 rounded" />
                <div className="h-14 bg-gray-800 rounded" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 mb-6">
              <ArrowLeft className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">Post Not Found</h2>
            <p className="text-gray-400 mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/">
              <Button size="lg" className="bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to all products</span>
          </Link>
        </div>

        <article className="max-w-6xl mx-auto">
          {/* Product Layout */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative group overflow-hidden rounded-2xl shadow-2xl bg-gray-800">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {post.category && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-4 py-2 bg-white/95 backdrop-blur-sm text-black rounded-full text-sm font-bold shadow-lg">
                      {post.category}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 rounded-xl p-3 text-center border border-gray-800 shadow-sm"
                  >
                    <feature.icon className="w-5 h-5 mx-auto mb-1 text-white" />
                    <span className="text-xs font-medium text-gray-300">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-white">
                  {post.title}
                </h1>
                
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-400">
                  {post.created_at && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.created_at).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-lg mb-6">
                  <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Product Details
                  </h2>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    {post.description}
                  </p>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-400">Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 text-white">Exclusive Offer</h3>
                    <p className="text-sm text-gray-400">Get this premium product with our special affiliate pricing</p>
                  </div>
                </div>
                
                <a
                  href={post.affiliate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button 
                    size="lg" 
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  >
                    <span>Shop This Product Now</span>
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </Button>
                </a>
                
                <p className="text-xs text-center text-gray-500">
                  Secure checkout • Free shipping available • Money-back guarantee
                </p>
              </div>
            </div>
          </div>

          {/* Why Buy Section */}
          <div className="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Why Choose This Product?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-500/10 rounded-full mb-4">
                  <CheckCircle className="w-7 h-7 text-green-500" />
                </div>
                <h3 className="font-bold mb-2 text-white">Quality Assured</h3>
                <p className="text-sm text-gray-400">Every product is carefully vetted and tested</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500/10 rounded-full mb-4">
                  <Shield className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="font-bold mb-2 text-white">Trusted Brands</h3>
                <p className="text-sm text-gray-400">We partner only with reputable suppliers</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-500/10 rounded-full mb-4">
                  <TrendingUp className="w-7 h-7 text-purple-500" />
                </div>
                <h3 className="font-bold mb-2 text-white">Best Value</h3>
                <p className="text-sm text-gray-400">Competitive pricing with exclusive deals</p>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default PostDetail;