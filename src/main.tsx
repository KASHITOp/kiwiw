import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles.css";
import Landing from "./pages/Landing";
import Editor from "./pages/Editor";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/editor", element: <Editor /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
