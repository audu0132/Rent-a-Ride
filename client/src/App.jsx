import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { motion } from "framer-motion";

// User Pages
const Home = lazy(() => import("./pages/user/Home"));
const SignUp = lazy(() => import("./pages/user/SignUp"));
const SignIn = lazy(() => import("./pages/user/SignIn"));
const Vehicles = lazy(() => import("./pages/user/Vehicles"));
const Profile = lazy(() => import("./pages/user/Profile"));
const Enterprise = lazy(() => import("./pages/user/Enterprise"));
const Contact = lazy(() => import("./pages/user/Contact"));
const VehicleDetails = lazy(() => import("./pages/user/VehicleDetails"));
const Orders = lazy(() => import("./pages/user/Orders"));
const AvailableVehicles = lazy(() => import("./pages/user/AvailableVehiclesAfterSearch"));
const CheckoutPage = lazy(() => import("./pages/user/CheckoutPage"));
const Razorpay = lazy(() => import("./pages/user/Razorpay"));
const AllVehiclesofSameModel = lazy(() => import("./pages/user/AllVehiclesofSameModel"));
const CarNotFound = lazy(() => import("./pages/user/CarNotFound"));

// Vendor Pages
const VendorSignin = lazy(() => import("./pages/vendor/pages/VendorSignin"));
const VendorSignup = lazy(() => import("./pages/vendor/pages/VendorSignup"));
const VendorDashboard = lazy(() => import("./pages/vendor/Dashboard/VendorDashboard"));
const VendorEditProductComponent = lazy(() => import("./pages/vendor/Components/VendorEditProductComponent"));
const VendorDeleteVehicleModal = lazy(() => import("./pages/vendor/Components/VendorDeleteVehicleModal"));
const VendorAddProductModal = lazy(() => import("./pages/vendor/Components/VendorAddVehilceModal"));

// Admin Pages
const Layout = lazy(() => import("./pages/admin/layouts/Layout"));
const AdminDashNew = lazy(() => import("./pages/admin/dashboard/AdminDashNew"));
const EditProductComponent = lazy(() => import("./pages/admin/components/EditProductComponent"));
const AddProductModal = lazy(() => import("./pages/admin/components/AddProductModal"));

// Layout & Route Wrappers
import With_nav from "./components/Layout/WithNav";
import PrivateRoute, { PrivateSignin } from "./components/PrivateRoute";
import AdminPrivateRoutes from "./components/AdminPrivateRoutes";
import VendorPrivateRoute from "./components/VendorPrivateRoute";

// Premium Page Loader
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-slate-950">
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
        borderRadius: ["20%", "50%", "20%"],
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
      }}
      className="h-16 w-16 bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)]"
    />
  </div>
);

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/adminHome" element={<Navigate to="/adminDashboard/adminHome" replace />} />
          <Route path="*" element={<CarNotFound />} />
          
          <Route element={<With_nav />}>
            <Route path="/" element={<Home />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/enterprise" element={<Enterprise />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route element={<PrivateSignin />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/vendorSignin" element={<VendorSignin />} />
            <Route path="/vendorSignup" element={<VendorSignup />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/profile/*" element={<Profile />} />
            <Route path="/allVariants" element={<AllVehiclesofSameModel />} />
            <Route path="/vehicleDetails" element={<VehicleDetails />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/availableVehicles" element={<AvailableVehicles />} />
            <Route path="/checkoutPage" element={<CheckoutPage />} />
            <Route path="/razorpay" element={<Razorpay />} />
          </Route>

          <Route element={<VendorPrivateRoute />}>
            <Route path="/vendorDashboard/*" element={<VendorDashboard />} />
            <Route path="/vendorDashboard/vendorEditProductComponent" element={<VendorEditProductComponent />} />
            <Route path="/vendorDashboard/vendorDeleteVehicleModal" element={<VendorDeleteVehicleModal />} />
            <Route path="vendorDashboard/vendorAddProduct" element={<VendorAddProductModal />} />
          </Route>

          <Route element={<AdminPrivateRoutes />}>
            <Route element={<Layout />}>
              <Route path="/adminDashboard/*" element={<AdminDashNew />} />
              <Route path="/adminDashboard/editProducts" element={<EditProductComponent />} />
              <Route path="/adminDashboard/addProducts" element={<AddProductModal />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
