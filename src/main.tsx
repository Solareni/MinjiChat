import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import { routes } from "./router";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: routes
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
