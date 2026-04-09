import { Routes, Route } from "react-router-dom";
import { ProductDetail, ProductList } from "../pages";
import { HomePage } from "../pages/Home/HomePage";
import { CartList } from "../pages/Cart/components/CartList";
import { Checkout } from "../pages/Cart/components/Checkout";
import { Login } from "../pages/Login";
import { ExploreProductsPage } from "../pages/Products/ExploreProductsPage";
import  Register  from "../pages/Register";
import { Payment } from "../pages/Order/Payment";
import { OrderSuccess } from "../pages/Order/components/OrderSuccess";
import { OrderFail } from "../pages/Order/components/OrderFail";
import { Dashboard } from "../pages/Dashboard/DashboardPage";
import { FreshProducts } from "../pages/FreshProducts";
import { CustomerCare } from "../pages/CustomerCare";
import AddProduct from "../pages/AddProduct";
import FarmerProductsDashboard from "../pages/Dashboard/FarmerProductsDashboard";
import AddFarm from "../pages/AddFarm";
import UpdateProduct from "../components/Elements/UpdateProduct";
import AddCompany from "../pages/AddCompany";
import Profile from "../pages/Profile";
import OrderedItemRequests  from "../pages/Order/components/OrderedItemRequests";
import MyFarms from "../pages/MyFarms";
import MyCompanies from "../pages/MyCompanies";
import FarmerProductRequests from "../pages/Products/FarmerProductRequests";
import CompletedItemRequests from "../pages/Order/components/CompletedItemRequests";
import {AddProductAdmin,AdminProductRequests, CompanyRequest, RegisterUser,AdminOrderRequests , BuyersList,FarmersList,SupervisorsList,UsersList } from "../pages/Admin/index";
import {
  FarmersListUnderSupervisor,
  FarmRequests,
  ProductRequests,
  OrderedItems,
  ProductsManagement
} from "../pages/Supervisor";

export const AllRoutes = () => {
  return (
    <Routes>
      

      
      <Route path="/" element={<HomePage />} />
      <Route path="products" element={<ProductList />} />
      <Route path="explore-Products" element={<ExploreProductsPage />} />
      <Route path="products/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<CartList />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/customer-care" element={<CustomerCare/>}/>
      <Route path="/payment" element={<Payment />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/order-failed" element={<OrderFail />} />
      <Route path="/my-orders" element={<Dashboard />} />
      <Route path="/products/fresh" element={<FreshProducts />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/my-products" element={<FarmerProductsDashboard />} />
      <Route path="/add-farm" element={<AddFarm />} />
      <Route path="/add-company" element={<AddCompany />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/completed-items" element={<CompletedItemRequests />} />
      <Route path="/my-farms" element={<MyFarms />} />
      <Route path="/my-companies" element={<MyCompanies />} />
      <Route path="/admin/users" element={<UsersList />} />
      <Route path="/admin/add-user" element={<RegisterUser />} />
      <Route path="/admin/add-product" element={<AddProductAdmin />} />
      <Route path="/admin/farmers" element={<FarmersList />} />
      <Route path="/admin/update-product/:id" element={<UpdateProduct />} />
      <Route path="/admin/company-requests" element={<CompanyRequest />} />
      <Route path="/admin/pending-items" element ={<AdminOrderRequests/>} />
      <Route path="/admin/supervisors" element={<SupervisorsList />} />
      <Route path="/admin/buyers" element={<BuyersList />} />
      <Route path="/supervisor/farmers" element={<FarmersListUnderSupervisor />} />
      <Route path="/supervisor/farm-requests" element={<FarmRequests />} />
      <Route path="/product-requests" element={<ProductRequests />} />
      <Route path="/supervisor/order-requests" element={<OrderedItems />} />
      <Route path="/supervisor/products" element={<ProductsManagement />} />
      <Route path="/farmer/product-requests" element={<FarmerProductRequests />} />
      <Route path="/admin/product-requests" element={<AdminProductRequests />} />
      <Route path="/ordered-items" element={<OrderedItemRequests />} />
    </Routes>
  );
};