import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

const RoomPage = () => {
  const { roomId } = useParams();
  const socketRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const user = JSON.parse(sessionStorage.getItem("user")!);

  // send message via WebSocket
  const sendMessage = (msg: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    }
  };

  // start WebRTC
  const startWebRTC = async (isInitiator: boolean) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pcRef.current = pc;

    // ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendMessage({ type: "candidate", data: event.candidate });
      }
    };

    // remote track
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // local stream
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    if (isInitiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      sendMessage({ type: "offer", data: offer });
    }
  };

  // handle offer from peer
  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!pcRef.current) await startWebRTC(false);
    await pcRef.current!.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pcRef.current!.createAnswer();
    await pcRef.current!.setLocalDescription(answer);
    sendMessage({ type: "answer", data: answer });
  };

  // handle answer from peer
  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!pcRef.current) return;
    await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  // handle ICE candidate from peer
  const handleCandidate = async (candidate: RTCIceCandidateInit) => {
    if (!pcRef.current) return;
    await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
  };

  useEffect(() => {
    // connect WebSocket
    const socket = new WebSocket("ws://localhost:3000");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ Connected to WebSocket");
      sendMessage({ type: "join", roomId, user });
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 WS message:", data);

      switch (data.type) {
        case "waiting":
          console.log("⏳ Waiting for peer...");
          break;

        case "peer-joined":
          console.log("👥 Peer joined");

          // only the first user (initiator) should start the offer
          if (data.initiatorId === user.id) {
            startWebRTC(true);
          }
          break;

        case "offer":
          handleOffer(data.data);
          break;

        case "answer":
          handleAnswer(data.data);
          break;

        case "candidate":
          handleCandidate(data.data);
          break;

        default:
          console.log("⚠️ Unknown message", data);
      }
    };

    socket.onclose = () => console.log("❌ WebSocket disconnected");

    return () => {
      socket.close();
    };
  }, [roomId, user]);

  return (
    <div className="flex h-screen w-full items-center justify-center gap-4 bg-neutral-800 p-4 text-white">
      {/* Local video */}
      <div className="flex flex-col items-center">
        <h2 className="mb-2">You</h2>
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-64 rounded-lg border-2 border-brand-300"
        />
      </div>

      {/* Remote video */}
      <div className="flex flex-col items-center">
        <h2 className="mb-2">Peer</h2>
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-64 rounded-lg border-2 border-brand-300"
        />
      </div>
    </div>
  );
};

export default RoomPage;
