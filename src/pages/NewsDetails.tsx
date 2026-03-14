import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import { client, newsQueries, urlFor } from "@/lib/sanity.client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, Clock, Play } from "lucide-react";
import { useMeta } from "@/hooks/use-meta";

const NewsDetails = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set up meta tags
  useMeta({
    title: post?.title,
    description: post?.meta_description,
    image: post?.featured_image,
    url: post?.slug ? `https://www.gloryofsport.com/news/${post.slug}` : undefined,
    type: 'article'
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (!identifier) {
        setError("No identifier provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // In this implementation, we mostly use slug. If it's an ID, we'd need a different query.
        // For now, let's assume identifier is always a slug as per our new link structure.
        const data = await client.fetch(newsQueries.newsBySlug, { slug: identifier });
        
        if (!data) throw new Error("News post not found");
        
        setPost(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch news post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [identifier]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070b]">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse max-w-4xl mx-auto">
            <div className="h-8 bg-gray-800 rounded w-32 mb-8"></div>
            <div className="h-12 bg-gray-800 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-800 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-800 rounded w-5/6"></div>
              <div className="h-4 bg-gray-800 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05070b]">
        <div className="text-center py-12 px-4">
          <div className="mb-6 text-6xl">😞</div>
          <h2 className="text-3xl font-bold text-red-400 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            {error || "News post not found"}
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString?: string) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  const ptComponents = {
    types: {
      image: ({ value }: any) => {
        if (!value?.asset?._ref) return null;
        return (
          <div className="my-8 flex justify-center">
            <img
              src={urlFor(value).width(800).url()}
              alt={value.alt || "Post image"}
              className="rounded-xl shadow-lg max-w-full"
            />
          </div>
        );
      },
    },
    block: {
      h2: ({ children }: any) => <h2 className="text-3xl font-bold text-white mt-10 mb-4">{children}</h2>,
      h3: ({ children }: any) => <h3 className="text-2xl font-bold text-white mt-8 mb-3">{children}</h3>,
      normal: ({ children }: any) => <p className="text-gray-300 text-lg leading-relaxed mb-6">{children}</p>,
    },
    marks: {
      link: ({ children, value }: any) => {
        const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined;
        return (
          <a href={value.href} rel={rel} className="text-blue-400 hover:underline">
            {children}
          </a>
        );
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <Button
          asChild
          variant="ghost"
          className="mb-4 sm:mb-6 md:mb-8 text-gray-400 hover:text-white hover:bg-gray-900 text-sm sm:text-base"
        >
          <Link to="/news" className="flex items-center gap-2">
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            Back to News
          </Link>
        </Button>

        <article className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <header className="mb-8 sm:mb-10 md:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-400 mb-6 sm:mb-8">
              {post.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                </div>
              )}
            </div>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8 shadow-2xl bg-black/10 flex justify-center items-center">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full max-h-[400px] sm:max-h-[500px] md:max-h-[600px] object-contain"
                />
              </div>
            )}

            {post.excerpt && (
              <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed italic border-l-4 border-blue-500 pl-4 sm:pl-6 py-2">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Content Sections */}
          <div className="mt-8">
            <PortableText value={post.body} components={ptComponents} />
          </div>

          {/* Back Button */}
          <div className="mt-10 sm:mt-12 md:mt-16 pt-6 sm:pt-8 border-t border-gray-800 flex justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base md:text-lg" asChild>
              <Link to="/news" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                Back to All News
              </Link>
            </Button>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
};

export default NewsDetails;
