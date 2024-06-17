import React, { lazy, Suspense } from "react";

const Hero = lazy(() => import("../components/Home/Hero"));
const CourseSection = lazy(() => import("../components/Home/CourseSection"));
const CategoriesSection = lazy(() => import("../components/Home/CategoriesSection"));
const TestimonialsSection = lazy(() => import("../components/Home/TestimonialsSection"));

const Home = () => {
  return (
    <div className="home">
      <Suspense fallback={<div>Loading...</div>}>
        <Hero />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <CourseSection />
        <CategoriesSection />
        <TestimonialsSection />
      </Suspense>
    </div>
  );
};

export default Home;
