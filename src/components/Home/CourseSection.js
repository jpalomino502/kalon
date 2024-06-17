import React, { useState, useEffect } from "react";
import { db } from "../../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const CourseSection = () => {
  const [courses, setCourses] = useState([]);
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

  const renderLoadingSkeletons = () => {
    return [...Array(3)].map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden relative p-6">
        <div className="animate-pulse h-40 bg-gray-200 rounded-md"></div>
        <div className="mt-4">
          <div className="animate-pulse h-6 w-1/2 bg-gray-200 rounded-md"></div>
          <div className="animate-pulse h-4 mt-2 w-1/4 bg-gray-200 rounded-md"></div>
          <div className="flex justify-between items-center mt-4">
            <div className="animate-pulse h-4 w-1/4 bg-gray-200 rounded-md"></div>
            <div className="animate-pulse h-4 w-1/4 bg-gray-200 rounded-md"></div>
          </div>
          <div className="mt-4">
            <div className="animate-pulse h-10 w-full bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Especializados para enseñarte
      </h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderLoadingSkeletons()}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 3).map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
              <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${course.image})` }}></div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{course.title}</h2>
                <p className="text-gray-700 mb-4">Creado por {course.instructor}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-black">COP${course.price}</span>
                  <span className="line-through text-gray-500">{course.originalPrice}</span>
                </div>
                <button className="block w-full px-4 py-2 font-bold text-white bg-black rounded-md hover:bg-gray-800 transition duration-300">
                  Comprar Ahora
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CourseSection;
