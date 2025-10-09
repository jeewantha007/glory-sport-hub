import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut, Edit, Trash2, Image, Link2, Tag, FolderOpen, TrendingUp, Eye, BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
  affiliate_link: string;
  category: string;
  tags: string[];
}

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [affiliateLink, setAffiliateLink] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setSession(session);
        fetchPosts();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive",
      });
    } else {
      setPosts(data || []);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setAffiliateLink("");
    setCategory("");
    setTags("");
    setIsAdding(false);
    setEditingPost(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      title,
      description,
      image_url: imageUrl,
      affiliate_link: affiliateLink,
      category,
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
    };

    try {
      if (editingPost) {
        const { error } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", editingPost.id);

        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Post updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from("posts")
          .insert([postData]);

        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Post created successfully.",
        });
      }

      resetForm();
      fetchPosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setDescription(post.description);
    setImageUrl(post.image_url);
    setAffiliateLink(post.affiliate_link);
    setCategory(post.category || "");
    setTags(post.tags?.join(", ") || "");
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Post deleted successfully.",
      });
      fetchPosts();
    }
  };

  const uniqueCategories = new Set(posts.map(p => p.category).filter(Boolean));
  const totalTags = new Set(posts.flatMap(p => p.tags || [])).size;

  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-white/90">Manage your affiliate content and track performance</p>
            </div>
            <Button 
              variant="secondary" 
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{posts.length}</div>
            <div className="text-sm text-muted-foreground">Total Posts</div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <FolderOpen className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{uniqueCategories.size}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Tag className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{totalTags}</div>
            <div className="text-sm text-muted-foreground">Unique Tags</div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">Active</div>
            <div className="text-sm text-muted-foreground">Status</div>
          </div>
        </div>

        {/* Action Button or Form */}
        {!isAdding ? (
          <div className="mb-8">
            <Button 
              onClick={() => setIsAdding(true)} 
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Post
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-2xl p-8 shadow-xl mb-8 border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">
                {editingPost ? "Edit Post" : "Create New Post"}
              </h2>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                Cancel
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <Edit className="w-4 h-4" />
                    Title
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="h-12"
                    placeholder="Enter product title..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <FolderOpen className="w-4 h-4" />
                    Category
                  </label>
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-12"
                    placeholder="Basketball, Soccer, Running..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <Eye className="w-4 h-4" />
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={5}
                  className="resize-none"
                  placeholder="Describe the product features and benefits..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <Image className="w-4 h-4" />
                    Image URL
                  </label>
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="h-12"
                    placeholder="https://example.com/image.jpg"
                  />
                  {imageUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-border/50">
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <Link2 className="w-4 h-4" />
                    Affiliate Link
                  </label>
                  <Input
                    value={affiliateLink}
                    onChange={(e) => setAffiliateLink(e.target.value)}
                    required
                    className="h-12"
                    placeholder="https://affiliate.link/product"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <Tag className="w-4 h-4" />
                  Tags (comma separated)
                </label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="h-12"
                  placeholder="gear, shoes, training, premium"
                />
                {tags && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.split(",").map((tag, i) => tag.trim() && (
                      <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  {editingPost ? "Update Post" : "Create Post"}
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        <div className="bg-card rounded-2xl p-8 shadow-xl border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">All Posts</h2>
            <div className="text-sm text-muted-foreground">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} total
            </div>
          </div>
          
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <BarChart3 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-6">Create your first post to get started!</p>
              <Button onClick={() => setIsAdding(true)} className="bg-gradient-to-r from-primary to-secondary">
                <Plus className="w-4 h-4 mr-2" />
                Create First Post
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex flex-col md:flex-row md:items-center gap-4 p-5 bg-background rounded-xl hover:shadow-md transition-all border border-border/50 animate-in fade-in slide-in-from-bottom duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {post.image_url && (
                    <div className="w-full md:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                      <img 
                        src={post.image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-lg line-clamp-1">{post.title}</h3>
                      {post.category && (
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium whitespace-nowrap">
                          {post.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {post.description}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-muted text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="px-2 py-0.5 text-xs text-muted-foreground">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 md:flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(post)}
                      className="hover:bg-primary/10 hover:text-primary hover:border-primary"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(post.id)}
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
      </main>

      <Footer />
    </div>
  );
};

export default Admin;