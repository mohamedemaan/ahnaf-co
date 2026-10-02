import { Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";

import Chatbot from "./components/Chatbot";

import ResponsiveLayout from "./components/ResponsiveLayout";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <ResponsiveLayout>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />


          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/myorders" element={<MyOrders />} />
        </Routes>

        <Chatbot />
      </ResponsiveLayout>
    </LanguageProvider>
  );
}

export default App;