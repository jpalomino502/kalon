import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import LoadingSkeleton from "../components/Loading/LoadingSkeleton";
import { HiSearch } from "react-icons/hi";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi";
import "../styles/courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [filtersVisible, setFiltersVisible] = useState(false);

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
        setFilteredCourses(courseList);
      } catch (error) {
        console.error("Error fetching courses: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterCourses(e.target.value, filterCategory, priceRange);
  };

  const handleCategoryChange = (e) => {
    setFilterCategory(e.target.value);
    filterCourses(searchTerm, e.target.value, priceRange);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prevRange) => ({
      ...prevRange,
      [name]: value,
    }));
    filterCourses(searchTerm, filterCategory, { ...priceRange, [name]: value });
  };

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const filterCourses = (searchTerm, category, priceRange) => {
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

    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter((course) => {
        const price = parseFloat(course.price.replace(/\./g, '').replace(',', '.'));
        const min = parseFloat(priceRange.min.replace(/\./g, '').replace(',', '.')) || 0;
        const max = parseFloat(priceRange.max.replace(/\./g, '').replace(',', '.')) || Infinity;
        return price >= min && price <= max;
      });
    }

    setFilteredCourses(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setPriceRange({ min: "", max: "" });
    filterCourses("", "", { min: "", max: "" });
  };

  const toggleFiltersVisibility = () => {
    setFiltersVisible(!filtersVisible);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 animate-fadeIn">
        Catálogo de Cursos
      </h1>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 p-4 border-r border-gray-200 animate-slideInLeft">
          <div className="flex justify-between items-center md:hidden">
            <h2 className="text-xl font-bold mb-4">Filtros</h2>
            <button onClick={toggleFiltersVisibility} className="text-gray-700">
              {filtersVisible ? <HiOutlineChevronUp size={24} /> : <HiOutlineChevronDown size={24} />}
            </button>
          </div>
          <div className={`${filtersVisible ? "block" : "hidden"} md:block`}>
            <div className="mb-4">
              <h3 className="font-semibold">Categoría</h3>
              <div className="mt-2 space-y-2">
                <div>
                  <input
                    type="radio"
                    value="Teoría Musical"
                    onChange={handleCategoryChange}
                    checked={filterCategory === "Teoría Musical"}
                  />
                  <label className="ml-2">Teoría Musical</label>
                </div>
                <div>
                  <input
                    type="radio"
                    value="Instrumentos"
                    onChange={handleCategoryChange}
                    checked={filterCategory === "Instrumentos"}
                  />
                  <label className="ml-2">Instrumentos</label>
                </div>
                <div>
                  <input
                    type="radio"
                    value="Producción Musical"
                    onChange={handleCategoryChange}
                    checked={filterCategory === "Producción Musical"}
                  />
                  <label className="ml-2">Producción Musical</label>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Precio</h3>
              <div className="mt-2 space-y-2">
                <div>
                  <label className="block">Desde:</label>
                  <input
                    type="text"
                    name="min"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={priceRange.min}
                    onChange={handlePriceChange}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block">Hasta:</label>
                  <input
                    type="text"
                    name="max"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={priceRange.max}
                    onChange={handlePriceChange}
                    placeholder="999.99"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={clearFilters}
              className="bg-[#20818C] text-white py-2 px-4 w-full"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
        <div className="w-full md:w-3/4 p-4 animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <div className="flex w-full relative">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg outline-none"
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <HiSearch className="absolute right-3 top-3 text-gray-400" size={20} />
            </div>
          </div>
          {filteredCourses.length === 0 ? (
            <div className="text-center text-gray-700 my-8 animate-fadeIn">
              <p>No se encontraron cursos con los filtros seleccionados.</p>
              <p>Prueba ajustando los filtros o explorando nuestra selección completa.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="block text-gray-900 overflow-hidden shadow-md hover:shadow-lg transition duration-300"
                >
                  <div
                    className="relative h-40 bg-cover bg-center"
                    style={{ backgroundImage: `url(${course.image})` }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center text-white font-bold text-lg opacity-0 hover:opacity-100 transition-opacity">
                      Ver curso
                    </div>
                  </div>
                  <div className="p-6 animate-fadeInUp">
                    <h2 className="text-xl font-bold mb-2 truncate">{course.title}</h2>
                    <p className="text-gray-700 mb-4 truncate">{course.description}</p>
                    <p className="text-gray-800 font-semibold mb-2">
                      COP$ {formatPrice(course.price)}
                    </p>
                    <p className="text-gray-600 mb-4">{course.duration} horas</p>
                    <button className="block bg-red-600 text-white text-center py-2 w-full">
                      Comprar Ahora
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
