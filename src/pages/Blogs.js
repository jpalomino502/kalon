import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import LoadingSkeleton from "../components/Loading/LoadingSkeleton";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
        console.error("Error al obtener los blogs: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-6">Últimos Blogs</h1>
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Buscar blogs..."
          className="border rounded-lg px-4 py-2 w-full max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 gap-6">
        {filteredBlogs.map((blog) => (
          <div key={blog.id} className="flex border-b pb-4 mb-4 items-start">
            <div className="w-1/4">
              <img src={blog.image} alt={blog.title} className="w-full h-40 object-cover rounded-lg shadow-md" />
            </div>
            <div className="w-3/4 pl-6">
              <Link to={`/blogs/${blog.id}`} className="block mb-2 hover:underline">
                <h2 className="text-3xl font-semibold mb-1">{blog.title}</h2>
              </Link>
              <p className="text-gray-600 mb-2">
                {new Date(blog.date).toLocaleDateString()} - {blog.author}
              </p>
              <p className="text-gray-800 mb-2">{blog.description}</p>
              <Link
                to={`/blogs/${blog.id}`}
                className="inline-block bg-red-600 text-white py-2 px-4 hover:bg-red-700 transition duration-300"
                style={{ backgroundColor: "#D91604", border: "none" }}
              >
                Leer más
              </Link>
              <div className="flex flex-wrap mt-4">
                {blog.tags && blog.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-200 text-gray-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
