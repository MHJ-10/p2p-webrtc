import { Avatar, Button } from "@/ui";

function App() {
  return (
    <div className="flex flex-col gap-20 p-20">
      <Button variant="primary" size="sm">
        Button
      </Button>

      <Avatar size="lg" name="Ali" />
    </div>
  );
}

export default App;
