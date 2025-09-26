import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from "recharts";

export default function Dashboard({ user }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to convert date to day name
  const getDayName = (dateString) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  useEffect(() => {
    if (!user) return;

    const fetchData = () => {
      fetch(`http://127.0.0.1:5000/api/analytics/${user.id}`)
        .then(res => res.json())
        .then(apiData => {
          // Convert seconds to minutes and clamp max 10
          const cleanedData = apiData.map(item => ({
            day: getDayName(item.date), // convert date to day name
            productive: Math.min(10, Math.round(item.productive / 60)),
            unproductive: Math.min(10, Math.round(item.unproductive / 60))
          }));
          setData(cleanedData);
          setLoading(false);
        })
        .catch(err => console.log("Error fetching analytics:", err));
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-xl">
          User not logged in. Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-6 flex flex-col">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-green-700">
          Productivity Tracker
        </h1>
        <p className="text-green-800 mt-1">Welcome, {user.email}</p>
      </header>

      <main className="flex-1 bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">
          Weekly Productivity (Minutes)
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading data...</p>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" label={{ value: "Day", position: "insideBottomRight", offset: -5 }} />
              <YAxis
                label={{ value: "Minutes", angle: -90, position: "insideLeft" }}
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
              />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="productive"
                stroke="#10B981"
                strokeWidth={2}
              >
                <LabelList dataKey="productive" position="top" />
              </Line>
              <Line
                type="monotone"
                dataKey="unproductive"
                stroke="#EF4444"
                strokeWidth={2}
              >
                <LabelList dataKey="unproductive" position="top" />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No data available yet.</p>
        )}
      </main>

      <footer className="text-center mt-8 text-gray-400 text-sm">
        © 2025 Productivity Tracker | Tracks your productivity in minutes by day.
      </footer>
    </div>
  );
}
