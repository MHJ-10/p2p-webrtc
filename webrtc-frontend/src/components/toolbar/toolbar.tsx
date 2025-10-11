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
import { useNavigate } from "react-router";

const Toolbar = () => {
  const { state, dispatch } = useVideoCall();

  const navigate = useNavigate();

  const isVideoActive = state.videoMedia.active;
  const isAudioActive = state.audioMedia.active;
  const isMediaActive = state.displayMedia.active;

  return <></>;
};

export default Toolbar;
