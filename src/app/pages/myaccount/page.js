"use client";

import { useState } from "react";

export default function MyAccountPage() {
  const [editable, setEditable] = useState(false);
  const [user, setUser] = useState({
    fullName: "John Demo",
    email: "johndemo@example.com",
    phone: "+1 555 678 1234",
    address: "1234 Elm Street, Some City, USA",
  });

  const orders = [
    { id: "1001", date: "2025-10-11", status: "Delivered", total: 79.99 },
    { id: "1002", date: "2025-10-30", status: "Processing", total: 45.5 },
  ];

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5 text-gray-800 md:px-20">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
        My Account
      </h1>

      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-12">
        {/* Profile Info */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
            <label className="flex flex-col">
              <span className="mb-1 font-medium text-gray-700">Full Name</span>
              <input
                type="text"
                name="fullName"
                disabled={!editable}
                onChange={handleChange}
                value={user.fullName}
                className={`border rounded px-4 py-2 ${
                  editable
                    ? "border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1 font-medium text-gray-700">Email Address</span>
              <input
                type="email"
                name="email"
                disabled={!editable}
                onChange={handleChange}
                value={user.email}
                className={`border rounded px-4 py-2 ${
                  editable
                    ? "border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1 font-medium text-gray-700">Phone Number</span>
              <input
                type="tel"
                name="phone"
                disabled={!editable}
                onChange={handleChange}
                value={user.phone}
                className={`border rounded px-4 py-2 ${
                  editable
                    ? "border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
              />
            </label>
            <label className="flex flex-col col-span-1 md:col-span-2">
              <span className="mb-1 font-medium text-gray-700">Address</span>
              <textarea
                name="address"
                disabled={!editable}
                onChange={handleChange}
                value={user.address}
                rows={3}
                className={`border rounded px-4 py-2 resize-none ${
                  editable
                    ? "border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
              />
            </label>
          </div>

          <div className="mt-6 flex gap-4">
            {!editable ? (
              <button
                onClick={() => setEditable(true)}
                className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => setEditable(false)}
                  className="px-6 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setEditable(false);
                    // TODO: perform save operation
                    alert("Profile saved (mock)");
                  }}
                  className="px-6 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition"
                >
                  Save
                </button>
              </>
            )}
          </div>
        </section>

        {/* Order History */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Order History</h2>

          <div className="overflow-x-auto">
            <table className="w-full table-auto bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 border-b border-gray-300">
                    Order ID
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 border-b border-gray-300">
                    Date
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 border-b border-gray-300">
                    Status
                  </th>
                  <th className="py-3 px-6 text-right text-sm font-medium text-gray-600 border-b border-gray-300">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map(({ id, date, status, total }) => (
                  <tr key={id} className="odd:bg-white even:bg-gray-50">
                    <td className="py-3 px-6 text-sm text-gray-800 font-mono">{id}</td>
                    <td className="py-3 px-6 text-sm">{date}</td>
                    <td className="py-3 px-6 text-sm">{status}</td>
                    <td className="py-3 px-6 text-sm text-right font-semibold">${total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
