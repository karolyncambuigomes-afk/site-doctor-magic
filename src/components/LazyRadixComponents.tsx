import React, { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Lazy load non-critical Radix components
const DropdownMenu = lazy(() => import('@/components/ui/dropdown-menu').then(module => ({
  default: module.DropdownMenu
})));

const DropdownMenuContent = lazy(() => import('@/components/ui/dropdown-menu').then(module => ({
  default: module.DropdownMenuContent
})));

const DropdownMenuItem = lazy(() => import('@/components/ui/dropdown-menu').then(module => ({
  default: module.DropdownMenuItem
})));

const DropdownMenuSeparator = lazy(() => import('@/components/ui/dropdown-menu').then(module => ({
  default: module.DropdownMenuSeparator
})));

const DropdownMenuTrigger = lazy(() => import('@/components/ui/dropdown-menu').then(module => ({
  default: module.DropdownMenuTrigger
})));

const Dialog = lazy(() => import('@/components/ui/dialog').then(module => ({
  default: module.Dialog
})));

const DialogContent = lazy(() => import('@/components/ui/dialog').then(module => ({
  default: module.DialogContent
})));

const DialogHeader = lazy(() => import('@/components/ui/dialog').then(module => ({
  default: module.DialogHeader
})));

const DialogTitle = lazy(() => import('@/components/ui/dialog').then(module => ({
  default: module.DialogTitle
})));

const DialogTrigger = lazy(() => import('@/components/ui/dialog').then(module => ({
  default: module.DialogTrigger
})));

const AlertDialog = lazy(() => import('@/components/ui/alert-dialog').then(module => ({
  default: module.AlertDialog
})));

const AlertDialogAction = lazy(() => import('@/components/ui/alert-dialog').then(module => ({
  default: module.AlertDialogAction
})));

const AlertDialogCancel = lazy(() => import('@/components/ui/alert-dialog').then(module => ({
  default: module.AlertDialogCancel
})));

const AlertDialogContent = lazy(() => import('@/components/ui/alert-dialog').then(module => ({
  default: module.AlertDialogContent
})));

const AlertDialogDescription = lazy(() => import('@/components/ui/alert-dialog').then(module => ({
  default: module.AlertDialogDescription
})));

const AlertDialogFooter = lazy(() => import('@/components/ui/alert-dialog').then(module => ({
  default: module.AlertDialogFooter
})));

const AlertDialogHeader = lazy(() => import('@/components/ui/alert-dialog').then(module => ({
  default: module.AlertDialogHeader
})));

const AlertDialogTitle = lazy(() => import('@/components/ui/alert-dialog').then(module => ({
  default: module.AlertDialogTitle
})));

const AlertDialogTrigger = lazy(() => import('@/components/ui/alert-dialog').then(module => ({
  default: module.AlertDialogTrigger
})));

// Loading wrapper for dropdown menus
const DropdownFallback = () => (
  <div className="w-48 h-32 bg-background border rounded-md shadow-md animate-pulse" />
);

// Loading wrapper for dialogs
const DialogFallback = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-background rounded-lg p-8 text-center max-w-sm w-full mx-4">
      <LoadingSpinner />
      <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
    </div>
  </div>
);

// Lazy wrapper components with fallbacks
export const LazyDropdownMenu: React.FC<any> = ({ children, ...props }) => (
  <Suspense fallback={null}>
    <DropdownMenu {...props}>
      {children}
    </DropdownMenu>
  </Suspense>
);

export const LazyDropdownMenuContent: React.FC<any> = ({ children, ...props }) => (
  <Suspense fallback={<DropdownFallback />}>
    <DropdownMenuContent {...props}>
      {children}
    </DropdownMenuContent>
  </Suspense>
);

export const LazyDropdownMenuItem: React.FC<any> = ({ children, ...props }) => (
  <Suspense fallback={null}>
    <DropdownMenuItem {...props}>
      {children}
    </DropdownMenuItem>
  </Suspense>
);

export const LazyDropdownMenuSeparator: React.FC<any> = (props) => (
  <Suspense fallback={null}>
    <DropdownMenuSeparator {...props} />
  </Suspense>
);

export const LazyDropdownMenuTrigger: React.FC<any> = ({ children, ...props }) => (
  <Suspense fallback={null}>
    <DropdownMenuTrigger {...props}>
      {children}
    </DropdownMenuTrigger>
  </Suspense>
);

export const LazyDialog: React.FC<any> = ({ children, ...props }) => (
  <Suspense fallback={null}>
    <Dialog {...props}>
      {children}
    </Dialog>
  </Suspense>
);

export const LazyDialogContent: React.FC<any> = ({ children, ...props }) => (
  <Suspense fallback={<DialogFallback />}>
    <DialogContent {...props}>
      {children}
    </DialogContent>
  </Suspense>
);

export const LazyDialogHeader: React.FC<any> = ({ children, ...props }) => (
  <Suspense fallback={null}>
    <DialogHeader {...props}>
      {children}
    </DialogHeader>
  </Suspense>
);

export const LazyDialogTitle: React.FC<any> = ({ children, ...props }) => (
  <Suspense fallback={null}>
    <DialogTitle {...props}>
      {children}
    </DialogTitle>
  </Suspense>
);

export const LazyDialogTrigger: React.FC<any> = ({ children, ...props }) => (
  <Suspense fallback={null}>
    <DialogTrigger {...props}>
      {children}
    </DialogTrigger>
  </Suspense>
);

export const LazyAlertDialog: React.FC<any> = ({ children, ...props }) => (
  <Suspense fallback={null}>
    <AlertDialog {...props}>
      {children}
    </AlertDialog>
  </Suspense>
);

export const LazyAlertDialogAction: React.FC<any> = ({ children, ...props }) => (
  <Suspense fallback={null}>
    <AlertDialogAction {...props}>
      {children}
    </AlertDialogAction>
  </Suspense>
);

export const LazyAlertDialogCancel: React.FC<any> = ({ children, ...props }) => (
  <Suspense fallback={null}>
    <AlertDialogCancel {...props}>
      {children}
    </AlertDialogCancel>
  </Suspense>
);

export const LazyAlertDialogContent: React.FC<any> = ({ children, ...props }) => (
  <Suspense fallback={<DialogFallback />}>
    <AlertDialogContent {...props}>
      {children}
    </AlertDialogContent>
  </Suspense>
);

export const LazyAlertDialogDescription: React.FC<any> = ({ children, ...props }) => (
  <Suspense fallback={null}>
    <AlertDialogDescription {...props}>
      {children}
    </AlertDialogDescription>
  </Suspense>
);

export const LazyAlertDialogFooter: React.FC<any> = ({ children, ...props }) => (
  <Suspense fallback={null}>
    <AlertDialogFooter {...props}>
      {children}
    </AlertDialogFooter>
  </Suspense>
);

export const LazyAlertDialogHeader: React.FC<any> = ({ children, ...props }) => (
  <Suspense fallback={null}>
    <AlertDialogHeader {...props}>
      {children}
    </AlertDialogHeader>
  </Suspense>
);

export const LazyAlertDialogTitle: React.FC<any> = ({ children, ...props }) => (
  <Suspense fallback={null}>
    <AlertDialogTitle {...props}>
      {children}
    </AlertDialogTitle>
  </Suspense>
);

export const LazyAlertDialogTrigger: React.FC<any> = ({ children, ...props }) => (
  <Suspense fallback={null}>
    <AlertDialogTrigger {...props}>
      {children}
    </AlertDialogTrigger>
  </Suspense>
);