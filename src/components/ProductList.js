


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Admin.css";

// function ProductList() {
//   const [products, setProducts] = useState([]);
//   const [filter, setFilter] = useState("All");

//   const productTypes = ["All", "Geyser", "Chimney", "Water Motor", "Basic Fan", "Decorative Fan"];

//   // ✅ Fetch products from backend
//   useEffect(() => {
//     axios.get("http://localhost:8080/api/products")
//       .then((res) => setProducts(res.data))
//       .catch((err) => console.error("Error fetching products:", err));
//   }, []);

//   // ✅ Update product pricef
//   const handlePriceUpdate = async (id, newPrice) => {
//     try {
//       const product = products.find((p) => p._id === id);
//       const discount = ((product.mrp - newPrice) / product.mrp) * 100;
//       const res = await axios.put(`http://localhost:8080/api/products/${id}`, {
//         price: newPrice,
//         discount: discount.toFixed(2),
//       });
//       setProducts(products.map((p) => (p._id === id ? res.data : p)));
//     } catch (err) {
//       console.error("Error updating price:", err);
//     }
//   };

//   // ✅ Delete product
//   const handleDeleteProduct = async (id) => {
//     try {
//       await axios.delete(`http://localhost:8080/api/products/${id}`);
//       setProducts(products.filter((p) => p._id !== id));
//     } catch (err) {
//       console.error("Error deleting product:", err);
//     }
//   };

//   const filteredProducts =
//     filter === "All"
//       ? products
//       : products.filter((p) => p.type.toLowerCase() === filter.toLowerCase());

//   return (
//     <div className="admin-card">
//       <div className="product-list-header">
//         <h2 className="admin-heading">📦 Product List</h2>
//         <div className="filter-container">
//           <label>Filter by Type: </label>
//           <select
//             className="filter-select"
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//           >
//             {productTypes.map((type, index) => (
//               <option key={index} value={type}>{type}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {filteredProducts.length === 0 ? (
//         <p className="no-products">No products found for "{filter}".</p>
//       ) : (
//         <table className="product-table">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Image</th>
//               <th>Name</th>
//               <th>Model Name</th>
//               <th>Type</th>
//               <th>Capacity</th>
//               <th>Description</th>
//               <th>MRP (₹)</th>
//               <th>Price (₹)</th>
//               <th>Discount (%)</th>
//               <th>Warranty</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProducts.map((p, i) => (
//               <tr key={p._id}>
//                 <td>{i + 1}</td>
//                 <td>{p.image ? <img src={p.image} alt={p.name} className="table-img" /> : "—"}</td>
//                 <td>{p.name}</td>
//                 <td>{p.modelName}</td>
//                 <td>{p.type}</td>
//                 <td>{p.capacity || "—"}</td>
//                 <td>{p.description || "—"}</td>
//                 <td>{p.mrp}</td>
//                 <td>
//                   <input
//                     type="number"
//                     defaultValue={p.price}
//                     className="price-input"
//                     onBlur={(e) => handlePriceUpdate(p._id, Number(e.target.value))}
//                   />
//                 </td>
//                 <td>{p.discount ? `${p.discount}%` : "—"}</td>
//                 <td>{p.warranty || "—"}</td>
//                 <td>
//                   <button className="btn-delete" onClick={() => handleDeleteProduct(p._id)}>
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// export default ProductList;
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("All");

  // 🔢 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  const productTypes = [
    "All",
    "Geyser",
    "Chimney",
    "Water Motor",
    "Basic Fan",
    "Decorative Fan",
  ];

  // ✅ Fetch products
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // ✅ Update product price
  const handlePriceUpdate = async (id, newPrice) => {
    try {
      const product = products.find((p) => p._id === id);
      const discount =
        product.mrp > 0
          ? ((product.mrp - newPrice) / product.mrp) * 100
          : 0;

      const res = await axios.put(
        `http://localhost:8080/api/products/${id}`,
        {
          price: newPrice,
          discount: discount.toFixed(2),
        }
      );

      setProducts(products.map((p) => (p._id === id ? res.data : p)));
    } catch (err) {
      console.error("Error updating price:", err);
    }
  };

  // ✅ Delete product
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // 🔍 Filter products
  const filteredProducts =
    filter === "All"
      ? products
      : products.filter(
          (p) => p.type.toLowerCase() === filter.toLowerCase()
        );

  // 🔢 Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredProducts.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const totalPages = Math.ceil(
    filteredProducts.length / recordsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  return (
    <div className="admin-card">
      <div className="product-list-header">
        <h2 className="admin-heading">📦 Product List</h2>

        <div className="filter-container">
          <label>Filter by Type:</label>
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {productTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentRecords.length === 0 ? (
        <p className="no-products">No products found.</p>
      ) : (
        <>
          {/* 📊 Table */}
          <table className="product-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Model Name</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Description</th>
                <th>MRP (₹)</th>
                <th>Price (₹)</th>
                <th>Discount (%)</th>
                <th>Warranty</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentRecords.map((p, i) => (
                <tr key={p._id}>
                  <td>{indexOfFirstRecord + i + 1}</td>
                  <td>
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="table-img" />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>{p.modelName}</td>
                  <td>{p.type}</td>
                  <td>{p.capacity || "—"}</td>
                  <td>{p.description || "—"}</td>
                  <td>{p.mrp}</td>
                  <td>
                    <input
                      type="number"
                      defaultValue={p.price}
                      className="price-input"
                      onBlur={(e) =>
                        handlePriceUpdate(p._id, Number(e.target.value))
                      }
                    />
                  </td>
                  <td>{p.discount ? `${p.discount}%` : "—"}</td>
                  <td>{p.warranty || "—"}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteProduct(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 🔢 Pagination Controls */}
          <div style={{ marginTop: "15px", display: "flex", gap: "8px" }}>
            <button
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              ◀ Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                style={{
                  fontWeight: currentPage === i + 1 ? "bold" : "normal",
                }}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ProductList;
