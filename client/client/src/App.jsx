import { Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import AdminAuth from "./pages/AdminAuth";
import AdminProtected from "./components/AdminProtected";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/cart";
import Orders from "./pages/Orders";
import MyOrders from "./pages/MyOrders";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <>
      <Routes>
        <Route path="/splash" element={<Splash />} />
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminAuth />} />
        <Route
          path="/admin"
          element={
            <AdminProtected>
              <Admin />
            </AdminProtected>
          }
        />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/myorders" element={<MyOrders />} />
      </Routes>
      <Chatbot />
    </>
  );
}

export default App;