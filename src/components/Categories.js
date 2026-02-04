import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    order: ""
  });

  // Fetch categories
  const loadCategories = async () => {
    const res = await axios.get("https://vicky-ele-server-1.onrender.com/api/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openForm = () => {
    setFormOpen(true);
    setEditId(null);
    setFormData({ name: "", order: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios.put(
        `https://vicky-ele-server-1.onrender.com/api/categories/${editId}`,
        formData
      );
    } else {
      await axios.post("https://vicky-ele-server-1.onrender.com/api/categories", formData);
    }

    setFormOpen(false);
    loadCategories();
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setFormOpen(true);
    setFormData({ name: cat.name, order: cat.order });
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://vicky-ele-server-1.onrender.com/api/categories/${id}`);
    loadCategories();
  };

  return (
    <div className="categories-page">
      <div className="header">
        <h2>Categories</h2>
        <button className="add-btn" onClick={openForm}>
          ➕ Add Category
        </button>
      </div>

      {formOpen && (
        <div className="category-form">
          <form onSubmit={handleSubmit}>
            <h3>{editId ? "Edit Category" : "Add Category"}</h3>

            <label>Category Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <label>Order Number</label>
            <input
              type="number"
              required
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: e.target.value })
              }
            />

            <button type="submit" className="save-btn">
              Save
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <table className="category-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Category Name</th>
            <th>Order No.</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No categories added yet.
              </td>
            </tr>
          ) : (
            categories.map((cat, index) => (
              <tr key={cat._id}>
                <td>{index + 1}</td>
                <td>{cat.name}</td>
                <td>{cat.order}</td>
                <td>
                  <button
                    onClick={() => handleEdit(cat)}
                    className="edit-btn"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="delete-btn"
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Categories;
