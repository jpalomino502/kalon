import React, { useEffect } from "react";
import { motion } from "framer-motion";
import headerBackgroundVideo from "../../assets/headerBackgroundVideo.mp4";

const Hero = () => {
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

  return (
    <div className="hero bg-black relative h-96 flex items-center justify-center overflow-hidden">
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
      <motion.div
        className="text-center relative z-10 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }} // Ajustar la duración de la animación de entrada y el retraso
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Bienvenido a la escuela de música
        </h1>
        <p className="mb-8">Donde la pasión por la música comienza</p>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }} // Ajustar la duración de la animación interna y el retraso
          className="flex justify-center space-x-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 transition duration-200"
          >
            Empieza Ahora
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-transparent border border-white text-white hover:bg-white hover:text-black px-4 py-2 transition duration-200"
          >
            Conoce Más
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
