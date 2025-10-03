import clsx from "clsx";

import type { MessageBubbleProps } from "./interface";

const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  return (
    <div
      className={clsx(
        "w-fit rounded-[20px] bg-brand-100 px-3 py-2 text-sm font-medium text-neutral-900",
        {
          "!bg-neutral-200": isOwn,
        },
      )}
    >
      {message}
    </div>
  );
};

export default MessageBubble;
