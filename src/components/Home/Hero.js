import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleStartNowClick = () => {
    navigate("/courses");
  };

  const handleLearnMoreClick = () => {
    navigate("/about-us");
  };

  return (
    <div className="hero bg-gradient-to-br from-blue-600 via-red-600 to-yellow-300 relative h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden px-8">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-white max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Aprende nuevas habilidades en línea
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Explora nuestra amplia selección de cursos en línea y desarrolla tus habilidades a tu propio ritmo. Ya sea que estés buscando avanzar en tu carrera, aprender un nuevo hobby, o simplemente expandir tu conocimiento, tenemos el curso perfecto para ti.
        </p>
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <button
            onClick={handleStartNowClick}
            className="bg-[#D91604] text-white px-6 py-3 transition duration-300 transform hover:scale-105 hover:bg-red-700"
            aria-label="Explorar Cursos"
          >
            Explorar Cursos
          </button>
          <button
            onClick={handleLearnMoreClick}
            className="bg-[#20818C] text-white px-6 py-3 transition duration-300 transform hover:scale-105 hover:bg-teal-700"
            aria-label="Nosotros"
          >
            Nosotros
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
