import React from 'react';
import 'react-lazy-load-image-component/src/effects/blur.css'; // Importa el efecto de desenfoque si lo deseas
import courseImage1 from '../assets/courseImage1.jpg';
import headerBackground from '../assets/headerBackground.jpg';

const Home = () => {
  return (
    <div className="home">
      <div
        className="relative h-96 bg-cover bg-center text-white flex items-center justify-center"
        style={{ backgroundImage: `url(${headerBackground})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            La escuela de música ideal para tu formación
          </h1>
          <p className="mb-8">Muchísimos cursos a elegir</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-red-600 text-white px-4 py-2 rounded-md">
              Regístrate Gratis
            </button>
            <button className="bg-transparent border border-white text-white px-4 py-2 rounded-md">
              Conoce la escuela
            </button>
          </div>
        </div>
      </div>
      
      <section className="container mx-auto p-5">
        <h2 className="text-2xl font-bold mb-8">Especializados para enseñarte</h2>
        <div className="grid md:grid-cols-3 gap-8 px-4 md:px-0">
          <div className="bg-white shadow-md rounded-lg">
            <img src={courseImage1} alt="Curso 1" className="rounded-t-lg w-full" />
            <div className="p-4">
              <h3 className="text-xl font-semibold">Introducción a</h3>
              <p className="text-gray-600">Creado por John Doe</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-red-600">$20,000</span>
                <span className="line-through text-gray-500">$29,000</span>
              </div>
              <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md w-full">
                Comprar
              </button>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg">
            <img src={courseImage1} alt="Curso 2" className="rounded-t-lg w-full" />
            <div className="p-4">
              <h3 className="text-xl font-semibold">Introducción a</h3>
              <p className="text-gray-600">Creado por John Doe</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-red-600">$20,000</span>
                <span className="line-through text-gray-500">$29,000</span>
              </div>
              <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md w-full">
                Comprar
              </button>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg">
            <img src={courseImage1} alt="Curso 3" className="rounded-t-lg w-full" />
            <div className="p-4">
              <h3 className="text-xl font-semibold">Introducción a</h3>
              <p className="text-gray-600">Creado por John Doe</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-red-600">$20,000</span>
                <span className="line-through text-gray-500">$29,000</span>
              </div>
              <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md w-full">
                Comprar
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
