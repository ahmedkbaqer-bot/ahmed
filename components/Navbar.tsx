import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-yellow-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-white text-2xl font-bold">
          Hopi Kids
        </NavLink>
        <div className="space-x-4">
          <NavLink to="/lessons" className="text-white hover:text-yellow-200">
            Lessons
          </NavLink>
          <NavLink to="/games" className="text-white hover:text-yellow-200">
            Games
          </NavLink>
          <NavLink to="/profile" className="text-white hover:text-yellow-200">
            Profile
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
