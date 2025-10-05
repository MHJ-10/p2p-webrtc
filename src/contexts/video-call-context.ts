import { createContext } from "react";

import type { VideoCallEvents, VideoCallState } from "@/reducers";

interface VideoContext {
  state: VideoCallState;
  dispatch: React.ActionDispatch<[action: VideoCallEvents]>;
}

export const VideoCallContext = createContext<VideoContext | undefined>(
  undefined,
);
