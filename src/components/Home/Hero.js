import React, { useState, useEffect } from "react";

import headerBackgroundVideo from "../../assets/headerBackgroundVideo.mp4";

const Hero = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const videoElement = document.getElementById("hero-video");

    if (videoElement) {
      videoElement.addEventListener("loadeddata", handleVideoLoaded);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("loadeddata", handleVideoLoaded);
      }
    };
  }, []);

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  return (
    <div className="hero bg-black relative h-96 flex items-center justify-center overflow-hidden">
      <video
        id="hero-video"
        className={`absolute inset-0 w-full h-full object-cover ${
          videoLoaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-1000`}
        autoPlay
        muted
        loop
      >
        <source src={headerBackgroundVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="text-center relative z-10 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Bienvenido a la escuela de música
        </h1>
        <p className="mb-8">Donde la pasión por la música comienza</p>
        <div className="flex justify-center space-x-4">
          <button className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md transition duration-300">
            Empieza Ahora
          </button>
          <button className="bg-transparent border border-white text-white hover:bg-white hover:text-black px-4 py-2 rounded-md transition duration-300">
            Conoce Más
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
