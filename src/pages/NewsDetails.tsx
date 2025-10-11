import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { newsService } from "@/services";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

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
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-muted-foreground mb-6">{error || "News post not found"}</p>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="outline" className="mb-6">
        <Link to="/" className="flex items-center">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-muted-foreground">
            {post.created_at && (
              <time dateTime={post.created_at}>
                {formatDate(post.created_at)}
              </time>
            )}
          </div>
        </header>

        {sections && sections.length > 0 ? (
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.id} className="border-b pb-8 last:border-b-0">
                {section.subtitle && (
                  <h2 className="text-2xl font-semibold mb-4">{section.subtitle}</h2>
                )}
                
                {section.description && (
                  <p className="text-lg mb-6 whitespace-pre-line">{section.description}</p>
                )}
                
                {section.images && section.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {section.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Section image ${index + 1}`}
                        className="rounded-lg object-cover w-full h-64"
                      />
                    ))}
                  </div>
                )}
                
                {section.video && (
                  <div className="mb-6">
                    {section.videoType === "upload" ? (
                      <video
                        src={section.video}
                        controls
                        className="rounded-lg w-full max-w-2xl"
                      />
                    ) : (
                      <div className="rounded-lg overflow-hidden w-full max-w-2xl">
                        {section.video.includes("youtube.com") || section.video.includes("youtu.be") ? (
                          <iframe
                            src={section.video.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full aspect-video"
                          ></iframe>
                        ) : (
                          <a 
                            href={section.video} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block bg-muted p-4 rounded-lg text-center hover:underline"
                          >
                            External Video Link: {section.video}
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
          <div className="text-center py-12">
            <p className="text-muted-foreground">No content available for this post.</p>
          </div>
        )}
      </article>
    </div>
  );
};

export default NewsDetails;