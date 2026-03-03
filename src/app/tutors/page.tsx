"use client";

import { useState } from "react";

 

const tutors = [
    {
        id: 1,
        name: "Rahim Ahmed",
        subject: "Mathematics",
        category: "Mathematics",
        rating: 4.9,
        reviews: 128,
        rate: 500,
        experience: 8,
        location: "Dhaka",
        bio: "Expert math tutor with 8 years of experience helping students conquer algebra, calculus, and beyond.",
        available: true,
        emoji: "👨‍🏫",
        badge: "Top Rated",
    },
    {
        id: 2,
        name: "Fatima Khan",
        subject: "Programming",
        category: "Programming",
        rating: 4.8,
        reviews: 95,
        rate: 700,
        experience: 6,
        location: "Chittagong",
        bio: "Full-stack developer turned tutor. Specializes in Python, JavaScript, and React.",
        available: true,
        emoji: "👩‍💻",
        badge: "Popular",
    },
    {
        id: 3,
        name: "Karim Sir",
        subject: "Physics",
        category: "Science",
        rating: 4.7,
        reviews: 74,
        rate: 450,
        experience: 10,
        location: "Sylhet",
        bio: "Physics PhD making complex concepts simple and enjoyable for all levels.",
        available: false,
        emoji: "🔬",
        badge: "Expert",
    },
    {
        id: 4,
        name: "Nadia Islam",
        subject: "English",
        category: "English",
        rating: 4.9,
        reviews: 210,
        rate: 400,
        experience: 5,
        location: "Dhaka",
        bio: "IELTS & TOEFL specialist. Helping students achieve their dream scores since 2018.",
        available: true,
        emoji: "📖",
        badge: "Top Rated",
    },
    {
        id: 5,
        name: "Arif Hossain",
        subject: "Guitar & Music",
        category: "Music",
        rating: 4.6,
        reviews: 52,
        rate: 600,
        experience: 7,
        location: "Rajshahi",
        bio: "Professional musician offering lessons in guitar, music theory, and composition.",
        available: true,
        emoji: "🎵",
        badge: null,
    },
    {
        id: 6,
        name: "Sadia Rahman",
        subject: "Graphic Design",
        category: "Design",
        rating: 4.8,
        reviews: 88,
        rate: 650,
        experience: 4,
        location: "Dhaka",
        bio: "Adobe Certified Designer teaching Photoshop, Illustrator, and UI/UX design.",
        available: true,
        emoji: "🎨",
        badge: "Rising Star",
    },
];

const categories = ["All", "Mathematics", "Programming", "Science", "English", "Music", "Design", "Business"];

const badgeColors = {
    "Top Rated": "bg-amber-100 text-amber-700",
    "Popular": "bg-blue-100 text-blue-700",
    "Expert": "bg-purple-100 text-purple-700",
    "Rising Star": "bg-green-100 text-green-700",
};

export default function BrowseTutors() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("rating");
    const [maxRate, setMaxRate] = useState(1000);

    const filtered = tutors
        .filter((t) => {
            const matchSearch =
                t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.subject.toLowerCase().includes(search.toLowerCase());
            const matchCategory =
                selectedCategory === "All" || t.category === selectedCategory;
            const matchRate = t.rate <= maxRate;
            return matchSearch && matchCategory && matchRate;
        })
        .sort((a, b) => {
            if (sortBy === "rating") return b.rating - a.rating;
            if (sortBy === "price_low") return a.rate - b.rate;
            if (sortBy === "price_high") return b.rate - a.rate;
            if (sortBy === "reviews") return b.reviews - a.reviews;
            return 0;
        });

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Hero Banner ── */}
            <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-14 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/70 text-sm">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
                        {tutors.filter(t => t.available).length} tutors available now
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                        Find Your Perfect{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            Tutor
                        </span>
                    </h1>
                    <p className="text-white/50 text-lg max-w-xl mx-auto">
                        Browse verified tutors, check availability, and book your first session today.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto mt-6 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by name or subject..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-lg"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* ── Sidebar Filters ── */}
                    <aside className="lg:w-64 space-y-6 shrink-0">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
                            <h3 className="font-semibold text-gray-900">Filters</h3>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</label>
                                <div className="flex flex-col gap-1.5">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`text-left text-sm px-3 py-2 rounded-lg transition-all ${selectedCategory === cat
                                                ? "bg-zinc-900 text-white font-medium"
                                                : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Max Rate */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Max Rate: ৳{maxRate}/hr
                                </label>
                                <input
                                    type="range"
                                    min={200}
                                    max={1000}
                                    step={50}
                                    value={maxRate}
                                    onChange={(e) => setMaxRate(Number(e.target.value))}
                                    className="w-full accent-zinc-900"
                                />
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>৳200</span>
                                    <span>৳1000</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ── Main Content ── */}
                    <div className="flex-1 space-y-5">

                        {/* Top Bar */}
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{filtered.length}</span> tutors
                            </p>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                            >
                                <option value="rating">Top Rated</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                                <option value="reviews">Most Reviews</option>
                            </select>
                        </div>

                        {/* Tutor Cards */}
                        {filtered.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <div className="text-5xl mb-4">😔</div>
                                <p className="text-lg font-medium">No tutors found</p>
                                <p className="text-sm mt-1">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                {filtered.map((tutor) => (
                                    <div
                                        key={tutor.id}
                                        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group"
                                    >
                                        {/* Card Top */}
                                        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-5 relative">
                                            {/* Available dot */}
                                            <div className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${tutor.available ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${tutor.available ? "bg-green-400" : "bg-gray-400"}`} />
                                                {tutor.available ? "Available" : "Busy"}
                                            </div>

                                            {/* Avatar */}
                                            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl">
                                                {tutor.emoji}
                                            </div>

                                            {/* Badge */}
                                            {tutor.badge && (
                                                <div className={`mt-3 inline-block text-xs font-medium px-2.5 py-1 rounded-full ${badgeColors[tutor.badge as keyof typeof badgeColors]}`}>
                                                    {tutor.badge}
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-5 space-y-3">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{tutor.name}</h3>
                                                <p className="text-sm text-blue-600 font-medium">{tutor.subject}</p>
                                            </div>

                                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                                                {tutor.bio}
                                            </p>

                                            {/* Meta */}
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <span>📍 {tutor.location}</span>
                                                <span>⏳ {tutor.experience}y exp</span>
                                            </div>

                                            {/* Rating */}
                                            <div className="flex items-center gap-1.5">
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <span key={s} className={`text-sm ${s <= Math.round(tutor.rating) ? "text-amber-400" : "text-gray-200"}`}>★</span>
                                                    ))}
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">{tutor.rating}</span>
                                                <span className="text-xs text-gray-400">({tutor.reviews} reviews)</span>
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                                <div>
                                                    <span className="text-lg font-bold text-gray-900">৳{tutor.rate}</span>
                                                    <span className="text-xs text-gray-400">/hr</span>
                                                </div>
                                                <button className="bg-zinc-900 hover:bg-zinc-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors">
                                                    Book Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}