import { useNavigate } from "react-router-dom";

export const DropdownLoggedIn = ({ setDropdown }) => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // Generic navigation function
  const navigateTo = (path) => {
    setDropdown(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setDropdown(false);
    navigate("/login");
  };

  return (
    <div className="absolute right-0 top-10 w-56 border bg-white dark:bg-gray-900 rounded shadow z-50">

      {/* USER NAME */}
      <span className="block px-4 py-2 font-semibold text-gray-800 dark:text-white border-b">
        {user?.name ? `Hello, ${user.name}` : "User"}
      </span>

      {/* COMMON */}
      <span
        onClick={() => navigateTo("/products")}
        className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Products
      </span>
      <span
        onClick={() => navigateTo("/profile")}
        className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Profile
      </span>
      <span onClick={() => navigateTo("/completed-items")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            Completed Items
          </span>
      {/* FARMER ONLY */}
      {role === "FARMER" && (
        <>
          <span onClick={() => navigateTo("/add-farm")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            Add Farm
          </span>
          <span onClick={() => navigateTo("/my-farms")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            My Farms
          </span>
          
          <span onClick={() => navigateTo("/add-product")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            Add Product
          </span>
          <span onClick={() => navigateTo("/my-products")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            My Products
          </span>
          <span onClick={() => navigateTo("/farmer/product-requests")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            My Product Requests
          </span>
          <span onClick={() => navigateTo("/my-videos")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            My Videos
          </span>
        </>
      )}

      {/* BUYER ONLY */}
      {role === "BUYER" && (
        <>
          <span onClick={() => navigateTo("/add-company")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            Add Company
          </span>
          <span
            onClick={() => navigateTo("/my-companies")}
            className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            My Companies
          </span>
          <span onClick={() => navigateTo("/my-orders")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            My Orders
          </span>
        </>
      )}

      {/* ADMIN ONLY */}
      {role === "ADMIN" && (
        <>
          
          <span onClick={() => navigateTo("/admin/farmers")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            Farmers List
          </span>
          <span onClick={() => navigateTo("/admin/supervisors")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            Supervisors List
          </span>
          <span onClick={() => navigateTo("/admin/buyers")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            Buyers List
          </span>
          {/* ✅ NEW FIELD ADDED */}
          <span onClick={() => navigateTo("/admin/company-requests")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            Company Requests
          </span>
          
          <span onClick={() => navigateTo("/admin/product-requests")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            Product Requests
          </span>
          <span onClick={() => navigateTo("/admin/pending-items")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            Order Requests
          </span>
          <span onClick={() => navigateTo("/ordered-items")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
              Ordered Items Requests
            </span>
            
          <span onClick={() => navigateTo("/add-product")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            Add Product
          </span>
          <span onClick={() => navigateTo("/admin/add-user")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            Add User
          </span>
          <span onClick={() => navigateTo("/admin/users")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            Users List
          </span>
        </>
      )}

      {/* SUPERVISOR ONLY */}
      {role === "SUPERVISOR" && (
        <>
          <span onClick={() => navigateTo("/supervisor/farmers")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            Farmers List
          </span>
          <span onClick={() => navigateTo("/supervisor/farm-requests")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            Farm Requests
          </span>
          <span onClick={() => navigateTo("/product-requests")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            Product Requests
          </span>
          <span onClick={() => navigateTo("/supervisor/order-requests")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            Order Requests
          </span>
          <span onClick={() => navigateTo("/ordered-items")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
              Ordered Items Requests
            </span>
            <span onClick={() => navigateTo("/completed-items")} className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                My Completed Items
              </span>
        </>
      )}

      {/* COMMON LOGOUT */}
      <span
        onClick={handleLogout}
        className="block px-4 py-2 cursor-pointer text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Logout
      </span>
      <span
        onClick={() => navigateTo("/customer-care")}
        className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Customer Care
      </span>
    </div>
  );
};