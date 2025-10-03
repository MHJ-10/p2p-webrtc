import type { ButtonProps } from "./interface";
import { buttonVariants } from "./styles";

const Button = (props: ButtonProps) => {
  const { children, variant, size, className, ...rest } = props;
  return (
    <button
      className={`${buttonVariants({
        variant,
        size,
        className,
      })}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
