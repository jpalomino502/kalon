import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import LoadingSkeleton from "../components/Loading/LoadingSkeleton";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesCollection = collection(db, "courses");
        const courseSnapshot = await getDocs(coursesCollection);
        const courseList = courseSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(courseList);
      } catch (error) {
        console.error("Error fetching courses: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleMouseEnter = (course) => setHoveredCourse(course);
  const handleMouseLeave = () => setHoveredCourse(null);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Nuestros Cursos Disponibles
      </h1>
      <p className="text-center mb-8 text-gray-700">
        Explore nuestra selección de cursos online de alta calidad y potencie
        su desarrollo personal y profesional.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow-md overflow-hidden relative"
            onMouseEnter={() => handleMouseEnter(course)}
            onMouseLeave={handleMouseLeave}
          >
            {hoveredCourse && hoveredCourse.id === course.id ? (
              <video
                autoPlay
                loop
                muted
                className="w-full h-40 object-cover"
              >
                <source src={course.videoURL} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
            ) : (
              <div
                className="h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${course.image})` }}
              ></div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{course.title}</h2>
              <p className="text-gray-700 mb-4">{course.description}</p>
              <p className="text-gray-800 font-semibold mb-2">
                COP$ {course.price},00
              </p>
              <p className="text-gray-600 mb-4">{course.duration} horas</p>
              <Link
                to={`/courses/${course.id}`}
                className="block bg-red-600 text-white text-center py-2 rounded"
              >
                Comprar Ahora
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
