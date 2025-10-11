import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import StatsCards from "./admin/StatsCards";
import PostForm from "./admin/PostForm";
import PostsFilter from "./admin/PostsFilter";
import PostsList from "./admin/PostsList";

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
  additional_images?: string[];
  video_url?: string;
  affiliate_link: string;
  category: string;
  tags: string[];
  price?: number;
  stock_status?: 'in_stock' | 'limited' | 'out_of_stock';
  affiliate_platform?: string;
  is_featured?: boolean;
  meta_title?: string;
  meta_description?: string;
}

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  
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

  useEffect(() => {
    let filtered = [...posts];
    
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterCategory) {
      filtered = filtered.filter(post => post.category === filterCategory);
    }
    
    switch (sortBy) {
      case "newest":
        break;
      case "oldest":
        filtered.reverse();
        break;
      case "price_high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "price_low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "featured":
        filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
    }
    
    setFilteredPosts(filtered);
  }, [posts, searchTerm, filterCategory, sortBy]);

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
      setFilteredPosts(data || []);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleFormSuccess = () => {
    setIsAdding(false);
    setEditingPost(null);
    fetchPosts();
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const { error } = await supabase.from("posts").delete().eq("id", id);

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

  const handleBulkDelete = async () => {
    if (selectedPosts.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedPosts.size} posts?`)) return;

    const deletePromises = Array.from(selectedPosts).map(id =>
      supabase.from("posts").delete().eq("id", id)
    );

    try {
      await Promise.all(deletePromises);
      toast({
        title: "Success!",
        description: `${selectedPosts.size} posts deleted successfully.`,
      });
      setSelectedPosts(new Set());
      fetchPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some posts",
        variant: "destructive",
      });
    }
  };

  const togglePostSelection = (id: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPosts(newSelected);
  };

  const uniqueCategories = Array.from(new Set(posts.map(p => p.category).filter(Boolean)));

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

        {/* Stats Cards Component */}
        <StatsCards posts={posts} />

        {/* Add Post Button or Form */}
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
          <PostForm
            editingPost={editingPost}
            uniqueCategories={uniqueCategories}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsAdding(false);
              setEditingPost(null);
            }}
          />
        )}

        {/* Filter Component */}
        <PostsFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          uniqueCategories={uniqueCategories}
        />

        {/* Posts List Component */}
        <PostsList
          posts={filteredPosts}
          allPosts={posts}
          selectedPosts={selectedPosts}
          onToggleSelection={togglePostSelection}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
          searchTerm={searchTerm}
          filterCategory={filterCategory}
          onAddPost={() => setIsAdding(true)}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Admin;