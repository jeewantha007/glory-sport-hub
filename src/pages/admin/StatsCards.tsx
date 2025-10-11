import { BarChart3, FolderOpen, Tag, Star } from "lucide-react";

interface Post {
  id: string;
  category: string;
  tags: string[];
  is_featured?: boolean;
}

interface StatsCardsProps {
  posts: Post[];
}

const StatsCards = ({ posts }: StatsCardsProps) => {
  const uniqueCategories = Array.from(new Set(posts.map(p => p.category).filter(Boolean)));
  const totalTags = new Set(posts.flatMap(p => p.tags || [])).size;
  const featuredCount = posts.filter(p => p.is_featured).length;

  return (
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
        <div className="text-3xl font-bold mb-1">{uniqueCategories.length}</div>
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
          <div className="p-3 bg-yellow-500/10 rounded-lg">
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
        <div className="text-3xl font-bold mb-1">{featuredCount}</div>
        <div className="text-sm text-muted-foreground">Featured</div>
      </div>
    </div>
  );
};

export default StatsCards;