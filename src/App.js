
import React, { useState } from "react";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";
import Leads from "./components/Leads";
import "./components/Admin.css";

function App() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("addProduct");

  const handleProductAdded = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const handlePriceUpdate = (index, newPrice) => {
    const updated = [...products];
    updated[index].price = newPrice;
    setProducts(updated);
  };

  const handleDeleteProduct = (index) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

  return (
    <div className="dashboard">

      {/* Left Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Vicky Electronics Admin Panel</h2>

        <ul className="menu">
          <li
            className={activeTab === "addProduct" ? "active" : ""}
            onClick={() => setActiveTab("addProduct")}
          >
            ➕ Add Product
          </li>

          <li
            className={activeTab === "productList" ? "active" : ""}
            onClick={() => setActiveTab("productList")}
          >
            📦 Product List
          </li>

          <li
            className={activeTab === "leads" ? "active" : ""}
            onClick={() => setActiveTab("leads")}
          >
            📋 Leads
          </li>
        </ul>
      </aside>

      {/* Right Content Area */}
      <main className="content">

        {activeTab === "addProduct" && (
          <AddProduct onProductAdded={handleProductAdded} />
        )}

        {activeTab === "productList" && (
          <ProductList
            products={products}
            onPriceUpdate={handlePriceUpdate}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === "leads" && <Leads />}
      </main>
    </div>
  );
}

export default App;
