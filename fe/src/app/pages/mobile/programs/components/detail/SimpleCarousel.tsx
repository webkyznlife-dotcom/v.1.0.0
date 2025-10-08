import React, { useState, useEffect } from "react";

interface CarouselProps {
  images: string[];
  interval?: number; // default 3 detik
}

const SimpleCarousel: React.FC<CarouselProps> = ({ images, interval = 3000 }) => {
  const [current, setCurrent] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);
  const [endX, setEndX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Auto slide
  useEffect(() => {
    if (isDragging) return; // Jangan auto jalan kalau sedang drag
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval, isDragging]);

  // ===== Swipe / Drag Handlers =====
  const handleStart = (clientX: number) => {
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    setEndX(clientX);
  };

  const handleEnd = () => {
    if (!isDragging || startX === null || endX === null) {
      setIsDragging(false);
      return;
    }

    const distance = startX - endX;

    if (distance > 50) {
      // Geser kiri → next
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
    if (distance < -50) {
      // Geser kanan → prev
      setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }

    setStartX(null);
    setEndX(null);
    setIsDragging(false);
  };

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      // Touch
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
      // Mouse
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      {/* Gambar fade-in fade-out */}
      <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 rounded-md overflow-hidden">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`slide-${i}`}
            className={`absolute top-0 left-0 w-full h-full object-cover rounded-md shadow-md transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
            draggable={false}
          />
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-3 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              current === index ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SimpleCarousel;
