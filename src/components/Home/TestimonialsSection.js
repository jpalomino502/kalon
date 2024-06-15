import React from "react";

const testimonials = [
  {
    quote:
      "Kalon ha transformado mi manera de entender la música. Los profesores son increíbles y el ambiente es muy acogedor.",
    name: "Carlos Mendoza",
  },
  {
    quote:
      "Gracias a Kalon, he podido cumplir mi sueño de tocar el piano. Las clases son personalizadas y muy efectivas.",
    name: "Ana Gómez",
  },
];

const TestimonialsSection = () => (
  <section className="container mx-auto p-5">
    <h2 className="text-2xl font-bold mb-8">Testimonios</h2>
    <div className="grid md:grid-cols-2 gap-8 px-4 md:px-0">
      {testimonials.map((testimonial, index) => (
        <div key={index} className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
          <h3 className="text-xl font-semibold">{testimonial.name}</h3>
        </div>
      ))}
    </div>
  </section>
);

export default TestimonialsSection;
