'use client';

import useCarousel from '@hooks/useCarousel';
import Image from 'next/image';
import React, { FC } from 'react';

const Carousel: FC<{ images: string[] }> = ({ images }) => {
  const { currentIndex, setCurrentIndex } = useCarousel(images);

  return (
    <div className="h-[500px] relative w-full overflow-hidden">
      <div className="relative w-full h-full">
        {images?.map((img, index) => (
          <Image
            key={index}
            src={img}
            alt={`Carousel Image ${index + 1}`}
            className={`absolute w-full h-full object-cover rounded-lg transition-transform duration-500 ${
              currentIndex === index ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{
              transform: `translateX(${(index - currentIndex) * 100}%)`,
            }}
            priority={true}
            width="0"
            height="0"
            sizes="100vw"
          />
        ))}
      </div>
      <div className="absolute inset-0 flex justify-between items-center p-4">
        <button
          onClick={() =>
            setCurrentIndex((currentIndex - 1 + images.length) % images.length)
          }
          className="bg-gray-800 text-white p-2 rounded-full opacity-50 hover:opacity-75 transition-opacity duration-200"
        >
          ❮
        </button>
        <button
          onClick={() => setCurrentIndex((currentIndex + 1) % images.length)}
          className="bg-gray-800 text-white p-2 rounded-full opacity-50 hover:opacity-75 transition-opacity duration-200"
        >
          ❯
        </button>
      </div>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images?.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? 'bg-white' : 'bg-gray-400'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
