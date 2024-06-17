import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import LoadingSkeleton from '../Loading/LoadingSkeleton'; // Importa un componente de carga opcional

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false); // Estado para manejar errores de carga de video

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
    setVideoError(true); // Maneja errores de carga de video
  };

  if (loading) {
    return <LoadingSkeleton />; // Componente de carga mientras se obtienen los datos del curso
  }

  if (!course) {
    return <div>El curso no existe o ha sido eliminado.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        {course.image && (
          <div
            className="h-64 bg-cover bg-center mb-4"
            style={{ backgroundImage: `url(${course.image})` }}
          ></div>
        )}
        <p className="text-gray-700 mb-4">{course.description}</p>
        <p className="text-gray-800 font-semibold mb-2">Precio: R$ {course.price},00</p>
        <p className="text-gray-600 mb-4">Duración: {course.duration} horas</p>

        {/* Reproductor de video */}
        {course.videoURL ? (
          <div className="mb-4">
            <video
              controls
              className="w-full rounded-lg shadow-md"
              onCanPlay={() => setVideoError(false)}
              onError={handleVideoError}
            >
              <source src={course.videoURL} type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>
            {videoError && (
              <p className="text-red-600 mt-2">
                Hubo un error al cargar el video. Por favor, intenta nuevamente más tarde.
              </p>
            )}
          </div>
        ) : (
          <p className="text-red-600">No hay video disponible para este curso.</p>
        )}

        <div className="mt-4">
          <h2 className="text-2xl font-bold">Temas Cubiertos</h2>
          <ul className="list-disc list-inside">
            {course.topics && course.topics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl font-bold">Sobre el Instructor</h2>
          <p>{course.instructor}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
