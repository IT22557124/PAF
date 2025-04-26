import { Bell } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if userId exists in localStorage
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  return (
    <div className="w-full bg-emerald-600 px-8 py-4 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to={"/"}>
          <div className="text-white text-2xl font-bold hover:text-emerald-100 transition-colors">
            Food Manga
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-8">
          <div className="relative group">
            <Link
              to={"/"}
              className="text-emerald-50 hover:text-white transition-colors flex items-center"
            >
              Posts
            </Link>
          </div>
          <div className="relative group">
            <Link
              to={"/plans"}
              className="text-emerald-50 hover:text-white transition-colors flex items-center"
            >
              Plans
            </Link>
          </div>
          <div className="relative group">
            <Link
              to={"/progress"}
              className="text-emerald-50 hover:text-white transition-colors flex items-center"
            >
              Progresses
            </Link>
          </div>
          {isLoggedIn && (
            <div className="relative group">
              <Link
                to={"/chat"}
                className="text-emerald-50 hover:text-white transition-colors flex items-center"
              >
                Chat
              </Link>
            </div>
          )}
          <div className="relative group">
            <Link
              to={"/notifications"}
              className="text-emerald-50 hover:text-white transition-colors flex items-center"
            >
              <Bell className="hover:scale-110 transition-transform" />
            </Link>
          </div>
          <a
            href={isLoggedIn ? "/profile" : "/login"}
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            {isLoggedIn ? "Profile" : "Login"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
