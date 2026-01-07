/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";

const DELHIVERY_API =
  "https://staging-express.delhivery.com/c/api/pin-codes/json/?filter_codes=";

export default function PincodeCheck({ deliveryRange }) {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState(null); // idle | loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("pincode");
    if (saved) {
      setPincode(saved);
      setStatus("success");
      setMessage(`Delivery available to ${saved}`);
    }
  }, []);

  const checkPincode = async () => {
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setStatus("error");
      setMessage("Please enter a valid 6-digit pincode");
      return;
    }

    try {
      setStatus("loading");
      setMessage("");

      const res = await fetch(
        `${DELHIVERY_API}${pincode}`,
        {
          headers: {
            Authorization: `Token ${process.env.NEXT_PUBLIC_DELHIVERY_TOKEN}`,
          },
        }
      );

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      const pinData = data?.delivery_codes?.[0]?.postal_code;

      if (pinData && pinData.pre_paid === "Y") {
        localStorage.setItem("pincode", pincode);
        setStatus("success");
        setMessage(
          `Delivery available to ${pinData.city}, ${pinData.state}`
        );
      } else {
        setStatus("error");
        setMessage("Delivery not available for this pincode");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Unable to check delivery. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 animate-fadeIn">
      <p className="font-semibold text-gray-900 mb-2">
        Check Delivery Availability
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter 6-digit pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          maxLength={6}
          className="border px-3 py-2 rounded-lg w-full
                     focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <button
          onClick={checkPincode}
          disabled={status === "loading"}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold
                     hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {status === "loading" ? "Checking..." : "Check"}
        </button>
      </div>

      {/* SUCCESS */}
      {status === "success" && (
        <div className="mt-3 text-sm text-green-600 animate-slideUp">
          ✅ {message}
          <div className="mt-1 text-gray-600">
            🚚 Delivery by <b>{deliveryRange}</b> <br />
            💳 COD Available • 🔄 Easy Returns
          </div>
        </div>
      )}

      {/* ERROR */}
      {status === "error" && (
        <div className="mt-3 text-sm text-red-500 animate-slideUp">
          ❌ {message}
        </div>
      )}
    </div>
  );
}
