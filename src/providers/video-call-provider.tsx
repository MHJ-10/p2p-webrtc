import React, { useReducer } from "react";

import { initialValue, videoCallReducer } from "@/reducers";
import { VideoCallContext } from "@/contexts";

export const VideoCallProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(videoCallReducer, initialValue);

  return (
    <VideoCallContext.Provider value={{ state, dispatch }}>
      {children}
    </VideoCallContext.Provider>
  );
};
