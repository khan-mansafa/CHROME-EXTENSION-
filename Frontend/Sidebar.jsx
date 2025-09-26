import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="w-64 bg-white h-screen shadow-md p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-600">ProdTracker</h2>
      <ul>
        <li className="mb-4">
          <Link to="/" className="text-gray-700 hover:text-green-600">Dashboard</Link>
        </li>
        <li className="mb-4">
          <Link to="/about" className="text-gray-700 hover:text-green-600">About</Link>
        </li>
        <li className="mb-4">
          <Link to="/helpline" className="text-gray-700 hover:text-green-600">Helpline</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
