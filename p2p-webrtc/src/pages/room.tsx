import { Toolbar } from "@/components";
import { useVideoCall } from "@/hooks";
import { checkRoomExist } from "@/services";
import { VideoCell } from "@/ui";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";

const RoomPage = () => {
  const { roomId } = useParams();
  const { state, dispatch } = useVideoCall();
  const navigate = useNavigate();

  const socketRef = useRef<WebSocket>(null);
  const connectionRef = useRef<RTCPeerConnection | null>(null);

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

  const createOffer = async (pc: RTCPeerConnection) => {
    const offer = await pc.createOffer();
    pc.setLocalDescription(offer);
  };

  useEffect(() => {
    connectionRef.current = new RTCPeerConnection();
    const pc = connectionRef.current;
    createOffer(pc);
  }, []);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:3001");

    const sokcet = socketRef.current;

    sokcet.onopen = () => {
      sokcet.send(JSON.stringify({ type: "join-room", roomId }));
    };

    sokcet.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "joined-room") {
        dispatch({
          type: "addUser",
          payload: {
            user: {
              name: data.isInitiator ? "One" : "Two",
              isInitiator: data.isInitiator,
              sdp: connectionRef.current?.localDescription,
            },
          },
        });
      }
    };

    return () => {
      if (sokcet) {
        sokcet.close();
      }
    };
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
