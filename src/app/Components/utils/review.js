"use client";
import { useState } from "react";

export default function ReviewForm({ productId, onNewReview }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const API_URL=process.env.NEXT_PUBLIC_API_BASE;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to submit a review.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          comment,
        }),
      });


      if (!response.ok) {
        throw new Error("Failed to submit review.");
      }

      const newReview = await response.json();

      // Clear form
      setRating(0);
      setComment("");
      onNewReview(newReview);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded-lg mt-12 max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">Write a Customer Review</h3>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block font-semibold mb-2">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              className={`text-3xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
              onClick={() => handleRatingChange(star)}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block font-semibold mb-2">
          Comment
        </label>
        <textarea
          id="comment"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          className="w-full border border-gray-300 rounded p-2 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
