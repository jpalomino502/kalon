import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import LoadingSkeleton from "../components/Loading/LoadingSkeleton";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [hoveredBlog, setHoveredBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsCollection = collection(db, "blogs");
        const blogSnapshot = await getDocs(blogsCollection);
        const blogList = blogSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogList);
      } catch (error) {
        console.error("Error fetching blogs: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleMouseEnter = (blog) => setHoveredBlog(blog);
  const handleMouseLeave = () => setHoveredBlog(null);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Nuestros Blogs Disponibles
      </h1>
      <p className="text-center mb-8 text-gray-700">
        Explore nuestra selección de Blogs online de alta calidad y potencie
        su desarrollo personal y profesional.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            to={`/blogs/${blog.id}`}
            className="block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
          >
            <div
              className="relative h-40"
              onMouseEnter={() => handleMouseEnter(blog)}
              onMouseLeave={handleMouseLeave}
            >
              {hoveredBlog && hoveredBlog.id === blog.id ? (
                <video autoPlay loop muted className="w-full h-full object-cover">
                  <source src={blog.videoURL} type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
              ) : (
                <div
                  className="h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${blog.image})` }}
                ></div>
              )}
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
              <p className="text-gray-700 mb-4">{blog.description}</p>
              <p className="text-gray-800 font-semibold mb-2">
                COP$ {blog.price},00
              </p>
              <p className="text-gray-600 mb-4">{blog.duration} horas</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
