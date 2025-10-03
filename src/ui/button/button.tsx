import type { ButtonProps } from "./interface";
import { buttonVariants } from "./styles";

export const Button = (props: ButtonProps) => {
  const { children, variant, size, className } = props;
  return (
    <button
      className={`${buttonVariants({
        variant,
        size,
        className,
      })}`}
    >
      {children}
    </button>
  );
};
