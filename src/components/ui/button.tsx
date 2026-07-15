import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.97] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-warm text-warm-foreground shadow-[0_4px_20px_-4px_hsl(var(--warm)/0.5)] hover:shadow-[0_8px_28px_-4px_hsl(var(--warm)/0.65)] hover:brightness-95',

        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft',

        outline:
          'border border-foreground/10 bg-foreground/[0.02] backdrop-blur-sm text-foreground hover:bg-foreground/[0.05] hover:border-foreground/20',

        secondary:
          'bg-primary text-primary-foreground border border-primary-foreground/[0.15] shadow-[0_4px_16px_-4px_hsl(var(--primary)/0.5)] hover:bg-primary/90 hover:shadow-[0_6px_22px_-4px_hsl(var(--primary)/0.6)]',

        ghost:
          'hover:bg-foreground/[0.05] hover:text-accent-foreground',

        link:
          'text-primary underline-offset-4 hover:underline rounded-none',

        glass:
          'bg-foreground/[0.05] backdrop-blur-md border border-foreground/[0.1] text-foreground hover:bg-foreground/[0.1] shadow-soft',
      },

      size: {
        default:
          'h-10 px-5 py-2',

        sm:
          'h-9 rounded-full px-4 text-xs',

        lg:
          'h-11 rounded-full px-8 text-base',

        xl:
          'h-12 rounded-full px-10 text-base font-semibold',

        icon:
          'h-10 w-10 rounded-full',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}


const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
(
  {
    className,
    variant,
    size,
    asChild = false,
    loading = false,
    children,
    disabled,
    ...props
  },
  ref
) => {

  const classes = cn(
    buttonVariants({
      variant,
      size,
    }),
    className
  );


  if (asChild) {
    return (
      <Slot
        ref={ref}
        className={classes}
        {...props}
      >
        {children}
      </Slot>
    );
  }


  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {variant === 'default' && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
      )}

      {loading && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}

      <span className="relative z-[1] inline-flex items-center gap-2">
        {children}
      </span>

    </button>
  );

});


Button.displayName = "Button";


export {
  Button,
  buttonVariants
};