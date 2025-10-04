import { ControlItem, VideoCell } from "@/ui";
import {
  DoorOpen,
  MessageCircle,
  Mic,
  Monitor,
  Video,
  VideoOff,
} from "lucide-react";
import { useReducer } from "react";
import { videoCallReducer } from "./reducers/videoCallReducer";

function App() {
  const [state, dispatch] = useReducer(videoCallReducer, {
    userMedia: { active: false, media: null },
    chats: { show: false },
    displayMedia: { active: false, media: null },
  });

  const isCameraActive = state.userMedia.active;

  const onToolbarButtonClick = () => {
    console.log("test");
  };

  return (
    <div className="relative flex h-screen flex-col items-center justify-center gap-20 bg-neutral-800 font-inter">
      <div className="grid w-full grid-cols-1 gap-4 px-4 lg:grid-cols-2">
        <div className="col-span-1">
          <VideoCell
            displayName="Mohammad Hossein"
            srcObject={state.userMedia.media}
          />
        </div>
        <div className="col-span-1">
          <VideoCell displayName="Reza" srcObject={state.userMedia.media} />
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
          icon={isCameraActive ? <VideoOff /> : <Video />}
          label="Cam"
          invented={isCameraActive}
        />
        <ControlItem
          onClick={onToolbarButtonClick}
          icon={<Mic />}
          label="Mic"
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
