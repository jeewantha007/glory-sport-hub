import { useEffect, useState } from 'react';

interface PreloaderProps {
  slug: string;
  type: 'post' | 'news';
  children: (data: any) => React.ReactNode;
}

export const Preloader = ({ slug, type, children }: PreloaderProps) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Import services dynamically to avoid circular dependencies
        const { postService } = await import('@/services/postService');
        const { newsPostService } = await import('@/services/newsPostService');
        
        let result;
        if (type === 'post') {
          result = await postService.fetchPosts();
          const post = result.data?.find((p: any) => p.slug === slug);
          setData(post || null);
        } else {
          result = await newsPostService.fetchNewsPosts();
          const newsPost = result.data?.find((p: any) => p.slug === slug);
          setData(newsPost || null);
        }
      } catch (error) {
        console.error('Preloader error:', error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, type]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse max-w-4xl mx-auto">
            <div className="h-8 bg-gray-800 rounded w-32 mb-8"></div>
            <div className="h-12 bg-gray-800 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-800 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-800 rounded w-5/6"></div>
              <div className="h-4 bg-gray-800 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children(data)}</>;
};
