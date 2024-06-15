import React, { memo, lazy, Suspense } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "react-lazy-load-image-component/src/effects/blur.css";

// Importing the background images directly
import headerBackground1 from "../assets/headerBackground.webp";
import headerBackground2 from "../assets/headerBackground.webp";
import headerBackground3 from "../assets/headerBackground.webp";

const CarouselSlide = memo(({ backgroundImage, title, subtitle, buttons }) => (
  <div
    className="h-96 bg-cover bg-center"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >
    <div className="absolute inset-0 bg-black opacity-50"></div>
    <div className="text-center relative z-10 flex items-center justify-center h-full animate-fadeIn">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          {title}
        </h1>
        <p className="mb-8 text-white">{subtitle}</p>
        <div className="flex justify-center space-x-4">
          {buttons.map((button, index) => (
            <button
              key={index}
              className={`${button.className} px-4 py-2 rounded-md transition duration-300`}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
));

const Home = () => {
  const slides = [
    {
      backgroundImage: headerBackground1,
      title: "La escuela de música ideal para tu formación",
      subtitle: "Muchísimos cursos a elegir",
      buttons: [
        {
          text: "Regístrate Gratis",
          className: "bg-red-600 text-white hover:bg-red-700",
        },
        {
          text: "Conoce la escuela",
          className:
            "bg-transparent border border-white text-white hover:bg-white hover:text-black",
        },
      ],
    },
    {
      backgroundImage: headerBackground2,
      title: "Descubre tu talento musical",
      subtitle: "Clases personalizadas para todos los niveles",
      buttons: [
        {
          text: "Empieza Ahora",
          className: "bg-red-600 text-white hover:bg-red-700",
        },
        {
          text: "Más Información",
          className:
            "bg-transparent border border-white text-white hover:bg-white hover:text-black",
        },
      ],
    },
    {
      backgroundImage: headerBackground3,
      title: "Un universo musical te espera",
      subtitle: "Innovación y creatividad en cada curso",
      buttons: [
        {
          text: "Explora Cursos",
          className: "bg-red-600 text-white hover:bg-red-700",
        },
        {
          text: "Contáctanos",
          className:
            "bg-transparent border border-white text-white hover:bg-white hover:text-black",
        },
      ],
    },
  ];

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
          {slides.map((slide, index) => (
            <CarouselSlide key={index} {...slide} />
          ))}
        </Carousel>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <CourseSection />
        <CategoriesSection />
        <TestimonialsSection />
      </Suspense>
    </div>
  );
};

const CourseSection = lazy(() => import("../components/Home/CourseSection"));
const CategoriesSection = lazy(() =>
  import("../components/Home/CategoriesSection")
);
const TestimonialsSection = lazy(() =>
  import("../components/Home/TestimonialsSection")
);

export default Home;
