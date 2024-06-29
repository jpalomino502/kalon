import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import LoadingSkeleton from "../components/Loading/LoadingSkeleton";
import { HiFilter } from "react-icons/hi";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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
        setFilteredCourses(courseList); // Inicializamos con todos los cursos
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

    // Filtrado por término de búsqueda
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(search) ||
          course.description.toLowerCase().includes(search)
      );
    }

    // Filtrado por categoría
    if (category) {
      filtered = filtered.filter((course) => course.category === category);
    }

    setFilteredCourses(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setShowFilters(false);
    filterCourses("", "");
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
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button className="p-2 text-gray-500">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </button>
            <input
              type="text"
              className="p-2 outline-none"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              <HiFilter className="inline-block mr-2" />
              Filtrar
            </button>
            {showFilters && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Categoría
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={filterCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">Todas las categorías</option>
                    <option value="Teoría Musical">Teoría Musical</option>
                    <option value="Instrumentos">Instrumentos</option>
                    <option value="Producción Musical">Producción Musical</option>
                  </select>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={clearFilters}
                    className="mr-2 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 focus:outline-none"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {filteredCourses.length === 0 ? (
        <div className="text-center text-gray-700 my-8">
          <p>No se encontraron cursos con los filtros seleccionados.</p>
          <p>Prueba ajustando los filtros o explorando nuestra selección completa.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="block text-gray-900 overflow-hidden shadow-md hover:shadow-lg transition duration-300 rounded-lg"
            >
              <div
                className="relative h-40 transition-all duration-300 transform hover:scale-105"
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
                    className="h-full bg-cover bg-center transition-all duration-300"
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
                <button className="block bg-red-600 text-white text-center py-2 w-full rounded-lg">
                  Comprar Ahora
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
