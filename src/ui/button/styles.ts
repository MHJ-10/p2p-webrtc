import { cva } from "class-variance-authority";

export const buttonVariants = cva("py-2  rounded-xl text-md transition-all", {
  variants: {
    variant: {
      primary:
        "bg-brand-600 hover:bg-brand-400 text-neutral-100 hover:text-brand-100",
      secondary: "bg-neutral-200 text-brand-600 hover:bg-neutral-300",
      tertiary: "bg-white text-neutral-600",
    },
    size: {
      full: "w-full",
      sm: "px-3",
      md: "px-6",
      lg: "w-60",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "sm",
  },
});
