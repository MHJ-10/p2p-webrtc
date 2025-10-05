import { CallRoom } from "@/components";
import { VideoCallProvider } from "@/providers";

function App() {
  return (
    <VideoCallProvider>
      <CallRoom />
    </VideoCallProvider>
  );
}

export default App;
