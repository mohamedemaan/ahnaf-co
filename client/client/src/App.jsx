import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  // 📦 Fetch Products
  const getProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🛒 Fetch Cart
  const getCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ➕ Add To Cart
  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product added to cart ✅");

      getCart();
    } catch (err) {
      console.log(err);

      alert("Failed to add cart ❌");
    }
  };

  // ❌ Remove Cart Item
  const removeCartItem = async (cartId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/cart/${cartId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Item removed ❌");

      getCart();
    } catch (err) {
      console.log(err);
    }
  };

  // 💰 Total Price
  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc + item.product?.price * item.quantity,
    0
  );

  // 📦 Place Order
const placeOrder = async () => {
  try {
    const token = localStorage.getItem("token");

    const orderItems = cartItems.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    const res = await axios.post(
      "http://localhost:5000/api/orders/create",
      {
        orderItems,
        totalPrice,
        paymentMethod: "COD",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(res.data);

    alert("Order placed successfully ✅");

    setCartItems([]);
  } catch (err) {
    console.log(err);

    alert("Order failed ❌");
  }
};

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-black text-white px-8 py-4 flex items-center justify-between">

        <h1 className="text-3xl font-bold">
          E-Shop
        </h1>

        <button className="text-lg">
          🛒 Cart ({cartItems.length})
        </button>

      </nav>

      {/* Hero */}
      <section className="text-center mt-10">

        <h2 className="text-4xl font-bold text-gray-800">
          Ecommerce Store 🔥
        </h2>

      </section>

      {/* Products */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-10">

        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >

            <img
              src={
                product.images &&
                product.images.length > 0
                  ? product.images[0]
                  : "https://via.placeholder.com/300"
              }
              alt={product.title}
              className="w-full h-64 object-cover"
            />

            <div className="p-5">

              <h3 className="text-2xl font-bold">
                {product.title}
              </h3>

              <p className="text-xl text-gray-600 mt-2">
                ₹{product.price}
              </p>

              <button
                onClick={() => addToCart(product._id)}
                className="mt-5 w-full bg-black text-white py-3 rounded-xl"
              >
                Add To Cart
              </button>

            </div>

          </div>
        ))}

      </section>

      {/* Cart Section */}
      <section className="p-10">

        <h2 className="text-3xl font-bold mb-6">
          🛒 My Cart
        </h2>

        <div className="space-y-5">

          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white p-5 rounded-2xl shadow flex items-center justify-between"
              >

                <div>

                  <h3 className="text-2xl font-bold">
                    {item.product?.title}
                  </h3>

                  <p className="text-gray-600 mt-2">
                    Quantity: {item.quantity}
                  </p>

                  <p className="text-lg font-semibold mt-2">
                    ₹{item.product?.price}
                  </p>

                </div>

                <button
                  onClick={() =>
                    removeCartItem(item._id)
                  }
                  className="bg-red-500 text-white px-5 py-2 rounded-lg"
                >
                  Remove
                </button>

              </div>
            ))
          ) : (
            <h1 className="text-xl font-bold">
              Cart is Empty
            </h1>
          )}

        </div>

        {/* Total */}
        <div className="mt-10 bg-black text-white p-6 rounded-2xl">

          <h2 className="text-3xl font-bold">
            Total: ₹{totalPrice}
          </h2>

          <button
  onClick={placeOrder}
  className="mt-5 bg-white text-black px-6 py-3 rounded-xl font-bold"
>
  Place Order (COD)
</button>
        </div>

      </section>

    </div>
  );
}

export default App;