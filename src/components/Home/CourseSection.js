import React, { useState, useEffect } from "react";
import { db } from "../../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

const CourseSection = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false); // Estado para controlar la carga de imágenes

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesCollection = collection(db, "courses");
        const courseSnapshot = await getDocs(coursesCollection);
        const courseList = courseSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          imageLoaded: false, // Agregar estado para cada curso para controlar la carga de la imagen
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

  useEffect(() => {
    // Verificar si todas las imágenes han cargado
    const allImagesLoaded = courses.every((course) => course.imageLoaded);

    if (allImagesLoaded) {
      setImagesLoaded(true); // Actualizar estado cuando todas las imágenes estén cargadas
    }
  }, [courses]);

  const handleImageLoaded = (index) => {
    // Marcar la imagen cargada en el estado del curso
    setCourses((prevCourses) =>
      prevCourses.map((course, idx) =>
        idx === index ? { ...course, imageLoaded: true } : course
      )
    );
  };

  const renderLoadingSkeletons = () => {
    return [...Array(3)].map((_, index) => (
      <motion.div
        key={index}
        className="bg-white rounded-lg shadow-md overflow-hidden relative p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <motion.div
          className="h-40 bg-gray-200 rounded-md"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        ></motion.div>
        <div className="mt-4">
          <motion.div
            className="h-6 w-1/2 bg-gray-200 rounded-md"
            animate={{ width: ["0%", "50%", "100%"] }}
            transition={{ duration: 1 }}
          ></motion.div>
          <motion.div
            className="h-4 mt-2 w-1/4 bg-gray-200 rounded-md"
            animate={{ width: ["0%", "25%", "100%"] }}
            transition={{ duration: 1 }}
          ></motion.div>
          <div className="flex justify-between items-center mt-4">
            <motion.div
              className="h-4 w-1/4 bg-gray-200 rounded-md"
              animate={{ width: ["0%", "50%", "100%"] }}
              transition={{ duration: 1 }}
            ></motion.div>
            <motion.div
              className="h-4 w-1/4 bg-gray-200 rounded-md"
              animate={{ width: ["0%", "50%", "100%"] }}
              transition={{ duration: 1 }}
            ></motion.div>
          </div>
          <div className="mt-4">
            <motion.div
              className="h-10 w-full bg-gray-200 rounded-md"
              animate={{ width: ["0%", "100%"] }}
              transition={{ duration: 1 }}
            ></motion.div>
          </div>
        </div>
      </motion.div>
    ));
  };

  const renderCourses = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.slice(0, 3).map((course, index) => (
          <motion.div
            key={course.id}
            className="bg-white rounded-lg shadow-md overflow-hidden relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div
              className="h-40 bg-cover bg-center"
              style={{ backgroundImage: `url(${course.image})` }}
            >
              <img
                src={course.image}
                alt={course.title}
                className="hidden"
                onLoad={() => handleImageLoaded(index)}
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{course.title}</h2>
              <div className="flex justify-between items-center mb-4">
                <span className="text-black">COP${course.price}</span>
                <span className="line-through text-gray-500">
                  {course.originalPrice}
                </span>
              </div>
              <button className="block w-full px-4 py-2 font-bold text-white bg-red-600 text-white hover:bg-red-700 transition duration-300">
                Comprar Ahora
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Especializados para enseñarte
      </h1>
      {(loading || !imagesLoaded) ? renderLoadingSkeletons() : renderCourses()}
    </section>
  );
};

export default CourseSection;
