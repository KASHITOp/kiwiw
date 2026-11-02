import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/600.css";
import "./fonts/kit";
import "./styles.css";
import Landing from "./pages/Landing";
import Editor from "./pages/Editor";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/editor", element: <Editor /> },
  // dev-only review surface; dead-code-eliminated from production builds
  ...(import.meta.env.DEV
    ? [{ path: "/dev/kit", HydrateFallback: () => null, lazy: async () => ({ Component: (await import("./pages/DevKit")).default }) }]
    : []),
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
