import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProductsProvider } from "./context/ProductsContext.jsx";
import { EmailProvider } from "./context/EmailContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <ProductsProvider>
          <EmailProvider>
            <App />
          </EmailProvider>
        </ProductsProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
