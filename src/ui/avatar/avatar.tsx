import clsx from "clsx";
import { User } from "lucide-react";

import type { AvatarProps } from "./interface";

const Avatar = (props: AvatarProps) => {
  const { size } = props;

  const hasName = !!props.name;
  const showName = hasName && props.size === "lg";

  return (
    <div
      className={clsx("flex flex-col items-center gap-1 overflow-hidden", {
        "size-8": size === "sm",
        "h-28 w-20": size === "lg",
      })}
    >
      <div
        className={clsx(
          "flex items-center justify-center rounded-lg bg-brand-900 [&>*]:text-brand-300 [&>svg]:stroke-[1.5px]",
          {
            "size-full [&>svg]:size-full": size === "sm",
            "size-20 [&>svg]:size-14": size === "lg",
          },
        )}
      >
        {hasName ? (
          <span
            className={clsx("text-brand-300", {
              "text-base font-medium": size === "sm",
              "text-4xl font-bold": size === "lg",
            })}
          >
            {props.name!.slice(0, 1)}
          </span>
        ) : (
          <User />
        )}
      </div>

      {showName && (
        <p
          className={clsx(
            "truncate text-center text-sm font-medium text-neutral-900",
            {
              "!w-8": size === "sm",
              "!w-20": size === "lg",
            },
          )}
        >
          {props.name}
        </p>
      )}
    </div>
  );
};

export default Avatar;
