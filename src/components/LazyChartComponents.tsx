import React, { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Lazy load recharts components
const ChartContainer = lazy(() => import('@/components/ui/chart').then(module => ({
  default: module.ChartContainer
})));

const ChartTooltip = lazy(() => import('@/components/ui/chart').then(module => ({
  default: module.ChartTooltip
})));

const ChartTooltipContent = lazy(() => import('@/components/ui/chart').then(module => ({
  default: module.ChartTooltipContent
})));

interface LazyChartProps {
  config: any;
  children: React.ReactNode;
  className?: string;
}

export const LazyChartContainer: React.FC<LazyChartProps> = ({ config, children, className }) => {
  return (
    <Suspense fallback={
      <Card className={className}>
        <CardHeader>
          <CardTitle>Carregando gráfico...</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <LoadingSpinner />
        </CardContent>
      </Card>
    }>
      <ChartContainer config={config} className={className}>
        {children as React.ReactElement}
      </ChartContainer>
    </Suspense>
  );
};

export const LazyChartTooltip = ({ children, ...props }: any) => {
  return (
    <Suspense fallback={null}>
      <ChartTooltip {...props}>
        {children}
      </ChartTooltip>
    </Suspense>
  );
};

export const LazyChartTooltipContent = (props: any) => {
  return (
    <Suspense fallback={null}>
      <ChartTooltipContent {...props} />
    </Suspense>
  );
};