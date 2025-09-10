import React, { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Lazy load Embla Carousel components
const Carousel = lazy(() => import('@/components/ui/carousel').then(module => ({
  default: module.Carousel
})));

const CarouselContent = lazy(() => import('@/components/ui/carousel').then(module => ({
  default: module.CarouselContent
})));

const CarouselItem = lazy(() => import('@/components/ui/carousel').then(module => ({
  default: module.CarouselItem
})));

const CarouselNext = lazy(() => import('@/components/ui/carousel').then(module => ({
  default: module.CarouselNext
})));

const CarouselPrevious = lazy(() => import('@/components/ui/carousel').then(module => ({
  default: module.CarouselPrevious
})));

// Loading fallback for carousel
const CarouselFallback = ({ className }: { className?: string }) => (
  <div className={`flex items-center justify-center h-64 bg-muted rounded-lg ${className || ''}`}>
    <div className="text-center">
      <LoadingSpinner />
      <p className="mt-4 text-sm text-muted-foreground">Carregando carousel...</p>
    </div>
  </div>
);

// Lazy wrapper components
export const LazyCarousel: React.FC<any> = ({ children, className, ...props }) => (
  <Suspense fallback={<CarouselFallback className={className} />}>
    <Carousel className={className} {...props}>
      {children}
    </Carousel>
  </Suspense>
);

export const LazyCarouselContent: React.FC<any> = ({ children, ...props }) => (
  <Suspense fallback={null}>
    <CarouselContent {...props}>
      {children}
    </CarouselContent>
  </Suspense>
);

export const LazyCarouselItem: React.FC<any> = ({ children, ...props }) => (
  <Suspense fallback={null}>
    <CarouselItem {...props}>
      {children}
    </CarouselItem>
  </Suspense>
);

export const LazyCarouselNext: React.FC<any> = (props) => (
  <Suspense fallback={null}>
    <CarouselNext {...props} />
  </Suspense>
);

export const LazyCarouselPrevious: React.FC<any> = (props) => (
  <Suspense fallback={null}>
    <CarouselPrevious {...props} />
  </Suspense>
);