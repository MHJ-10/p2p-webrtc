import React, { useEffect, useRef, type ComponentProps } from "react";

import BackgroundImage from "@/assets/video-background.png";

interface VideoCellProps extends ComponentProps<"video"> {
  displayName: string;
  srcObject: MediaProvider | null;
}

const VideoCell = (props: VideoCellProps) => {
  const { displayName, srcObject, ...rest } = props;

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = srcObject;
    }
  }, [srcObject]);

  return (
    <div className="relative max-h-[390px] w-full rounded-lg border-red-500">
      {srcObject ? (
        <video
          className="size-full rounded-lg"
          ref={videoRef}
          {...rest}
          autoPlay
        />
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
