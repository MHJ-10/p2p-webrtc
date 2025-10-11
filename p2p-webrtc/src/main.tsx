import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "@/routes";
import { VideoCallProvider } from "@/providers";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VideoCallProvider>
      <RouterProvider router={router} />
    </VideoCallProvider>
  </StrictMode>,
);
