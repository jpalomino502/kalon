import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import LoadingSkeleton from '../Loading/LoadingSkeleton';

const BlogDetail = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogDoc = doc(db, 'blogs', blogId);
        const blogSnap = await getDoc(blogDoc);
        if (blogSnap.exists()) {
          setBlog(blogSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleVideoError = () => {
    setVideoError(true);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!blog) {
    return <div>El blog no existe o ha sido eliminado.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 flex">
        <div className="w-1/2 relative">
          <div
            className="relative h-64 bg-cover bg-center mb-4 rounded-lg cursor-pointer"
            style={{ backgroundImage: `url(${blog.image})` }}
            onClick={() => setShowVideo(!showVideo)}
          >
            {!showVideo && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-white cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-5.197-2.88A1 1 0 008 9.103v5.794a1 1 0 001.555.832l5.197-2.88a1 1 0 000-1.664z"
                  />
                </svg>
              </div>
            )}
            {showVideo && blog.videoURL && (
              <video
                controls
                className="absolute inset-0 w-full h-full rounded-lg"
                onCanPlay={() => setVideoError(false)}
                onError={handleVideoError}
              >
                <source src={blog.videoURL} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
            )}
          </div>
          {videoError && (
            <div className="text-red-500 mt-2">
              Error cargando el video. Por favor, intenta nuevamente más tarde.
            </div>
          )}
          <div className="flex justify-between">
            <button className="bg-black text-white py-2 px-4 rounded-lg mr-2">
              Inscribirse Ahora
            </button>
            <button className="bg-gray-200 py-2 px-4 rounded-lg">
              Acceder al Blog
            </button>
          </div>
        </div>
        <div className="w-1/2 pl-8">
          <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
          <p className="text-gray-700 mb-4">{blog.description}</p>
          <div className="flex items-center mb-4">
            <p className="text-gray-800 font-semibold mr-2">
              Precio: COP$ {blog.price},00
            </p>
            <p className="text-gray-600">Duración: {blog.duration} horas</p>
          </div>
          {blog.topics && blog.topics.length > 0 && (
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Temas Cubiertos</h2>
              <ul className="list-disc list-inside">
                {blog.topics.map((topic, index) => (
                  <li key={index} className="text-gray-700">{topic}</li>
                ))}
              </ul>
            </div>
          )}
          {blog.instructor && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Sobre el Instructor</h2>
              <p className="text-gray-700">{blog.instructor}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
