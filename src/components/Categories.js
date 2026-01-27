import React, { useState } from "react";
import "./Admin.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    order: "",
  });

  const openForm = () => {
    setFormOpen(true);
    setEditIndex(null);
    setFormData({ name: "", order: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      const updated = [...categories];
      updated[editIndex] = { ...formData };
      setCategories(updated);
    } else {
      setCategories([...categories, formData]);
    }

    setFormOpen(false);
    setFormData({ name: "", order: "" });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormOpen(true);
    setFormData(categories[index]);
  };

  const handleDelete = (index) => {
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
  };

  return (
    <div className="categories-page">
      <div className="header">
        <h2>Categories</h2>
        <button className="add-btn" onClick={openForm}>
          ➕ Add Category
        </button>
      </div>

      {/* Category Form (Popup style) */}
      {formOpen && (
        <div className="category-form">
          <form onSubmit={handleSubmit}>
            <h3>{editIndex !== null ? "Edit Category" : "Add Category"}</h3>

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

      {/* Category Table */}
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
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{cat.name}</td>
                <td>{cat.order}</td>
                <td>
                  <button onClick={() => handleEdit(index)} className="edit-btn">
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
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
