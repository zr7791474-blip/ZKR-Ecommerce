import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-md',

        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft',

        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20',

        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-soft',

        ghost:
          'hover:bg-accent hover:text-accent-foreground',

        link:
          'text-primary underline-offset-4 hover:underline',

        glass:
          'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-soft',
      },

      size: {
        default:
          'h-10 px-4 py-2',

        sm:
          'h-9 rounded-md px-3 text-xs',

        lg:
          'h-11 rounded-lg px-8 text-base',

        xl:
          'h-12 rounded-xl px-10 text-base font-semibold',

        icon:
          'h-10 w-10',
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

      {loading && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}

      {children}

    </button>
  );

});


Button.displayName = "Button";


export {
  Button,
  buttonVariants
};