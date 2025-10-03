import { MessageBubble } from "@/ui";

function App() {
  return (
    <div className="flex flex-col gap-20 p-20  font-inter">
      <MessageBubble message="Hi team! How are things?" isOwn />
    </div>
  );
}

export default App;
