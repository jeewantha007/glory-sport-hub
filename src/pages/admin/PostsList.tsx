import { Edit, Trash2, Video, ExternalLink, Star, TrendingUp, BarChart3, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Post } from "@/integrations/supabase/types";
import { Link } from "react-router-dom";

interface PostsListProps {
  posts: Post[];
  allPosts: Post[];
  selectedPosts: Set<string>;
  onToggleSelection: (id: string) => void;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  onBulkDelete: () => void;
  searchTerm: string;
  filterCategory: string;
  onAddPost: () => void;
}

const PostsList = ({
  posts,
  allPosts,
  selectedPosts,
  onToggleSelection,
  onEdit,
  onDelete,
  onBulkDelete,
  searchTerm,
  filterCategory,
  onAddPost,
}: PostsListProps) => {
  return (
    <>
      {/* Bulk Actions */}
      {selectedPosts.size > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 flex items-center justify-between">
          <span className="font-semibold">
            {selectedPosts.size} post{selectedPosts.size > 1 ? 's' : ''} selected
          </span>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={onBulkDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Posts List */}
      <div className="bg-card rounded-2xl p-8 shadow-xl border border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">All Posts</h2>
          <div className="text-sm text-muted-foreground">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} 
            {searchTerm || filterCategory ? ' (filtered)' : ''}
          </div>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              {allPosts.length === 0 ? (
                <BarChart3 className="w-8 h-8 text-muted-foreground" />
              ) : (
                <Filter className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {allPosts.length === 0 ? 'No posts yet' : 'No posts found'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {allPosts.length === 0 
                ? 'Create your first post to get started!' 
                : 'Try adjusting your search or filters'}
            </p>
            {allPosts.length === 0 && (
              <Button onClick={onAddPost} className="bg-gradient-to-r from-primary to-secondary">
                <Plus className="w-4 h-4 mr-2" />
                Create First Post
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="flex flex-col md:flex-row md:items-center gap-4 p-5 bg-background rounded-xl hover:shadow-md transition-all border border-border/50 animate-in fade-in slide-in-from-bottom duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Checkbox for bulk selection */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedPosts.has(post.id)}
                    onChange={() => onToggleSelection(post.id)}
                    className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                  />
                </div>

                {/* Image Preview */}
                {post.image_url && (
                  <div className="relative w-full md:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {post.additional_images && post.additional_images.length > 0 && (
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                        +{post.additional_images.length}
                      </div>
                    )}
                    {post.video_url && (
                      <div className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded">
                        <Video className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                )}
                
                {/* Post Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg line-clamp-1">{post.title}</h3>
                      {post.is_featured && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-full text-xs font-medium">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.category && (
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium whitespace-nowrap">
                          {post.category}
                        </span>
                      )}
                      {post.price && (
                        <span className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-xs font-medium whitespace-nowrap">
                          ${post.price}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {post.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {post.affiliate_platform && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded">
                        <ExternalLink className="w-3 h-3" />
                        {post.affiliate_platform}
                      </span>
                    )}
                    
                    {post.stock_status && (
                      <span className={`px-2 py-1 rounded ${
                        post.stock_status === 'in_stock' 
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                          : post.stock_status === 'limited'
                          ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}>
                        {post.stock_status === 'in_stock' ? 'In Stock' : 
                         post.stock_status === 'limited' ? 'Limited Stock' : 'Out of Stock'}
                      </span>
                    )}
                    
                    {post.tags && post.tags.length > 0 && (
                      <>
                        {post.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-muted rounded">
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="px-2 py-1 text-muted-foreground">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  
                  {(post.meta_title || post.meta_description) && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="w-3 h-3" />
                      <span>SEO optimized</span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 md:flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="hover:bg-primary/10 hover:text-primary hover:border-primary"
                  >
                    <Link to={post.slug ? `/post/${post.slug}` : `/post/${post.id}`}>
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(post)}
                    className="hover:bg-primary/10 hover:text-primary hover:border-primary"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(post.id)}
                    className="hover:bg-destructive/90"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PostsList;