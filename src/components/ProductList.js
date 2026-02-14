import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  const DEFAULT_IMAGE =
    "https://www.crompton.co.in/cdn/shop/files/Storage_Water_Heater_07057b7d-8839-409e-87dd-336b1e7ef16c_600x.png?v=1694501155";

  // ✅ Rank Options (Added Only)
  const rankOptions = [
    "Most Recommended",
    "Recommended",
    "Average",
    "Less Recommended",
  ];

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(
      "https://vicky-ele-server-1.onrender.com/api/products"
    );
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get(
      "https://vicky-ele-server-1.onrender.com/api/categories"
    );
    setCategories(res.data);
  };

  /* ================= EDIT ================= */

  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditData({
      ...product,
      image: product.images?.[0] || "",
      removeImage: false,
      isPopular: !!product.isPopular,
      rank: product.rank || "", // ✅ ensure rank editable
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEditData({
      ...editData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    const mrp = Number(editData.mrp);
    const price = Number(editData.price);

    const discount =
      mrp > 0 ? (((mrp - price) / mrp) * 100).toFixed(2) : 0;

    let images = [];
    if (!editData.removeImage && editData.image?.trim()) {
      images = [editData.image.trim()];
    }

    const payload = {
      ...editData,
      mrp,
      price,
      discount,
      images,
    };

    delete payload.image;
    delete payload.removeImage;

    const res = await axios.put(
      `https://vicky-ele-server-1.onrender.com/api/products/${editingId}`,
      payload
    );

    setProducts(
      products.map((p) => (p._id === editingId ? res.data : p))
    );

    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (id) => {
    await axios.delete(
      `https://vicky-ele-server-1.onrender.com/api/products/${id}`
    );
    setProducts(products.filter((p) => p._id !== id));
  };

  /* ================= FILTER + SEARCH ================= */

  const filteredProducts = products.filter((p) => {
    const matchType =
      filter === "All" || p.type?.toLowerCase() === filter.toLowerCase();

    const matchSearch = p.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    return matchType && matchSearch;
  });

  /* ================= PAGINATION ================= */

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredProducts.slice(
    indexOfFirst,
    indexOfLast
  );

  // const totalPages = Math.ceil(
  //   filteredProducts.length / recordsPerPage
  // );

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  /* ================= UI ================= */

  return (
    <div className="admin-card">
      <h2>📦 Product List</h2>

      <div className="product-list-header">
        <input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Model</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Description</th>
            <th>Warranty</th>
            <th>MRP</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Popular</th>
            <th>Rank</th> {/* ✅ Added */}
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentRecords.map((p, i) => (
            <tr key={p._id}>
              <td>{indexOfFirst + i + 1}</td>

              <td>
                <img
                  src={p.images?.[0] || DEFAULT_IMAGE}
                  alt={p.name}
                  style={{ width: 60, height: 60 }}
                />
              </td>

              {editingId === p._id ? (
                <>
                  <td><input name="name" value={editData.name || ""} onChange={handleChange} /></td>
                  <td><input name="modelName" value={editData.modelName || ""} onChange={handleChange} /></td>

                  <td>
                    <select name="type" value={editData.type || ""} onChange={handleChange}>
                      {categories.map((c) => (
                        <option key={c._id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </td>

                  <td><input name="capacity" value={editData.capacity || ""} onChange={handleChange} /></td>
                  <td><textarea name="description" value={editData.description || ""} onChange={handleChange} /></td>
                  <td><input name="warranty" value={editData.warranty || ""} onChange={handleChange} /></td>

                  <td><input type="number" name="mrp" value={editData.mrp || ""} onChange={handleChange} /></td>
                  <td><input type="number" name="price" value={editData.price || ""} onChange={handleChange} /></td>
                  <td>{editData.mrp ? (((editData.mrp - editData.price) / editData.mrp) * 100).toFixed(2) : 0}%</td>

                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      name="isPopular"
                      checked={editData.isPopular || false}
                      onChange={handleChange}
                    />
                  </td>

                  {/* ✅ Rank Editable */}
                  <td>
                    <select
                      name="rank"
                      value={editData.rank || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select Rank</option>
                      {rankOptions.map((r, idx) => (
                        <option key={idx} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <button className="btn-save" onClick={handleSave}>Save</button>
                    <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{p.name}</td>
                  <td>{p.modelName}</td>
                  <td>{p.type}</td>
                  <td>{p.capacity || "—"}</td>
                  <td>{p.description || "—"}</td>
                  <td>{p.warranty || "—"}</td>
                  <td>{p.mrp}</td>
                  <td>{p.price}</td>
                  <td>{p.discount || "—"}%</td>

                  <td style={{ textAlign: "center" }}>
                    {p.isPopular ? "✅ Yes" : "❌ No"}
                  </td>

                  {/* ✅ Rank Display */}
                  <td>{p.rank || "—"}</td>

                  <td>
                    <button onClick={() => handleEdit(p)}>Edit</button>
                    <button onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
