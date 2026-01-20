import React, { useState } from "react";
import "./Admin.css";

function Leads() {
  const [editingIndex, setEditingIndex] = useState(null);

  const [leads, setLeads] = useState([
    {
      name: "Harvinder Singh",
      email: "hs8126246@gmail.com",
      phone: "8126246330",
      product: "Geyser - 10 Ltr",
      status: "New",
      description: "Asked for installation charges",
    },
    {
      name: "Simran Kaur",
      email: "simran@example.com",
      phone: "9876543210",
      product: "Chimney",
      status: "Contacted",
      description: "Follow-up required",
    },
    {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "9123456780",
      product: "Decorative Fan",
      status: "Interested",
      description: "Interested in premium model",
    },
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...leads];
    updated[index][field] = value;
    setLeads(updated);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSave = () => {
    setEditingIndex(null);
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  return (
    <div className="admin-card">
      <h2 className="admin-heading">📋 Leads</h2>

      <table className="product-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Lead Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Interested Product</th>
            <th>Status</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead, i) => (
            <tr key={i}>
              <td>{i + 1}</td>

              {/* Name */}
              <td>
                {editingIndex === i ? (
                  <input
                    value={lead.name}
                    onChange={(e) =>
                      handleChange(i, "name", e.target.value)
                    }
                  />
                ) : (
                  lead.name
                )}
              </td>

              {/* Email */}
              <td>
                {editingIndex === i ? (
                  <input
                    value={lead.email}
                    onChange={(e) =>
                      handleChange(i, "email", e.target.value)
                    }
                  />
                ) : (
                  lead.email
                )}
              </td>

              {/* Phone */}
              <td>
                {editingIndex === i ? (
                  <input
                    value={lead.phone}
                    onChange={(e) =>
                      handleChange(i, "phone", e.target.value)
                    }
                  />
                ) : (
                  lead.phone
                )}
              </td>

              {/* Product */}
              <td>
                {editingIndex === i ? (
                  <input
                    value={lead.product}
                    onChange={(e) =>
                      handleChange(i, "product", e.target.value)
                    }
                  />
                ) : (
                  lead.product
                )}
              </td>

              {/* Status (Option Set) */}
              <td>
                {editingIndex === i ? (
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      handleChange(i, "status", e.target.value)
                    }
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Closed">Closed</option>
                  </select>
                ) : (
                  <span className={`status ${lead.status.toLowerCase()}`}>
                    {lead.status}
                  </span>
                )}
              </td>

              {/* Description */}
              <td>
                {editingIndex === i ? (
                  <input
                    value={lead.description}
                    onChange={(e) =>
                      handleChange(i, "description", e.target.value)
                    }
                  />
                ) : (
                  lead.description
                )}
              </td>

              {/* Actions */}
              <td>
                {editingIndex === i ? (
                  <>
                    <button className="btn save" onClick={handleSave}>
                      Save
                    </button>
                    <button className="btn cancel" onClick={handleCancel}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="btn edit" onClick={() => handleEdit(i)}>
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
