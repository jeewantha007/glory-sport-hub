import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface NewsPost {
  id: string;
  title: string;
  meta_description?: string;
  created_at?: string;
}

interface NewsPostCardProps {
  post: NewsPost;
}

const NewsPostCard = ({ post }: NewsPostCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold line-clamp-2">{post.title}</h3>
      </CardHeader>
      <CardContent className="pb-2">
        {post.meta_description && (
          <p className="text-muted-foreground line-clamp-3">
            {post.meta_description}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {post.created_at && (
          <span className="text-sm text-muted-foreground">
            {formatDate(post.created_at)}
          </span>
        )}
        <Button variant="outline" size="sm" asChild>
          <Link to={`/news/${post.id}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewsPostCard;