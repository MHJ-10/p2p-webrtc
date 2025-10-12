import { createRoom } from "@/services";
import { Button, Input } from "@/ui";
import { Video } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [info, setInfo] = useState<{ name: string; saved: boolean }>({
    name: JSON.parse(localStorage.getItem("user")!).name,
    saved: false,
  });

  const onCreateRoom = async () => {
    try {
      const res = await createRoom();
      const generatedRoomId = res.data.roomId;
      navigate(`/room/${generatedRoomId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const joinRoom = () => {
    navigate(`/room/${roomId.trim()}`);
  };

  const saveUser = () => {
    setInfo((prev) => ({ ...prev, saved: true }));
    const user = { name: info.name, id: crypto.randomUUID() };
    localStorage.setItem("user", JSON.stringify(user));
  };

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-700/30 font-inter">
      <div className="grid h-[500px] w-3/4 grid-cols-1 rounded-lg border-2 border-brand-300 md:grid-cols-5">
        <div className="flex h-full items-center justify-center md:col-span-2">
          <p className="animate-pulse bg-linear-to-r from-brand-300 to-brand-700 bg-clip-text text-center text-3xl font-bold text-transparent md:text-4xl lg:text-6xl">
            P2P Video Call
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 bg-brand-300/40 px-8 py-16 md:col-span-3 md:rounded-r-lg md:px-12 md:py-0 lg:px-16 xl:px-20">
          <div className="flex w-full flex-col gap-2 lg:flex-row">
            <Input
              size="full"
              value={info.name}
              onChange={(e) =>
                setInfo((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter your name"
            />
            <Button
              size="lg"
              className="w-full lg:w-60"
              variant="primary"
              disabled={!info.name.trim()}
              onClick={saveUser}
            >
              Save
            </Button>
          </div>

          <div className="mx-auto h-0.5 w-full space-y-4 rounded-full bg-brand-700" />

          <Button
            className="flex w-full items-center justify-center gap-4"
            size="lg"
            onClick={onCreateRoom}
            disabled={!info.name}
          >
            <Video className="size-8" />
            <span>New Meeting </span>
          </Button>
          <div className="flex w-full flex-col gap-2 lg:flex-row">
            <Input
              size="full"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter the room id"
            />
            <Button
              size="lg"
              className="w-full lg:w-60"
              variant="secondary"
              disabled={!roomId.trim() || !info.name}
              onClick={joinRoom}
            >
              Join
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
