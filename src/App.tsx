import {
  DoorOpen,
  MessageCircle,
  Mic,
  MicOff,
  Monitor,
  Video,
  VideoOff,
} from "lucide-react";
import { useReducer } from "react";

import { initialValue, videoCallReducer } from "@/reducers";
import { ControlItem, VideoCell } from "@/ui";

function App() {
  const [state, dispatch] = useReducer(videoCallReducer, initialValue);

  const isVideoActive = state.videoMedia.active;
  const isAudioActive = state.audioMedia.active;

  const onToolbarButtonClick = () => {
    console.log("clicked");
  };

  return (
    <div className="relative flex h-screen flex-col items-center justify-center gap-20 bg-neutral-800 font-inter">
      <div className="grid w-full grid-cols-1 gap-4 px-4 lg:grid-cols-2">
        <div className="col-span-1">
          <VideoCell
            displayName="Mohammad Hossein"
            srcObject={state.videoMedia.media}
          />
        </div>
        <div className="col-span-1">
          <VideoCell displayName="Reza" srcObject={state.videoMedia.media} />
        </div>
      </div>
      <div className="absolute bottom-3 flex w-full flex-row items-center justify-center gap-4">
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
          icon={isVideoActive ? <VideoOff /> : <Video />}
          label="Cam"
          invented={isVideoActive}
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
          icon={isAudioActive ? <MicOff /> : <Mic />}
          label="Mic"
          invented={isAudioActive}
        />
        <ControlItem
          onClick={onToolbarButtonClick}
          icon={<Monitor />}
          label="Share"
        />
        <ControlItem
          onClick={onToolbarButtonClick}
          icon={<MessageCircle />}
          label="Chat"
        />
        <ControlItem
          onClick={onToolbarButtonClick}
          icon={<DoorOpen />}
          label="Leave"
          invented
        />
      </div>
    </div>
  );
}

export default App;
