import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  affiliateLink: string;
}

const PostCard = ({ id, title, description, imageUrl, affiliateLink }: PostCardProps) => {
  return (
    <div className="group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      <Link to={`/post/${id}`}>
        <div className="relative overflow-hidden aspect-square">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      
      <div className="p-5">
        <Link to={`/post/${id}`}>
          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {description}
        </p>
        
        <a
          href={affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <Button className="w-full group/btn bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            <span>Shop Now</span>
            <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </a>
      </div>
    </div>
  );
};

export default PostCard;
