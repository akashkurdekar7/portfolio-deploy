import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import LoaderProgressDemo from "./components/LoaderProgressDemo.tsx";

// Preview-only gate: open the app with ?demo=loader to see the retired
// progress-bar loader in isolation, now that the bouncing-ball loader has
// taken its place as the real Loader used by App.
const isLoaderDemo = new URLSearchParams(window.location.search).get("demo") === "loader";

createRoot(document.getElementById("root")!).render(
  <StrictMode>{isLoaderDemo ? <LoaderProgressDemo /> : <App />}</StrictMode>,
);
