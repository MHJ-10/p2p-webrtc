import { Button, VideoCell } from "@/ui";
import { useRef } from "react";

function App() {
  const ownVideoRef = useRef<HTMLVideoElement>(null);

  const onVideoStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (ownVideoRef.current) {
      ownVideoRef.current.srcObject = stream;
    }
  };

  return (
    <div className="flex flex-col gap-20 p-20 font-inter">
      <Button size="lg" onClick={onVideoStream}>
        Share Own Webcam
      </Button>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <VideoCell displayName="Mohammad Hossein" ref={ownVideoRef} />
        </div>
        <div className="col-span-1">
          <VideoCell displayName="Reza" />
        </div>
      </div>
    </div>
  );
}

export default App;
