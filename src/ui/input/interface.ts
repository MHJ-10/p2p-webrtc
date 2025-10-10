import type { ComponentProps } from "react";

export interface InputProps extends Omit<ComponentProps<"input">, "size"> {
  size?: "sm" | "md" | "lg" | "full";
}
