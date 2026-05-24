import {
  Building2,
  ChevronDown,
  Home,
  IndianRupee,
  MapPin,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { budgetRanges } from "../utils/propertySearch";

const propertyTypes = [
  { label: "All", value: "ALL", path: "/home" },
  { label: "Buy", value: "BUY", path: "/buy" },
  { label: "Rent", value: "RENT", path: "/rent" },
];

const bedroomOptions = [
  { label: "Any Beds", value: "" },
  { label: "1+ Beds", value: "1" },
  { label: "2+ Beds", value: "2" },
  { label: "3+ Beds", value: "3" },
  { label: "4+ Beds", value: "4" },
];

export default function HomeSearchBar() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("ALL");
  const [bedrooms, setBedrooms] = useState("1");
  const [budget, setBudget] = useState("any");

  const selectedType = useMemo(
    () => propertyTypes.find((item) => item.value === type) || propertyTypes[0],
    [type]
  );

  const handleSearch = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();
    const trimmedLocation = location.trim();

    if (trimmedLocation) params.set("q", trimmedLocation);
    if (budget !== "any") params.set("budget", budget);
    if (bedrooms) params.set("bedrooms", bedrooms);

    navigate(`${selectedType.path}${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative z-20 mx-auto mt-8 w-[calc(100%-2rem)] max-w-6xl rounded-[2rem] border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/70 sm:rounded-full"
    >
      <div className="grid gap-3 lg:grid-cols-[1.25fr_0.85fr_0.85fr_0.85fr_auto] lg:items-center lg:gap-0">
        <label className="flex min-h-14 items-center gap-3 rounded-2xl bg-slate-50 px-4 lg:bg-transparent">
          <MapPin className="h-5 w-5 shrink-0 text-red-600" />
          <div className="min-w-0 flex-1">
            <span className="block text-[11px] font-black uppercase tracking-wider text-slate-400">
              Location
            </span>
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Add city, area, or project..."
              className="w-full border-0 bg-transparent text-base font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>
        </label>

        <label className="flex min-h-14 items-center gap-3 rounded-2xl bg-slate-50 px-4 lg:border-l lg:border-slate-200 lg:bg-transparent">
          <Home className="h-5 w-5 shrink-0 text-red-600" />
          <span className="sr-only">Property type</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="w-full appearance-none border-0 bg-transparent pr-8 text-base font-semibold text-slate-700 outline-none"
          >
            {propertyTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none h-4 w-4 shrink-0 text-slate-400" />
        </label>

        <label className="flex min-h-14 items-center gap-3 rounded-2xl bg-slate-50 px-4 lg:border-l lg:border-slate-200 lg:bg-transparent">
          <Building2 className="h-5 w-5 shrink-0 text-red-600" />
          <span className="sr-only">Bedrooms</span>
          <select
            value={bedrooms}
            onChange={(event) => setBedrooms(event.target.value)}
            className="w-full appearance-none border-0 bg-transparent pr-8 text-base font-semibold text-slate-700 outline-none"
          >
            {bedroomOptions.map((item) => (
              <option key={item.label} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none h-4 w-4 shrink-0 text-slate-400" />
        </label>

        <label className="flex min-h-14 items-center gap-3 rounded-2xl bg-slate-50 px-4 lg:border-l lg:border-slate-200 lg:bg-transparent">
          <IndianRupee className="h-5 w-5 shrink-0 text-red-600" />
          <span className="sr-only">Budget</span>
          <select
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            className="w-full appearance-none border-0 bg-transparent pr-8 text-base font-semibold text-slate-700 outline-none"
          >
            {budgetRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none h-4 w-4 shrink-0 text-slate-400" />
        </label>

        <button
          type="submit"
          className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-red-600 px-8 text-lg font-extrabold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 active:scale-[0.98] sm:rounded-full"
        >
          <Search className="h-5 w-5" />
          Search
        </button>
      </div>
    </form>
  );
}
