import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { newsService } from "@/services";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, Clock, Play } from "lucide-react";
import { useMeta } from "@/hooks/use-meta";

interface Section {
  id: string;
  subtitle: string;
  description: string;
  images: string[];
  video: string;
  videoType: "upload" | "url";
  buttons?: Array<{
    text: string;
    url: string;
    style: "primary" | "secondary" | "outline" | "link";
    alignment?: "left" | "center" | "right";
  }>;
  // Styling and alignment metadata
  headingLevel?: string;
  headingAlignment?: "left" | "center" | "right";
  headingStyling?: { fontFamily?: string; fontSize?: string; color?: string };
  paragraphAlignments?: ("left" | "center" | "right")[];
  paragraphStyling?: Array<{ fontFamily?: string; fontSize?: string; color?: string }>;
  imageData?: Array<{ alt?: string; caption?: string; alignment?: "left" | "center" | "right" }>;
  videoAlignment?: "left" | "center" | "right";
}

const NewsDetails = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set up meta tags
  useMeta({
    title: post?.meta_title || post?.title,
    description: post?.meta_description || post?.description,
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
        let data, error;

        // Check if the identifier looks like a slug (contains letters and hyphens)
        if (identifier.includes('-') && /[a-z]/.test(identifier)) {
          // Treat it as a slug
          const result = await newsService.fetchNewsBySlug(identifier);
          data = result.data;
          error = result.error;
        } else {
          // Treat it as an ID
          const result = await newsService.fetchNewsById(identifier);
          data = result.data;
          error = result.error;
        }
        
        if (error) throw error;
        if (!data) throw new Error("News post not found");
        
        setPost(data);
        
        // If we fetched by ID but the post has a slug, redirect to the slug URL
        if (identifier && data.slug && data.slug !== identifier) {
          navigate(`/news/${data.slug}`, { replace: true });
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch news post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [identifier, navigate]);

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

  // Parse sections safely
  let sections: Section[] = [];
  if (post.sections) {
    try {
      const parsed = Array.isArray(post.sections)
        ? post.sections
        : typeof post.sections === "string"
        ? JSON.parse(post.sections)
        : [];
      
      // Filter out invalid sections and ensure proper structure
      sections = parsed
        .filter((section: any) => section && typeof section === 'object')
        .map((section: any) => ({
          id: section.id || Date.now().toString() + Math.random(),
          subtitle: section.subtitle || "",
          description: section.description || "",
          images: Array.isArray(section.images) ? section.images.filter((img: any) => img && typeof img === 'string') : [],
          video: section.video || "",
          videoType: section.videoType === "upload" ? "upload" : "url",
          buttons: Array.isArray(section.buttons) ? section.buttons.filter((btn: any) => btn && btn.text && btn.url) : [],
          // Preserve styling and alignment metadata
          headingLevel: section.headingLevel,
          headingAlignment: section.headingAlignment,
          headingStyling: section.headingStyling,
          paragraphAlignments: section.paragraphAlignments,
          paragraphStyling: section.paragraphStyling,
          imageData: section.imageData,
          videoAlignment: section.videoAlignment,
        }))
        .filter((section: Section) => 
          section.subtitle || 
          section.description || 
          (section.images && section.images.length > 0) || 
          section.video ||
          (section.buttons && section.buttons.length > 0)
        );
    } catch (e) {
      console.error("Failed to parse sections:", e);
      sections = [];
    }
  }

  const formatDate = (dateString?: string) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  const getReadingTime = (sections: Section[]) => {
    const wordCount = sections.reduce(
      (total, section) => total + (section.description?.split(" ").length || 0),
      0
    );
    return `${Math.ceil(wordCount / 200)} min read`;
  };

  const convertToEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch")) {
      const id = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    } else if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    } else if (url.includes("vimeo.com/")) {
      const id = url.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
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

            {/* Featured Video */}
            {post.video && (
              <div className="mb-6 sm:mb-8">
                {post.videoType === "upload" || !post.video.includes("http") ? (
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
                    <video
                      src={post.video}
                      controls
                      className="w-full max-h-[600px]"
                      preload="metadata"
                      poster={post.featured_image}
                    />
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
                    {(post.video.includes("youtube.com") ||
                      post.video.includes("youtu.be") ||
                      post.video.includes("vimeo.com")) ? (
                      <div className="relative" style={{ paddingBottom: "56.25%" }}>
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
                        <span className="text-lg font-semibold">
                          Watch External Video
                        </span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Featured Image */}
            {!post.video && post.featured_image && (
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8 shadow-2xl bg-black/10 flex justify-center items-center">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full max-h-[400px] sm:max-h-[500px] md:max-h-[600px] object-contain"
                />
              </div>
            )}

            {post.meta_description && (
              <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed italic border-l-4 border-blue-500 pl-4 sm:pl-6 py-2">
                {post.meta_description}
              </p>
            )}
          </header>

          {/* Content Sections */}
          {sections && sections.length > 0 ? (
            <div className="space-y-10 sm:space-y-12 md:space-y-16">
              {sections.map((section, index) => (
                <section
                  key={section.id}
                  className="border-b border-gray-800 pb-8 sm:pb-10 md:pb-12 last:border-b-0"
                >
                  {(section.subtitle || section.description) && (
                    <>
                      {section.subtitle && (
                        <h2 
                          className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white ${
                            section.headingAlignment === "center" ? "text-center" :
                            section.headingAlignment === "right" ? "text-right" : "text-left"
                          }`}
                          style={{
                            fontFamily: section.headingStyling?.fontFamily || "inherit",
                            fontSize: section.headingStyling?.fontSize || "inherit",
                            color: section.headingStyling?.color || "inherit",
                          }}
                        >
                          {section.subtitle}
                        </h2>
                      )}

                      {section.description && (
                        <div className="prose prose-sm sm:prose-base md:prose-lg prose-invert max-w-none mb-6 sm:mb-8">
                          {section.description.split(/\n\n+/).map((paragraph: string, paraIndex: number) => {
                            const paraAlignment = Array.isArray(section.paragraphAlignments) 
                              ? section.paragraphAlignments[paraIndex] || "left"
                              : section.paragraphAlignments || "left";
                            const paraStyling = Array.isArray(section.paragraphStyling)
                              ? section.paragraphStyling[paraIndex] || {}
                              : section.paragraphStyling || {};
                            
                            return (
                              <p
                                key={paraIndex}
                                className={`text-gray-300 leading-relaxed whitespace-pre-line text-base sm:text-lg mb-4 ${
                                  paraAlignment === "center" ? "text-center" :
                                  paraAlignment === "right" ? "text-right" : "text-left"
                                }`}
                                style={{
                                  fontFamily: paraStyling.fontFamily || "inherit",
                                  fontSize: paraStyling.fontSize || "inherit",
                                  color: paraStyling.color || "inherit",
                                }}
                              >
                                {paragraph.trim()}
                              </p>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}

                  {/* Images Grid (Full Size) */}
                  {section.images && Array.isArray(section.images) && section.images.length > 0 && (
                    <div
                      className={`grid gap-4 mb-8 ${
                        section.images.length === 1
                          ? "grid-cols-1"
                          : section.images.length === 2
                          ? "grid-cols-1 md:grid-cols-2"
                          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      }`}
                    >
                      {section.images
                        .filter((image: any) => image && typeof image === 'string' && image.trim())
                        .map((image: string, imgIndex: number) => {
                          const imageData = Array.isArray(section.imageData) ? section.imageData[imgIndex] : {};
                          const alignment = imageData?.alignment || "left";
                          
                          return (
                            <div
                              key={imgIndex}
                              className={`relative rounded-xl overflow-hidden group shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-black/10 flex items-center ${
                                alignment === "center" ? "justify-center" :
                                alignment === "right" ? "justify-end" : "justify-start"
                              }`}
                            >
                              <img
                                src={image}
                                alt={imageData?.alt || `${section.subtitle || "Section"} image ${imgIndex + 1}`}
                                className="w-full max-h-[600px] object-contain rounded-xl transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                  // Hide broken images
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                              {imageData?.caption && (
                                <p className="text-sm text-gray-400 mt-2 text-center">{imageData.caption}</p>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* Video Player */}
                  {section.video && section.video.trim() && (
                    <div className={`mb-8 ${
                      section.videoAlignment === "center" ? "flex justify-center" :
                      section.videoAlignment === "right" ? "flex justify-end" : ""
                    }`}>
                      {section.videoType === "upload" ? (
                        <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black">
                          <video
                            src={section.video}
                            controls
                            className="w-full max-h-[600px]"
                            preload="metadata"
                          />
                        </div>
                      ) : (
                        <div className="relative rounded-xl overflow-hidden shadow-2xl bg-gray-900">
                          {(section.video.includes("youtube.com") ||
                            section.video.includes("youtu.be") ||
                            section.video.includes("vimeo.com")) ? (
                            <div className="relative" style={{ paddingBottom: "56.25%" }}>
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
                              <span className="text-lg font-semibold">
                                Watch External Video
                              </span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Buttons */}
                  {section.buttons && Array.isArray(section.buttons) && section.buttons.length > 0 && (
                    <div className={`flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8 ${
                      (section.buttons[0]?.alignment || "left") === "center" ? "justify-center" :
                      (section.buttons[0]?.alignment || "left") === "right" ? "justify-end" : "justify-start"
                    }`}>
                      {section.buttons.map((button, btnIndex) => {
                        const buttonVariants: Record<string, any> = {
                          primary: "bg-blue-600 hover:bg-blue-700 text-white",
                          secondary: "bg-gray-700 hover:bg-gray-600 text-white",
                          outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
                          link: "text-blue-400 hover:text-blue-300 underline",
                        };
                        
                        const buttonClass = buttonVariants[button.style] || buttonVariants.primary;
                        
                        return (
                          <a
                            key={btnIndex}
                            href={button.url}
                            target={button.url.startsWith('http') ? '_blank' : undefined}
                            rel={button.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ${buttonClass} ${
                              button.style === 'link' ? '' : 'shadow-lg hover:shadow-xl'
                            }`}
                          >
                            {button.text}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </section>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-900/30 rounded-xl">
              <p className="text-gray-400 text-lg">
                No content available for this post.
              </p>
            </div>
          )}

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
