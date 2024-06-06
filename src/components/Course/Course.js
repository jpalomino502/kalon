import React from 'react';

const Course = ({ course }) => {
  return (
    <div className="course">
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p>Precio: </p>
      {/* Agrega más detalles del curso aquí */}
    </div>
  );
};

export default Course;
