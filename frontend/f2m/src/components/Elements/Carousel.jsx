import { useEffect, useState } from "react";
import { getCarouselData } from "../../services/CarouselService";
import { useNavigate } from "react-router-dom";

export const Carousel = () => {

  const navigate = useNavigate();

  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getCarouselData().then(setSlides);
  }, []);

  // Auto slide
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides]);

  if (!slides.length) return null;

  const prevSlide = () => {
    setIndex(index === 0 ? slides.length - 1 : index - 1);
  };

  const nextSlide = () => {
    setIndex((index + 1) % slides.length);
  };

  // ✅ CLICK HANDLER (UPDATED)
  const handleClick = () => {
    const title = slides[index].title.toLowerCase();

    if (title.includes("fresh")) {
      navigate("/explore-products?type=fresh");
    } else if (title.includes("seasonal")) {
      navigate("/explore-products?type=seasonal");
    } else if (title.includes("organic")) {
      navigate("/explore-products?type=organic");
    } else {
      navigate("/explore-products?type=all");
    }
  };

  return (
    <div
      className="relative w-full h-[350px] overflow-hidden cursor-pointer"
      onClick={handleClick}
    >

      <img
        src={slides[index].imageUrl}
        alt="slide"
        className="w-full h-full object-cover"
      />

      {/* TEXT */}
      <div className="absolute top-1/3 left-10 text-white">
        <h2 className="text-3xl font-bold">{slides[index].title}</h2>
        <p className="text-lg">{slides[index].subtitle}</p>
      </div>

      {/* LEFT */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="absolute left-5 top-1/2 text-white text-3xl"
      >
        ❮
      </button>

      {/* RIGHT */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="absolute right-5 top-1/2 text-white text-3xl"
      >
        ❯
      </button>

    </div>
  );
};