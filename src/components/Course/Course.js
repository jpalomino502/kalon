import React, { useState, useEffect } from "react";
import { db } from "../../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCollection = collection(db, "courses");
      const courseSnapshot = await getDocs(coursesCollection);
      const courseList = courseSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(courseList);
      setCourses(courseList);
    };

    fetchCourses();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {/* Aquí puedes mostrar la imagen del curso si tienes una */}
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{course.title}</h2>
            <p className="text-gray-700 mb-4">{course.description}</p>
            {/* Aquí puedes agregar más detalles del curso, como el precio, la duración, etc. */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Courses;
