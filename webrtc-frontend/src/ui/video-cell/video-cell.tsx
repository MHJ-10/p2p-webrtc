import { type ComponentProps } from "react";

import BackgroundImage from "@/assets/video-background.png";

interface VideoCellProps extends ComponentProps<"video"> {
  displayName: string;
  isActive: boolean;
}

const VideoCell = (props: VideoCellProps) => {
  const { displayName, isActive, ref, ...rest } = props;

  return (
    <div className="relative w-full rounded-lg border-red-500">
      {isActive ? (
        <video className="size-full rounded-lg" ref={ref} {...rest} autoPlay />
      ) : (
        <img
          src={BackgroundImage}
          alt="background"
          className="size-full rounded-lg object-cover"
        />
      )}

      <span className="absolute bottom-2 left-2 rounded-sm bg-neutral-800 px-1 py-0.5 text-sm font-medium text-neutral-100">
        {displayName}
      </span>
    </div>
  );
};

export default VideoCell;
