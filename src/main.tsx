import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { SnackbarProvider } from "notistack";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
    <BrowserRouter>
      <SnackbarProvider
        maxSnack={3}                    
        autoHideDuration={3000}          
        anchorOrigin={{                 
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <App />
      </SnackbarProvider> 
    </BrowserRouter>
    </SnackbarProvider>
  </React.StrictMode>
);