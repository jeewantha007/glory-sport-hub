import { Edit, Trash2, Newspaper, BarChart3, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsPost } from "@/integrations/supabase/types";
import { Link } from "react-router-dom";

interface NewsPostsListProps {
  posts: NewsPost[];
  allPosts: NewsPost[];
  selectedPosts: Set<string>;
  onToggleSelection: (id: string) => void;
  onEdit: (post: NewsPost) => void;
  onDelete: (id: string) => void;
  onBulkDelete: () => void;
  searchTerm: string;
  onAddPost: () => void;
}

const NewsPostsList = ({
  posts,
  allPosts,
  selectedPosts,
  onToggleSelection,
  onEdit,
  onDelete,
  onBulkDelete,
  searchTerm,
  onAddPost,
}: NewsPostsListProps) => {
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

      {/* News Posts List */}
      <div className="bg-card rounded-2xl p-8 shadow-xl border border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">All News Posts</h2>
          <div className="text-sm text-muted-foreground">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} 
            {searchTerm ? ' (filtered)' : ''}
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
              {allPosts.length === 0 ? 'No news posts yet' : 'No news posts found'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {allPosts.length === 0 
                ? 'Create your first news post to get started!' 
                : 'Try adjusting your search'}
            </p>

            {allPosts.length === 0 && (
              <Button onClick={onAddPost} className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Create First News Post
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

                {/* Post Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg line-clamp-1">{post.title}</h3>
                    </div>
                  </div>
                  
                  {post.meta_description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {post.meta_description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {post.created_at && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded">
                        <Newspaper className="w-3 h-3" />
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    )}
                    
                    {post.sections && Array.isArray(post.sections) && post.sections.length > 0 && (
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded">
                        {post.sections.length} section{post.sections.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  
                  {(post.meta_title || post.meta_description) && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Newspaper className="w-3 h-3" />
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
                    <Link to={`/news/${post.slug || post.id}`}>
                      <Newspaper className="w-4 h-4 mr-1" />
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

export default NewsPostsList;