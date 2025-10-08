import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut, Edit, Trash2 } from "lucide-react";
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

  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {!isAdding ? (
          <Button onClick={() => setIsAdding(true)} className="mb-8">
            <Plus className="w-4 h-4 mr-2" />
            Add New Post
          </Button>
        ) : (
          <div className="bg-card rounded-lg p-8 shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingPost ? "Edit Post" : "Create New Post"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Affiliate Link</label>
                <Input
                  value={affiliateLink}
                  onChange={(e) => setAffiliateLink(e.target.value)}
                  required
                  placeholder="https://affiliate.link/product"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Basketball, Soccer, Running, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tags (comma separated)
                </label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="gear, shoes, training"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                  {editingPost ? "Update Post" : "Create Post"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-card rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-6">All Posts</h2>
          {posts.length === 0 ? (
            <p className="text-muted-foreground">No posts yet. Create your first post!</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 bg-background rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {post.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="w-4 h-4" />
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
