import { useEffect, useRef, useState } from "react";
import { MapPin, ShieldCheck } from "lucide-react";

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop",
    alt: "Modern villa exterior with lawn",
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
    alt: "Luxury home exterior at sunset",
  },
  {
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop",
    alt: "Bright modern living room interior",
  },
  {
    src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop",
    alt: "Contemporary apartment living space",
  },
];

export default function Hero() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [text, setText] = useState({
    title: "Find Your Next Home",
    subtitle: "Verified properties for buying and renting in prime locations.",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("carouselText"));
    if (saved) setText(saved);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % heroImages.length;
        const scroller = scrollRef.current;

        if (scroller) {
          scroller.scrollTo({
            left: nextIndex * scroller.clientWidth,
            behavior: "smooth",
          });
        }

        return nextIndex;
      });
    }, 2000);

    return () => window.clearInterval(timer);
  }, []);

  const handleManualScroll = () => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    setActiveIndex(Math.round(scroller.scrollLeft / scroller.clientWidth));
  };

  return (
    <section className="bg-slate-50 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-xl shadow-slate-200">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/80 via-slate-950/35 to-transparent pointer-events-none" />

          <div className="absolute left-6 right-6 top-1/2 z-20 max-w-2xl -translate-y-1/2 text-white sm:left-10 lg:left-14">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              <ShieldCheck size={15} />
              Verified Real Estate
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {text.title}
            </h1>
            <p className="mt-4 max-w-xl text-base font-medium leading-7 text-white/85 sm:text-lg">
              {text.subtitle}
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-white/90">
              <MapPin size={18} />
              Noida, Delhi NCR, and nearby locations
            </div>
          </div>

          <div
            ref={scrollRef}
            onScroll={handleManualScroll}
            className="flex h-[420px] snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-color:#dc2626_#e2e8f0] [scrollbar-width:thin] sm:h-[500px]"
          >
            {heroImages.map((image) => (
              <div
                key={image.src}
                className="h-full min-w-full snap-center"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {heroImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => {
                  setActiveIndex(index);
                  scrollRef.current?.scrollTo({
                    left: index * scrollRef.current.clientWidth,
                    behavior: "smooth",
                  });
                }}
                aria-label={`Show property image ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === index ? "w-8 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
