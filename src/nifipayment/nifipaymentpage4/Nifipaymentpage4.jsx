import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    logo: "https://1000logos.net/wp-content/uploads/2016/10/Amazon-Logo.png",
    quote:
      '"I think any organisation which is operating at a reasonable scale and has an aspiration to go digital should explore Leegality"',
    name: "Shashank Agrawal",
    position: "Chief Technology Officer @ HDFC Credila",
    image:
      "https://img.freepik.com/free-photo/waist-up-portrait-handsome-serious-unshaven-male-keeps-hands-together-dressed-dark-blue-shirt-has-talk-with-interlocutor-stands-against-white-wall-self-confident-man-freelancer_273609-16320.jpg?semt=ais_hybrid&w=740",
    stats: {
      description: "Slashed document execution",
      timeBefore: "4 Days",
      timeAfter: "10 minutes",
    },
  },
  {
    id: 2,
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Ford-Motor-Company-Logo.png",
    quote:
      '"Leegality has transformed our document workflow completely, making it seamless and efficient."',
    name: "Rahul Sharma",
    position: "Operations Head @ IIFL Samasta",
    image:
      "https://toppng.com/uploads/preview/person-png-11553989513mzkt4ocbrv.png",
    stats: {
      description: "Reduced processing time",
      timeBefore: "7 Days",
      timeAfter: "30 minutes",
    },
  },
  {
    id: 3,
    logo: "https://res.cloudinary.com/vistaprint/images/c_scale,w_448,h_146,dpr_2/f_auto,q_auto/v1706089184/ideas-and-advice-prod/en-us/Coca-Cola_logo.svg_/Coca-Cola_logo.svg_.png?_i=AA",
    quote:
      '"The digital transformation with Leegality has been a game-changer for our organization."',
    name: "Priya Patel",
    position: "Digital Transformation Lead @ Asian Paints",
    image:
      "https://img.freepik.com/premium-photo/business-office-advertising-people-concept-friendly-young-buisnessman-pointing-finger-something-palm-his-hand_380164-53314.jpg",
    stats: {
      description: "Improved efficiency",
      timeBefore: "5 Days",
      timeAfter: "1 hour",
    },
  },
];

const Nifipaymentpage4 = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(goToNext, 10000);
    }
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="bg-[#f4e8f8] min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <h2 className='text-2xl font-bold mb-6'>Don’t take our word for it</h2>
      <p className="text-lg text-gray-700 mb-12 text-center max-w-2xl">
        See how growth minded Indian companies are using Leegality to drive
        fantastic business results
      </p>
      {/* Main Card */}
      <div className="bg-[#f8f9fa] rounded-2xl shadow-lg overflow-hidden max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 relative">
        {/* Navigation Arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors lg:left-4"
        >
          <FaChevronLeft className="text-gray-700" />
        </button>
        <button 
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors lg:right-4"
        >
          <FaChevronRight className="text-gray-700" />
        </button>

        {/* Left Section: Testimonial Text */}
        <div className="p-8 md:p-12 flex flex-col justify-between space-y-8">
          <div>
            <img
              src={currentTestimonial.logo}
              alt="Company Logo"
              className="h-16 mb-10 rounded-2xl"
            />
            <blockquote className="text-2xl md:text-3xl font-normal text-gray-800 leading-snug">
              {currentTestimonial.quote}
            </blockquote>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-lg font-bold text-gray-900">
                {currentTestimonial.name}
              </p>
              <p className="text-base text-gray-600">
                {currentTestimonial.position}
              </p>
            </div>
            <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50">
              Read Case Study
            </button>
          </div>
        </div>

        {/* Right Section: Image and Overlay */}
        <div className="relative min-h-[450px] lg:min-h-0">
          {/* Background Image */}
          <img
            src={currentTestimonial.image}
            alt={`${currentTestimonial.name}, ${currentTestimonial.position.split("@")[0]}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay Content */}
          <div className="absolute inset-x-6 bottom-6 md:inset-x-10 md:bottom-10 bg-black bg-opacity-60 text-white p-6 rounded-xl backdrop-blur-sm">
            <p className="text-lg">{currentTestimonial.stats.description}</p>
            <div className="flex items-end justify-between mt-2 gap-4">
              <div>
                <p className="text-3xl md:text-4xl font-bold leading-none">
                  <span className="font-normal text-xl">time from</span>{" "}
                  {currentTestimonial.stats.timeBefore} to
                </p>
                <p className="text-5xl md:text-6xl font-bold">
                  {currentTestimonial.stats.timeAfter}
                </p>
              </div>
              <div className="bg-white/30 rounded-full p-3 flex-shrink-0">
                <FaChevronDown className="text-white text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Logos and Indicators */}
      <div className="mt-12 w-full max-w-6xl mx-auto">
        {/* Indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full ${currentIndex === index ? "bg-purple-600" : "bg-gray-300"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Logos */}
        <div className="flex items-center justify-center gap-10 sm:gap-16 flex-wrap px-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`py-2 ${currentIndex === index ? "border-b-2 border-purple-600" : "opacity-50"}`}
              onClick={() => goToSlide(index)}
            >
              <img
                src={testimonial.logo}
                alt={`${testimonial.position.split("@")[1]} Logo`}
                className={`h-8 ${currentIndex !== index ? "grayscale" : ""}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Nifipaymentpage4;
