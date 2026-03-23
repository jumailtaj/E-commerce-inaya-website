
  import { createRoot } from "react-dom/client";
  import App from "./app/App.jsx";
  import "./styles/index.css";

  console.log("API URL:", import.meta.env.VITE_API_URL);
  createRoot(document.getElementById("root")).render(<App />);
  
