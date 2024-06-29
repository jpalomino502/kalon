import React from "react";
import logoBlanco from "../assets/logo.png"; 
import image1 from "../assets/headerBackground.jpg";
import image2 from "../assets/headerBackground1.jpg";
import image3 from "../assets/headerBackground2.jpg";

const AboutUs = () => {
  return (
    <div className="about-us-container py-12 px-4 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-primary">Sobre Nosotros</h1>
          <p className="text-lg">
            Bienvenido a <strong>Kalon, Universo Musical</strong>. Nuestra misión es proporcionar una educación musical de alta calidad para todos.
          </p>
        </div>
        <div className="flex flex-wrap items-center mb-12">
          <img src={image1} alt="Image 1" className="w-full sm:w-1/2 h-auto rounded-lg shadow-md mb-4 sm:mb-0 sm:mr-4" />
          <p className="text-lg flex-1">
            Desde nuestros humildes comienzos, hemos crecido hasta convertirnos en una institución reconocida, ofreciendo una amplia variedad de cursos y programas.
          </p>
        </div>
        <div className="flex flex-wrap items-center mb-12">
          <p className="text-lg flex-1 order-2 sm:order-1">
            Nuestro objetivo es fomentar el crecimiento cognitivo, motriz, intelectual, emocional y social a través de la música, ayudando a desarrollar habilidades como la disciplina, la creatividad y la confianza en sí mismo.
          </p>
          <img src={image2} alt="Image 2" className="w-full sm:w-1/2 h-auto rounded-lg shadow-md mb-4 sm:mb-0 sm:ml-4 order-1 sm:order-2" />
        </div>
        <div className="flex flex-wrap items-center mb-12">
          <img src={image3} alt="Image 3" className="w-full sm:w-1/2 h-auto rounded-lg shadow-md mb-4 sm:mb-0 sm:mr-4" />
          <p className="text-lg flex-1">
            Kalon, palabra griega que significa “Una belleza que es más que superficial, todo aquello que gusta y despierta admiración pero que al mismo tiempo es bueno y justo”, se ha creado con la necesidad de impactar la sociedad por medio de la música, en todos sus ámbitos tanto en educación, producción y asesoramiento artístico.
          </p>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-primary">Nuestros Valores</h2>
          <ul className="list-disc list-inside text-lg">
            <li className="mb-2">Compromiso con la excelencia en la educación musical</li>
            <li className="mb-2">Innovación y creatividad en nuestros métodos de enseñanza</li>
            <li className="mb-2">Inclusión y accesibilidad para todos los estudiantes</li>
            <li className="mb-2">Pasión por la música y el arte</li>
          </ul>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-primary">Conoce a Nuestro Equipo</h2>
          <div className="flex flex-wrap justify-center">
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <img src="https://via.placeholder.com/150" alt="Team Member" className="w-32 h-32 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">John Doe</h3>
                <p className="text-lg">Director</p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <img src="https://via.placeholder.com/150" alt="Team Member" className="w-32 h-32 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Jane Smith</h3>
                <p className="text-lg">Coordinadora Académica</p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <img src="https://via.placeholder.com/150" alt="Team Member" className="w-32 h-32 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Emily Johnson</h3>
                <p className="text-lg">Profesora de Piano</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-primary">Contáctanos</h2>
          <p className="text-lg mb-4">
            Si tienes alguna pregunta o necesitas más información, no dudes en ponerte en contacto con nosotros.
          </p>
          <p className="text-lg">
            Email: <a href="mailto:info@kalonmusicschool.com" className="text-primary">info@kalonmusicschool.com</a>
          </p>
          <p className="text-lg">
            Teléfono: <a href="tel:+1234567890" className="text-primary">+1 234 567 890</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
