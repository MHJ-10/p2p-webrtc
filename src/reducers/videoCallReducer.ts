interface MediaStreamState {
  media: MediaProvider | null;
  active: boolean;
}

interface Chat {
  id: string;
  name?: string;
  message: string;
}

interface ChatState {
  converstations?: Chat[];
  show: boolean;
}

export type VideoCallEvents =
  | {
      type: "cameraShare";
      payload: { stream: MediaProvider };
    }
  | {
      type: "microphoneShare";
      payload: { stream: MediaProvider };
    }
  | {
      type: "screenShare";
      payload: { stream: MediaProvider };
    }
  | {
      type: "chat";
      payload: { chats: ChatState };
    }
  | {
      type: "leaveRoom";
    };

type VideoCallState = {
  userMedia: MediaStreamState;
  displayMedia: MediaStreamState;
  chats: ChatState;
};

export type ActionType = VideoCallEvents["type"];

export const videoCallReducer = (
  state: VideoCallState,
  action: VideoCallEvents,
): VideoCallState => {
  switch (action.type) {
    case "cameraShare":
      return {
        ...state,
        userMedia: state.userMedia.active
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
        userMedia: state.userMedia.active
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
      return { ...state, chats: action.payload.chats };
    case "leaveRoom":
      return state;
  }
};
