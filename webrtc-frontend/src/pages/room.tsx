import { useVideoCall } from "@/hooks";
import { checkRoomExist } from "@/services";
import { ControlItem, VideoCell } from "@/ui";
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
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";

const RoomPage = () => {
  const { roomId } = useParams();
  const { state, dispatch } = useVideoCall();
  const navigate = useNavigate();

  const socketRef = useRef<WebSocket>(null);
  const connectionRef = useRef<RTCPeerConnection | null>(null);

  const isVideoActive = state.videoMedia.active;
  const isAudioActive = state.audioMedia.active;
  const isMediaActive = state.displayMedia.active;

  console.log(state);

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

    if (state.videoMedia.active) {
      connectionRef.current.addTrack(
        state.videoMedia.media!.getVideoTracks()[0],
        state.videoMedia.media!,
      );
    }

    if (state.audioMedia.active) {
      connectionRef.current.addTrack(
        state.audioMedia.media!.getAudioTracks()[0],
        state.audioMedia.media!,
      );
    }
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
        socketRef.current?.send(
          JSON.stringify({
            type: "signal",
            roomId,
            payload: connectionRef.current!.localDescription,
          }),
        );
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

      if (data.type === "signal") {
        const payload = data.payload;
        connectionRef.current?.setRemoteDescription(payload);
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
        <div className="mx-auto flex flex-row items-center gap-4">
          <ControlItem
            onClick={async () => {
              const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: state.audioMedia.active,
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
                video: state.videoMedia.active,
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
            onClick={() => {
              socketRef.current?.send(JSON.stringify({ type: "leave-room" }));
              navigate("/");
            }}
            icon={<DoorOpen />}
            label="Leave"
            invented
          />
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
