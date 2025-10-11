import {
  DoorOpen,
  MessageCircle,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  Video,
  VideoOff,
} from "lucide-react";

import { useVideoCall } from "@/hooks";
import { ControlItem } from "@/ui";

const Toolbar = () => {
  const { state, dispatch } = useVideoCall();

  const isVideoActive = state.videoMedia.active;
  const isAudioActive = state.audioMedia.active;
  const isMediaActive = state.displayMedia.active;

  return (
    <div className="mx-auto flex flex-row items-center gap-4">
      <ControlItem
        onClick={async () => {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });

          dispatch({
            type: "cameraShare",
            payload: {
              stream,
            },
          });
        }}
        icon={!isVideoActive ? <VideoOff /> : <Video />}
        label="Cam"
        invented={!isVideoActive}
      />
      <ControlItem
        onClick={async () => {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });

          dispatch({
            type: "microphoneShare",
            payload: {
              stream,
            },
          });
        }}
        icon={!isAudioActive ? <MicOff /> : <Mic />}
        label="Mic"
        invented={!isAudioActive}
      />
      <ControlItem
        onClick={() => console.log("monitor")}
        icon={!isMediaActive ? <MonitorOff /> : <Monitor />}
        label="Share"
        invented={!isMediaActive}
      />
      <ControlItem
        onClick={() => console.log("chat")}
        icon={<MessageCircle />}
        label="Chat"
      />
      <ControlItem
        onClick={() => window.close()}
        icon={<DoorOpen />}
        label="Leave"
        invented
      />
    </div>
  );
};

export default Toolbar;
