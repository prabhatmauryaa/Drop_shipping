"use client";

import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { Plus, Tag, Edit, Trash2, PackageOpen, Search, X, Upload } from "lucide-react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import api, { getImageUrl, getErrorMessage } from "@/lib/api";

const ProductSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number().positive("Must be positive").required("Price is required"),
  stock: Yup.number().integer().min(0).required("Stock is required"),
  category: Yup.string().required("Category is required"),
  images: Yup.array()
    .of(Yup.string().required("Image is required"))
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),
  sizes: Yup.array().of(Yup.string()),
});

export default function SupplierProductsPage() {
  const [products, setProducts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/dashboard");
      setProducts(res.data || []);
    } catch (error) {
      console.error("Product fetch error:", getErrorMessage(error));
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateProduct = async (values, { setSubmitting, resetForm }) => {
    try {
      const finalValues = {
        ...values,
        images: values.images.filter((img) => img && img.trim() !== ""),
        sizes: values.sizes.filter((s) => s && s.trim() !== "")
      };

      if (editingProduct) {
        const res = await api.put(`/products/${editingProduct._id}`, finalValues);
        toast.success("Product updated successfully");
        setProducts(products.map((p) => (p._id === editingProduct._id ? res.data.product : p)));
      } else {
        const res = await api.post("/products", finalValues);
        toast.success("Product submitted for admin review");
        setProducts([res.data.product, ...products]);
      }
      setIsAdding(false);
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (e, setFieldValue, currentImages) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (currentImages.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      const res = await api.post("/upload/products", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const newImages = [...currentImages, ...res.data.images];
      setFieldValue("images", newImages);
      toast.success("Images uploaded successfully");
    } catch (error) {
      console.error("Upload error:", getErrorMessage(error));
      toast.error(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsAdding(true);
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter((p) =>
      p.title?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  return (
    <AdminLayout>
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-600">
              <PackageOpen className="w-7 h-7" />
            </div>
            Catalog & Inventory
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Create, edit, and keep track of your dropship catalog items.</p>
        </div>

        <button
          onClick={() => { setIsAdding(true); setEditingProduct(null); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 mb-8 w-full max-w-4xl mx-auto shadow-lg">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingProduct ? "Edit Product Listing" : "Create New Product Listing"}
              </h2>
              <p className="text-xs text-slate-500">Provide accurate details for buyers and marketplace admin review.</p>
            </div>
            <button
              onClick={() => { setIsAdding(false); setEditingProduct(null); }}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <Formik
            initialValues={{
              title: editingProduct?.title || "",
              description: editingProduct?.description || "",
              price: editingProduct?.price || "",
              stock: editingProduct?.stock || "",
              category: editingProduct?.category || "",
              images: editingProduct?.images?.length > 0 ? editingProduct.images : (editingProduct?.imageUrl ? [editingProduct.imageUrl] : []),
              sizes: editingProduct?.sizes || []
            }}
            validationSchema={ProductSchema}
            onSubmit={handleCreateOrUpdateProduct}
            enableReinitialize
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Product Title <span className="text-rose-500">*</span>
                  </label>
                  <Field
                    name="title"
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                    placeholder="e.g. Classic Embroidered Cotton Kurta"
                  />
                  <ErrorMessage name="title" component="p" className="text-xs text-rose-500 mt-1" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    rows="3"
                    name="description"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all leading-relaxed"
                    placeholder="Provide materials, fit, care instructions, and craftsmanship notes..."
                  />
                  <ErrorMessage name="description" component="p" className="text-xs text-rose-500 mt-1" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <Field
                    name="price"
                    type="number"
                    step="0.01"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                    placeholder="e.g. 1499"
                  />
                  <ErrorMessage name="price" component="p" className="text-xs text-rose-500 mt-1" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Stock Quantity <span className="text-rose-500">*</span>
                  </label>
                  <Field
                    name="stock"
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                    placeholder="e.g. 100"
                  />
                  <ErrorMessage name="stock" component="p" className="text-xs text-rose-500 mt-1" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="category"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                  >
                    <option value="">Select a category</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Accessories">Accessories</option>
                  </Field>
                  <ErrorMessage name="category" component="p" className="text-xs text-rose-500 mt-1" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Size Options (Optional)
                  </label>
                  <FieldArray name="sizes">
                    {({ push, remove }) => (
                      <div className="flex flex-wrap gap-2 items-center">
                        {values.sizes.map((size, index) => (
                          <div key={index} className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl">
                            <Field
                              name={`sizes.${index}`}
                              className="bg-transparent border-none focus:outline-none text-xs font-semibold text-slate-800 w-14"
                              placeholder="e.g. XL"
                            />
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push("")}
                          className="px-3.5 py-1.5 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:text-indigo-600 hover:border-indigo-400 transition-all text-xs font-semibold flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Size
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Product Images (Max 5) <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-2">
                    <FieldArray name="images">
                      {({ push, remove }) => (
                        <>
                          {values.images.map((img, index) => (
                            img && (
                              <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
                                <img
                                  src={getImageUrl(img)}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.target.src = "/placeholder-product.svg"; }}
                                />
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )
                          ))}
                          {values.images.length < 5 && (
                            <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center cursor-pointer group p-2 text-center">
                              <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 mb-1 transition-colors" />
                              <span className="text-[10px] text-slate-500 group-hover:text-indigo-600 font-bold uppercase tracking-wider transition-colors">
                                {uploading ? "Uploading..." : "Upload Photo"}
                              </span>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                disabled={uploading}
                                onChange={(e) => handleFileUpload(e, setFieldValue, values.images)}
                              />
                            </label>
                          )}
                        </>
                      )}
                    </FieldArray>
                  </div>
                  <ErrorMessage name="images" component="p" className="text-xs text-rose-500 mt-1" />
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => { setIsAdding(false); setEditingProduct(null); }}
                    className="px-5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : editingProduct ? "Update Product" : "Submit Listing"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      {/* Products List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="font-bold text-slate-900 text-base">My Product Catalog</h2>
            <p className="text-xs text-slate-500">Showing {filteredProducts.length} items</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5 font-bold">Product</th>
                <th className="px-6 py-3.5 font-bold">Category</th>
                <th className="px-6 py-3.5 font-bold">Price</th>
                <th className="px-6 py-3.5 font-bold">Stock</th>
                <th className="px-6 py-3.5 font-bold">Status</th>
                <th className="px-6 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm">Loading catalog items...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No products found. Click "Add New Product" to list your first item.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const displayImg = getImageUrl(product.imageUrl || (product.images && product.images[0]));
                  return (
                    <tr key={product._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {displayImg ? (
                            <img
                              src={displayImg}
                              alt={product.title}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = "/placeholder-product.svg"; }}
                            />
                          ) : (
                            <Tag className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 line-clamp-1 w-52">{product.title}</div>
                          <div className="text-xs text-slate-400 truncate w-52">{product.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        ₹{(product.price || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                          (product.stock || 0) > 10
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}>
                          {product.stock || 0} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                          product.status === "approved" || product.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : product.status === "rejected"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {product.status || "pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
