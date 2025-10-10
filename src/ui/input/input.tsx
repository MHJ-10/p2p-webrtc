import clsx from "clsx";

import type { InputProps } from "./interface";

const Input = (props: InputProps) => {
  const { size = "lg", ...rest } = props;
  return (
    <input
      className={clsx(
        "rounded-lg border border-neutral-400 px-2 py-3 text-base/5 font-medium text-neutral-800 transition-all outline-none placeholder:text-neutral-800 focus:border-neutral-600",
        {
          "w-40": size === "sm",
          "w-60": size === "md",
          "w-80": size === "lg",
          "w-full": size === "full",
        },
      )}
      {...rest}
    />
  );
};

export default Input;
