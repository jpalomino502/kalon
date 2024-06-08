import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Blog from "./pages/Blog";
import Profile from "./pages/Profile";
import BlogPost from "./components/Blog/BlogPost";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import CourseForm from "./components/Admin/CourseForm";
import BlogForm from "./components/Admin/BlogForm";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
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
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
