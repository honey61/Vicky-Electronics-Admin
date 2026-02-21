import React, { useEffect, useState } from "react";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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

  const rankOptions = [
    "Most Recommended",
    "Recommended",
    "Average",
    "Less Recommended",
  ];

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

  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditData({
      ...product,
      image: product.images?.[0] || "",
      removeImage: false,
      isPopular: !!product.isPopular,
      rank: product.rank || "",
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    const mrp = Number(editData.mrp);
    const price = Number(editData.price);

    const discount = mrp > 0 ? (((mrp - price) / mrp) * 100).toFixed(2) : 0;

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

    setProducts((prev) => prev.map((p) => (p._id === editingId ? res.data : p)));

    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://vicky-ele-server-1.onrender.com/api/products/${id}`);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const filteredProducts = products.filter((p) => {
    const matchType =
      filter === "All" || p.type?.toLowerCase() === filter.toLowerCase();

    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());

    return matchType && matchSearch;
  });

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredProducts.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  const discountPreview =
    Number(editData.mrp) > 0
      ? (
          ((Number(editData.mrp) - Number(editData.price || 0)) /
            Number(editData.mrp)) *
          100
        ).toFixed(2)
      : 0;

  return (
    <div className="admin-card">
      <h2>Product List</h2>

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

      {editingId && (
        <div className="product-edit-panel">
          <h3>Edit Product Record</h3>

          <div className="form-grid product-edit-grid">
            <div>
              <label>Name</label>
              <input name="name" value={editData.name || ""} onChange={handleChange} />
            </div>

            <div>
              <label>Model</label>
              <input
                name="modelName"
                value={editData.modelName || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Category</label>
              <select name="type" value={editData.type || ""} onChange={handleChange}>
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Capacity</label>
              <input name="capacity" value={editData.capacity || ""} onChange={handleChange} />
            </div>

            <div>
              <label>Warranty</label>
              <input name="warranty" value={editData.warranty || ""} onChange={handleChange} />
            </div>

            <div>
              <label>Image URL</label>
              <input name="image" value={editData.image || ""} onChange={handleChange} />
            </div>

            <div>
              <label>MRP</label>
              <input
                type="number"
                name="mrp"
                value={editData.mrp || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={editData.price || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Discount Preview</label>
              <input value={`${discountPreview}%`} readOnly />
            </div>

            <div>
              <label>Rank</label>
              <select name="rank" value={editData.rank || ""} onChange={handleChange}>
                <option value="">Select Rank</option>
                {rankOptions.map((r, idx) => (
                  <option key={idx} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="product-checkbox-wrap">
              <label>
                <input
                  type="checkbox"
                  name="isPopular"
                  checked={editData.isPopular || false}
                  onChange={handleChange}
                />{" "}
                Popular Product
              </label>
              <label>
                <input
                  type="checkbox"
                  name="removeImage"
                  checked={editData.removeImage || false}
                  onChange={handleChange}
                />{" "}
                Remove Existing Image
              </label>
            </div>

            <div className="full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={editData.description || ""}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="full-width">
              <label>Detail Description</label>
              <CKEditor
                editor={ClassicEditor}
                data={editData.detailDescription || ""}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setEditData((prev) => ({
                    ...prev,
                    detailDescription: data,
                  }));
                }}
              />
            </div>
          </div>

          <div className="product-edit-actions">
            <button className="btn-save" onClick={handleSave}>
              Save
            </button>
            <button className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Model</th>
              <th>Type</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Popular</th>
              <th>Rank</th>
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
                    style={{ width: 60, height: 60, objectFit: "cover" }}
                  />
                </td>
                <td>{p.name}</td>
                <td>{p.modelName || "-"}</td>
                <td>{p.type || "-"}</td>
                <td>{p.price}</td>
                <td>{p.discount || "-"}%</td>
                <td>{p.isPopular ? "Yes" : "No"}</td>
                <td>{p.rank || "-"}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Open & Edit</button>
                  <button onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductList;
