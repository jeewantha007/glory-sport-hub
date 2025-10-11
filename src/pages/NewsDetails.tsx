import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { newsService } from "@/services";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, Calendar, Clock, Play } from "lucide-react";

interface Section {
  id: string;
  subtitle: string;
  description: string;
  images: string[];
  video: string;
  videoType: "upload" | "url";
}

const NewsDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await newsService.fetchNewsById(id);
        
        if (error) throw error;
        
        setPost(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch news post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#05070b' }}>
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#05070b' }}>
        <div className="text-center py-12 px-4">
          <div className="mb-6 text-6xl">😞</div>
          <h2 className="text-3xl font-bold text-red-400 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-8 text-lg">{error || "News post not found"}</p>
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

  // Parse sections if they're stored as a string
  let sections: Section[] = [];
  if (post.sections) {
    try {
      sections = Array.isArray(post.sections) 
        ? post.sections 
        : typeof post.sections === 'string' 
          ? JSON.parse(post.sections)
          : [];
    } catch (e) {
      console.error("Failed to parse sections", e);
      sections = [];
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadingTime = (sections: Section[]) => {
    const wordCount = sections.reduce((total, section) => {
      return total + (section.description?.split(' ').length || 0);
    }, 0);
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  const convertToEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#05070b' }}>
      <div className="container mx-auto px-4 py-8">
        <Button 
          asChild 
          variant="ghost" 
          className="mb-8 text-gray-400 hover:text-white hover:bg-gray-900"
        >
          <Link to="/" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to News
          </Link>
        </Button>

        <article className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <header className="mb-12">
            <h1 className="text-5xl font-bold mb-6 text-white leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 text-gray-400 mb-8">
              {post.created_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.created_at}>
                    {formatDate(post.created_at)}
                  </time>
                </div>
              )}
              {sections.length > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{getReadingTime(sections)}</span>
                </div>
              )}
            </div>

            {/* Featured Video Player */}
            {post.video && (
              <div className="mb-8">
                {post.videoType === "upload" || !post.video.includes("http") ? (
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
                    <video
                      src={post.video}
                      controls
                      className="w-full max-h-[600px]"
                      preload="metadata"
                      poster={post.featured_image}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
                    {(post.video.includes("youtube.com") || 
                      post.video.includes("youtu.be") ||
                      post.video.includes("vimeo.com")) ? (
                      <div className="relative" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          src={convertToEmbedUrl(post.video)}
                          title="Featured video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="absolute top-0 left-0 w-full h-full"
                        ></iframe>
                      </div>
                    ) : (
                      <a 
                        href={post.video} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-8 rounded-xl text-white transition-all duration-300 group"
                      >
                        <Play className="h-6 w-6 group-hover:scale-110 transition-transform" />
                        <span className="text-lg font-semibold">Watch External Video</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Featured Image (only if no video) */}
            {!post.video && post.featured_image && (
              <div className="relative rounded-2xl overflow-hidden mb-8 shadow-2xl">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-transparent to-transparent opacity-60"></div>
              </div>
            )}

            {post.meta_description && (
              <p className="text-xl text-gray-300 leading-relaxed italic border-l-4 border-blue-500 pl-6 py-2">
                {post.meta_description}
              </p>
            )}
          </header>

          {/* Content Sections */}
          {sections && sections.length > 0 ? (
            <div className="space-y-16">
              {sections.map((section, index) => (
                <section 
                  key={section.id} 
                  className="border-b border-gray-800 pb-12 last:border-b-0"
                >
                  {section.subtitle && (
                    <h2 className="text-3xl font-bold mb-6 text-white">
                      {section.subtitle}
                    </h2>
                  )}
                  
                  {section.description && (
                    <div className="prose prose-lg prose-invert max-w-none mb-8">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                        {section.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Images Grid */}
                  {section.images && section.images.length > 0 && (
                    <div className={`grid gap-4 mb-8 ${
                      section.images.length === 1 ? 'grid-cols-1' :
                      section.images.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    }`}>
                      {section.images.map((image, imgIndex) => (
                        <div 
                          key={imgIndex}
                          className="relative rounded-xl overflow-hidden group shadow-lg hover:shadow-2xl transition-shadow duration-300"
                        >
                          <img
                            src={image}
                            alt={`${section.subtitle || 'Section'} image ${imgIndex + 1}`}
                            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Video Player */}
                  {section.video && (
                    <div className="mb-8">
                      {section.videoType === "upload" ? (
                        <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black">
                          <video
                            src={section.video}
                            controls
                            className="w-full max-h-[600px]"
                            preload="metadata"
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ) : (
                        <div className="relative rounded-xl overflow-hidden shadow-2xl bg-gray-900">
                          {(section.video.includes("youtube.com") || 
                            section.video.includes("youtu.be") ||
                            section.video.includes("vimeo.com")) ? (
                            <div className="relative" style={{ paddingBottom: '56.25%' }}>
                              <iframe
                                src={convertToEmbedUrl(section.video)}
                                title={`Video player ${index + 1}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="absolute top-0 left-0 w-full h-full"
                              ></iframe>
                            </div>
                          ) : (
                            <a 
                              href={section.video} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-8 rounded-xl text-white transition-all duration-300 group"
                            >
                              <Play className="h-6 w-6 group-hover:scale-110 transition-transform" />
                              <span className="text-lg font-semibold">Watch External Video</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-900/30 rounded-xl">
              <p className="text-gray-400 text-lg">No content available for this post.</p>
            </div>
          )}

          {/* Back to top button */}
          <div className="mt-16 pt-8 border-t border-gray-800 flex justify-center">
            <Button 
              asChild 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            >
              <Link to="/" className="flex items-center gap-2">
                <ChevronLeft className="h-5 w-5" />
                Back to All News
              </Link>
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default NewsDetails;