import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { GoPrintProvider } from "./context/GoPrintContext";
import "antd/dist/reset.css";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoPrintProvider>
        <App />
      </GoPrintProvider>
    </BrowserRouter>
  </React.StrictMode>
);
