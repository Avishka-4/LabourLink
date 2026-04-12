import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const ads = [
  {
    id: 1,
    title: "Know Your Rights",
    description: "Access comprehensive information about migrant worker rights and protections",
    bgColor: "bg-gradient-to-r from-blue-500 to-indigo-600",
  },
  {
    id: 2,
    title: "Free Legal Consultation",
    description: "Get free legal support and advice through our government-backed program",
    bgColor: "bg-gradient-to-r from-emerald-500 to-teal-600",
  },
  {
    id: 3,
    title: "Healthcare Services",
    description: "Access quality healthcare facilities and medical support services",
    bgColor: "bg-gradient-to-r from-purple-500 to-pink-600",
  },
  {
    id: 4,
    title: "Skills Training Programs",
    description: "Enroll in free skills development and vocational training courses",
    bgColor: "bg-gradient-to-r from-amber-500 to-orange-600",
  },
];

export function AdCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 10000); // Rotate every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="relative h-64 flex items-center justify-center">
        {ads.map((ad, index) => (
          <div
            key={ad.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            } ${ad.bgColor}`}
          >
            <div className="flex flex-col items-center justify-center h-full text-white p-8 text-center">
              <h3 className="text-white mb-3">{ad.title}</h3>
              <p className="text-lg text-white/90 max-w-2xl">{ad.description}</p>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
          onClick={goToPrevious}
        >
          <ChevronLeft className="size-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
          onClick={goToNext}
        >
          <ChevronRight className="size-6" />
        </Button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
