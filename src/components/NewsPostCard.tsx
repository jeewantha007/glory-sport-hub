import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";

interface Section {
  id: string;
  subtitle?: string;
  description?: string;
  images?: string[];
  video?: string;
  videoType?: string;
  buttons?: Array<{
    text: string;
    url: string;
    style: "primary" | "secondary" | "outline" | "link";
  }>;
}

interface NewsPost {
  _id: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  image_url?: string;
  slug?: string;
}

interface NewsPostCardProps {
  post: NewsPost;
}

const NewsPostCard = ({ post }: NewsPostCardProps) => {
  const firstImage =
    post.image_url ||
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop";

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-none"
      style={{ backgroundColor: "#05070b" }}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden h-48 bg-black flex items-center justify-center">
        <img
          src={firstImage}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-transparent to-transparent opacity-60"></div>
      </div>

      <CardHeader className="pb-3 pt-4">
        <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-blue-400 transition-colors duration-300">
          {post.title}
        </h3>
      </CardHeader>

      <CardContent className="pb-4">
        {post.excerpt && (
          <p className="text-gray-400 line-clamp-3 text-sm leading-relaxed">
            {post.excerpt}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-4 border-t border-gray-800">
        {post.publishedAt && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/30 group/btn"
        >
          <Link to={`/news/${post.slug || post._id}`} className="flex items-center gap-2">
            Read More
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewsPostCard;
