import { useEffect, useState } from "react";
import axios from "axios";

function Admin() {
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [image, setImage] = useState(null);

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

  useEffect(() => {
    getProducts();
  }, []);

  // 📝 Handle Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ➕ Add Product
  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("stock", formData.stock);

      if (image) {
        data.append("images", image);
      }

      await axios.post(
        "http://localhost:5000/api/products/add",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Product added ✅");

      getProducts();

    } catch (err) {
      console.log(err);

      alert("Failed ❌");
    }
  };

  // ❌ Delete Product
  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product deleted ❌");

      getProducts();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      {/* Admin Form */}
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-2xl mx-auto">

        <h1 className="text-4xl font-bold mb-8 text-center">
          👨‍💼 Admin Dashboard
        </h1>

        <form onSubmit={addProduct}>

          <input
            type="text"
            name="title"
            placeholder="Product Title"
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded-lg"
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded-lg"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded-lg"
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded-lg"
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded-lg"
          />

          <input
            type="file"
            onChange={(e) =>
              setImage(e.target.files[0])
            }
            className="w-full mb-4"
          />

          <button className="w-full bg-black text-white py-3 rounded-lg">
            Add Product
          </button>

        </form>

      </div>

      {/* Product List */}
      <div className="mt-16">

        <h2 className="text-3xl font-bold mb-8">
          📦 All Products
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

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

                <p className="mt-2 text-gray-600">
                  ₹{product.price}
                </p>

                <p className="mt-2 text-gray-500">
                  Stock: {product.stock}
                </p>

                <button
                  onClick={() =>
                    deleteProduct(product._id)
                  }
                  className="mt-5 w-full bg-red-500 text-white py-3 rounded-xl"
                >
                  Delete Product
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default Admin;