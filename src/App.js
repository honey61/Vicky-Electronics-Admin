import React, { useState } from "react";
import { NavLink, Routes, Route } from "react-router-dom";

import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";
import Leads from "./components/Leads";
import Categories from "./components/Categories";
import Electricians from "./components/Electricians";
import "./components/Admin.css";

function App() {
  const [products, setProducts] = useState([]);

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
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Vicky Electronics Admin Panel</h2>

        <ul className="menu">
          <li>
            <NavLink to="/categories" className="menu-link">
              📁 Categories
            </NavLink>
          </li>

          <li>
            <NavLink to="/add-product" className="menu-link">
              ➕ Add Product
            </NavLink>
          </li>

          <li>
            <NavLink to="/product-list" className="menu-link">
              📦 Product List
            </NavLink>
          </li>

          <li>
            <NavLink to="/leads" className="menu-link">
              📋 Leads
            </NavLink>
          </li>
           <li>
            <NavLink to="/electricians" className="menu-link">
              🧑‍🔧 Electricians
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="content">
        <Routes>
          <Route
            path="/add-product"
            element={<AddProduct onProductAdded={handleProductAdded} />}
          />

          <Route
            path="/product-list"
            element={
              <ProductList
                products={products}
                onPriceUpdate={handlePriceUpdate}
                onDeleteProduct={handleDeleteProduct}
              />
            }
          />

          <Route path="/categories" element={<Categories />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/electricians" element={<Electricians />} />

          {/* DEFAULT */}
          <Route
            path="/"
            element={<AddProduct onProductAdded={handleProductAdded} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
