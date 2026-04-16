import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./app/App.jsx";
import "./styles/index.css";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!clientId) {
  console.warn(
    "[Inaya] VITE_GOOGLE_CLIENT_ID is not set. " +
    "Google Sign-In will be disabled. " +
    "Add VITE_GOOGLE_CLIENT_ID to your .env file and to Vercel environment variables."
  );
}

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId || ""}>
    <App />
  </GoogleOAuthProvider>
);

