import React, { useEffect, useState } from "react";

export default function History({ user }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`http://127.0.0.1:5000/api/history/${user.id}`)
        .then(res => res.json())
        .then(data => setHistory(data))
        .catch(err => console.error("Error fetching history:", err));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-xl">Please log in to see history.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-blue-700">Browsing History</h1>
        <p className="text-blue-800 mt-1">Recent sites you visited</p>
      </header>

      <main className="bg-white rounded shadow p-6">
        {history.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-2 text-left">Website</th>
                <th className="border p-2 text-left">Category</th>
                <th className="border p-2 text-left">Duration (sec)</th>
                <th className="border p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, i) => (
                <tr key={i} className="hover:bg-blue-50">
                  <td className="border p-2">{item.website}</td>
                  <td
                    className={`border p-2 font-semibold ${
                      item.category === "productive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.category}
                  </td>
                  <td className="border p-2">{item.duration}</td>
                  <td className="border p-2">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No history available yet.</p>
        )}
      </main>
    </div>
  );
}
