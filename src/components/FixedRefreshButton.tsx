import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';
import { useNuclearCacheClear } from '@/hooks/useNuclearCacheClear';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { toast } from 'sonner';

export const FixedRefreshButton = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { forceFreshBlogData } = useNuclearCacheClear();
  const { refetch } = useBlogPosts();

  const handleGlobalRefresh = async () => {
    setRefreshing(true);
    try {
      await forceFreshBlogData();
      await refetch();
      // Force page reload to refresh all content
      window.location.reload();
    } catch (error) {
      toast.error('Failed to refresh content');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-50">
      <Button
        onClick={handleGlobalRefresh}
        disabled={refreshing}
        size="sm"
        className="shadow-elegant hover:shadow-luxury transition-all duration-300 bg-secondary text-secondary-foreground hover:bg-secondary/90"
        title="Refresh content from database"
      >
        {refreshing ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <RefreshCw className="w-4 h-4 mr-2" />
        )}
        Refresh
      </Button>
    </div>
  );
};