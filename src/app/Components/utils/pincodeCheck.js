"use client";
import { useState } from "react";

export default function PincodeCheck({ deliveryRange }) {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);

  const checkPincode = async () => {
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setStatus("error");
      return;
    }

    try {
      setStatus("loading");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/pincode/check?pincode=${pincode}`
      );

      const data = await res.json();

      if (!data.available) {
        setStatus("unavailable");
      } else {
        setResult(data);
        setStatus("success");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="bg-white rounded-xl border p-4 mt-4">
      <p className="font-semibold mb-2">Check Delivery Availability</p>

      <div className="flex gap-2">
        <input
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter Pincode"
          className="flex-1 border px-3 py-2 rounded-lg"
        />
        <button
          onClick={checkPincode}
          className="bg-indigo-600 text-white px-4 rounded-lg"
        >
          Check
        </button>
      </div>

      {/* STATES */}
      {status === "loading" && (
        <p className="text-sm mt-2 text-gray-500">
          Checking availability…
        </p>
      )}

      {status === "success" && result && (
        <p className="text-sm mt-2 text-green-600">
          ✅ Deliverable to {result.city}, {result.state} <br />
          🚚 Delivery by <b>{deliveryRange}</b> <br />
          {result.cod && "💵 Cash on Delivery available"}
        </p>
      )}

      {status === "unavailable" && (
        <p className="text-sm mt-2 text-red-600">
          ❌ Not deliverable to this pincode
        </p>
      )}

      {status === "error" && (
        <p className="text-sm mt-2 text-red-600">
          ⚠️ Invalid pincode or service error
        </p>
      )}
    </div>
  );
}
