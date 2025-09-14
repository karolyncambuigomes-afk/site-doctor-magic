import React, { useEffect, useState } from 'react';
import { runBlogMigration } from '@/utils/runBlogMigration';
import { checkMigrationStatus } from '@/utils/migrateBlogData';

export const BlogMigrationTrigger: React.FC = () => {
  const [hasMigrated, setHasMigrated] = useState(false);

  useEffect(() => {
    const executeMigration = async () => {
      if (!hasMigrated) {
        try {
          // Check if migration is needed
          const status = await checkMigrationStatus();
          
          if (status.needsMigration && status.missingPosts > 0) {
            console.log(`Executing blog migration for ${status.missingPosts} missing posts`);
            await runBlogMigration();
            setHasMigrated(true);
          }
        } catch (error) {
          console.error('Migration error:', error);
        }
      }
    };

    // Execute migration immediately
    executeMigration();
  }, [hasMigrated]);

  return null; // This component doesn't render anything
};