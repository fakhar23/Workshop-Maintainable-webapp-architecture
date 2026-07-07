import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// TODO: Step 1 - import Sentry here:
// import * as Sentry from "@sentry/react";
import "./index.css";
import App from "./App.jsx";

// TODO: Step 1 - initialize Sentry here before React creates the root.

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <StrictMode>
    {/* TODO: Step 2 - wrap <App /> with Sentry.ErrorBoundary here. */}
    <App />
  </StrictMode>,
);
