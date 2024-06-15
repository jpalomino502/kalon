import React from "react";

const categories = ["Piano", "Guitarra", "Violín", "Producción Musical"];

const CategoriesSection = () => (
  <section className="bg-gray-100 py-8">
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold mb-8">Categorías de Cursos</h2>
      <div className="grid md:grid-cols-4 gap-8 px-4 md:px-0">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-6 text-center"
          >
            <h3 className="text-xl font-semibold">{category}</h3>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CategoriesSection;
