import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-opacity-75 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30",
        destructive: "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/30",
        outline: "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:shadow-[0_0_8px_rgba(168,85,247,0.4)]",
        secondary: "bg-gray-700/20 text-gray-300 border border-gray-600/20 hover:bg-gray-700/30 hover:shadow-[0_0_8px_rgba(168,85,247,0.4)]",
        ghost: "text-gray-300 hover:bg-white/10 hover:text-white hover:shadow-[0_0_8px_rgba(168,85,247,0.4)]",
        link: "text-purple-400 underline-offset-4 hover:text-purple-300 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };