"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { Star, MessageSquare, User, Clock, Filter } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api, { getErrorMessage } from "@/lib/api";

export default function FeedbackManagementPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await api.get("/reviews/dashboard-reviews");
      setReviews(res.data || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-100"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 rounded-2xl border border-amber-100 text-amber-600">
            <MessageSquare className="w-7 h-7" />
          </div>
          Feedback & Customer Reviews
        </h1>
        <p className="text-slate-500 mt-1 text-sm">Monitor shopper ratings, comments, and customer satisfaction logs.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" /> Customer Reviews ({reviews.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5 font-bold">User</th>
                <th className="px-6 py-3.5 font-bold">Rating</th>
                <th className="px-6 py-3.5 font-bold">Comment</th>
                <th className="px-6 py-3.5 font-bold">Type</th>
                <th className="px-6 py-3.5 font-bold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm">Loading feedback data...</p>
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No reviews logged yet.</p>
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-900 font-semibold">
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        {review.user?.name || "Customer"}
                      </div>
                    </td>
                    <td className="px-6 py-4">{renderStars(review.rating)}</td>
                    <td className="px-6 py-4">
                      <div className="max-w-md truncate text-slate-700 font-medium" title={review.comment}>
                        "{review.comment}"
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {review.isInstantFeedback ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-wider border border-indigo-200">
                          Instant
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider border border-slate-200">
                          Product
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
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
