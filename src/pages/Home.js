import React, { lazy, Suspense } from "react";
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const Hero = lazy(() => import("../components/Home/Hero"));
const CourseSection = lazy(() => import("../components/Home/CourseSection"));
// const CategoriesSection = lazy(() => import("../components/Home/CategoriesSection"));
const TestimonialsSection = lazy(() => import("../components/Home/TestimonialsSection"));

const Home = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [courseRef, courseInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="home">
      <Suspense fallback={<div>Loading...</div>}>
        <motion.div
          ref={heroRef}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={variants}
          transition={{ duration: 0.5 }}
        >
          <Hero />
        </motion.div>
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <motion.div
          ref={courseRef}
          initial="hidden"
          animate={courseInView ? "visible" : "hidden"}
          variants={variants}
          transition={{ duration: 0.5 }}
        >
          <CourseSection />
        </motion.div>
        {/* <motion.div
          ref={categoriesRef}
          initial="hidden"
          animate={categoriesInView ? "visible" : "hidden"}
          variants={variants}
          transition={{ duration: 0.5 }}
        >
          <CategoriesSection />
        </motion.div> */}
        <motion.div
          ref={testimonialsRef}
          initial="hidden"
          animate={testimonialsInView ? "visible" : "hidden"}
          variants={variants}
          transition={{ duration: 0.5 }}
        >
          <TestimonialsSection />
        </motion.div>
      </Suspense>
    </div>
  );
};

export default Home;
