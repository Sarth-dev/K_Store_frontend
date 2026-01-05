"use client";
import { useState } from "react";

export default function ReviewForm({ productId, onNewReview }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to submit a review.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/products/${productId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating, comment }),
        }
      );

      if (!res.ok) throw new Error("Failed to submit review");

      const newReview = await res.json();
      setRating(0);
      setComment("");
      onNewReview?.(newReview);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-16 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Write a Review
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Share your experience — it helps other customers make better decisions.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ⭐ Rating */}
          <div>
            <label className="block font-medium text-gray-800 mb-2">
              Your Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = hoverRating
                  ? star <= hoverRating
                  : star <= rating;

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`${star} star`}
                    className={`text-3xl transition-transform duration-150
                      ${active ? "text-yellow-400 scale-110" : "text-gray-300"}
                      hover:scale-110`}
                  >
                    ★
                  </button>
                );
              })}
            </div>
            {rating > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                You selected {rating} star{rating > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* 📝 Comment */}
          <div>
            <label
              htmlFor="comment"
              className="block font-medium text-gray-800 mb-2"
            >
              Your Review
            </label>
            <textarea
              id="comment"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike about this product?"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3
                text-sm text-gray-800 resize-none
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                focus:border-indigo-500 transition"
            />
          </div>

          {/* 🚀 Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl
                font-semibold text-white transition-all
                ${
                  submitting || rating === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
                }`}
            >
              {submitting && (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
