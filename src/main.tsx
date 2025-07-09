import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import App from "./App.tsx";
import "./index.css";

const paypalOptions = {
  clientId: "Af6mjQjOYGWAs_AKdbtJPcDAzVjD5ep5LlIBy5Gi7NgXsWODNvNmW7s1_WNghQ_6cNKfR1eSbn3exLaY",
  currency: "USD",
  intent: "capture"
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PayPalScriptProvider options={paypalOptions}>
      <App />
    </PayPalScriptProvider>
  </StrictMode>
);
