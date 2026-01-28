// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Admin.css";

// function Leads() {
//   const [leads, setLeads] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [showForm, setShowForm] = useState(false);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     product: "",
//     status: "New",
//     description: ""
//   });

//   // 🔹 Fetch Leads
//   useEffect(() => {
//     fetchLeads();
//   }, []);

//   const fetchLeads = async () => {
//     const res = await axios.get("http://localhost:8080/api/leads");
//     setLeads(res.data);
//   };

//   // 🔹 Handle input
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // ➕ Add Lead
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await axios.post("http://localhost:8080/api/leads", form);
//     setLeads([res.data, ...leads]);
//     setForm({
//       name: "",
//       email: "",
//       phone: "",
//       product: "",
//       status: "New",
//       description: ""
//     });
//     setShowForm(false);
//   };

//   // ✏️ Edit
//   const handleEdit = (lead) => {
//     setEditingId(lead._id);
//     setForm(lead);
//   };

//   // 💾 Save
//   const handleSave = async () => {
//     const res = await axios.put(
//       `http://localhost:8080/api/leads/${editingId}`,
//       form
//     );
//     setLeads(leads.map(l => (l._id === editingId ? res.data : l)));
//     setEditingId(null);
//   };

//   return (
//     <div className="admin-card">
//       <div className="product-list-header">
//         <h2>📋 Leads</h2>
//         <button className="btn-add" onClick={() => setShowForm(true)}>
//           ➕ Add Lead
//         </button>
//       </div>

//       {/* ➕ Add Lead Form */}
//       {showForm && (
//         <form className="admin-form" onSubmit={handleSubmit}>
//           <input name="name" placeholder="Name" onChange={handleChange} required />
//           <input name="email" placeholder="Email" onChange={handleChange} />
//           <input name="phone" placeholder="Phone" onChange={handleChange} />
//           <input name="product" placeholder="Interested Product" onChange={handleChange} />

//           <select name="status" onChange={handleChange}>
//             <option>New</option>
//             <option>Contacted</option>
//             <option>Interested</option>
//             <option>Closed</option>
//           </select>

//           <textarea
//             name="description"
//             placeholder="Description"
//             onChange={handleChange}
//           />

//           <button className="btn-save">Save Lead</button>
//           <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
//             Cancel
//           </button>
//         </form>
//       )}

//       {/* 📊 Leads Table */}
//       <table className="product-table">
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Phone</th>
//             <th>Product</th>
//             <th>Status</th>
//             <th>Description</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {leads.map((l, i) => (
//             <tr key={l._id}>
//               <td>{i + 1}</td>

//               <td>
//                 {editingId === l._id ? (
//                   <input
//                     value={form.name}
//                     onChange={handleChange}
//                     name="name"
//                   />
//                 ) : (
//                   l.name
//                 )}
//               </td>

//               <td>{l.email}</td>
//               <td>{l.phone}</td>
//               <td>{l.product}</td>

//               <td>
//                 {editingId === l._id ? (
//                   <select
//                     value={form.status}
//                     name="status"
//                     onChange={handleChange}
//                   >
//                     <option>New</option>
//                     <option>Contacted</option>
//                     <option>Interested</option>
//                     <option>Closed</option>
//                   </select>
//                 ) : (
//                   l.status
//                 )}
//               </td>

//               <td>{l.description}</td>

//               <td>
//                 {editingId === l._id ? (
//                   <>
//                     <button className="btn-save" onClick={handleSave}>
//                       Save
//                     </button>
//                     <button className="btn-cancel" onClick={() => setEditingId(null)}>
//                       Cancel
//                     </button>
//                   </>
//                 ) : (
//                   <button className="btn-edit" onClick={() => handleEdit(l)}>
//                     Edit
//                   </button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default Leads;
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

function Leads() {
  const [leads, setLeads] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    product: "",
    status: "New",
    description: ""
  });

  // 🔹 Fetch Leads
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const res = await axios.get("http://localhost:8080/api/leads");
    setLeads(res.data);
  };

  // 🔹 Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ Add Lead
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:8080/api/leads", form);
    setLeads([res.data, ...leads]);
    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      product: "",
      status: "New",
      description: ""
    });
  };

  // ✏️ Edit
  const handleEdit = (lead) => {
    setEditingId(lead._id);
    setForm({ ...lead });
  };

  // 💾 Save
  const handleSave = async () => {
    const res = await axios.put(
      `http://localhost:8080/api/leads/${editingId}`,
      form
    );

    setLeads(leads.map(l => (l._id === editingId ? res.data : l)));
    setEditingId(null);
    resetForm();
  };

  // ❌ Cancel
  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="admin-card">
      <div className="product-list-header">
        <h2>📋 Leads</h2>
        <button className="btn-add" onClick={() => setShowForm(true)}>
          ➕ Add Lead
        </button>
      </div>

      {/* ➕ Add Lead Form */}
      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          <input name="product" placeholder="Interested Product" value={form.product} onChange={handleChange} />

          <select name="status" value={form.status} onChange={handleChange}>
            <option>New</option>
            <option>Contacted</option>
            <option>Interested</option>
            <option>Closed</option>
          </select>

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <button className="btn-save">Save Lead</button>
          <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </form>
      )}

      {/* 📊 Leads Table */}
      <table className="product-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Product</th>
            <th>Status</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((l, i) => (
            <tr key={l._id}>
              <td>{i + 1}</td>

              {/* Name */}
              <td>
                {editingId === l._id ? (
                  <input name="name" value={form.name} onChange={handleChange} />
                ) : (
                  l.name
                )}
              </td>

              {/* Email */}
              <td>
                {editingId === l._id ? (
                  <input name="email" value={form.email} onChange={handleChange} />
                ) : (
                  l.email
                )}
              </td>

              {/* Phone */}
              <td>
                {editingId === l._id ? (
                  <input name="phone" value={form.phone} onChange={handleChange} />
                ) : (
                  l.phone
                )}
              </td>

              {/* Product */}
              <td>
                {editingId === l._id ? (
                  <input name="product" value={form.product} onChange={handleChange} />
                ) : (
                  l.product
                )}
              </td>

              {/* Status */}
              <td>
                {editingId === l._id ? (
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Interested</option>
                    <option>Closed</option>
                  </select>
                ) : (
                  l.status
                )}
              </td>

              {/* Description */}
              <td>
                {editingId === l._id ? (
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                  />
                ) : (
                  l.description
                )}
              </td>

              {/* Actions */}
              <td>
                {editingId === l._id ? (
                  <>
                    <button className="btn-save" onClick={handleSave}>
                      Save
                    </button>
                    <button className="btn-cancel" onClick={handleCancel}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="btn-edit" onClick={() => handleEdit(l)}>
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leads;
