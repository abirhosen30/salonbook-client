"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Service } from "@/types";
import { getServices } from "@/lib/api";
import { categoryNames } from "@/lib/categories";
import ServiceCard from "@/components/ServiceCard";
import Loader from "@/components/Loader";

function ServicesContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters and sorting state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || "All");
  const [sortBy, setSortBy] = useState<string>("default");

  // Sync category if URL param changes without cascading render effect
  const [prevUrlCategory, setPrevUrlCategory] = useState(urlCategory);
  if (urlCategory !== prevUrlCategory) {
    setPrevUrlCategory(urlCategory);
    setSelectedCategory(urlCategory || "All");
  }

  // Fetch active services
  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error("Failed to load services", error);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  // Filter and sort in frontend simple JS
  const filteredServices = useMemo(() => {
    return services
      .filter((service) => {
        const matchesName = service.serviceName
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim());
        const matchesCategory =
          selectedCategory === "All" || service.category === selectedCategory;
        return matchesName && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "low-to-high") return a.price - b.price;
        if (sortBy === "high-to-low") return b.price - a.price;
        return 0;
      });
  }, [services, searchTerm, selectedCategory, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSortBy("default");
  };

  return (
    <div className="min-h-screen py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#9E5739]">
          Bespoke Treatments
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D241E] mt-2">
          Explore Salon Services
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#2D241E]/70 leading-relaxed">
          Discover tailored rituals performed by master stylists, clinical aestheticians, and holistic therapists. Reserve your experience seamlessly.
        </p>
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EFECE6] shadow-xs mb-8 flex flex-col md:flex-row items-center gap-4 justify-between">
        {/* Search Box */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-[#2D241E]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search services by name (e.g. Balayage, Cut)..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF6F0] rounded-xl border border-[#EFECE6] focus:outline-none focus:border-[#9E5739] text-[#2D241E]"
          />
        </div>

        {/* Sort Select Dropdown */}
        <div className="w-full md:w-auto flex items-center justify-end gap-3">
          <label
            htmlFor="sort-select"
            className="text-xs font-semibold text-[#2D241E]/70 uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#9E5739]" />
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-auto px-4 py-2.5 text-sm bg-[#FAF6F0] rounded-xl border border-[#EFECE6] focus:outline-none focus:border-[#9E5739] text-[#2D241E] cursor-pointer"
          >
            <option value="default">Default</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mb-10 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 flex-nowrap min-w-max">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all ${
              selectedCategory === "All"
                ? "bg-[#9E5739] text-white shadow-xs"
                : "bg-white text-[#2D241E]/80 border border-[#EFECE6] hover:bg-[#FAF6F0]"
            }`}
          >
            All Categories
          </button>
          {categoryNames.map((catName) => (
            <button
              key={catName}
              type="button"
              onClick={() => setSelectedCategory(catName)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all ${
                selectedCategory === catName
                  ? "bg-[#9E5739] text-white shadow-xs"
                  : "bg-white text-[#2D241E]/80 border border-[#EFECE6] hover:bg-[#FAF6F0]"
              }`}
            >
              {catName}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Info */}
      <div className="flex items-center justify-between mb-6 text-sm text-[#2D241E]/70">
        <p>
          Showing <span className="font-semibold text-[#2D241E]">{filteredServices.length}</span>{" "}
          {filteredServices.length === 1 ? "service" : "services"}
        </p>

        {(searchTerm || selectedCategory !== "All" || sortBy !== "default") && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 text-xs text-[#9E5739] hover:underline font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all filters
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && <Loader />}

      {/* Empty State */}
      {!loading && filteredServices.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#EFECE6] p-12 text-center max-w-md mx-auto my-12">
          <p className="text-base font-semibold text-[#2D241E]">No services found</p>
          <p className="mt-1 text-sm text-[#2D241E]/60">
            We couldn&apos;t find any active services matching your search or filter criteria.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-6 px-5 py-2.5 text-sm font-medium text-white bg-[#9E5739] rounded-xl hover:bg-[#8B4A2F] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Active Services Grid */}
      {!loading && filteredServices.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BrowseServicesPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ServicesContent />
    </Suspense>
  );
}
