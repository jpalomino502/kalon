import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import PrivateRoute from "./components/PrivateRoute";

// Carga perezosa de componentes
const Home = React.lazy(() => import("./pages/Home"));
const Courses = React.lazy(() => import("./pages/Courses"));
const Blog = React.lazy(() => import("./pages/Blog"));
const Profile = React.lazy(() => import("./pages/Profile"));
const BlogPost = React.lazy(() => import("./components/Blog/BlogPost"));
const Login = React.lazy(() => import("./components/Auth/Login"));
const Register = React.lazy(() => import("./components/Auth/Register"));
const ForgotPassword = React.lazy(() => import("./components/Auth/ForgotPassword"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const CourseForm = React.lazy(() => import("./components/Admin/CourseForm"));
const BlogForm = React.lazy(() => import("./components/Admin/BlogForm"));

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/blog/:postId" element={<BlogPost />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Rutas protegidas para la administración */}
              <Route element={<PrivateRoute role="admin" />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/course/new" element={<CourseForm />} />
                <Route path="/admin/course/:courseId" element={<CourseForm />} />
                <Route path="/admin/blog/new" element={<BlogForm />} />
                <Route path="/admin/blog/:postId" element={<BlogForm />} />
              </Route>
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
