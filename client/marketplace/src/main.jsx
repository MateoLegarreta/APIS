import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

// Arranque de la app. Los proveedores envuelven a App para que cualquier
// componente pueda leer las rutas, la sesion y el carrito
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
      <App />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
