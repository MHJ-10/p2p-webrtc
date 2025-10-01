import type { ButtonProps } from "./interface";
import { buttonVariants } from "./styles";

export const Button = (props: ButtonProps) => {
  const { children, variant, size } = props;
  return (
    <button
      className={`${buttonVariants({
        variant,
        size,
      })}`}
    >
      {children}
    </button>
  );
};
