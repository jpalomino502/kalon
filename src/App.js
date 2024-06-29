import React, { useState, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import PrivateRoute from "./components/Routes/PrivateRoute";
import LoadingSkeleton from "./components/Loading/LoadingSkeleton";
import CheckoutForm from "./components/CheckoutForm/CheckoutForm"; 
import HeroCarousel from "./components/Home/Hero"; // Importar el componente Hero

const Home = React.lazy(() => import("./pages/Home"));
const Courses = React.lazy(() => import("./pages/Courses"));
const Blog = React.lazy(() => import("./pages/Blogs"));
const Profile = React.lazy(() => import("./pages/Profile"));
const EditProfile = React.lazy(() => import("./components/Profile/EditProfile"));
const Login = React.lazy(() => import("./components/Auth/Login"));
const Register = React.lazy(() => import("./components/Auth/Register"));
const ForgotPassword = React.lazy(() => import("./components/Auth/ForgotPassword"));
const AdminCoursesList = React.lazy(() => import("./components/Admin/AdminCoursesList"));
const AdminBlogsList = React.lazy(() => import("./components/Admin/AdminBlogsList"));
const AdminSidebar = React.lazy(() => import("./components/Admin/AdminSidebar"));
const AdminTabs = React.lazy(() => import("./components/Admin/AdminTabs"));
const CourseDetail = React.lazy(() => import("./components/Courses/CourseDetail"));
const BlogDetail = React.lazy(() => import("./components/Blog/BlogDetail"));
const AboutUs = React.lazy(() => import("./pages/AboutUs"));

const AdminEmpty = () => <div></div>;

const AdminDashboardLayout = () => {
  return (
    <div className="flex">
      <Suspense fallback={<LoadingSkeleton />}>
        <AdminSidebar />
      </Suspense>
      <div className="flex-1 flex flex-col p-6">
        <Suspense fallback={<LoadingSkeleton />}>
          <AdminTabs />
        </Suspense>
        <Routes>
          <Route index element={<AdminEmpty />} />
          <Route path="blogs" element={<AdminBlogsList />} />
          <Route path="courses" element={<AdminCoursesList />} />
          <Route path="blog/edit/:postId" element={<AdminBlogsList />} />
          <Route path="course/edit/:courseId" element={<AdminCoursesList />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleAddToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = () => {
    setCheckoutOpen(true);
  };

  const handleSuccessfulCheckout = (payment) => {
    setCartItems([]);
    setCheckoutOpen(false);
    console.log("Pago exitoso:", payment);
    alert("Pago exitoso");
    return <Navigate to="/" />;
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header cartItems={cartItems} onClearCart={handleClearCart} onCheckout={handleCheckout} />
        <main className="flex-grow">
          <Suspense fallback={<LoadingSkeleton />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses onAddToCart={handleAddToCart} />} />
              <Route path="/courses/:courseId" element={<CourseDetail onAddToCart={handleAddToCart} />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blogs/:blogId" element={<BlogDetail />} /> 
              <Route path="/profile" element={currentUser ? <Profile /> : <Navigate to="/login" />} />
              <Route path="/edit-profile" element={currentUser ? <EditProfile /> : <Navigate to="/login" />} />
              <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/profile" />} />
              <Route path="/register" element={!currentUser ? <Register /> : <Navigate to="/profile" />} />
              <Route path="/forgot-password" element={!currentUser ? <ForgotPassword /> : <Navigate to="/profile" />} />
              <Route element={<PrivateRoute role="admin" />}>
                <Route path="admin" element={<AdminDashboardLayout />}>
                  <Route index element={<AdminEmpty />} />
                  <Route path="blogs" element={<AdminBlogsList />} />
                  <Route path="courses" element={<AdminCoursesList />} />
                  <Route path="blog/edit/:postId" element={<AdminBlogsList />} />
                  <Route path="course/edit/:courseId" element={<AdminCoursesList />} />
                </Route>
              </Route>
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/hero-carousel" element={<HeroCarousel />} /> {/* Nueva ruta para el carrusel */}
            </Routes>
          </Suspense>
        </main>
        <Footer />
        {checkoutOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl mb-4">Procesar Pago con PayPal</h2>
              <CheckoutForm onSuccessfulCheckout={handleSuccessfulCheckout} />
              <button onClick={() => setCheckoutOpen(false)} className="mt-4 w-full bg-red-500 text-white py-2 rounded">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
