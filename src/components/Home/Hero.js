import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import headerBackgroundVideo from "../../assets/headerBackgroundVideo.mp4";

const Hero = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const videoElement = document.getElementById("hero-video");
    if (videoElement) {
      videoElement.addEventListener("loadeddata", () => {
        videoElement.play();
      });
      return () => {
        videoElement.removeEventListener("loadeddata", () => {
          videoElement.play();
        });
      };
    }
  }, []);

  const handleStartNowClick = () => {
    navigate("/courses");
  };

  const handleLearnMoreClick = () => {
    navigate("/about-us");
  };

  return (
    <div className="hero bg-black relative h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden px-8">
      <div className="text-center relative z-10 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Aprende nuevas habilidades en línea
        </h1>
        <p className="mb-8">
          Explora nuestra amplia selección de cursos en línea y desarrolla tus
          habilidades a tu propio ritmo.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleStartNowClick}
            className="bg-[#D91604] text-white hover:bg-red-700 px-4 py-2 transition duration-200"
          >
            Explorar Cursos
          </button>
          <button
            onClick={handleLearnMoreClick}
            className="bg-[#20818C] text-white hover:bg-teal-700 px-4 py-2 transition duration-200"
          >
            Nosotros
          </button>
        </div>
      </div>
      <video
        id="hero-video"
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
      >
        <source src={headerBackgroundVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black opacity-50"></div>
    </div>
  );
};

export default Hero;
