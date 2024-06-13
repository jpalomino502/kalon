import React, { lazy, Suspense } from 'react';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; 

const courseImage1 = lazy(() => import('../assets/logo.svg'));
const courseImage2 = lazy(() => import('../assets/logo.svg'));
const courseImage3 = lazy(() => import('../assets/logo.svg'));
const headerBackground1 = lazy(() => import('../assets/logo.svg'));
const headerBackground2 = lazy(() => import('../assets/logo.svg'));
const headerBackground3 = lazy(() => import('../assets/logo.svg'));

const Home = () => {
  return (
    <div className="home">
      <div className="relative h-96">
        <Carousel 
          autoPlay 
          infiniteLoop 
          showThumbs={false} 
          showStatus={false}
          className="relative"
        >
          <Suspense fallback={<div>Loading...</div>}>
            <div className="h-96 bg-cover bg-center" style={{ backgroundImage: `url(${headerBackground1})` }}>
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="text-center relative z-10 flex items-center justify-center h-full animate-fadeIn">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">La escuela de música ideal para tu formación</h1>
                  <p className="mb-8 text-white">Muchísimos cursos a elegir</p>
                  <div className="flex justify-center space-x-4">
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300">Regístrate Gratis</button>
                    <button className="bg-transparent border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition duration-300">Conoce la escuela</button>
                  </div>
                </div>
              </div>
            </div>
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="h-96 bg-cover bg-center" style={{ backgroundImage: `url(${headerBackground2})` }}>
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="text-center relative z-10 flex items-center justify-center h-full animate-fadeIn">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Descubre tu talento musical</h1>
                  <p className="mb-8 text-white">Clases personalizadas para todos los niveles</p>
                  <div className="flex justify-center space-x-4">
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300">Empieza Ahora</button>
                    <button className="bg-transparent border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition duration-300">Más Información</button>
                  </div>
                </div>
              </div>
            </div>
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="h-96 bg-cover bg-center" style={{ backgroundImage: `url(${headerBackground3})` }}>
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="text-center relative z-10 flex items-center justify-center h-full animate-fadeIn">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Un universo musical te espera</h1>
                  <p className="mb-8 text-white">Innovación y creatividad en cada curso</p>
                  <div className="flex justify-center space-x-4">
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300">Explora Cursos</button>
                    <button className="bg-transparent border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition duration-300">Contáctanos</button>
                  </div>
                </div>
              </div>
            </div>
          </Suspense>
        </Carousel>
      </div>

      <section className="container mx-auto p-5">
        <h2 className="text-2xl font-bold mb-8">Especializados para enseñarte</h2>
        <div className="grid md:grid-cols-3 gap-8 px-4 md:px-0">
          <Suspense fallback={<div>Loading...</div>}>
            <div className="bg-white shadow-md rounded-lg">
              <LazyLoadImage src={courseImage1} alt="Curso 1" className="rounded-t-lg w-full" effect="blur" />
              <div className="p-4">
                <h3 className="text-xl font-semibold">Curso de Piano</h3>
                <p className="text-gray-600">Creado por John Doe</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-red-600">$20,000</span>
                  <span className="line-through text-gray-500">$29,000</span>
                </div>
                <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md w-full hover:bg-red-700 transition duration-300">Comprar</button>
              </div>
            </div>
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="bg-white shadow-md rounded-lg">
              <LazyLoadImage src={courseImage2} alt="Curso 2" className="rounded-t-lg w-full" effect="blur" />
              <div className="p-4">
                <h3 className="text-xl font-semibold">Curso de Guitarra</h3>
                <p className="text-gray-600">Creado por Jane Smith</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-red-600">$15,000</span>
                  <span className="line-through text-gray-500">$25,000</span>
                </div>
                <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md w-full hover:bg-red-700 transition duration-300">Comprar</button>
              </div>
            </div>
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="bg-white shadow-md rounded-lg">
              <LazyLoadImage src={courseImage3} alt="Curso 3" className="rounded-t-lg w-full" effect="blur" />
              <div className="p-4">
                <h3 className="text-xl font-semibold">Curso de Violín</h3>
                <p className="text-gray-600">Creado por Mary Johnson</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-red-600">$18,000</span>
                  <span className="line-through text-gray-500">$27,000</span>
                </div>
                <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md w-full hover:bg-red-700 transition duration-300">Comprar</button>
              </div>
            </div>
          </Suspense>
        </div>
      </section>

      <section className="bg-gray-100 py-8">
        <div className="container mx-auto p-5">
          <h2 className="text-2xl font-bold mb-8">Categorías de Cursos</h2>
          <div className="grid md:grid-cols-4 gap-8 px-4 md:px-0">
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold">Piano</h3>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold">Guitarra</h3>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold">Violín</h3>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold">Producción Musical</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto p-5">
        <h2 className="text-2xl font-bold mb-8">Testimonios</h2>
        <div className="grid md:grid-cols-2 gap-8 px-4 md:px-0">
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-gray-600 mb-4">"Kalon ha transformado mi manera de entender la música. Los profesores son increíbles y el ambiente es muy acogedor."</p>
            <h3 className="text-xl font-semibold">Carlos Mendoza</h3>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-gray-600 mb-4">"Gracias a Kalon, he podido cumplir mi sueño de tocar el piano. Las clases son personalizadas y muy efectivas."</p>
            <h3 className="text-xl font-semibold">Ana Gómez</h3>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
