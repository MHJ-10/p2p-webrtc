import { Button } from "@/ui";
import { Video } from "lucide-react";
import MeetImage from "@/assets/meet.png";

const HomePage = () => {
  return (
    <div className="flex h-screen items-center justify-center font-inter">
      <form className="grid h-[500px] w-3/4 grid-cols-5 gap-4 rounded-lg border-2 border-brand-300">
        <div className="col-span-2 flex items-center justify-center">
          <img className="drop-shadow-brand-500" src={MeetImage} alt="meet" />
        </div>

        <div className="col-span-3 flex flex-col items-center justify-center gap-6 rounded-r-lg bg-brand-200/50">
          <p className="text-5xl font-bold text-neutral-800">Video Call</p>
          <Button className="flex items-center justify-center gap-4" size="lg">
            <Video className="size-8" />
            <span>New Meeting </span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HomePage;
