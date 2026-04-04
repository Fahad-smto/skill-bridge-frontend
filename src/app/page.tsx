// app/page.tsx
"use client";

import { motion } from "framer-motion";
import HeroCarousel from "@/components/ui/HeroCarousel";
import Link from "next/link";
import { 
  Search, Users, BookOpen, Star, Calendar, 
  ChevronRight, Award, Clock, TrendingUp, 
  Headphones, GraduationCap, Video 
} from "lucide-react";

// অ্যানিমেশন ভেরিয়েন্ট
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } }
};

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Stats Section */}
      <section className="bg-slate-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: "10,000+", label: "Active Students", icon: Users },
              { value: "1,200+", label: "Expert Tutors", icon: GraduationCap },
              { value: "50+", label: "Subjects", icon: BookOpen },
              { value: "4.9", label: "Average Rating", icon: Star },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-600/20 rounded-2xl">
                    <stat.icon className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Top Educators</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Learn from the best educators who are passionate about teaching and dedicated to your success.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Dr. Rahim Ahmed", subject: "Mathematics", rating: 4.9, students: 234, price: 500, image: "👨‍🏫" },
              { name: "Prof. Fatema Begum", subject: "Physics", rating: 4.8, students: 189, price: 600, image: "👩‍🏫" },
              { name: "Mr. Karim Hasan", subject: "Programming", rating: 4.9, students: 456, price: 700, image: "👨‍💻" },
              { name: "Ms. Sumaiya Akter", subject: "English", rating: 4.7, students: 167, price: 450, image: "👩‍🏫" },
            ].map((tutor, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-xl group"
              >
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {tutor.image}
                  </div>
                  <h3 className="font-bold text-xl text-gray-900">{tutor.name}</h3>
                  <p className="text-blue-600 font-medium">{tutor.subject}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-bold text-gray-700">{tutor.rating}</span>
                    <span className="text-xs text-gray-400">({tutor.students} students)</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div>
                    <span className="text-xl font-bold text-gray-900">৳{tutor.price}</span>
                    <span className="text-gray-500 text-xs">/hour</span>
                  </div>
                  <Link href={`/tutors`} className="text-blue-600 hover:translate-x-1 transition-transform inline-flex items-center text-sm font-bold">
                    Profile <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple 3-Step Process</h2>
            <p className="text-gray-500">Get started with SkillBridge in minutes</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Find a Tutor", desc: "Browse through our expert list for your needs.", icon: Search, color: "bg-blue-100 text-blue-600" },
              { step: "02", title: "Book a Session", desc: "Choose a time that works for you instantly.", icon: Calendar, color: "bg-purple-100 text-purple-600" },
              { step: "03", title: "Start Learning", desc: "Connect live and begin your journey.", icon: Video, color: "bg-emerald-100 text-emerald-600" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className={`w-20 h-20 ${item.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner`}>
                  <item.icon className="w-10 h-10" />
                </div>
                <div className="absolute top-0 right-1/3 text-6xl font-black text-gray-50 -z-10">{item.step}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Popular Categories</h2>
              <p className="text-gray-500 mt-2">Explore trending subjects</p>
            </div>
            <Link href="/categories" className="text-blue-600 font-semibold flex items-center hover:underline">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              { name: "Math", icon: "📐", count: "234 tutors" },
              { name: "Code", icon: "💻", count: "189 tutors" },
              { name: "English", icon: "📖", count: "156 tutors" },
              { name: "Physics", icon: "⚛️", count: "123 tutors" },
              { name: "Chem", icon: "🧪", count: "98 tutors" },
              { name: "Bio", icon: "🔬", count: "87 tutors" },
            ].map((cat, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} className="cursor-pointer">
                <Link href={`/categories?subject=${cat.name}`} className="bg-white rounded-2xl p-6 text-center block border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="font-bold text-gray-900 text-sm">{cat.name}</h3>
                  <p className="text-[10px] text-gray-400 uppercase mt-1 tracking-widest">{cat.count}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why SkillBridge is the best choice for you?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "Expert Tutors", icon: Award, desc: "Verified professionals." },
                  { title: "Flexibility", icon: Clock, desc: "Learn on your schedule." },
                  { title: "Affordable", icon: TrendingUp, desc: "Best rates in market." },
                  { title: "Support", icon: Headphones, desc: "24/7 dedicated help." },
                ].map((f, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-blue-100 transition-all">
                    <f.icon className="w-10 h-10 text-blue-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900">{f.title}</h4>
                      <p className="text-sm text-gray-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-blue-600 w-full h-[400px] rounded-[3rem] rotate-3 absolute inset-0 -z-10 opacity-10"></div>
              <div className="bg-slate-100 w-full h-[400px] rounded-[3rem] flex items-center justify-center text-8xl shadow-inner border border-gray-100">
                 🎓
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container mx-auto bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Boost Your Skills?</h2>
          <p className="text-blue-100 mb-10 max-w-xl mx-auto text-lg opacity-90">
            Join 10,000+ students already learning on SkillBridge. Your future starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/register" className="bg-white text-blue-700 px-10 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-xl shadow-black/10">
              Get Started Free
            </Link>
            <Link href="/tutors" className="border-2 border-white/30 text-white px-10 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm">
              Browse Tutors
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}