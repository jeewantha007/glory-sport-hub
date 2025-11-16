import { Link } from "react-router-dom";
import { ExternalLink, Star, TrendingUp, DollarSign, Video, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  affiliateLink: string;
  price?: number;
  category?: string;
  tags?: string[];
  stock_status?: 'in_stock' | 'limited' | 'out_of_stock';
  affiliate_platform?: string;
  is_featured?: boolean;
  video_url?: string;
  additional_images?: string[];
  slug?: string;
}

const PostCard = ({ 
  id, 
  title, 
  description, 
  imageUrl, 
  affiliateLink,
  price,
  category,
  tags,
  stock_status,
  affiliate_platform,
  is_featured,
  video_url,
  additional_images,
  slug
}: PostCardProps) => {
  const hasMultipleMedia = (additional_images && additional_images.length > 0) || video_url;
  const postUrl = slug ? `/post/${slug}` : `/post/${id}`;

  // Strip HTML tags from description for card preview
  const stripHtml = (html: string): string => {
    if (typeof window !== 'undefined') {
      const tmp = document.createElement('DIV');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    }
    // Fallback for SSR: use regex to strip HTML tags and decode common entities
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  };

  const cleanDescription = stripHtml(description);

  return (
    <div className="group bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-800 hover:-translate-y-2">
      <Link to={postUrl}>
        <div className="relative overflow-hidden aspect-square bg-gray-800">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            {/* Category Badge */}
            {category && (
              <div className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                <span className="text-xs font-bold text-black">{category}</span>
              </div>
            )}

            {/* Featured Badge */}
            {is_featured && (
              <div className="flex items-center gap-1 bg-yellow-500/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                <Star className="w-3.5 h-3.5 text-black fill-black" />
                <span className="text-xs font-bold text-black">Featured</span>
              </div>
            )}
          </div>

          {/* Media Indicators */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {video_url && (
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <Video className="w-4 h-4 text-white" />
              </div>
            )}
            {additional_images && additional_images.length > 0 && (
              <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg">
                <span className="text-xs font-bold text-white">+{additional_images.length}</span>
              </div>
            )}
          </div>

          {/* Stock Status Badge */}
          {stock_status && (
            <div className="absolute bottom-3 left-3">
              <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                stock_status === 'in_stock' 
                  ? 'bg-green-500/90 text-white' 
                  : stock_status === 'limited'
                  ? 'bg-orange-500/90 text-white'
                  : 'bg-red-500/90 text-white'
              }`}>
                {stock_status === 'in_stock' ? '✓ In Stock' : 
                 stock_status === 'limited' ? '⚠ Limited' : '✗ Out'}
              </div>
            </div>
          )}

          {/* Quick View Hint */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center justify-center gap-2 shadow-lg">
              <TrendingUp className="w-4 h-4 text-black" />
              <span className="text-xs font-semibold text-black">View Details</span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="p-5">
        {/* Price and Platform */}
        {(price || affiliate_platform) && (
          <div className="flex items-center justify-between mb-3">
            {price && (
              <div className="flex items-center gap-1 text-green-400">
                <DollarSign className="w-5 h-5" />
                <span className="text-2xl font-bold">{price.toFixed(2)}</span>
              </div>
            )}
            {affiliate_platform && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                <Package className="w-3 h-3" />
                <span className="text-xs font-medium">{affiliate_platform}</span>
              </div>
            )}
          </div>
        )}

        <Link to={postUrl}>
          <h3 className="font-bold text-lg mb-2 group-hover:text-white transition-colors line-clamp-2 leading-tight text-white">
            {title}
          </h3>
        </Link>
        
        <p className="text-gray-400 text-sm mb-3 line-clamp-2 leading-relaxed">
          {cleanDescription}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-0.5 text-gray-500 text-xs">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-4" />
        
        <a
          href={affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <Button 
            className="w-full h-11 group/btn bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white shadow-md hover:shadow-lg transition-all font-semibold"
            disabled={stock_status === 'out_of_stock'}
          >
            <span>
              {stock_status === 'out_of_stock' ? 'Out of Stock' : 'Shop Now'}
            </span>
            {stock_status !== 'out_of_stock' && (
              <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5 transition-transform" />
            )}
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