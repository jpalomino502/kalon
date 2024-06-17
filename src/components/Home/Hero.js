import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "react-lazy-load-image-component/src/effects/blur.css";

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

  const slides = [
    {
      backgroundVideo: headerBackgroundVideo,
      title: "Bienvenido a la escuela de música",
      subtitle: "Donde la pasión por la música comienza",
      buttons: [
        {
          text: "Empieza Ahora",
          className: "bg-red-600 text-white hover:bg-red-700",
        },
        {
          text: "Conoce Más",
          className:
            "bg-transparent border border-white text-white hover:bg-white hover:text-black",
        },
      ],
    },
  ];

  return (
    <div className="hero">
      <div className="relative h-96">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
          className="relative"
        >
          {slides.map((slide, index) => (
            <div key={index} className="h-96 relative">
              {slide.backgroundVideo && (
                <video
                  id="hero-video"
                  className={`absolute inset-0 w-full h-full object-cover ${
                    videoLoaded ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-1000`}
                  autoPlay
                  muted
                  loop
                >
                  <source src={slide.backgroundVideo} type="video/mp4" />
                </video>
              )}
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="text-center relative z-10 flex items-center justify-center h-full animate-fadeIn">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                    {slide.title}
                  </h1>
                  <p className="mb-8 text-white">{slide.subtitle}</p>
                  <div className="flex justify-center space-x-4">
                    {slide.buttons.map((button, index) => (
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
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Hero;
