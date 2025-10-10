import type { VideoCallEvents, VideoCallState } from "./interace";

export const videoCallReducer = (
  state: VideoCallState,
  action: VideoCallEvents,
): VideoCallState => {
  switch (action.type) {
    case "cameraShare":
      return {
        ...state,
        videoMedia: state.videoMedia.active
          ? {
              active: false,
              media: null,
            }
          : {
              media: action.payload.stream,
              active: true,
            },
      };
    case "microphoneShare":
      return {
        ...state,
        audioMedia: state.audioMedia.active
          ? {
              active: false,
              media: null,
            }
          : {
              media: action.payload.stream,
              active: true,
            },
      };
    case "screenShare":
      return {
        ...state,
        displayMedia: state.displayMedia.active
          ? {
              active: false,
              media: null,
            }
          : {
              media: action.payload.stream,
              active: true,
            },
      };
    case "chat":
      return {
        ...state,
        chats: action.payload.chats,
      };
    case "addUser":
      return {
        ...state,
        users: [...state.users, action.payload.user],
      };
    case "leaveRoom":
      return state;
  }
};
