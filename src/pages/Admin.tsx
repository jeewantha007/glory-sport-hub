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
import NewsPostForm from "./admin/NewsPostForm";
import PostsFilter from "./admin/PostsFilter";
import PostsList from "./admin/PostsList";
import NewsPostsList from "./admin/NewsPostsList";
import { postService, newsPostService, authService } from "@/services";
import { Post, NewsPost } from "@/integrations/supabase/types";

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [filteredNewsPosts, setFilteredNewsPosts] = useState<NewsPost[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingNewsPost, setEditingNewsPost] = useState<NewsPost | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [selectedNewsPosts, setSelectedNewsPosts] = useState<Set<string>>(new Set());
  const [addingType, setAddingType] = useState<"product" | "news">("product");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    authService.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
      else {
        setSession(session);
        fetchPosts();
      }
    });

    const subscription = authService.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    let filtered = [...posts];

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterCategory) {
      filtered = filtered.filter((post) => post.category === filterCategory);
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
    // Fetch product posts
    const { data: postData, error: postError } = await postService.fetchPosts();
    
    if (postError)
      toast({ title: "Error", description: "Failed to fetch posts", variant: "destructive" });
    else {
      setPosts(postData || []);
      setFilteredPosts(postData || []);
    }
    
    // Fetch news posts
    const { data: newsData, error: newsError } = await newsPostService.fetchNewsPosts();
    if (newsError)
      toast({ title: "Error", description: "Failed to fetch news posts", variant: "destructive" });
    else {
      // Transform the data to match the NewsPost interface
      const transformedNewsData = (newsData || []).map(post => {
        let sections = null;
        if (post.sections) {
          try {
            sections = typeof post.sections === 'string' ? JSON.parse(post.sections) : post.sections;
          } catch (e) {
            console.error('Failed to parse sections for post:', post.id, e);
            sections = null;
          }
        }
        return {
          ...post,
          sections
        };
      });
      setNewsPosts(transformedNewsData);
      setFilteredNewsPosts(transformedNewsData);
    }
  };

  const handleLogout = async () => {
    await authService.signOut();
    navigate("/");
  };

  const handleFormSuccess = () => {
    setIsAdding(false);
    setEditingPost(null);
    setEditingNewsPost(null);
    fetchPosts();
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setAddingType("product");
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditNewsPost = (post: NewsPost) => {
    setEditingNewsPost(post);
    setAddingType("news");
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const { error } = await postService.deletePost(id);

    if (error)
      toast({ title: "Error", description: "Failed to delete post", variant: "destructive" });
    else {
      toast({ title: "Success!", description: "Post deleted successfully." });
      fetchPosts();
    }
  };

  const handleDeleteNewsPost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news post?")) return;

    const { error } = await newsPostService.deleteNewsPost(id);

    if (error)
      toast({ title: "Error", description: "Failed to delete news post", variant: "destructive" });
    else {
      toast({ title: "Success!", description: "News post deleted successfully." });
      fetchPosts();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedPosts.size} posts?`)) return;

    const { errors } = await postService.bulkDeletePosts(Array.from(selectedPosts));

    if (errors && errors.length > 0)
      toast({ title: "Error", description: "Failed to delete some posts", variant: "destructive" });
    else {
      toast({ title: "Success!", description: `${selectedPosts.size} posts deleted successfully.` });
      setSelectedPosts(new Set());
      fetchPosts();
    }
  };

  const handleBulkDeleteNewsPosts = async () => {
    if (selectedNewsPosts.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedNewsPosts.size} news posts?`)) return;

    // Since there's no bulk delete for news posts, we'll delete them one by one
    const deletePromises = Array.from(selectedNewsPosts).map(id => 
      newsPostService.deleteNewsPost(id)
    );

    const results = await Promise.all(deletePromises);
    const errors = results.filter(result => result.error);

    if (errors.length > 0)
      toast({ title: "Error", description: `Failed to delete ${errors.length} news posts`, variant: "destructive" });
    else {
      toast({ title: "Success!", description: `${selectedNewsPosts.size} news posts deleted successfully.` });
      setSelectedNewsPosts(new Set());
      fetchPosts();
    }
  };

  const togglePostSelection = (id: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedPosts(newSelected);
  };

  const toggleNewsPostSelection = (id: string) => {
    const newSelected = new Set(selectedNewsPosts);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedNewsPosts(newSelected);
  };

  const uniqueCategories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));

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
        <StatsCards posts={posts} />

        {/* Add Post Toggle */}
        {!isAdding ? (
          <div className="mb-8 flex gap-4">
            <Button
              onClick={() => {
                setIsAdding(true);
                setAddingType("product");
              }}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Product Post
            </Button>
            <Button
              onClick={() => {
                setIsAdding(true);
                setAddingType("news");
              }}
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-90 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add News Post
            </Button>
          </div>
        ) : addingType === "product" ? (
          <PostForm
            editingPost={editingPost}
            uniqueCategories={uniqueCategories}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsAdding(false);
              setEditingPost(null);
            }}
          />
        ) : (
          <NewsPostForm
            editingPost={editingNewsPost}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsAdding(false);
              setEditingNewsPost(null);
            }}
          />
        )}

        {/* Filter & Lists */}
        <PostsFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          uniqueCategories={uniqueCategories}
        />

        {/* Product Posts List */}
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

        {/* News Posts List */}
        <NewsPostsList
          posts={filteredNewsPosts}
          allPosts={newsPosts}
          selectedPosts={selectedNewsPosts}
          onToggleSelection={toggleNewsPostSelection}
          onEdit={handleEditNewsPost}
          onDelete={handleDeleteNewsPost}
          onBulkDelete={handleBulkDeleteNewsPosts}
          searchTerm={searchTerm}
          onAddPost={() => {
            setIsAdding(true);
            setAddingType("news");
          }}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
