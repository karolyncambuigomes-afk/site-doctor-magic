import React, { useState } from 'react';
import { OptimizedImage } from '@/components/OptimizedImage';
import { compressImage, convertToWebP } from '@/utils/imageOptimization';

interface ImageUploadProps {
  onImageUpload: (file: File, optimizedFile?: File) => void;
  maxSizeMB?: number;
  accept?: string;
  className?: string;
}

export const OptimizedImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  maxSizeMB = 5,
  accept = 'image/*',
  className = ''
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProgress(20);

    try {
      // Compress image
      const compressedBlob = await compressImage(file, 1200, 1800, 0.8);
      setProgress(60);

      // Convert to WebP for even better compression
      const webpBlob = await convertToWebP(file, 0.8);
      setProgress(80);

      // Create files from blobs
      const compressedFile = new File([compressedBlob], 
        file.name.replace(/\.[^/.]+$/, '.jpg'), 
        { type: 'image/jpeg' }
      );
      
      const webpFile = new File([webpBlob], 
        file.name.replace(/\.[^/.]+$/, '.webp'), 
        { type: 'image/webp' }
      );

      setProgress(100);

      // Use the smaller file
      const finalFile = webpBlob.size < compressedBlob.size ? webpFile : compressedFile;
      onImageUpload(file, finalFile);

      console.log(`Original: ${(file.size / 1024).toFixed(1)}KB → Optimized: ${(finalFile.size / 1024).toFixed(1)}KB`);
    } catch (error) {
      console.error('Image optimization failed:', error);
      onImageUpload(file); // Fallback to original
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={isProcessing}
        className="hidden"
        id="optimized-image-upload"
      />
      
      <label 
        htmlFor="optimized-image-upload"
        className={`
          block border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 
          text-center cursor-pointer hover:border-primary/50 transition-colors
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isProcessing ? (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Optimizing image...</div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">{progress}%</div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl">📸</div>
            <div className="text-sm font-medium">Upload & Auto-Optimize Image</div>
            <div className="text-xs text-muted-foreground">
              Automatically compresses and converts to optimal format
            </div>
          </div>
        )}
      </label>
    </div>
  );
};