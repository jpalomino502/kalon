import React from "react";

const courses = [
  {
    title: "Curso de Piano",
    instructor: "John Doe",
    price: "$20,000",
    originalPrice: "$29,000",
  },
  {
    title: "Curso de Guitarra",
    instructor: "Jane Smith",
    price: "$15,000",
    originalPrice: "$25,000",
  },
  {
    title: "Curso de Violín",
    instructor: "Mary Johnson",
    price: "$18,000",
    originalPrice: "$27,000",
  },
];

const CourseSection = () => (
  <section className="container mx-auto p-5">
    <h2 className="text-2xl font-bold mb-8">Especializados para enseñarte</h2>
    <div className="grid md:grid-cols-3 gap-8 px-4 md:px-0">
      {courses.map((course, index) => (
        <div key={index} className="bg-white shadow-md rounded-lg">
          <div className="p-4">
            <h3 className="text-xl font-semibold">{course.title}</h3>
            <p className="text-gray-600">Creado por {course.instructor}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-red-600">{course.price}</span>
              <span className="line-through text-gray-500">
                {course.originalPrice}
              </span>
            </div>
            <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md w-full hover:bg-red-700 transition duration-300">
              Comprar
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default CourseSection;
