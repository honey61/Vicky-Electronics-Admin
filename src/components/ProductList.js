
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("https://vicky-ele-server-1.onrender.com/api/products");
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get("https://vicky-ele-server-1.onrender.com/api/categories");
    setCategories(res.data);
  };

  /* ================= EDIT HANDLERS ================= */

  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditData({ ...product });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const discount =
      editData.mrp > 0
        ? ((editData.mrp - editData.price) / editData.mrp) * 100
        : 0;

    const res = await axios.put(
      `https://vicky-ele-server-1.onrender.com/api/products/${editingId}`,
      {
        ...editData,
        discount: discount.toFixed(2),
      }
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
    await axios.delete(`https://vicky-ele-server-1.onrender.com/api/products/${id}`);
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

  const totalPages = Math.ceil(
    filteredProducts.length / recordsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  /* ================= UI ================= */

  return (
    <div className="admin-card">
      <div className="product-list-header">
        <h2>📦 Product List</h2>

        <div className="header-center">
    <div className="search-box">
      <input
        placeholder="Search product name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  </div>

  <div className="controls">
    <select
      className="filter-select"
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
    >
      <option value="All">All</option>
      {categories.map((c) => (
        <option key={c._id} value={c.name}>
          {c.name}
        </option>
      ))}
    </select>
  </div>
</div>
      {/* ================= TABLE ================= */}
      <table className="product-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Model</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Description</th>
            <th>MRP</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Warranty</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentRecords.map((p, i) => (
            <tr key={p._id}>
              <td>{indexOfFirst + i + 1}</td>

              {editingId === p._id ? (
                <>
                  <td>
                    <input
                      name="name"
                      value={editData.name}
                      onChange={handleChange}
                    />
                  </td>

                  <td>
                    <input
                      name="modelName"
                      value={editData.modelName}
                      onChange={handleChange}
                    />
                  </td>

                  {/* ✅ Dynamic Category Dropdown */}
                  <td>
                    <select
                      name="type"
                      value={editData.type}
                      onChange={handleChange}
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      name="capacity"
                      value={editData.capacity || ""}
                      onChange={handleChange}
                    />
                  </td>

                  <td>
                    <textarea
                      name="description"
                      value={editData.description || ""}
                      onChange={handleChange}
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      name="mrp"
                      value={editData.mrp}
                      onChange={handleChange}
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      name="price"
                      value={editData.price}
                      onChange={handleChange}
                    />
                  </td>

                  <td>
                    {editData.mrp
                      ? (
                          ((editData.mrp - editData.price) /
                            editData.mrp) *
                          100
                        ).toFixed(2)
                      : 0}
                    %
                  </td>

                  <td>
                    <input
                      name="warranty"
                      value={editData.warranty || ""}
                      onChange={handleChange}
                    />
                  </td>

                  <td>
                    <button className="btn-save" onClick={handleSave}>
                      Save
                    </button>
                    <button className="btn-cancel" onClick={handleCancel}>
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{p.name}</td>
                  <td>{p.modelName}</td>
                  <td>{p.type}</td>
                  <td>{p.capacity || "—"}</td>
                  <td>{p.description || "—"}</td>
                  <td>{p.mrp}</td>
                  <td>{p.price}</td>
                  <td>{p.discount || "—"}%</td>
                  <td>{p.warranty || "—"}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= PAGINATION ================= */}
      <div style={{ marginTop: 15 }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ◀ Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              fontWeight: currentPage === i + 1 ? "bold" : "normal",
            }}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

export default ProductList;
