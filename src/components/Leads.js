import React from "react";
import "./Admin.css";

function Leads() {
  // Dummy test data
  const leads = [
    {
      name: "Harvinder Singh",
      email: "hs8126246@gmail.com",
      phone: "8126246330",
      product: "Geyser - 10 Ltr",
      status: "New",
    },
    {
      name: "Simran Kaur",
      email: "simran@example.com",
      phone: "9876543210",
      product: "Chimney",
      status: "Contacted",
    },
    {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "9123456780",
      product: "Decorative Fan",
      status: "Interested",
    },
  ];

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
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.phone}</td>
              <td>{lead.product}</td>
              <td>{lead.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leads;
