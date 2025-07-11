import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import { baseUrl, decryptText } from "../../../../../encryptDecrypt";
import { toast } from "react-toastify";
import axios from "axios";
import VerificationForm from "./Verification/VerificationForm";

const CategoriesLayout = ({ darkMode }) => {
  const token = localStorage.getItem("userToken");
  const [categories, setCategories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const activeCategory = activeIndex !== null ? {
    categoryName: categories?.[activeIndex]?.categoryName,
    id: categories?.[activeIndex]?._id,
  } : null;

  const getCategory = async () => {
    try {
      const response = await axios(`${baseUrl}/api/category/`, {
        headers: {
          authorization: token,
        },
      });
      const decrypted = await decryptText(response.data.body);
      const parsed = JSON.parse(decrypted);

      const filteredCategories = parsed.data.filter(
        (cat) => cat.categoryStatus !== "5" && cat.categoryName !== "e-sign method"
      );

      const uniqueCategories = filteredCategories.filter(
        (cat, index, self) =>
          index === self.findIndex((t) => t.categoryName.trim() === cat.categoryName.trim())
      );

      setCategories(uniqueCategories);

      if (uniqueCategories.length > 0 && activeIndex === null) {
        setActiveIndex(0);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    getCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrev = () => {
    if (isAnimating || categories.length === 0) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === null || prev === 0 ? categories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (isAnimating || categories.length === 0) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === null || prev === categories.length - 1 ? 0 : prev + 1));
  };

  const handleCategoryClick = (index) => {
    if (isAnimating || index === activeIndex || categories.length === 0) return;
    setIsAnimating(true);
    setActiveIndex(index);
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [activeIndex, isAnimating]);

  return (
    <div
      className={`h-[100%] p-3 sm:p-4 md:p-4 md:pb-0 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Category Navigation */}
        <div className="relative group">
          <div className={`absolute bottom-[105px] right-0 z-20 px-2 py-1 rounded-bl-lg text-xs font-medium ${
            darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-700"
          }`}>
            {categories.length} categories
          </div>

          <button
            onClick={handlePrev}
            disabled={categories.length === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 shadow-lg p-2 sm:p-3 rounded-full sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95 ${
              darkMode ? "bg-gray-900" : "bg-slate-700"
            } ${categories.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label="Previous category"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={handleNext}
            disabled={categories.length === 0}
            className={`absolute right-1 sm:right-1 top-1/2 -translate-y-1/2 z-10 shadow-lg p-2 sm:p-3 rounded-full sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 ${
              darkMode ? "bg-gray-900" : "bg-slate-700"
            } ${categories.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label="Next category"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="max-w-7xl px-1 w-[100%]">
            {categories.length > 0 ? (
              <Marquee
                pauseOnHover
                gradient={false}
                speed={50}
                className="py-1 sm:py-2"
              >
                {categories.map((cat, index) => (
                  <button
                    key={cat._id}  
                    onClick={() => handleCategoryClick(index)}
                    className={`flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 mx-1 sm:mx-2 min-w-[90px] xs:min-w-[100px] sm:min-w-[120px] md:min-w-[140px] lg:min-w-[180px] h-[65px] xs:h-[70px] sm:h-[80px] md:h-[90px] lg:h-[100px] rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                      activeIndex === index
                        ? "bg-[#3470b2] text-white shadow-lg ring-2 ring-white ring-opacity-50"
                        : darkMode
                        ? "bg-gray-800 border border-gray-700 hover:border-[#3470b2] shadow-md hover:shadow-lg"
                        : "bg-white border border-gray-200 hover:border-[#3470b2] shadow-md hover:shadow-lg"
                    }`}
                  >
                    <div
                      className={`text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2 transition-all duration-300 ${
                        activeIndex === index
                          ? "text-white scale-110"
                          : darkMode
                          ? "text-indigo-400 hover:text-indigo-300"
                          : "text-[#3470b2] hover:text-[#3470b2]"
                      }`}
                    >
                      <img
                        className="h-[45px] w-[60px] rounded-[5px] object-cover"
                        src={cat.categoryImg}
                        alt={cat.categoryName}
                        onError={(e) => {
                          e.target.src = 'path-to-fallback-image.png';
                        }}
                      />
                    </div>
                    <span
                      className={`text-xs xs:text-xs sm:text-sm font-semibold text-center ${
                        activeIndex === index
                          ? "text-white"
                          : darkMode
                          ? "text-gray-300"
                          : "text-gray-700"
                      }`}
                    >
                      {cat.categoryName}
                    </span>
                    {activeIndex === index && (
                      <div
                        className={`absolute -bottom-1 sm:-bottom-2 w-3 h-3 sm:w-4 sm:h-4 ${
                          darkMode ? "bg-[#3470b2]" : "bg-gray-100"
                        } transform rotate-45 shadow-md`}
                      ></div>
                    )}
                  </button>
                ))}
              </Marquee>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Loading categories or none available...
              </div>
            )}
          </div>
        </div>

        {activeCategory && (
          <VerificationForm category={activeCategory} darkMode={darkMode} />
        )}
      </div>
    </div>
  );
};

export default CategoriesLayout;