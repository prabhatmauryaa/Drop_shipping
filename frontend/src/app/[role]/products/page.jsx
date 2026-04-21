"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { Plus, Tag, Box, DollarSign, Edit, Trash2, PackageOpen, Search } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const ProductSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number().positive("Must be positive").required("Price is required"),
  stock: Yup.number().integer().min(0).required("Stock is required"),
  category: Yup.string().required("Category is required"),
  imageUrl: Yup.string().url("Must be a valid URL").required("Image URL is required"),
});

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("dropsync_token");
      if (!token) {
        toast.error("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:5000/api/products/dashboard", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      setProducts(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Product fetch error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to load products");
      setLoading(false);
    }
  };

  const handleCreateOrUpdateProduct = async (values, { setSubmitting, resetForm }) => {
    const token = localStorage.getItem("dropsync_token");

    try {
      if (editingProduct) {
        // Update
        const res = await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, values, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Product updated successfully");
        setProducts(products.map(p => p._id === editingProduct._id ? res.data.product : p));
      } else {
        // Create
        const res = await axios.post("http://localhost:5000/api/products", values, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Product added successfully");
        setProducts([res.data.product, ...products]);
      }
      setIsAdding(false);
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    const token = localStorage.getItem("dropsync_token");
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Product deleted successfully");
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsAdding(true);
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
             <PackageOpen className="w-8 h-8 text-blue-500" /> Products Management
          </h1>
          <p className="text-slate-400 mt-1">Add, update or remove items from the marketplace (Module 3).</p>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setEditingProduct(null); }}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-5 h-5" /> Add New Product
        </button>
      </div>

      {isAdding && (
        <div className="glass p-8 rounded-3xl border border-blue-500/30 mb-8 w-full max-w-4xl mx-auto transform transition-all shadow-2xl shadow-blue-500/10">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-3">{editingProduct ? "Edit Product Listing" : "Create New Listing"}</h2>
          
          <Formik
            initialValues={{ 
              title: editingProduct?.title || "", 
              description: editingProduct?.description || "", 
              price: editingProduct?.price || "", 
              stock: editingProduct?.stock || "", 
              category: editingProduct?.category || "", 
              imageUrl: editingProduct?.imageUrl || "" 
            }}
            validationSchema={ProductSchema}
            onSubmit={handleCreateOrUpdateProduct}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Product Title <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500"><Tag className="w-5 h-5" /></div>
                    <Field name="title" type="text" className="input-base pl-10" placeholder="e.g. Premium Wireless Headphones" />
                  </div>
                  <ErrorMessage name="title" component="p" className="text-error text-xs mt-1" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description <span className="text-red-500">*</span></label>
                  <Field as="textarea" rows="3" name="description" className="input-base" placeholder="Enter detailed product description..." />
                  <ErrorMessage name="description" component="p" className="text-error text-xs mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Price (₹) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500"><DollarSign className="w-5 h-5" /></div>
                    <Field name="price" type="number" step="0.01" className="input-base pl-10" placeholder="   99.99" />
                  </div>
                  <ErrorMessage name="price" component="p" className="text-error text-xs mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Stock Quantity <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500"><Box className="w-5 h-5" /></div>
                    <Field name="stock" type="number" className="input-base pl-10" placeholder="   500" />
                  </div>
                  <ErrorMessage name="stock" component="p" className="text-error text-xs mt-1" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category <span className="text-red-500">*</span></label>
                  <Field as="select" name="category" className="input-base bg-slate-800">
                    <option value="">Select a category</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Accessories">Accessories</option>
                  </Field>
                  <ErrorMessage name="category" component="p" className="text-error text-xs mt-1" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Image URL <span className="text-red-500">*</span></label>
                  <Field type="text" name="imageUrl" className="input-base bg-slate-800" placeholder="https://example.com/image.jpg" />
                  <ErrorMessage name="imageUrl" component="p" className="text-error text-xs mt-1" />
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 mt-4 border-t border-slate-800 pt-4">
                  <button type="button" onClick={() => { setIsAdding(false); setEditingProduct(null); }} className="px-5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 transition-colors disabled:opacity-50">
                    {isSubmitting ? "Processing..." : editingProduct ? "Update Product" : "Save Product"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      {/* Products List Table */}
      <div className="glass rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
          <h2 className="font-bold text-white text-lg">Product Inventory</h2>
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search products..." className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Product Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">Loading products...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">No products found. Add your first product.</td></tr>
              ) : (
                products.map(product => (
                  <tr key={product._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.title} className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-700" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center"><Tag className="w-5 h-5 text-slate-500"/></div>
                      )}
                      <div>
                        <div className="font-medium text-white line-clamp-1 w-48">{product.title}</div>
                        <div className="text-xs text-slate-500 truncate w-48">{product.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">{product.category}</span></td>
                    <td className="px-6 py-4 font-medium text-green-400">₹{product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.stock > 10 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        product.status === "approved" || product.status === "active" ? "bg-green-500/20 text-green-400" :
                        product.status === "rejected" ? "bg-red-500/20 text-red-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {product.status || "pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleEditClick(product)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(product._id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
