/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";

export default function PincodeCheck({ deliveryRange }) {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("pincode");
    if (saved) {
      setPincode(saved);
      setStatus("success");
    }
  }, []);

  const checkPincode = () => {
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setStatus("error");
      return;
    }
    localStorage.setItem("pincode", pincode);
    setStatus("success");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 animate-fadeIn">
      <p className="font-semibold text-gray-800 mb-2">
        Check Delivery Availability
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={checkPincode}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Check
        </button>
      </div>

      {status === "success" && (
        <div className="mt-3 text-sm text-green-600 animate-slideUp">
          🚚 Delivery by <b>{deliveryRange}</b> | Free Delivery | Easy Returns
        </div>
      )}

      {status === "error" && (
        <div className="mt-3 text-sm text-red-500 animate-shake">
          ❌ Please enter a valid 6-digit pincode
        </div>
      )}
    </div>
  );
}
