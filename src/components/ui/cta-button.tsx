import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { trackEvent } from "@/utils/tracking"

const ctaButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-elegant hover:shadow-luxury hover:scale-105",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-minimal hover:shadow-elegant hover:scale-105",
        outline: "border border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-minimal hover:shadow-elegant hover:scale-105",
        ghost: "text-primary hover:bg-primary/10 hover:scale-105",
        hero: "px-6 py-2 text-xs uppercase tracking-[0.25em] font-light border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300",
        whatsapp: "bg-green-600 text-white hover:bg-green-700 shadow-elegant hover:shadow-luxury hover:scale-105",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        default: "h-10 px-4 py-2 text-sm",
        lg: "h-11 px-8 text-base",
        hero: "px-6 py-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface CTAButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ctaButtonVariants> {
  children: React.ReactNode
  trackingLabel?: string
  trackingCategory?: string
}

const CTAButton = React.forwardRef<HTMLButtonElement, CTAButtonProps>(
  ({ className, variant, size, children, trackingLabel, trackingCategory = 'cta', onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (trackingLabel) {
        trackEvent('cta_click', trackingCategory, trackingLabel);
      }
      onClick?.(e);
    };
    
    return (
      <button
        className={cn(ctaButtonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        data-tracking-label={trackingLabel}
        data-tracking-category={trackingCategory}
        {...props}
      >
        {children}
      </button>
    )
  }
)
CTAButton.displayName = "CTAButton"

export { CTAButton, ctaButtonVariants }