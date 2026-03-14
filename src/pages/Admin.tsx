import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Package, Newspaper, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService, postService } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import StatsCards from "./admin/StatsCards";
import PostForm from "./admin/PostForm";
import PostsFilter from "./admin/PostsFilter";
import PostsList from "./admin/PostsList";
import AdminLayout from "@/components/admin/AdminLayout";
import { Post } from "@/integrations/supabase/types";

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [addingType, setAddingType] = useState<"product">("product");
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "products";

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    setCurrentPage(1);
  }, [posts, searchTerm, filterCategory, sortBy]);

  const fetchPosts = async () => {
    const { data: postData, error: postError } = await postService.fetchPosts();
    
    if (postError)
      toast({ title: "Error", description: "Failed to fetch posts", variant: "destructive" });
    else {
      setPosts(postData || []);
      setFilteredPosts(postData || []);
    }
  };

  const handleFormSuccess = () => {
    setIsAdding(false);
    setEditingPost(null);
    fetchPosts();
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setAddingType("product");
    setIsAdding(true);
    setSearchParams({ tab: "products" });
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


  const togglePostSelection = (id: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedPosts(newSelected);
  };


  const uniqueCategories = useMemo(() => 
    Array.from(new Set(posts.map((p) => p.category).filter(Boolean))),
    [posts]
  );

  const totalProductPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  const setActiveTab = (value: string) => {
    setSearchParams({ tab: value });
  };

  if (!session) return null;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your content and track performance</p>
          </div>
          <div className="flex items-center gap-3">
            {mounted && (
              <Button
                variant="outline"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                size="icon"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards posts={posts} />

        {/* Tabs for Products */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-[200px] grid-cols-1 mb-8 bg-muted/50 p-1">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Products ({posts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {!isAdding || addingType !== "product" ? (
              <div className="mb-8">
                <Button
                  onClick={() => {
                    setIsAdding(true);
                    setAddingType("product");
                    setEditingPost(null);
                  }}
                  size="lg"
                  className="bg-primary hover:opacity-90 shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Product Post
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

            {!isAdding || addingType !== "product" ? (
              <>
                <PostsFilter
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filterCategory={filterCategory}
                  setFilterCategory={setFilterCategory}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  uniqueCategories={uniqueCategories}
                />

                <PostsList
                  posts={paginatedProducts}
                  allPosts={posts}
                  selectedPosts={selectedPosts}
                  onToggleSelection={togglePostSelection}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onBulkDelete={handleBulkDelete}
                  searchTerm={searchTerm}
                  filterCategory={filterCategory}
                  onAddPost={() => {
                    setIsAdding(true);
                    setAddingType("product");
                  }}
                />

                {totalProductPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalProductPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(totalProductPages, prev + 1))}
                      disabled={currentPage === totalProductPages}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                )}
                
                {filteredPosts.length > 0 && (
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredPosts.length)} of {filteredPosts.length} products
                  </div>
                )}
              </>
            ) : null}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Admin;
