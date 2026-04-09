import { Link, useLocation } from "react-router-dom";
import Logo from "./../../../src/assets/farmer.jfif";
import { useState, useEffect, useRef } from "react";
import { Search } from "../Sections/Search";
import { DropdownLoggedIn } from "../Elements/DropdownLoggedIn";
import { DropdownLoggedOut } from "../Elements/DropdownLoggedOut";
import { useCart } from "../../Context/CartContext";
import { CategoryBar } from "../../components/Layouts/CategoryBar";

export const Header = () => {

  const [dropdown, setDropdown] = useState(false);

  const location = useLocation();
  const dropdownRef = useRef(null);

  const isLoggedIn = localStorage.getItem("user");

  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) || false
  );

  const { cartList } = useCart();

  // DARK MODE
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // CLOSE DROPDOWN ON ROUTE CHANGE
  useEffect(() => {
    setDropdown(false);
  }, [location]);

  // CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setDropdown((prev) => !prev);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md dark:bg-slate-900 dark:text-white">

      <nav className="w-full">
        <div className="flex justify-between items-center w-full px-8 py-4">

          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={Logo}
              className="h-10 w-10 rounded-full border-2 border-gray-400 object-cover"
              alt="F2M"
            />
            <span className="text-xl font-semibold">F2M</span>
          </Link>

          {/* SEARCH */}
          <div className="flex-1 mx-6">
            <Search setSearchSection={() => {}} />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-6" ref={dropdownRef}>

            {/* DARK MODE */}
            <span
              onClick={() => setDarkMode(!darkMode)}
              className="cursor-pointer text-xl text-gray-700 dark:text-white bi bi-gear-wide-connected"
            ></span>

            {/* CART */}
            <Link to="/cart" className="text-gray-700 dark:text-white">
              <span className="text-2xl bi bi-cart-fill relative">
                <span className="text-white text-sm absolute -top-1 left-2.5 bg-rose-500 px-1 rounded-full">
                  {cartList.length}
                </span>
              </span>
            </Link>

            {/* USER */}
            <span
              onClick={toggleDropdown}
              className="bi bi-person-circle cursor-pointer text-2xl text-gray-700 dark:text-white"
            ></span>

            {/* DROPDOWN */}
            {dropdown && (
              isLoggedIn
                ? <DropdownLoggedIn setDropdown={setDropdown} />
                : <DropdownLoggedOut setDropdown={setDropdown} />
            )}

          </div>

        </div>
      </nav>

      {/* ✅ ADD CATEGORY BAR HERE */}
      <CategoryBar />

    </header>
  );
};