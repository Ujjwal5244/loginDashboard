import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
// import { categories } from "./categories";
import PersonalVerification from "./persnlverif/PersonalVerification";
import Vahan from "./vahan/Vahan";
import CorporateVerification from "./corporateverif/CorporateVerification";
import Operator from "./operator/Operator";
import { baseUrl, decryptText } from "../../../../../encryptDecrypt";
import { toast } from "react-toastify";
import axios from "axios";

const CategoriesLayout = ({ darkMode }) => {
  const [categories, setCategories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const activeCategory = {
    categoryName: categories?.[activeIndex]?.categoryName,
    id: categories?.[activeIndex]?._id,
  };
  const token = localStorage.getItem("userToken");
  const getCategory = async () => {
    try {
      const response = await axios(`${baseUrl}/api/category/`, {
        headers: {
          authorization: token,
        },
      });
      const decrypted = await decryptText(response.data.body);
      const parsed = JSON.parse(decrypted);
      setCategories(parsed.data);
      console.log("category data", parsed);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    getCategory();
  }, []);
  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
  };

  const handleCategoryClick = (index) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(index);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  return (
    <div
      className={`min-h-screen p-3 sm:p-4 md:p-6 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-black"}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Category Navigation */}
        <div className="relative mb-8 sm:mb-12 group">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 shadow-lg p-2 sm:p-3 rounded-full sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95 ${
              darkMode ? "bg-gray-900" : "bg-slate-700"
            }`}
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
            className={`absolute right-1 sm:right-1 top-1/2 -translate-y-1/2 z-10 shadow-lg p-2 sm:p-3 rounded-full sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 ${
              darkMode ? "bg-gray-900" : "bg-slate-700"
            }`}
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

          {/* Marquee */}
          <div className="max-w-7xl px-1 w-[100%]">
            <Marquee
              pauseOnHover
              gradient={false}
              speed={50}
              className="py-1 sm:py-2"
            >
              {categories?.map((cat, index) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(index)}
                  className={`flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 mx-1 sm:mx-2 min-w-[90px] xs:min-w-[100px] sm:min-w-[120px] md:min-w-[140px] lg:min-w-[180px] h-[65px] xs:h-[70px] sm:h-[80px] md:h-[90px] lg:h-[100px] rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    activeCategory.categoryName === cat.categoryName
                      ? "bg-[#3470b2] text-white shadow-lg ring-2 ring-white ring-opacity-50"
                      : darkMode
                        ? "bg-gray-800 border border-gray-700 hover:border-indigo-400 shadow-md hover:shadow-lg"
                        : "bg-white border border-gray-200 hover:border-[#3470b2]/50 shadow-md hover:shadow-lg"
                  }`}
                >
                  <div
                    className={`text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2 transition-all duration-300 ${
                      activeCategory.categoryName === cat.categoryName
                        ? "text-white scale-110"
                        : darkMode
                          ? "text-[#3470b2] hover:text-indigo-300"
                          : "text-[#3470b2] hover:text-[#3a7bd5]"
                    }`}
                  >
                    <img
                      height={"55px"}
                      width={"65px"}
                      style={{ borderRadius:"10px" }}
                      src={cat.categoryImg}
                    />
                  </div>
                  <span
                    className={`text-xs xs:text-xs sm:text-sm font-semibold text-center ${
                      activeCategory.categoryName === cat.categoryName
                        ? "text-white"
                        : darkMode
                          ? "text-gray-300"
                          : "text-gray-700"
                    }`}
                  >
                    {cat.categoryName}
                  </span>
                  {activeCategory.categoryName === cat.categoryName && (
                    <div
                      className={`absolute -bottom-1 sm:-bottom-2 w-3 h-3 sm:w-4 sm:h-4 ${
                        darkMode ? "bg-indigo-600" : "bg-white"
                      } transform rotate-45 shadow-md`}
                    ></div>
                  )}
                </button>
              ))}
            </Marquee>
          </div>
        </div>

        {/* Selected Form Section */}
        <div
          className={`rounded-xl sm:rounded-2xl xs:m-6 sm:m-8 md:m-10 lg:m-12 border overflow-hidden transition-all duration-500 ease-in-out ${
            isAnimating ? "opacity-70" : "opacity-100"
          } ${
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          }`}
        >
          <div
            className={`bg-[#3470b2] p-2 relative overflow-hidden ${
              darkMode ? "shadow-lg" : "shadow-md"
            }`}
          >
            <div className="flex items-center justify-between mx-3 relative z-10">
              <h2 className="text-[15px] xs:text-base sm:text-[[15px] md:text-[15px] font-semibold text-white drop-shadow-md">
                {categories?.[activeIndex]?.categoryName} Verification
              </h2>
              <span
                className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium text-white shadow-inner ${
                  darkMode ? "bg-indigo-700/50" : "bg-white/20"
                }`}
              >
                {activeIndex + 1}/{categories.length}
              </span>
            </div>
          </div>

          <div
            className={`p-3 sm:p-4 md:p-6 lg:p-8 transition-all duration-300 ${
              darkMode
                ? isAnimating
                  ? "bg-gray-700"
                  : "bg-gray-800"
                : isAnimating
                  ? "bg-gray-50"
                  : "bg-white"
            }`}
          >
            {activeCategory?.categoryName === "Personal" && (
              <PersonalVerification
                darkMode={darkMode}
                id={activeCategory.id}
              />
            )}
            {activeCategory?.categoryName === "corporate" && (
              <CorporateVerification
                darkMode={darkMode}
                id={activeCategory.id}
              />
            )}
            {activeCategory?.categoryName === "vahan" && (
              <Vahan darkMode={darkMode} id={activeCategory.id} />
            )}
            {activeCategory.categoryName === "education" && (
              <Placeholder
                title="Education"
                darkMode={darkMode}
                id={activeCategory.id}
              />
            )}
            {activeCategory?.categoryName === "court" && (
              <Placeholder
                title="Court"
                darkMode={darkMode}
                id={activeCategory.id}
              />
            )}
            {activeCategory?.categoryName === "police" && (
              <Placeholder
                title="Police"
                darkMode={darkMode}
                id={activeCategory.id}
              />
            )}
            {activeCategory?.categoryName === "operator" && (
              <Operator darkMode={darkMode} id={activeCategory.id} />
            )}
            {activeCategory?.categoryName === "Business" && (
              <Placeholder
                title="Business"
                darkMode={darkMode}
                id={activeCategory.id}
              />
            )}
            {activeCategory?.categoryName === "abc" && (
              <Placeholder
                title="Abc"
                darkMode={darkMode}
                id={activeCategory.id}
              />
            )}
            {activeCategory.categoryName === "def" && (
              <Placeholder
                title="Def"
                darkMode={darkMode}
                id={activeCategory.id}
              />
            )}
            {activeCategory.categoryName === "ghi" && (
              <Placeholder
                title="Ghi"
                darkMode={darkMode}
                id={activeCategory.id}
              />
            )}
            {activeCategory.categoryName === "jkl" && (
              <Placeholder
                title="Jkl"
                darkMode={darkMode}
                id={activeCategory.id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function Placeholder({ title, darkMode }) {
  return (
    <div className="text-center py-8 sm:py-10 md:py-12 animate-fadeIn">
      <div
        className={`mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-inner ${
          darkMode
            ? "bg-gradient-to-br from-indigo-900/30 to-indigo-700/20"
            : "bg-gradient-to-br from-[#3470b2]/10 to-[#3a7bd5]/20"
        }`}
      >
        <span
          className={`text-2xl sm:text-3xl md:text-4xl animate-pulse ${
            darkMode ? "text-indigo-400" : "text-[#3470b2]"
          }`}
        >
          📝
        </span>
      </div>
      <h3
        className={`text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 ${
          darkMode ? "text-gray-100" : "text-gray-800"
        }`}
      >
        {title} Verification
      </h3>
      <p
        className={`text-xs sm:text-sm max-w-md mx-auto mb-4 sm:mb-6 ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        The {title} verification form is currently under development. We're
        working hard to bring you this feature soon.
      </p>
      <button
        className={`px-4 py-1 sm:px-6 sm:py-2 text-white rounded-md sm:rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 sm:hover:-translate-y-1 active:translate-y-0 active:scale-95 text-sm sm:text-base font-medium ${
          darkMode
            ? "bg-[#3470b2]"
            : "bg-gradient-to-r from-[#3470b2] to-[#3a7bd5] hover:from-[#3a7bd5] hover:to-[#00d2ff]"
        }`}
      >
        Notify Me When Available
      </button>
    </div>
  );
}

export default CategoriesLayout;
