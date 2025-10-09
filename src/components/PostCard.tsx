import { Link } from "react-router-dom";
import { ExternalLink, Star, TrendingUp } from "lucide-react";
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
    <div className="group bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-800 hover:-translate-y-2">
      <Link to={`/post/${id}`}>
        <div className="relative overflow-hidden aspect-square bg-gray-800">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badge */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-black">Featured</span>
            </div>
          </div>

          {/* Quick View Hint */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center justify-center gap-2 shadow-lg">
              <TrendingUp className="w-4 h-4 text-black" />
              <span className="text-xs font-semibold text-black">Click to view details</span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="p-5">
        <Link to={`/post/${id}`}>
          <h3 className="font-bold text-lg mb-2 group-hover:text-white transition-colors line-clamp-2 leading-tight text-white">
            {title}
          </h3>
        </Link>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>
        
        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-4" />
        
        <a
          href={affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <Button className="w-full h-11 group/btn bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white shadow-md hover:shadow-lg transition-all font-semibold">
            <span>Shop Now</span>
            <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Button>
        </a>

        {/* Trust Indicator */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          </div>
          <span className="font-medium">Verified Product</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;