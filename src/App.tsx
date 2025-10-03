import { ControlItem } from "@/ui";
import { CameraOff } from "lucide-react";

function App() {
  return (
    <div className="flex flex-col gap-20 p-20 font-inter">
      <ControlItem
        icon={<CameraOff />}
        onClick={() => console.log("hello")}
        label="Camera"
        badge={2}
      />
    </div>
  );
}

export default App;
