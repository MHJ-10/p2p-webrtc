import { use } from "react";

import { VideoCallContext } from "@/contexts";

export const useVideoCall = () => {
  const context = use(VideoCallContext);

  if (!context) throw new Error("Context must be use inside the provider");

  return context;
};
