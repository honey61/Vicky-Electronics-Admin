import React, { useState, useEffect } from "react";
import "./Admin.css";
import axios from "axios";

function AddProduct({ onProductAdded }) {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    modelName: "",
    mrp: "",
    discount: "",
    price: "",
    type: "",
    capacity: "",
    warranty: "",
    images: [],
    description: "",
  });

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  fetchCategories();
}, []);


  const geyserCapacities = [
    "3 Ltr",
    "6 Ltr",
    "10 Ltr",
    "15 Ltr",
    "25 Ltr",
    "32 Ltr",
  ];

  // ✅ Handle text field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

    const mrp = parseFloat(updatedForm.mrp);
    const price = parseFloat(updatedForm.price);
    const discount = parseFloat(updatedForm.discount);

    if (name === "mrp" || name === "price") {
      if (!isNaN(mrp) && !isNaN(price) && mrp > 0) {
        updatedForm.discount = (((mrp - price) / mrp) * 100).toFixed(2);
      }
    } else if (name === "discount") {
      if (!isNaN(mrp) && !isNaN(discount) && mrp > 0) {
        updatedForm.price = (mrp - (mrp * discount) / 100).toFixed(2);
      }
    }

    setForm(updatedForm);
  };

  // ✅ Handle multiple image uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((images) => {
      setForm((prev) => ({ ...prev, images: [...prev.images, ...images] }));
    });
  };

  // ✅ Remove image from preview
  const handleRemoveImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ✅ Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.type)
      return alert("Please fill all required fields");

    try {
      const res = await axios.post("http://localhost:8080/api/products", form);
      alert("✅ Product added successfully!");
      onProductAdded(res.data.product);

      // Reset form
      setForm({
        name: "",
        modelName: "",
        mrp: "",
        discount: "",
        price: "",
        type: "",
        capacity: "",
        warranty: "",
        images: [],
        description: "",
      });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add product");
    }
  };

  return (
    <div className="admin-card">
      <h2 className="admin-heading">➕ Add New Product</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>Product Name</label>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Product Model Name</label>
        <input
          type="text"
          name="modelName"
          placeholder="Product Model Name"
          value={form.modelName}
          onChange={handleChange}
          required
        />

        <label>Product Type</label>
        <select name="type" value={form.type} onChange={handleChange} required>
  <option value="">Select Product Type</option>
  {categories.map((cat) => (
    <option key={cat._id} value={cat.name}>
      {cat.name}
    </option>
  ))}
</select>


        {form.type === "Geyser" && (
          <>
            <label>Capacity</label>
            <select
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              required
            >
              <option value="">Select Capacity</option>
              {geyserCapacities.map((c, idx) => (
                <option key={idx} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </>
        )}

        <label>Product MRP</label>
        <input
          type="number"
          name="mrp"
          placeholder="MRP Price (₹)"
          value={form.mrp}
          onChange={handleChange}
          required
        />

        <label>Discount (%)</label>
        <input
          type="number"
          name="discount"
          placeholder="Discount (%)"
          value={form.discount}
          onChange={handleChange}
        />

        <label>Product Price</label>
        <input
          type="number"
          name="price"
          placeholder="Final Price (₹)"
          value={form.price}
          onChange={handleChange}
          required
        />

        <label>Product Warranty</label>
        <input
          type="text"
          name="warranty"
          placeholder="Warranty (e.g. 1 Year)"
          value={form.warranty}
          onChange={handleChange}
        />

        <label>Product Description</label>
        <textarea
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
          rows="3"
        />

        {/* ✅ Multiple Image Upload */}
        <label>Product Images</label>
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />

        {form.images.length > 0 && (
          <div className="image-preview" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {form.images.map((img, idx) => (
              <div
                key={idx}
                style={{
                  position: "relative",
                  width: "100px",
                  height: "100px",
                }}
              >
                <img
                  src={img}
                  alt={`Preview ${idx}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                    boxShadow: "0 0 4px rgba(0,0,0,0.3)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="btn-primary">
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
