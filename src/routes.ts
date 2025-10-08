import { createBrowserRouter } from "react-router";

import { HomePage, RoomPage } from "@/pages";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/room",
    Component: RoomPage,
  },
]);
