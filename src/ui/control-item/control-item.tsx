import clsx from "clsx";
import type { ControlItemProps } from "./interface";

const ControlItem = (props: ControlItemProps) => {
  const { icon, onClick, label, badge, invented } = props;

  return (
    <div className="x relative flex w-fit flex-col items-center gap-1">
      <button
        className={clsx(
          "flex size-12 items-center justify-center rounded-xl bg-neutral-900 [&>svg]:!size-6 [&>svg]:stroke-2 [&>svg]:!text-neutral-100",
          { "!bg-feedback-800": invented },
        )}
        onClick={onClick}
      >
        {icon}
      </button>
      {!!label && (
        <p className="max-w-16 truncate text-sm font-medium text-neutral-100">
          {label}
        </p>
      )}

      {!!badge && !invented && (
        <span className="absolute -top-2 right-1 flex size-6 items-center justify-center rounded-full bg-feedback-800 text-neutral-200">
          {badge}
        </span>
      )}
    </div>
  );
};

export default ControlItem;
