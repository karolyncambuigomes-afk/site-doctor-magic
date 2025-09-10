// Debug panel for image loading issues
import React, { useState } from 'react';
import { syncModelMainImages } from '@/utils/modelImageSyncManager';
import { forceImageRefresh } from '@/utils/imageCacheBuster';

export const ImageDebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const result = await syncModelMainImages();
      setSyncResult(result);
      console.log('🔄 [DEBUG-PANEL] Sync result:', result);
    } catch (error) {
      console.error('❌ [DEBUG-PANEL] Sync error:', error);
      setSyncResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceRefresh = () => {
    forceImageRefresh();
    console.log('🔄 [DEBUG-PANEL] Forced image refresh');
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <>
      {/* Debug Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-red-500 text-white px-3 py-2 rounded-full text-sm shadow-lg hover:bg-red-600 transition-colors"
        >
          🐛 Debug Images
        </button>
      </div>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 max-w-sm">
          <div className="space-y-3">
            <h3 className="font-bold text-sm">Image Debug Panel</h3>
            
            <div className="space-y-2">
              <button
                onClick={handleSync}
                disabled={isLoading}
                className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'Checking...' : 'Check Model Images'}
              </button>
              
              <button
                onClick={handleForceRefresh}
                className="w-full bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600"
              >
                Force Refresh All Images
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-orange-500 text-white px-3 py-2 rounded text-sm hover:bg-orange-600"
              >
                Hard Reload Page
              </button>
            </div>

            {syncResult && (
              <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                <div className="font-semibold">
                  Status: {syncResult.success ? '✅' : '❌'}
                </div>
                {syncResult.modelsToUpdate && (
                  <div className="mt-1">
                    Models needing sync: {syncResult.modelsToUpdate.length}
                  </div>
                )}
                {syncResult.error && (
                  <div className="text-red-500 mt-1">
                    Error: {syncResult.error}
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-gray-500 text-xs hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};