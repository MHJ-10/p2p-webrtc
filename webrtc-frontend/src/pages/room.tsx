import { ControlItem } from "@/ui";
import {
  DoorOpen,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  Video,
  VideoOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

const RoomPage = () => {
  const { roomId } = useParams();
  const socketRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const [status, setStatus] = useState<{
    video?: boolean;
    audio?: boolean;
    screen?: boolean;
  }>();

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localScreenRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteScreenRef = useRef<HTMLVideoElement | null>(null);

  const user = JSON.parse(sessionStorage.getItem("user")!);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:3000/");
    pcRef.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: ["stun:stun.l.google.com:19302"],
        },
      ],
    });
    const socket = socketRef.current;
    const connection = pcRef.current;

    connection.onnegotiationneeded = async () => {
      try {
        const offer = await connection.createOffer();
        await connection.setLocalDescription(offer);
        socket.send(
          JSON.stringify({
            type: "offer",
            roomId,
            userId: user.id,
            payload: offer,
          }),
        );
      } catch (err) {
        console.error("Negotiation error:", err);
      }
    };

    connection.ontrack = (event) => {
      const stream = event.streams[0] || new MediaStream([event.track]);
      const isScreen = event.transceiver.mid === "0";
      if (isScreen) {
        remoteScreenRef.current!.srcObject = stream;
      } else {
        remoteVideoRef.current!.srcObject = stream;
      }
    };

    connection.onicecandidate = async (e) => {
      if (e.candidate) {
        socket.send(
          JSON.stringify({
            type: "candidate",
            userId: user.id,
            roomId,
            payload: e.candidate,
          }),
        );
      }
    };

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "join",
          roomId: roomId || "",
          userId: user.id,
        }),
      );
    };

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case "ready":
          if (message.number === 1) return;
          else {
            // const offer = await connection.createOffer();
            // connection.setLocalDescription(offer);
            // socket.send(
            //   JSON.stringify({
            //     type: "offer",
            //     roomId,
            //     userId: user.id,
            //     payload: offer,
            //   }),
            // );
          }
          break;
        case "offer":
          {
            await connection.setRemoteDescription(message.payload);
            const answer = await connection.createAnswer();
            connection.setLocalDescription(answer);
            socket.send(
              JSON.stringify({
                type: "answer",
                roomId,
                userId: user.id,
                payload: answer,
              }),
            );
          }
          break;
        case "answer":
          {
            await connection.setRemoteDescription(message.payload);
          }
          break;
        case "candidate": {
          try {
            if (message.payload) {
              await connection.addIceCandidate(
                new RTCIceCandidate(message.payload),
              );
            }
          } catch (err) {
            console.error("❌ Error adding received ICE candidate", err);
          }
          break;
        }
      }
    };

    return () => {
      socket.close();
      connection.close();
    };
  }, [roomId, user.id]);

  const shareVideo = async () => {
    if (status?.video) {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
        setStatus((prev) => ({ ...prev, video: false }));
      }
    } else {
      if (pcRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach((t) => {
          t.contentHint = "camera";
          pcRef.current!.addTrack(t, stream);
        });

        setStatus((prev) => ({ ...prev, video: true }));
      }
    }
  };

  const shareScreen = async () => {
    if (status?.screen) {
      if (localScreenRef.current) {
        localScreenRef.current.srcObject = null;
        setStatus((prev) => ({ ...prev, screen: false }));
      }
    } else {
      if (pcRef.current) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        if (localScreenRef.current) {
          localScreenRef.current.srcObject = stream;
        }

        stream.getTracks().forEach((t) => {
          t.contentHint = "screen";
          pcRef.current!.addTrack(t, stream);
        });

        setStatus((prev) => ({ ...prev, screen: true }));
      }
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center gap-4 bg-neutral-800 p-4 text-white">
      <div className="grid grid-cols-2 [&>video]:border [&>video]:border-red-500">
        <video
          className="size-full rounded-lg"
          width={200}
          height={200}
          autoPlay
          ref={localVideoRef}
        />
        <video
          className="size-full rounded-lg"
          width={200}
          height={200}
          autoPlay
          ref={localScreenRef}
        />
        <video
          className="size-full rounded-lg"
          width={200}
          height={200}
          autoPlay
          ref={remoteVideoRef}
        />
        <video
          className="size-full rounded-lg"
          width={200}
          height={200}
          autoPlay
          ref={remoteScreenRef}
        />
      </div>

      <div className="fixed bottom-5 flex gap-4">
        <ControlItem
          icon={status?.video ? <Video /> : <VideoOff />}
          invented={!status?.video}
          label="Cam"
          onClick={shareVideo}
        />
        <ControlItem
          icon={status?.video ? <Mic /> : <MicOff />}
          invented={!status?.audio}
          label="Audio"
          onClick={() => console.log("first")}
        />
        <ControlItem
          icon={status?.screen ? <Monitor /> : <MonitorOff />}
          invented={!status?.screen}
          label="Screen"
          onClick={shareScreen}
        />
        <ControlItem
          icon={<DoorOpen />}
          invented
          label="Leave"
          onClick={() => {
            console.log("local", localVideoRef.current?.srcObject);
            console.log("remote", remoteVideoRef.current?.srcObject);
          }}
        />
      </div>
    </div>
  );
};

export default RoomPage;
