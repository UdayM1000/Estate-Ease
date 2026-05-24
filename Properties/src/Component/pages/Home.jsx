import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, Sparkles, Calendar, Clock, CheckCircle, XCircle, Trash2, Home as HomeIcon, Building2, KeyRound, Star, ArrowRight, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import BookingModal from "../BookingModel";
import Hero from "../Hero";
import HomeSearchBar from "../HomeSearchBar";
import PropertyCard from "../PropertyCard";
import { filterProperties } from "../../utils/propertySearch";

export default function Home({ user }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [searchParams] = useSearchParams();

  // 🔍 EMAIL SEARCH
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // 📅 BOOKINGS
  const [bookings, setBookings] = useState([]);

  // Delete Bookings 
  const cancelBooking = async (bookingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmDelete) return;

    try {
      const encodedEmail = encodeURIComponent(email.trim());

      await axiosInstance.delete(`/bookings/delete/${bookingId}?email=${encodedEmail}`);

      // ✅ Remove booking from UI instantly
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));

      alert("Booking cancelled successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    }
  };

  // ===============================
  // FETCH BOOKINGS BY EMAIL
  // ===============================
  const fetchBookings = async () => {
    try {
      setError("");

      if (!email || !email.trim()) {
        setError("Please enter a valid email");
        return;
      }

      const encodedEmail = encodeURIComponent(email.trim());

      setBookingLoading(true);
      const res = await axiosInstance.get(
        `/bookings/user/${encodedEmail}`
      );

      if (Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Failed to load bookings", err);
      setError("No bookings found for this email");
      setBookings([]);
    } finally {
      setBookingLoading(false);
    }
  };

  // ===============================
  // FETCH PROPERTIES
  // ===============================
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get("/properties");
        setProperties(res.data?.content || res.data || []);

      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // ===============================
  // FILTER PROPERTIES
  // ===============================
  const filteredItems = filterProperties(
    filter === "ALL"
      ? properties
      : properties.filter((p) => p.type === filter),
    {
      query: searchParams.get("q") || "",
      budget: searchParams.get("budget") || "any",
      bedrooms: searchParams.get("bedrooms") || "",
    }
  );

  return (
    <div className="bg-slate-50/50 min-h-screen font-sans antialiased text-slate-800">
      <Hero />
      <HomeSearchBar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-600 ring-1 ring-red-100">
              <ShieldCheck size={14} />
              Start Here
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              What are you looking for today?
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
              Pick a path and we will take you straight to the listings that match how people actually search: budget, location, bedrooms, and visit availability.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Link
            to="/buy"
            className="group relative min-h-[360px] overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-xl shadow-slate-200 transition-all hover:-translate-y-1"
          >
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/20" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-red-600 shadow-lg">
                  <Building2 size={23} />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.24em] text-red-200">
                  Buy Property
                </span>
                <h3 className="mt-3 text-3xl font-black leading-tight">
                  Own a home that fits your budget and lifestyle.
                </h3>
                <p className="mt-4 text-sm leading-6 text-white/75">
                  Compare verified properties, inspect key details, and book visits before making the big decision.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-start xl:flex-row xl:items-center">
                <div className="flex gap-3 text-sm font-bold text-white/90">
                  <span>{properties.filter((item) => item.type === "BUY").length || 0} buy listings</span>
                  <span className="text-white/35">|</span>
                  <span>Visit booking</span>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-black text-white transition group-hover:bg-red-500">
                  Explore Buy
                  <ArrowRight size={17} className="transition group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>

          <Link
            to="/rent"
            className="group relative min-h-[360px] overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-xl shadow-slate-200 transition-all hover:-translate-y-1"
          >
            <img
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-slate-950/80 to-slate-950/20" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-lg">
                  <KeyRound size={23} />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.24em] text-emerald-200">
                  Rent Fast
                </span>
                <h3 className="mt-3 text-3xl font-black leading-tight">
                  Move into the right place sooner.
                </h3>
                <p className="mt-4 text-sm leading-6 text-white/75">
                  Filter monthly rentals by area and bedroom count, then schedule a viewing in a few clicks.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-start xl:flex-row xl:items-center">
                <div className="flex gap-3 text-sm font-bold text-white/90">
                  <span>{properties.filter((item) => item.type === "RENT").length || 0} rentals</span>
                  <span className="text-white/35">|</span>
                  <span>Quick visits</span>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-black text-white transition group-hover:bg-emerald-500">
                  Explore Rent
                  <ArrowRight size={17} className="transition group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>

          <Link
            to="/featured"
            className="group relative min-h-[360px] overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-xl shadow-slate-200 transition-all hover:-translate-y-1"
          >
            <img
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-950 via-slate-950/80 to-slate-950/20" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-lg">
                  <Star size={23} />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.24em] text-amber-200">
                  Featured
                </span>
                <h3 className="mt-3 text-3xl font-black leading-tight">
                  See the homes worth opening first.
                </h3>
                <p className="mt-4 text-sm leading-6 text-white/75">
                  Jump into highlighted listings with stronger photos, better visibility, and faster discovery.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-start xl:flex-row xl:items-center">
                <div className="flex gap-3 text-sm font-bold text-white/90">
                  <span>{properties.filter((item) => item.featured).length || 0} homes</span>
                  <span className="text-white/35">|</span>
                  <span>Hand-picked</span>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-5 py-3 text-sm font-black text-white transition group-hover:bg-amber-500">
                  Explore Featured
                  <ArrowRight size={17} className="transition group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ===============================
          MY BOOKINGS
      =============================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.35fr]">
            <div className="bg-slate-950 p-7 text-white sm:p-8 lg:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/80">
                <Calendar size={14} />
                Visit Tracker
              </span>
              <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                Track every property visit in one place.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/70">
                Use the same email you entered during booking to check approval status, visit timing, and cancellation options.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-2xl font-black">{bookings.length}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-white/55">Loaded visits</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-2xl font-black">24h</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-white/55">Team review</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="mb-6">
                <h3 className="text-2xl font-black tracking-tight text-slate-950">
                  My Scheduled Visits
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Enter your registered email to view active visit requests and their latest status.
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    placeholder="Enter email to track visits..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border-0 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none ring-1 ring-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <button
                  onClick={fetchBookings}
                  disabled={bookingLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-100 transition-all hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-red-400"
                >
                  {bookingLoading ? "Finding..." : "Find Bookings"}
                  {bookingLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <ArrowRight size={16} />
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 flex max-w-2xl items-center gap-2 rounded-xl border border-red-100 bg-red-50/80 p-4 text-sm text-red-600">
                  <XCircle size={16} className="shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOOKINGS LIST */}
        <div className="mt-8">
          {bookings.length === 0 ? (
            <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                <HomeIcon size={20} />
              </div>
              <p className="text-base font-black text-slate-800">No booked visits loaded yet</p>
              <p className="mt-2 text-sm text-slate-400">Search with your registered email to preview active statuses.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((b) => (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={b.id}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300"
                >
                  {/* Property Preview */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img 
                      src={b.propertyImage} 
                      alt={b.propertyTitle}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border shadow-sm backdrop-blur-md
                        ${b.status === "APPROVED" ? "bg-emerald-500/90 text-white border-emerald-400/30" : 
                          b.status === "REJECTED" ? "bg-red-500/90 text-white border-red-400/30" : 
                          "bg-amber-500/90 text-white border-amber-400/30"}
                      `}>
                        {b.status}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-5 right-5">
                      <span className="text-indigo-300 text-[10px] font-bold uppercase tracking-wider block mb-0.5">Scheduled Visit</span>
                      <h3 className="text-white font-semibold text-lg line-clamp-1 tracking-tight">
                        {b.propertyTitle}
                      </h3>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="p-5 flex flex-col flex-grow">
                    
                    {/* Visit Information */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100/50">
                      <div className="flex items-center gap-2.5">
                        <Calendar size={15} className="text-slate-400" />
                        <div>
                          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Date</p>
                          <p className="text-slate-800 text-xs font-semibold">{b.visitDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 border-l border-slate-200 pl-4">
                        <Clock size={15} className="text-slate-400" />
                        <div>
                          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Time Slot</p>
                          <p className="text-slate-800 text-xs font-semibold">{b.visitTime}</p>
                        </div>
                      </div>
                    </div>

                    {/* Informational Message based on status */}
                    <div className={`p-3 rounded-xl flex items-start gap-2.5 border flex-grow text-xs leading-relaxed ${
                      b.status === "APPROVED" ? "bg-emerald-50/40 border-emerald-100/70 text-emerald-800" : 
                      b.status === "REJECTED" ? "bg-red-50/40 border-red-100/70 text-red-800" : 
                      "bg-slate-50/80 border-slate-100 text-slate-600"
                    }`}>
                      {b.status === "APPROVED" ? (
                        <>
                          <CheckCircle size={15} className="shrink-0 text-emerald-600 mt-0.5" />
                          <p>Your visit is confirmed! Our agent will meet you at the property at the scheduled time.</p>
                        </>
                      ) : b.status === "REJECTED" ? (
                        <>
                          <XCircle size={15} className="shrink-0 text-red-600 mt-0.5" />
                          <p>This slot was unavailable. Please try booking a different date or contact support.</p>
                        </>
                      ) : (
                        <>
                          <Clock size={15} className="shrink-0 text-amber-600 mt-0.5" />
                          <p>Request received. Our team is reviewing your preferred slot and will update you shortly.</p>
                        </>
                      )}
                    </div>

                    {/* Cancel Booking Action */}
                    <button
                      onClick={() => cancelBooking(b.id)}
                      className="mt-4 w-full py-2.5 bg-white text-slate-700 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-all hover:bg-red-50/30"
                    >
                      <Trash2 size={13} />
                      Cancel Booking
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===============================
          PROPERTIES
      =============================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-10 overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-600">
              <Sparkles size={13} /> Premium Selection
            </span>
            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Browse properties ready for your next visit
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Filter the latest available listings by intent and continue from search results without losing momentum.
            </p>
          </motion.div>

          {/* Filter Segment Control */}
          <div className="flex rounded-2xl border border-slate-200/60 bg-slate-100 p-1">
            {["ALL", "BUY", "RENT"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`rounded-xl px-5 py-2 text-xs font-black transition-all duration-200
                  ${filter === type
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 border-t border-slate-100 pt-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-2xl font-black text-slate-950">{filteredItems.length}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">Matching results</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-2xl font-black text-slate-950">{properties.filter((item) => item.type === "BUY").length}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">For purchase</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-2xl font-black text-slate-950">{properties.filter((item) => item.type === "RENT").length}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">For rent</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white py-24 shadow-sm">
            <Loader2 className="animate-spin text-red-600" size={36} />
            <p className="mt-4 text-xs font-black uppercase tracking-[0.25em] text-slate-400">Loading properties</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-24 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Search size={22} />
            </div>
            <p className="text-lg font-black text-slate-800">No matching properties found</p>
            <p className="mt-2 text-sm text-slate-400">Try changing the search bar filters or switch between Buy and Rent.</p>
          </div>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <PropertyCard
                  key={item.id}
                  item={item}
                  onBook={(prop) => setSelectedProperty(prop)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {selectedProperty && (
          <BookingModal
            property={selectedProperty}
            user={user}
            onClose={() => setSelectedProperty(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
