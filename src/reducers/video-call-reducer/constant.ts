import type { VideoCallState } from "./interace";

export const initialValue: VideoCallState = {
  videoMedia: {
    active: false,
    media: null,
  },
  audioMedia: {
    active: false,
    media: null,
  },
  displayMedia: {
    active: false,
    media: null,
  },
  chats: {
    show: false,
  },
};
