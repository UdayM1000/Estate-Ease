import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Bath,
  Bed,
  Building2,
  ChevronDown,
  HeartHandshake,
  Home,
  IndianRupee,
  KeyRound,
  Mail,
  MapPin,
  Maximize,
  Mouse,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link, useNavigate } from 'react-router-dom';
import Coastal from '../../assets/Images/Coastal.png';
import Contemporary from '../../assets/Images/Contemporary.png';
import Mountain from '../../assets/Images/Mountain.png';
import Rustic from '../../assets/Images/Rustic.png';
import Ultra from '../../assets/Images/Ultra.png';
import Warm from '../../assets/Images/Warm.png';

// Import your login components
import Login from '../Auth/Login';

const heroImages = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1974&h=700',Coastal,Contemporary,Mountain
];

const featuredProperties = [
  { id: 1, img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600', price: '$1,250,000', title: 'Skyline Modern Villa', location: 'Beverly Hills, CA', beds: 4, baths: 3, sqft: 3200 },
  { id: 2, img: Coastal, price: '$899,000', title: 'Garden Oasis Home', location: 'Santa Monica, CA', beds: 3, baths: 2, sqft: 2800 },
  { id: 3, img: Contemporary, price: '$1,500,000', title: 'Coastal Retreat', location: 'Malibu, CA', beds: 5, baths: 4, sqft: 4500 },
  { id: 4, img:  Mountain, price: '$720,000', title: 'Urban Loft Penthouse', location: 'Downtown LA, CA', beds: 2, baths: 2, sqft: 1800 },
  { id: 5, img:  Warm, price: '$1,100,000', title: 'Suburban Family Home', location: 'Orange County, CA', beds: 4, baths: 2, sqft: 3000 },
  { id: 6, img:  Ultra, price: '$950,000', title: 'Lakefront Cabin', location: 'Lake Tahoe, CA', beds: 3, baths: 3, sqft: 2500 },
  { id: 7, img:  Rustic, price: '$950,00', title: 'Lakefront', location: 'Lake, CA', beds: 2, baths: 1, sqft: 1500 },
];

const trustBadges = [
  { label: 'Verified homes', icon: ShieldCheck },
  { label: 'Smart visits', icon: Sparkles },
  { label: 'Local experts', icon: HeartHandshake },
];

const quickActions = [
  {
    title: 'Buy a home',
    copy: 'Shortlist verified properties and compare every important detail before a visit.',
    icon: Home,
    accent: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    title: 'Rent faster',
    copy: 'Find flexible rental options, then request a visit when a place feels right.',
    icon: KeyRound,
    accent: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    title: 'Featured picks',
    copy: 'Start with highlighted homes that deserve your attention first.',
    icon: Star,
    accent: 'text-amber-600',
    bg: 'bg-amber-50',
  },
];

const priceOptions = [
  { value: '0-250000', label: '$0 - $250K' },
  { value: '250000-500000', label: '$250K - $500K' },
  { value: '500000-750000', label: '$500K - $750K' },
  { value: '750000-1000000', label: '$750K - $1M' },
  { value: '1000000-max', label: '$1M+' },
];

const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  // Search state
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState(null);
  const [priceRange, setPriceRange] = useState(null);

  useEffect(() => {
    // const token = localStorage.getItem('accessToken');
    // if (token) setIsLoggedIn(true);
    
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('accessToken'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const scrollToFeatured = () => {
    document.getElementById('featured-properties')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    toast.success('Logged out successfully.');
    navigate('/');
  };

  // Restrict feature logic
  const handleRestrictedAction = (e) => {
    if (e) e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please login to perform this task", {
        duration: 3000,
        position: 'top-center',
      });
      setShowLoginModal(true);
      return false;
    }
    return true;
  };

  const handleSearch = () => {
    if (handleRestrictedAction()) {
      const locationLabel = location.trim() || 'available areas';
      const propertyLabel = propertyType?.label || 'properties';
      toast.success(`Searching ${locationLabel} for ${propertyLabel}...`);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen scroll-smooth bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-2.5 text-xl font-black tracking-tight text-slate-950">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:scale-105">
              <Building2 size={21} />
            </span>
            <span>ESTATE.PRO</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-bold text-slate-500 md:flex">
            <button type="button" onClick={scrollToFeatured} className="transition hover:text-blue-600">
              Featured
            </button>
            <button type="button" onClick={handleRestrictedAction} className="transition hover:text-blue-600">
              Visits
            </button>
            <button type="button" onClick={handleRestrictedAction} className="transition hover:text-blue-600">
              Agents
            </button>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <button type="button" onClick={handleLogout} className="px-5 py-2.5 rounded-full border border-slate-300 font-bold hover:bg-slate-50 transition">
                Logout
              </button>
            ) : (
              <button type="button" onClick={() => setShowLoginModal(true)} className="px-5 py-2.5 rounded-full border border-slate-300 font-bold hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition">
                Sign In
              </button>
            )}
            <button type="button" onClick={handleRestrictedAction} className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 hover:-translate-y-0.5 shadow-lg shadow-blue-200 transition">
              List Property
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Carousel */}
      <section className="relative overflow-hidden pt-20">
        <Carousel
          showThumbs={false}
          showStatus={false}
          showArrows={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={5000}
          transitionTime={800}
          className="absolute inset-0"
        >
          {heroImages.map((img, index) => (
            <div key={index} className="h-full">
              <img src={img} className="w-full h-full object-cover brightness-[0.5]" alt={`Luxury Home ${index + 1}`} />
            </div>
          ))}
        </Carousel>

        <div className="absolute inset-0 bg-slate-950/35" />

        <div className="relative z-10 flex min-h-[820px] items-center justify-center px-4 py-16 sm:min-h-[780px] sm:px-6 lg:min-h-[760px]">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="w-full max-w-6xl text-center text-white">
            <motion.div variants={fadeInUp} className="mx-auto mb-6 flex flex-wrap items-center justify-center gap-3">
              {trustBadges.map(({ label, icon: Icon }) => (
                <span key={label} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-slate-950/10 backdrop-blur-md">
                  <Icon size={15} />
                  {label}
                </span>
              ))}
            </motion.div>

            <motion.h1 variants={fadeInUp} className="mx-auto max-w-5xl text-4xl font-black leading-[1.08] sm:text-6xl lg:text-7xl">
              Discover homes that match how you actually live.
            </motion.h1>

            <motion.p variants={fadeInUp} className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-white/80 sm:text-lg">
              Browse beautiful homes, save your preferred style, and book visits after signing in.
            </motion.p>

            <motion.div variants={fadeInUp} className="mx-auto mt-9 grid max-w-5xl gap-3 rounded-[2rem] border border-white/20 bg-white p-3 text-left shadow-2xl shadow-slate-950/25 lg:grid-cols-[1.25fr_0.85fr_0.85fr_auto] lg:rounded-full">
              <label className="flex min-h-14 min-w-0 items-center gap-3 rounded-2xl bg-slate-50 px-4 lg:bg-transparent">
                <MapPin className="h-5 w-5 shrink-0 text-blue-600" />
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="City, area, or project"
                  className="min-w-0 w-full border-0 bg-transparent text-base font-bold text-slate-800 outline-none placeholder:text-slate-400"
                />
              </label>

              <label className="flex min-h-14 min-w-0 items-center gap-3 rounded-2xl bg-slate-50 px-4 lg:border-l lg:border-slate-200 lg:bg-transparent">
                <Home className="h-5 w-5 shrink-0 text-blue-600" />
                <select
                  value={propertyType?.value || ''}
                  onChange={(event) => setPropertyType(event.target.value ? { value: event.target.value, label: event.target.options[event.target.selectedIndex].text } : null)}
                  className="min-w-0 w-full appearance-none border-0 bg-transparent text-base font-bold text-slate-700 outline-none"
                >
                  <option value="">Property type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="condo">Condo</option>
                </select>
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
              </label>

              <label className="flex min-h-14 min-w-0 items-center gap-3 rounded-2xl bg-slate-50 px-4 lg:border-l lg:border-slate-200 lg:bg-transparent">
                <IndianRupee className="h-5 w-5 shrink-0 text-blue-600" />
                <select
                  value={priceRange?.value || ''}
                  onChange={(event) => setPriceRange(event.target.value ? { value: event.target.value, label: event.target.options[event.target.selectedIndex].text } : null)}
                  className="min-w-0 w-full appearance-none border-0 bg-transparent text-base font-bold text-slate-700 outline-none"
                >
                  <option value="">Budget</option>
                  {priceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
              </label>

              <button
                type="button"
                onClick={handleSearch}
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 text-base font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 lg:w-auto lg:rounded-full"
              >
                <Search size={19} />
                Search
              </button>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowLoginModal(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-black text-blue-600 shadow-xl shadow-slate-950/20 transition hover:-translate-y-1 hover:bg-blue-50 sm:w-auto"
              >
                Start Exploring
                <ArrowRight size={17} />
              </button>
              <button
                type="button"
                onClick={scrollToFeatured}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20 sm:w-auto"
              >
                View Featured
                <Mouse size={17} />
              </button>
            </motion.div>

            <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-white/15 bg-white/10 text-white backdrop-blur-md sm:grid-cols-3">
              <div className="p-4">
                <p className="text-2xl font-black">120+</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-white/65">Listings</p>
              </div>
              <div className="border-y border-white/15 p-4 sm:border-x sm:border-y-0">
                <p className="text-2xl font-black">24h</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-white/65">Visit review</p>
              </div>
              <div className="p-4">
                <p className="text-2xl font-black">4.8</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-white/65">User rating</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="relative z-10 px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {quickActions.map(({ title, copy, icon: Icon, accent, bg }) => (
            <motion.button
              type="button"
              key={title}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRestrictedAction}
              className="group rounded-3xl border border-slate-100 bg-white p-6 text-left shadow-xl shadow-slate-200/70 transition hover:shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg} ${accent}`}>
                  <Icon size={23} />
                </span>
                <ArrowRight className={`h-5 w-5 text-slate-300 transition group-hover:translate-x-1 ${accent}`} />
              </div>
              <h3 className="text-xl font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-500">{copy}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section id="featured-properties" className="scroll-mt-24 bg-white px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-blue-600">
                <Sparkles size={15} />
                Curated preview
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Featured Properties</h2>
              <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-slate-500">
                A public preview of homes worth opening first. Sign in when you are ready to book a visit.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLoginModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-600"
            >
              Unlock full access
              <ArrowRight size={17} />
            </button>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <motion.div
                key={property.id}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.01 }}
                onClick={handleRestrictedAction}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:border-blue-100 hover:shadow-2xl hover:shadow-slate-200"
              >
                <div className="h-64 overflow-hidden relative">
                  <img src={property.img} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt={property.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-sm font-black text-blue-600 shadow-lg backdrop-blur">{property.price}</div>
                  <div className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-amber-500 shadow-lg backdrop-blur transition group-hover:scale-110">
                    <Star size={18} fill="currentColor" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-4"><MapPin size={16} /> {property.location}</div>
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-50 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1"><Bed size={14} /> {property.beds} BD</span>
                    <span className="flex items-center gap-1"><Bath size={14} /> {property.baths} BA</span>
                    <span className="flex items-center gap-1"><Maximize size={14} /> {property.sqft} SQFT</span>
                  </div>
                  <div className="mt-5 flex items-center justify-between text-sm font-black text-blue-600 opacity-0 transition group-hover:opacity-100">
                    Preview details
                    <ArrowRight size={17} className="transition group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Poster */}
      <section className="px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-slate-950">
          <div className="grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-blue-100">
                <ShieldCheck size={15} />
                Members get the useful tools
              </span>
              <h2 className="mt-5 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">Ready to find your next home?</h2>
              <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/70">Unlock exclusive deals, visit booking, and expert support by signing in today.</p>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRestrictedAction}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-9 py-4 text-lg font-black text-blue-600 shadow-xl transition hover:bg-blue-50"
            >
              {isLoggedIn ? "Contact an Agent" : "Sign in to contact"}
              <ArrowRight size={19} />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div><h4 className="text-xl font-bold mb-4">ESTATE.PRO</h4><p className="text-slate-400">Your trusted real estate partner.</p></div>
          <div><h4 className="font-bold mb-4">Quick Links</h4><ul className="text-slate-400 space-y-2"><li>Buy</li><li>Sell</li></ul></div>
          <div><h4 className="font-bold mb-4">Support</h4><ul className="text-slate-400 space-y-2"><li>FAQs</li><li>Privacy</li></ul></div>
          <div><h4 className="font-bold mb-4">Contact</h4><ul className="text-slate-400 space-y-2"><li className="flex items-center gap-2">
            <Mail size={16}/> <a href="mailto:udaymahajan1000@gmail.com" className="underline">udaymahajan1000@gmail.com</a>
          </li></ul></div>
        </div>
      </footer>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex justify-center items-center z-[100]" onClick={() => setShowLoginModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="relative bg-white rounded-3xl shadow-3xl max-w-md w-full overflow-hidden">
              <button type="button" onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-[110]"><X size={24} /></button>
              <Login />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
