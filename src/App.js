import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import PrivateRoute from "./components/Routes/PrivateRoute";
import LoadingSkeleton from "./components/Loading/LoadingSkeleton";

const Home = React.lazy(() => import("./pages/Home"));
const Courses = React.lazy(() => import("./pages/Courses"));
const Blog = React.lazy(() => import("./pages/Blog"));
const Profile = React.lazy(() => import("./pages/Profile"));
const EditProfile = React.lazy(() => import("./components/Profile/EditProfile"));
const BlogPost = React.lazy(() => import("./components/Blog/BlogPost"));
const Login = React.lazy(() => import("./components/Auth/Login"));
const Register = React.lazy(() => import("./components/Auth/Register"));
const ForgotPassword = React.lazy(() =>
  import("./components/Auth/ForgotPassword")
);
const AdminCoursesList = React.lazy(() =>
  import("./components/Admin/AdminCoursesList")
);
const AdminBlogsList = React.lazy(() =>
  import("./components/Admin/AdminBlogsList")
);
const AdminSidebar = React.lazy(() =>
  import("./components/Admin/AdminSidebar")
);
const AdminTabs = React.lazy(() => import("./components/Admin/AdminTabs"));
const CourseDetail = React.lazy(() => import("./components/Courses/CourseDetail"));

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

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<LoadingSkeleton />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId" element={<CourseDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route
                path="/profile"
                element={currentUser ? <Profile /> : <Navigate to="/login" />}
              />
              <Route
                path="/edit-profile"
                element={
                  currentUser ? <EditProfile /> : <Navigate to="/login" />
                }
              />
              <Route path="/blog/:postId" element={<BlogPost />} />
              <Route
                path="/login"
                element={!currentUser ? <Login /> : <Navigate to="/profile" />}
              />
              <Route
                path="/register"
                element={
                  !currentUser ? <Register /> : <Navigate to="/profile" />
                }
              />
              <Route
                path="/forgot-password"
                element={
                  !currentUser ? <ForgotPassword /> : <Navigate to="/profile" />
                }
              />
              <Route element={<PrivateRoute role="admin" />}>
                <Route path="admin" element={<AdminDashboardLayout />}>
                  <Route index element={<AdminEmpty />} />
                  <Route path="blogs" element={<AdminBlogsList />} />
                  <Route path="courses" element={<AdminCoursesList />} />
                  <Route path="blog/edit/:postId" element={<AdminBlogsList />} />
                  <Route path="course/edit/:courseId" element={<AdminCoursesList />} />
                </Route>
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
