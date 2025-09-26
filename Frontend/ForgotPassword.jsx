import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();
    alert("Password reset functionality can be implemented here.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <form onSubmit={handleForgot} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Forgot Password</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          Submit
        </button>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-green-600 hover:underline">Back to Login</Link>
        </div>
      </form>
    </div>
  );
}
