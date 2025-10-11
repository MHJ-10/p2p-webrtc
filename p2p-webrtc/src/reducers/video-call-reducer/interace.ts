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

interface User {
  name: string;
  isInitiator: boolean;
  sdp?: RTCSessionDescriptionInit | null;
  candidate?: RTCIceCandidate | null;
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
      type: "addUser";
      payload: { user: User };
    }
  | {
      type: "leaveRoom";
    };

export interface VideoCallState {
  videoMedia: MediaStreamState;
  audioMedia: MediaStreamState;
  displayMedia: MediaStreamState;
  chats: ChatState;
  users: User[];
}
