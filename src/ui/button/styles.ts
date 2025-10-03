import { cva } from "class-variance-authority";

export const buttonVariants = cva("text-md rounded-xl py-2 transition-all", {
  variants: {
    variant: {
      primary:
        "bg-brand-600 text-neutral-100 hover:bg-brand-400 hover:text-brand-100",
      secondary: "bg-neutral-200 text-brand-600 hover:bg-neutral-300",
      tertiary: "bg-white text-neutral-600",
    },
    size: {
      full: "w-full",
      sm: "w-16",
      md: "w-28",
      lg: "w-60",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "sm",
  },
});
