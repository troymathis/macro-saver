import { ButtonHTMLAttributes, FC, forwardRef } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const buttonVariants = cva(
  "active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offest-2 disable:opacity-50 dark:focus:ring-lime-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900",
  {
    variants: {
      variant: {
        default:
          "bg-lime-900 text-white hover:bg-lime-800 dark:bg-lime-200 dark:text-lime-900 dark:hover:bg-lime-100",
        outline:
          "bg-lime-900 text-white hover:bg-lime-900 dark:bg-lime-200 dark:text-lime-900 dark:hover:bg-lime-100 border-lime-200 hover:bg-lime-100 dark:border-lime-700",
        ghost:
          "bg-transparent hover:bg-lime-100 dark:hover:bg-lime-800 dark:text-lime-400 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent",
        link: "bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-lime-900 dark:text-lime-100 hover:bg-transparent dark:hover:bg-transparent",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button: FC<ButtonProps> = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant, isLoading, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button'

export default Button;
