import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import LoadingSkeleton from '../Loading/LoadingSkeleton';

const CourseDetail = ({ onAddToCart }) => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseDoc = doc(db, 'courses', courseId);
        const courseSnap = await getDoc(courseDoc);
        if (courseSnap.exists()) {
          setCourse(courseSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleVideoError = () => {
    setVideoError(true);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!course) {
    return <div>El curso no existe o ha sido eliminado.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 flex">
        <div className="w-1/2 relative">
          <div
            className="relative h-64 bg-cover bg-center mb-4"
            style={{ backgroundImage: `url(${course.image})` }}
            onClick={() => setShowVideo(!showVideo)}
          >
            {!showVideo && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer">
                <svg
                  className="w-16 h-16 text-white"
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
            {showVideo && course.videoURL && (
              <video
                controls
                className="absolute inset-0 w-full h-full"
                onCanPlay={() => setVideoError(false)}
                onError={handleVideoError}
              >
                <source src={course.videoURL} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
            )}
          </div>
          {videoError && (
            <div className="text-red-500 mt-2">
              Error cargando el video. Por favor, intenta nuevamente más tarde.
            </div>
          )}
          <div className="mt-4">
            <button className="bg-red-600 text-white py-2 px-4 mr-2" onClick={() => onAddToCart(course)}>
              Comprar
            </button>
          </div>
        </div>
        <div className="w-1/2 pl-8">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-700 mb-4">{course.description}</p>
          <p className="text-gray-800 font-semibold mb-2">
            Precio: COP$ {course.price},00
          </p>
          <p className="text-gray-600 mb-4">Duración: {course.duration} horas</p>
          {course.topics && course.topics.length > 0 && (
            <div className="mt-4">
              <h2 className="text-2xl font-bold">Temas Cubiertos</h2>
              <ul className="list-disc list-inside">
                {course.topics.map((topic, index) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
            </div>
          )}
          {course.instructor && (
            <div className="mt-4">
              <h2 className="text-2xl font-bold">Sobre el Instructor</h2>
              <p>{course.instructor}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
