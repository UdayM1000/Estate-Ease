import { Bath, BedDouble, Calendar, ChevronLeft, ChevronRight, MapPin, Square, Star } from "lucide-react";
import { useState } from "react";

/**
 * @param {Object} item - Individual property object from res.data.content
 * @param {Function} onBook - Function to handle booking logic
 */
export default function PropertyCard({ item, onBook }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Backend Image Mapping
  // Since you use Multipart uploads, images are usually in imageUrls (Array) 
  // or imageUrl (String). This handles both + a placeholder.
  const images = item?.imageUrls?.length > 0
    ? item.imageUrls
    : item?.imageUrl
      ? [item.imageUrl]
      : ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop"];

  // 2. Formatting Price for Indian Currency (₹)
  const formatPrice = (price) => {
    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice)) {
      return "Price on request";
    }

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(numericPrice);
  };

  const nextSlide = (e) => {
    e.stopPropagation(); // Prevents triggering parent clicks
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (!item) return null;

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 group flex flex-col h-full">
      
      {/* --- Visual Section (Carousel) --- */}
      <div className="relative h-72 overflow-hidden group/carousel">
        <img
          src={images[currentIndex]}
          alt={item.title}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
        />

        {/* Status Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2 z-20">
          <div className="bg-indigo-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
            {item.type || "SALE"}
          </div>
          {item.featured && (
            <div className="bg-amber-400 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 animate-pulse">
              <Star size={12} fill="currentColor" /> Featured
            </div>
          )}
        </div>

        {/* Carousel Navigation */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevSlide} 
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-xl opacity-0 group-hover/carousel:opacity-100 transition-all z-30 hover:bg-indigo-600 hover:text-white active:scale-90"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextSlide} 
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-xl opacity-0 group-hover/carousel:opacity-100 transition-all z-30 hover:bg-indigo-600 hover:text-white active:scale-90"
            >
              <ChevronRight size={20} />
            </button>
            
            {/* Slide Indicators */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-30">
              {images.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "bg-white w-6 shadow-md" : "bg-white/40 w-1.5"
                  }`} 
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* --- Details Section --- */}
      <div className="p-7 flex flex-col flex-grow bg-gradient-to-b from-white to-slate-50/30">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-bold text-slate-800 line-clamp-1 tracking-tight">{item.title}</h3>
          <span className="text-2xl font-black text-indigo-600 whitespace-nowrap">
            {formatPrice(item.price)}
            {item.priceSuffix && (
              <span className="ml-1 text-sm font-bold text-slate-400">
                {item.priceSuffix}
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center text-slate-400 text-sm mb-5 font-medium">
          <MapPin size={16} className="mr-1.5 text-indigo-400" /> {item.location}
        </div>

        {/* Icons/Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-100 mb-6 text-slate-600">
          <div className="flex flex-col items-center gap-1 border-r border-slate-100">
            <BedDouble size={20} className="text-indigo-500/60" />
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">{item.bedrooms || 0} Beds</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-r border-slate-100">
            <Bath size={20} className="text-indigo-500/60" />
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">{item.bathrooms || 0} Baths</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Square size={20} className="text-indigo-500/60" />
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">{item.squareFeet || 0} Sqft</span>
          </div>
        </div>

        {/* Description Line Clamp */}
        <p className="text-slate-500 text-sm line-clamp-2 mb-8 flex-grow leading-relaxed">
          {item.description}
        </p>

        {/* Booking Action */}
        <button
          onClick={() => onBook(item)}
          className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-[1.25rem] transition-all duration-300 shadow-xl shadow-slate-200 active:scale-[0.97]"
        >
          <Calendar size={20} />
          Book Viewing
        </button>
      </div>
    </div>
  );
}
