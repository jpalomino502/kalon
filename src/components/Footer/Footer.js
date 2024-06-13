import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white text-black py-4 mt-auto">
      <div className="container mx-auto text-center">
        <div className="mb-2">
          <span className="font-semibold">Kalon, Universo Musical</span> - Profesionalidad, Dinamismo, Innovación, Excelencia
        </div>
        <div className="flex justify-center space-x-4">
          <a href="/about" className="text-cyan-600 hover:text-cyan-400">Quiénes Somos</a>
          <a href="/contact" className="text-cyan-600 hover:text-cyan-400">Contacto</a>
          <a href="/privacy" className="text-cyan-600 hover:text-cyan-400">Política de Privacidad</a>
        </div>
        <div className="mt-4">
          &copy; 2024 Kalon. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
