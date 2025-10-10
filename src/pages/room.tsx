import { Toolbar } from "@/components";
import { useVideoCall } from "@/hooks";
import { checkRoomExist } from "@/services";
import { VideoCell } from "@/ui";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

const RoomPage = () => {
  const { roomId } = useParams();
  const { state } = useVideoCall();
  const navigate = useNavigate();

  const checkRoomId = async () => {
    try {
      await checkRoomExist(roomId!);
    } catch (err) {
      if (err) navigate("/");
    }
  };

  useEffect(() => {
    checkRoomId();
  }, []);

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
      <div className="absolute bottom-3">
        <Toolbar />
      </div>
    </div>
  );
};

export default RoomPage;
