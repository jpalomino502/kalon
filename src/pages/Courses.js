import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import LoadingSkeleton from "../components/Loading/LoadingSkeleton";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

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
        setFilteredCourses(courseList); // Initialize filtered courses with all courses
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterCourses(e.target.value, filterCategory);
  };

  const handleCategoryChange = (e) => {
    setFilterCategory(e.target.value);
    filterCourses(searchTerm, e.target.value);
  };

  const filterCourses = (searchTerm, category) => {
    let filtered = courses;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(search) ||
          course.description.toLowerCase().includes(search)
      );
    }

    if (category) {
      filtered = filtered.filter((course) => course.category === category);
    }

    setFilteredCourses(filtered);
  };

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
      <div className="flex justify-between mb-6">
        <div className="w-1/3">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Buscar por nombre o descripción"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-1/3">
          <select
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={filterCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Filtrar por categoría</option>
            <option value="Teoría Musical">Teoría Musical</option>
            <option value="Instrumentos">Instrumentos</option>
            <option value="Producción Musical">Producción Musical</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Link
            key={course.id}
            to={`/courses/${course.id}`}
            className="block text-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
          >
            <div
              className="relative h-40"
              onMouseEnter={() => handleMouseEnter(course)}
              onMouseLeave={handleMouseLeave}
            >
              {hoveredCourse && hoveredCourse.id === course.id ? (
                <video autoPlay loop muted className="w-full h-full object-cover">
                  <source src={course.videoURL} type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
              ) : (
                <div
                  className="h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${course.image})` }}
                ></div>
              )}
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{course.title}</h2>
              <p className="text-gray-700 mb-4">{course.description}</p>
              <p className="text-gray-800 font-semibold mb-2">
                COP$ {course.price},00
              </p>
              <p className="text-gray-600 mb-4">{course.duration} horas</p>
              <button className="block bg-red-600 text-white text-center py-2 rounded">
                Comprar Ahora
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Courses;
