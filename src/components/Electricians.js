import { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

export default function Electricians() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    area: "",
    experience: "",
    specialization: "",
    status: "Active",
    notes: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchElectricians();
  }, []);

  const fetchElectricians = async () => {
    const res = await axios.get("http://localhost:8080/api/electricians");
    setList(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      const res = await axios.put(
        `http://localhost:8080/api/electricians/${editingId}`,
        form
      );
      setList(list.map((l) => (l._id === editingId ? res.data : l)));
    } else {
      const res = await axios.post(
        "http://localhost:8080/api/electricians",
        form
      );
      setList([res.data, ...list]);
    }

    setForm({
      name: "",
      phone: "",
      email: "",
      area: "",
      experience: "",
      specialization: "",
      status: "Active",
      notes: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (e) => {
    setForm(e);
    setEditingId(e._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/electricians/${id}`);
    setList(list.filter((l) => l._id !== id));
  };

  return (
    <div className="admin-card">
      <div className="product-list-header">
        <h2>🔌 Electricians</h2>
        <button className="btn-add" onClick={() => setShowForm(true)}>
          ➕ Add Electrician
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input name="area" placeholder="Area" value={form.area} onChange={handleChange} />
          <input name="experience" placeholder="Experience (years)" value={form.experience} onChange={handleChange} />
          <input name="specialization" placeholder="Specialization" value={form.specialization} onChange={handleChange} />

          <select name="status" value={form.status} onChange={handleChange}>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
          />

          <button className="btn-save">Save</button>
          <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </form>
      )}

      <table className="product-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Area</th>
            <th>Experience</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {list.map((e, i) => (
            <tr key={e._id}>
              <td>{i + 1}</td>
              <td>{e.name}</td>
              <td>{e.phone}</td>
              <td>{e.area}</td>
              <td>{e.experience} yrs</td>
              <td>{e.status}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(e)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(e._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
