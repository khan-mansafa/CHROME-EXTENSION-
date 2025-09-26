import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Sidebar from "./components/Sidebar";
import About from "./components/About";
import Helpline from "./components/Helpline";

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/register" element={<Register onRegister={setUser} />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  // Logged in -> show sidebar + navbar + main content
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <nav className="bg-green-600 text-white p-4 flex justify-between items-center">
            <h1 className="font-bold text-xl">Productivity Tracker</h1>
            <div className="space-x-4">
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <Link to="/history" className="hover:underline">History</Link>
              <Link to="/about" className="hover:underline">About</Link>
              <Link to="/helpline" className="hover:underline">Helpline</Link>
              <button
                onClick={() => setUser(null)}
                className="ml-4 bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </nav>

          {/* Routes */}
          <main className="flex-1 p-6 bg-gray-50">
            <Routes>
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/history" element={<History user={user} />} />
              <Route path="/about" element={<About />} />
              <Route path="/helpline" element={<Helpline />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
